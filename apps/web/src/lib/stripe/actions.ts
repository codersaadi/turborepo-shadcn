"use server";
import { PublicError } from "@/lib/errors";
import * as userRepository from "@repo/db/data/users";
import env from "@repo/env";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticatedAction } from "../action-guard";
import { stripe } from "./stripe";

const schema = z.object({
	priceId: z.union([
		z.literal(env.NEXT_PUBLIC_PRICE_ID_BASIC),
		z.literal(env.NEXT_PUBLIC_PRICE_ID_PREMIUM),
	]),
});

export const generateStripeSessionAction = authenticatedAction
	.input(schema)
	.handler(async ({ input: { priceId }, ctx: { user } }) => {
		const fullUser = await userRepository.getUserById(user.id);

		if (!fullUser) {
			throw new PublicError("no user found");
		}
		const email = fullUser.email;
		const userId = user.id;

		if (!userId) {
			throw new PublicError("no user id found");
		}

		const stripeSession = await stripe.checkout.sessions.create({
			success_url: `${env.NEXT_PUBLIC_HOST}/success` as string,
			cancel_url: `${env.NEXT_PUBLIC_HOST}/cancel` as string,
			payment_method_types: ["card"],
			customer_email: email ? email : undefined,
			mode: "subscription",
			line_items: [
				{
					price: "priceId",
					quantity: 1,
				},
			],
			metadata: {
				userId,
			},
		});
		if (stripeSession.url) redirect(stripeSession.url);
		throw new PublicError("stripe session url not found");
	});
