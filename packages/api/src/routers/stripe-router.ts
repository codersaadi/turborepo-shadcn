import { createStripeCustomerRecord } from "@repo/db/data/users";
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
        throw new Error("Missing required checkout parameters");
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

  // updateSubscription: protectedProcedure
  //   .input(createSubscriptionSchema)
  //   .mutation(async ({ input, ctx }) => {
  //     const { priceId } = input;
  //     const user = ctx.auth.user;

  //     // Check existing subscription
  //     const existingSubscription = await getSubscription(user.id);

  //     if (existingSubscription?.stripeSubscriptionId) {
  //       // Retrieve and update current subscription
  //       const currentSubscription = await stripe.subscriptions.retrieve(
  //         existingSubscription.stripeSubscriptionId
  //       );

  //       const updatedSubscription = await stripe.subscriptions.update(
  //         existingSubscription.stripeSubscriptionId,
  //         {
  //           items: [
  //             {
  //               id: currentSubscription.items.data?.[0]?.id,
  //               deleted: true,
  //             },
  //             { price: priceId },
  //           ],
  //           expand: ["latest_invoice.payment_intent"],
  //         }
  //       );

  //       // Update database record
  //       await updateSubscription({
  //         stripeSubscriptionId: updatedSubscription.id,
  //         stripePriceId: priceId,
  //         stripeCurrentPeriodEnd: new Date(
  //           updatedSubscription.current_period_end * 1000
  //         ),
  //       });

  //       // Handle payment intent
  //       const latestInvoice = updatedSubscription.latest_invoice as Stripe.Invoice;
  //       return {
  //         subscriptionId: updatedSubscription.id,
  //         clientSecret: latestInvoice?.payment_intent
  //           ? (latestInvoice.payment_intent as Stripe.PaymentIntent).client_secret
  //           : null,
  //       };
  //     }

  //     throw new Error("No existing subscription found");
  //   }),
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
