import { z } from "zod";

/** Mirrors CreateOfferZodSchema in offer.validation.ts */
export const createOfferSchema = z
  .object({
    eventId: z.string().uuid("Select an event."),
    capacityKw: z.coerce
      .number()
      .int("Capacity must be a whole number.")
      .positive("Capacity must be positive."),
    pricePerKwh: z.coerce
      .number()
      .positive("Price per kWh must be positive."),
    deliveryStartLocal: z.string().min(1, "Delivery start is required."),
    deliveryEndLocal: z.string().min(1, "Delivery end is required."),
  })
  .refine(
    (data) =>
      new Date(data.deliveryEndLocal).getTime() >
      new Date(data.deliveryStartLocal).getTime(),
    {
      message: "Delivery end must be after delivery start.",
      path: ["deliveryEndLocal"],
    },
  );

export type CreateOfferValues = z.infer<typeof createOfferSchema>;

/** Client update form — does not expose free status transitions. */
export const updateOfferSchema = z
  .object({
    capacityKw: z.coerce
      .number()
      .int("Capacity must be a whole number.")
      .positive("Capacity must be positive."),
    pricePerKwh: z.coerce
      .number()
      .positive("Price per kWh must be positive."),
    deliveryStartLocal: z.string().min(1, "Delivery start is required."),
    deliveryEndLocal: z.string().min(1, "Delivery end is required."),
  })
  .refine(
    (data) =>
      new Date(data.deliveryEndLocal).getTime() >
      new Date(data.deliveryStartLocal).getTime(),
    {
      message: "Delivery end must be after delivery start.",
      path: ["deliveryEndLocal"],
    },
  );

export type UpdateOfferValues = z.infer<typeof updateOfferSchema>;
