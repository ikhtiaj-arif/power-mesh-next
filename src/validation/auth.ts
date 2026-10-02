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
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
