import { withAuthHandler } from "@/lib/api-utils/auth-middleware";
import { stripe } from "@/lib/stripe/stripe";
import { createStripeCustomerSchema } from "@/lib/stripe/stripe.schema";
import { createStripeCustomerRecord } from "@repo/db/data/users";
import { NextResponse } from "next/server";

export const POST = withAuthHandler(async (req) => {
	try {
		const user = req.auth.user;
		// Validate the user object against the Zod schema
		const validated = createStripeCustomerSchema.safeParse(user);
		if (!validated.success) {
			// Extract validation error messages
			const validationErrors = validated.error.errors
				.map((err) => err.message)
				.join(", ");
			return NextResponse.json({ error: validationErrors }, { status: 403 });
		}

		// Destructure validated data
		const { userId, ...data } = validated.data;

		// Create Stripe customer
		const customer = await stripe.customers.create(data);

		// Store Stripe customer ID in the user record
		await createStripeCustomerRecord({
			userId,
			stripeCustomerId: customer.id,
		});

		// Return the customer object
		return NextResponse.json({ customer });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error creating Stripe customer:", error.message);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: "Unknown error" }, { status: 500 });
	}
});
