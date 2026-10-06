import { z } from "zod";

import { PAYMENT_GATEWAY_STATUSES, RESERVATION_STATUS_OPTIONS } from "@/types";

const reservationStatusSchema = z.enum(
  RESERVATION_STATUS_OPTIONS as unknown as [string, ...string[]],
);

const paymentStatusSchema = z.enum(
  PAYMENT_GATEWAY_STATUSES as unknown as [string, ...string[]],
);

/** Mirrors UpdateReservationStatusZodSchema in admin.validation.ts */
export const updateReservationStatusSchema = z.object({
  status: reservationStatusSchema,
  paymentStatus: paymentStatusSchema.or(z.literal("")).optional(),
  resolution: z.string().max(1000, "Resolution must be at most 1000 characters.").optional(),
});

export type UpdateReservationStatusValues = z.infer<
  typeof updateReservationStatusSchema
>;

/** Mirrors BlockUserZodSchema in admin.validation.ts */
export const blockUserSchema = z.object({
  reason: z.string().max(500, "Reason must be at most 500 characters.").optional(),
});

export type BlockUserValues = z.infer<typeof blockUserSchema>;
