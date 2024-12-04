import { z } from "zod";

export const createStripeCustomerSchema = z.object({
  email: z.string().email("Invalid email format"), // Validates that the email is a valid email format
  name: z.string().min(1, "Name cannot be empty"), // Validates that the name is a non-empty string
  userId: z.string().uuid("Invalid user ID format"),
});

export const createCheckoutSessionSchema = z.object({
  priceId: z.string().min(1, "Price ID cannot be empty"),
  successUrl: z.string().url("Invalid URL for success"),
  cancelUrl: z.string().url("Invalid URL for cancellation"),
});

export type CreateStripeCustomerSChema = z.infer<
  typeof createStripeCustomerSchema
>;

// Define the input schema for the request
export const createSubscriptionSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
});
