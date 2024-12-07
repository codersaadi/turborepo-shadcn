import type { SessionUser } from "@/types/auth";

import { createAuthenticationError, isKnownError } from "@repo/api/errors";
import { type TShapeErrorFn, createServerActionProcedure } from "zsa";
import { auth } from "../auth";
import { rateLimitByKey } from "./limiter";

function shapeErrors({ err }: { err: ReturnType<TShapeErrorFn> }) {
	const isAllowedError = isKnownError(err);
	const isDev = process.env.NODE_ENV === "development";
	if (isAllowedError || isDev) {
		console.error(err);
		return {
			code: err.code ?? "ERROR",
			message: `${!isAllowedError && isDev ? "DEV ONLY ENABLED - " : ""}${
				err.message
			}`,
		};
	}
	return {
		code: "ERROR",
		message: "Something went wrong",
	};
}

// Improve rate limiting configuration with constants
const RATE_LIMIT_CONFIG = {
	AUTHENTICATED: { limit: 10, window: 10000 }, // 10 requests per 10 seconds
	UNAUTHENTICATED: { limit: 5, window: 10000 }, // 5 requests per 10 seconds
} as const;
export const authActionProcedure = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		const session = await auth();
		if (!session?.user?.id) {
			throw createAuthenticationError();
		}

		const { user } = session;
		await rateLimitByKey({
			key: `${user.id}-global`,
			...RATE_LIMIT_CONFIG.AUTHENTICATED,
		});

		return { user } satisfies { user: SessionUser };
	});

// Improve authenticated action with better error handling
export const authenticatedAction = authActionProcedure.createServerAction();

// Improve unauthenticated action with stricter rate limiting
export const unauthenticatedAction = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		await rateLimitByKey({
			key: "unauthenticated-global",
			...RATE_LIMIT_CONFIG.UNAUTHENTICATED,
		});
	})
	.createServerAction();
