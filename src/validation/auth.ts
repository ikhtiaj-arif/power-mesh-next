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

export const resourceTypes = [
  "GENERATOR",
  "SOLAR_BESS",
  "BATTERY",
  "MICROGRID",
  "OTHER",
] as const;

export const providerApplySchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters.")
    .max(50, "First name must be at most 50 characters."),
  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters.")
    .max(50, "Last name must be at most 50 characters."),
  email: z.string().email("Enter a valid email."),
  password: passwordSchema,
  companyName: z.string().min(2, "Company name is required."),
  licenseNumber: z.string().min(2, "License number is required."),
  resourceType: z.enum(resourceTypes, {
    required_error: "Select a resource type.",
  }),
  capacityKw: z
    .string()
    .trim()
    .min(1, "Capacity is required.")
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) > 0,
      "Capacity must be a positive whole number.",
    ),
  address: z.string().min(2, "Address is required."),
  contactPerson: z.string().min(2, "Contact person is required."),
  contactPhone: z.string().min(2, "Contact phone is required."),
  bankAccountNumber: optionalText,
});

export const verifyEmailSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code."),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProviderApplyValues = z.infer<typeof providerApplySchema>;
