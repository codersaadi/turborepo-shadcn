import env from "@repo/env";
import Stripe from "stripe";
export const stripe = new Stripe(env.STRIPE_API_KEY || "", {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});
