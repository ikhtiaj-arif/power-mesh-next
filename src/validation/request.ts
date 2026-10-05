import { z } from "zod";

const priorityTierSchema = z.enum([
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "FLEXIBLE",
]);

/** Mirrors CreateRequestZodSchema in capacity-request.validation.ts */
export const createRequestSchema = z.object({
  requestedKw: z.coerce
    .number()
    .int("Requested kW must be a whole number.")
    .positive("Requested kW must be positive."),
  maxPricePerKwh: z.coerce
    .number()
    .positive("Max price per kWh must be positive."),
  priorityTier: priorityTierSchema,
});

export type CreateRequestValues = z.infer<typeof createRequestSchema>;

/** Mirrors UpdateRequestZodSchema in capacity-request.validation.ts */
export const updateRequestSchema = z.object({
  requestedKw: z.coerce
    .number()
    .int("Requested kW must be a whole number.")
    .positive("Requested kW must be positive."),
  maxPricePerKwh: z.coerce
    .number()
    .positive("Max price per kWh must be positive."),
  priorityTier: priorityTierSchema,
});

export type UpdateRequestValues = z.infer<typeof updateRequestSchema>;
