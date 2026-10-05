import { z } from "zod";

/** Mirrors `RejectProviderZodSchema` in power-mesh-server provider.validation.ts */
export const rejectProviderSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(3, "Rejection reason must be at least 3 characters.")
    .max(500, "Rejection reason must be at most 500 characters."),
});

export type RejectProviderValues = z.infer<typeof rejectProviderSchema>;
