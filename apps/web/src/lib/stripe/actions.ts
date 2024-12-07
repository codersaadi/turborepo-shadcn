"use server";
import {
	createBadRequestError,
	createResourceNotFoundError,
} from "@repo/api/errors";
import { stripe } from "@repo/api/stripe";
import * as userRepository from "@repo/db/data/users";
import env from "@repo/env";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticatedAction } from "../action-guard";
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
			throw createResourceNotFoundError();
		}
		const email = fullUser.email;
		const userId = user.id;

		if (!userId) {
			throw createBadRequestError("no user id found");
		}

		const stripeSession = await stripe.checkout.sessions.create({
			success_url: `${env.NEXT_PUBLIC_HOST}/success` as string,
			cancel_url: `${env.NEXT_PUBLIC_HOST}/cancel` as string,
			payment_method_types: ["card"],
			customer_email: email ? email : undefined,
			mode: "subscription",
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			metadata: {
				userId,
			},
		});
		if (stripeSession.url) redirect(stripeSession.url);
		throw createBadRequestError("stripe session url not found");
	});
