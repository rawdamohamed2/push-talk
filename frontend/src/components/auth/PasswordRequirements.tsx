import { getPasswordStrength, STYLES } from "@/lib/passwordStrength.ts";

export function PasswordRequirements({ value }: { value: string }) {
  if (!value) return null;

  const { level, missing } = getPasswordStrength(value);
  const s = STYLES[level];

  return (
    <div className="mt-2 space-y-2" aria-live="polite">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full ${n <= s.bars ? s.color : "bg-primary/40"}`}
          />
        ))}
      </div>

      {missing.length === 0 ? (
        <p className="text-xs text-green-400">✓ All requirements met</p>
      ) : (
        <ul className="space-y-0.5 text-xs text-primary">
          {missing.map((r) => (
            <li key={r.id}>○ {r.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
