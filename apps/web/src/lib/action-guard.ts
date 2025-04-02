import { auth } from "@authjs/core";
import type { SessionUser } from "@authjs/core/types";
import { createAuthenticationError, isKnownError } from "@repo/api/errors";
import { RatelimitError, secureLimiter, strictLimiter } from "@repo/rate-limit";
import { type TShapeErrorFn, createServerActionProcedure } from "zsa";
import { getIp } from "./get-ip";

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

export const authActionProcedure = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		const session = await auth();
		if (!session?.user?.id) {
			throw createAuthenticationError();
		}

		const { user } = session;
		const limitResponse = await secureLimiter.limit(user.id);
		if (!limitResponse.success) {
			throw new RatelimitError("Too many requests, slow down.");
		}

		return { user } satisfies { user: SessionUser };
	});

// Improve authenticated action with better error handling
export const authenticatedAction = authActionProcedure.createServerAction();

// Improve unauthenticated action with stricter rate limiting
export const unauthenticatedAction = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		const limitResponse = await strictLimiter.limit(
			(await getIp()) || "global",
		);
		if (!limitResponse.success) {
			throw new RatelimitError("Too many requests, slow down.");
		}
	})
	.createServerAction();
