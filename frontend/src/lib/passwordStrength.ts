import { passwordRules } from "@/schemas/auth.schema.ts";

export type Strength = "weak" | "fair" | "good" | "strong";

export function getPasswordStrength(value: string) {
  const passed = passwordRules.filter((r) => r.test(value)).length;
  const missing = passwordRules.filter((r) => !r.test(value));

  let level: Strength = "weak";
  if (value.length === 0) level = "weak";
  else if (passed >= 5) level = "strong";
  else if (passed >= 4) level = "good";
  else if (passed >= 3) level = "fair";

  return { passed, total: passwordRules.length, level, missing };
}
export const STYLES: Record<
  Strength,
  { label: string; bars: number; color: string; text: string }
> = {
  weak: { label: "Weak", bars: 1, color: "bg-red-400", text: "text-red-400" },
  fair: {
    label: "Fair",
    bars: 2,
    color: "bg-amber-400",
    text: "text-amber-400",
  },
  good: { label: "Good", bars: 3, color: "bg-cyan-400", text: "text-cyan-400" },
  strong: {
    label: "Strong",
    bars: 4,
    color: "bg-cyan-400",
    text: "text-cyan-400",
  },
};
