import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from array import array
from app.config import settings
from app.errors import AppError

ALLOWED_FORMATS = {"matroska", "webm", "ogg", "mov", "mp4", "mp3", "wav"}
_TIME_RE = re.compile(r"out_time_us=(\d+)")
PEAK_BUCKETS = 40

@dataclass(frozen=True)
class AudioInfo:
    duration_ms: int


def _not_audio() -> AppError:
    return AppError(415, "unsupported_media_type", "The file is not a valid audio recording")


def _run(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    try: 
        return subprocess.run(cmd, capture_output=True, text=True, timeout=20, check=False)
    except subprocess.TimeoutExpired:
        raise _not_audio() from None


def probe_audio(path: Path) -> AudioInfo:
   
    probe = _run(["ffprobe", "-v", "error", "-print_format", "json",
                  "-show_format", "-show_streams", str(path)])
    if probe.returncode != 0:
        raise _not_audio()
    try:
        data = json.loads(probe.stdout)
    except json.JSONDecodeError:
        raise _not_audio() from None

    kinds = {s.get("codec_type") for s in data.get("streams", [])}
    formats = set(data.get("format", {}).get("format_name", "").split(","))
    if "audio" not in kinds or "video" in kinds or not formats & ALLOWED_FORMATS:
        raise _not_audio()

    decode = _run(["ffmpeg", "-v", "error", "-nostdin", "-i", str(path),
                   "-vn", "-f", "null", "-progress", "pipe:1", "-"])
    times = _TIME_RE.findall(decode.stdout)
    if decode.returncode != 0 or not times:
        raise _not_audio()

    duration_ms = int(times[-1]) // 1000
    if not settings.min_duration_ms <= duration_ms <= settings.max_duration_ms:
        raise AppError(400, "invalid_duration", "Recording must be between 0.5 and 60 seconds")
    return AudioInfo(duration_ms=duration_ms)

def convert_to_ogg(src: Path, dest: Path) -> None:
    
    result = subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-nostdin", "-i", str(src),
         "-vn", "-ac", "1", "-ar", "48000", "-c:a", "libopus", "-b:a", "32k", str(dest)],
        capture_output=True, text=True, timeout=60, check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed: {result.stderr.strip()}")


def ogg_duration_ms(path: Path) -> int:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, timeout=20, check=False,
    )
    try:
        return round(float(result.stdout.strip()) * 1000)
    except ValueError:
        raise RuntimeError("could not read duration") from None


def extract_peaks(path: Path, buckets: int = PEAK_BUCKETS) -> list[float]:
    result = subprocess.run(
        ["ffmpeg", "-v", "error", "-nostdin", "-i", str(path),
         "-vn", "-ac", "1", "-ar", "8000", "-f", "s16le", "-"],
        capture_output=True, timeout=60, check=False,
    )
    raw = result.stdout[: len(result.stdout) // 2 * 2]
    if result.returncode != 0 or not raw:
        raise RuntimeError("could not decode audio for peaks")

    samples = array("h")
    samples.frombytes(raw)
    size = max(1, len(samples) // buckets)
    peaks = [
        max((abs(s) for s in samples[i * size:(i + 1) * size]), default=0)
        for i in range(buckets)
    ]
    loudest = max(peaks) or 1  # نكبّر الأعمدة عشان تاخد الارتفاع كله
    return [round(p / loudest, 2) for p in peaks]