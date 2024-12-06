import { createStripeCustomerRecord } from "@repo/db/data/users";
import { ErrorType, createError } from "../errors";
import {
  createCheckoutSessionSchema,
  createStripeCustomerSchema,
} from "../schema/stripe-schema";
import { stripe } from "../stripe/stripe";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const stripeRouter = createTRPCRouter({
  createSessionCheckout: protectedProcedure
    .input(createCheckoutSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const { successUrl, priceId, cancelUrl } = input;

      // Validate required fields
      if (!successUrl || !priceId || !cancelUrl) {
        throw createError(
          ErrorType.BAD_REQUEST,
          "Missing required checkout parameters"
        );
      }

      // Create Stripe checkout session
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { userId: ctx.auth.user.id },
      });

      return { sessionId: stripeSession.id };
    }),

  createStripeCustomer: protectedProcedure
    .input(createStripeCustomerSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      // Create Stripe customer
      const customer = await stripe.customers.create(input);

      // Store Stripe customer ID
      await createStripeCustomerRecord({
        userId,
        stripeCustomerId: customer.id,
      });

      return customer;
    }),
});

// export async function OPTIONS(request: Request) {
//   const allowedOrigin = request.headers.get("origin");
//   const response = new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": allowedOrigin || "*",
//       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//       "Access-Control-Allow-Headers":
//         "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
//       "Access-Control-Max-Age": "86400",
//     },
//   });

//   return response;
// }
