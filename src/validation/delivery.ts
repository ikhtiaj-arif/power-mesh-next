import { z } from "zod";

/** Mirrors ProviderReportZodSchema in delivery.validation.ts */
export const providerReportSchema = z.object({
  actualDeliveredKw: z.coerce
    .number({ invalid_type_error: "Enter a whole number ≥ 0." })
    .int("Delivered capacity must be a whole number.")
    .min(0, "Delivered capacity cannot be negative."),
});

export type ProviderReportValues = z.infer<typeof providerReportSchema>;

/** Mirrors ConsumerDisputeZodSchema in delivery.validation.ts */
export const consumerDisputeSchema = z.object({
  disputeReason: z
    .string()
    .trim()
    .min(5, "Dispute reason must be at least 5 characters."),
});

export type ConsumerDisputeValues = z.infer<typeof consumerDisputeSchema>;
