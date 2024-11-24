import { getCurrentUser } from "@/lib/get-user";
import { stripe } from "@/lib/stripe/stripe";
import { createCheckoutSessionSchema } from "@/lib/stripe/stripe.schema";
import { type NextRequest, NextResponse } from "next/server";
import type { z } from "zod";

export async function POST(req: NextRequest) {
	// Create Checkout Session Endpoint
	try {
		const { user, error: userError } = await getCurrentUser();
		if (userError) return handleError(userError.message, 401);
		if (!user.id) return handleError("Unauthorized", 401);
		const body = await req.json();
		const validated = createCheckoutSessionSchema.safeParse(body);
		if (!validated.success) return handleValidationErrors(validated.error);

		const { priceId, successUrl, cancelUrl } = validated.data;

		// Ensure successUrl and cancelUrl are not undefined
		if (!successUrl || !cancelUrl) {
			return NextResponse.json(
				{ error: "Success URL and Cancel URL are required" },
				{ status: 400 },
			);
		}

		// Create the Stripe session
		const stripeSession = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [{ price: priceId, quantity: 1 }],
			mode: "subscription", // Change to 'payment' if applicable
			success_url: successUrl,
			cancel_url: cancelUrl,
			metadata: { userId: user.id },
		});

		return NextResponse.json({ sessionId: stripeSession.id });
	} catch (error) {
		return handleError(error);
	}
}

// Utility Functions
function handleError(error: unknown, statusCode = 500) {
	if (error instanceof Error) {
		console.error("Error:", error);
		return NextResponse.json(
			{ error: error.message || "Internal Server Error" },
			{ status: statusCode },
		);
	}
	return NextResponse.json(
		{ error: "Internal Server Error" },
		{ status: statusCode },
	);
}

function handleValidationErrors(error: z.ZodError) {
	const validationErrors = error.errors.map((err) => err.message).join(", ");
	return NextResponse.json({ error: validationErrors }, { status: 400 });
}

export async function OPTIONS(request: Request) {
	const allowedOrigin = request.headers.get("origin");
	const response = new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": allowedOrigin || "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers":
				"Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
			"Access-Control-Max-Age": "86400",
		},
	});

	return response;
}
