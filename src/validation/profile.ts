import { z } from "zod";

export const profileEditSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  organizationName: z.string().optional(),
  criticalLoadKw: z
    .number({ invalid_type_error: "Enter a valid number" })
    .int("Critical load must be a whole number")
    .positive("Critical load must be greater than zero")
    .optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  companyName: z.string().optional(),
  providerAddress: z.string().optional(),
  providerContactPerson: z.string().optional(),
  providerContactPhone: z.string().optional(),
  bankAccountNumber: z.string().optional(),
});

export type ProfileEditValues = z.infer<typeof profileEditSchema>;
