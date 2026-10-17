import { z } from "zod";

export const passwordRules = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (v: string) => v.length >= 8,
  },
  {
    id: "lowercase",
    label: "One lowercase letter (a-z)",
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    id: "uppercase",
    label: "One uppercase letter (A-Z)",
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    id: "number",
    label: "One number (0-9)",
    test: (v: string) => /\d/.test(v),
  },
  {
    id: "special",
    label: "One special character (!@#$...)",
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
] as const;
const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .superRefine((value, ctx) => {
    for (const rule of passwordRules) {
      if (!rule.test(value)) {
        ctx.addIssue({ code: "custom", message: rule.label });
      }
    }
  });

const emailSchema = z
  .email()
  .min(3, "Email must be at least 3 characters")
  .max(30, "Email must be at most 30 characters");

export const loginSchema = z
  .object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  })
  .required();
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
