# PushTalk

A walkie-talkie style web app. Users in a shared channel hold a button to record a short voice
message (0.5 s to 60 s). The message is sent when they release the button, and other members hear
it automatically, one after another.

## Run it

```bash
cp .env.example .env        # Windows: copy .env.example .env
# edit .env: use letters and digits only in the DB password, and a long random JWT_SECRET
docker compose up --build
```

| Service | URL |
|---|---|
| App | http://localhost:5173 |
| API docs | http://localhost:8000/docs |
| Health | http://localhost:8000/health |

- Migrations run automatically when the `api` container starts.
- The frontend is built into static files and served by nginx. `VITE_API_URL` and `VITE_WS_URL` are
  baked in at build time (build args in `docker-compose.yml`).
- Use the latest Chrome. The microphone only works on `https` or `localhost`.
- Start again from zero: `docker compose down -v && docker compose up --build`.

Frontend development without Docker:

```bash
cd frontend && npm install && npm run dev     # http://localhost:5173 (needs the API running)
npm test                                      # unit tests
```

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript, Vite, Tailwind, shadcn/ui, React Hook Form + Zod, React Router, TanStack Query, axios |
| Frontend tests | Vitest |
| Backend | Python 3.12, FastAPI, SQLAlchemy 2, Alembic |
| Database | PostgreSQL 16 |
| Messaging / jobs | Redis (pub/sub), RQ (background jobs) |
| Audio | ffmpeg / ffprobe |
| Media storage | Local Docker volume behind a `StorageService` class |

## Status

| Area | State |
|---|---|
| Docker Compose: api, worker, db, redis, frontend. Env config, Alembic migrations | Done |
| Backend: auth, channels, upload validation, worker, history, protected audio, WebSocket | Done, tested manually |
| Frontend: auth, channels, room (history with pagination, recorder, playback queue, enable-audio overlay) on the real API | Done |
| Frontend: WebSocket with reconnect, backoff and catch-up, presence, delivery receipts | Done |
| Frontend unit tests: playback queue, message cache merge, socket reconnect and backoff | Done |

## How the user stories are covered

| Story | Where |
|---|---|
| 1 Sign up and log in | `POST /auth/signup`, `/auth/login`, JWT in `sessionStorage` |
| 2 Channels and who is online | channels API, `presence.*` WebSocket events |
| 3 Hold to record, 0.5 to 60 s | `useRecorder`, checked again on the server with ffmpeg |
| 4 Auto-play in sequence, never overlapping | `PlaybackQueue` |
| 5 Own messages do not auto-play | `PlaybackQueue` ignores `senderId === me` |
| 6 History and missed messages | `before_seq` pagination, `after_seq` catch-up on every (re)connect |
| 7 sent, delivered, played | `receipt.update` events |

## API summary

| Method | Path | Notes |
|---|---|---|
| POST | `/auth/signup`, `/auth/login` | returns `{ token, user }` |
| GET / POST | `/channels` | list, create |
| GET | `/channels/{id}` | one channel (`memberCount`, `isMember`) |
| POST | `/channels/{id}/join` | idempotent |
| GET | `/channels/{id}/members` | members only |
| POST | `/channels/{id}/messages` | multipart upload, returns `202` and `processing` |
| GET | `/channels/{id}/messages` | `before_seq` (older), `after_seq` (catch-up), `limit` |
| GET | `/messages/{id}/audio` | member only, JWT required |
| WS | `/ws/channels/{id}?token=` | close codes `4401` not authenticated, `4403` not a member |

Errors always look like `{ "error": { "code", "message", "details?" } }`.
WebSocket events: `presence.snapshot`, `presence.update`, `message.new`, `message.failed` (sender only),
`receipt.update`. The client sends `message.played`.


Message flow:

1. The sender releases the button. The browser uploads over HTTP and shows the message as `processing`.
2. The API checks membership, size, real MIME type and real duration, stores the file under a random
   name, saves the message, enqueues a job and returns `202`.
3. The worker converts to Opus/OGG, extracts duration and 40 waveform peaks, assigns the channel
   `seq`, marks the message `sent` and publishes `message.new`.
4. The API forwards the event to every connected member. A failed job notifies the sender only.
5. The message cache merges by `id` and sorts by `seq`. Live messages from other people go into the
   playback queue and are fetched with the JWT and played in order.

Frontend layers: `pages/` compose `components/` (props only) and `hooks/`, which connect React to
plain TypeScript in `lib/` (playback queue, audio player, socket, cache merge) and `api/` (axios).
Backend layers: `routers/` call `services/`, which use `models.py` and `db.py`.

## Known limitations

- A message can stay `processing` forever if Redis loses the queue or the worker dies mid-job.
- `processing` and `failed` messages have no `seq`, so the history endpoint does not return them.
- Presence counters live in Redis and can be stale after an API crash (no TTL or heartbeat).
- `delivered` means the server pushed the event to a connected client.
- The WebSocket token is in the query string, and tokens are in `sessionStorage` (XSS exposure).
- After a refresh the enable-audio overlay appears again (browser autoplay policy).
- `pause()` while audio is still downloading has no effect.
- Backend logs use Python `logging` with extra fields and are not formatted as JSON yet.
- Backend automated tests are not written.
- Only the latest Chrome is supported (Chrome records WebM/Opus, Safari records MP4/AAC).

## What I cut and why

| Cut | Reason |
|---|---|
| Direct messages, transcription, per-user rate limiting | Stretch goals |
| Playback speed control | Stretch goal. One line (`audio.playbackRate`) in `BrowserAudioPlayer` |
| Leave channel, private channels, invitations | Not in the user stories |
| Email on signup | The brief asks for username and password only |
| Per-recipient receipt UI | Aggregated status only |

See [DECISIONS.md](./DECISIONS.md) for the design questions.