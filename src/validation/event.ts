import { z } from "zod";

/** Mirrors CreateEventZodSchema in power-mesh-server event.validation.ts */
export const createEventSchema = z
  .object({
    scheduledStart: z.string().min(1, "Scheduled start is required."),
    scheduledEnd: z.string().min(1, "Scheduled end is required."),
    totalCapacityKw: z.coerce
      .number()
      .int("Total capacity must be a whole number.")
      .positive("Total capacity must be positive."),
    survivalQuotaKw: z.coerce
      .number()
      .int("Survival quota must be a whole number.")
      .positive("Survival quota must be positive."),
    notes: z.string().max(1000, "Notes must be at most 1000 characters.").optional(),
  })
  .refine((data) => new Date(data.scheduledStart) > new Date(), {
    message: "scheduledStart must be in the future.",
    path: ["scheduledStart"],
  })
  .refine(
    (data) => new Date(data.scheduledEnd) > new Date(data.scheduledStart),
    {
      message: "scheduledEnd must be after scheduledStart.",
      path: ["scheduledEnd"],
    },
  )
  .refine((data) => data.survivalQuotaKw <= data.totalCapacityKw, {
    message: "survivalQuotaKw cannot exceed totalCapacityKw.",
    path: ["survivalQuotaKw"],
  });

export type CreateEventValues = z.infer<typeof createEventSchema>;

/** Mirrors UpdateEventZodSchema in power-mesh-server event.validation.ts */
export const updateEventSchema = z
  .object({
    scheduledStart: z.string().min(1, "Scheduled start is required."),
    scheduledEnd: z.string().min(1, "Scheduled end is required."),
    totalCapacityKw: z.coerce
      .number()
      .int("Total capacity must be a whole number.")
      .positive("Total capacity must be positive."),
    survivalQuotaKw: z.coerce
      .number()
      .int("Survival quota must be a whole number.")
      .positive("Survival quota must be positive."),
    notes: z.string().max(1000, "Notes must be at most 1000 characters.").optional(),
  })
  .refine((data) => new Date(data.scheduledStart) > new Date(), {
    message: "scheduledStart must be in the future.",
    path: ["scheduledStart"],
  })
  .refine(
    (data) => new Date(data.scheduledEnd) > new Date(data.scheduledStart),
    {
      message: "scheduledEnd must be after scheduledStart.",
      path: ["scheduledEnd"],
    },
  )
  .refine((data) => data.survivalQuotaKw <= data.totalCapacityKw, {
    message: "survivalQuotaKw cannot exceed totalCapacityKw.",
    path: ["survivalQuotaKw"],
  });

export type UpdateEventValues = z.infer<typeof updateEventSchema>;

export const updateEventStatusSchema = z.object({
  status: z.enum([
    "SCHEDULED",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export type UpdateEventStatusValues = z.infer<typeof updateEventStatusSchema>;
