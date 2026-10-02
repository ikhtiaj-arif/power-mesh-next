import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least 1 number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character.");

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: passwordSchema,
});

const optionalText = z.string().trim();

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters.")
    .max(10, "First name must be at most 10 characters."),
  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters.")
    .max(10, "Last name must be at most 10 characters."),
  email: z.string().email("Enter a valid email."),
  password: passwordSchema,
  organizationName: optionalText,
  criticalLoadKw: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || Number.isFinite(Number(value)),
      "Enter a number of kilowatts.",
    )
    .refine(
      (value) => value === "" || Number(value) >= 0,
      "Critical load cannot be negative.",
    ),
  address: optionalText,
  contactPerson: optionalText,
  contactPhone: optionalText,
});

export const verifyEmailSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code."),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
