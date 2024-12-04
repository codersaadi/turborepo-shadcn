import { stripe } from "@repo/api/stripe";
import { subscriptionCreated } from "@repo/db/data/subscription";
import env from "@repo/env";
import { headers as headersPromise } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
const stripeWebhookEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
  const stripeEvent = await stripeWebHook(req);
  return stripeEvent;
}
const stripeWebHook = async (req: NextRequest) => {
  let stripeEvent: Stripe.Event;
  const body = await req.text();
  const headers = await headersPromise();
  const sig = headers.get("Stripe-Signature");
  const webhookSecret =
    env.STRIPE_WEBHOOK_SECRET_LIVE ?? env.STRIPE_WEBHOOK_SECRET;
  try {
    if (!sig || !webhookSecret) {
      console.log(
        "🔴 Error Stripe webhook secret or the signature does not exist."
      );
      return;
    }
    stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: unknown) {
    console.log(
      `🔴 Error ${
        error instanceof Error
          ? error.message
          : "  error occured while recieving webhook"
      }`,
      error
    );
    return new NextResponse(
      `Webhook Error: ${
        error instanceof Error ? error.message : "something went wrong"
      }`,
      { status: 400 }
    );
  }

  //
  try {
    if (stripeWebhookEvents.has(stripeEvent.type)) {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      if (
        !subscription.metadata.connectAccountPayments &&
        !subscription.metadata.connectAccountSubscriptions
      ) {
        switch (stripeEvent.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated": {
            if (subscription.status === "active") {
              await subscriptionCreated(
                subscription,
                subscription.customer as string
              );
              console.log("CREATED FROM WEBHOOK 💳", subscription);
            } else {
              console.log(
                "SKIPPED AT CREATED FROM WEBHOOK 💳 because subscription status is not active",
                subscription
              );
            }
            break; // Ensure the break here too
          }

          default:
            console.log("👉🏻 Unhandled relevant event!", stripeEvent.type);
        }
      } else {
        console.log(
          "SKIPPED FROM WEBHOOK 💳 because subscription was from a connected account not for the application",
          subscription
        );
      }
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("🔴 Webhook Error", { status: 400 });
  }
  return NextResponse.json(
    {
      webhookActionReceived: true,
    },
    {
      status: 200,
    }
  );
};
