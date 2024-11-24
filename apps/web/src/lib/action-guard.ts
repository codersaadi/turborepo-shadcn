import type { SessionUser } from "@/types/auth";
import { type TShapeErrorFn, ZSAError, createServerActionProcedure } from "zsa";
import { auth } from "../auth";
import { AuthenticationError, type ErrorResponse, PublicError } from "./errors";
import { rateLimitByKey } from "./limiter";

function shapeErrors({
	err,
	typedData,
}: Parameters<TShapeErrorFn>[number]): ErrorResponse {
	const isDev = process.env.NODE_ENV === "development";
	const timestamp = new Date().toISOString();

	// Handle ZSA validation errors
	if (err instanceof ZSAError) {
		return {
			code: "VALIDATION_ERROR",
			message: err.message,
			statusCode: 400,
			data: err.data ?? null,
			metadata: isDev
				? {
						timestamp,
						stack: err.stack,
						debug: {
							inputRaw: typedData.inputRaw,
							inputParsed: typedData.inputParsed,
							inputParseErrors: typedData.inputParseErrors,
						},
					}
				: null,
		};
	}

	// Handle our custom public errors
	if (err instanceof PublicError) {
		return {
			code: err.code,
			message: err.message,
			statusCode: err.statusCode,
			data: null,
			metadata: isDev
				? {
						timestamp,
						stack: err.stack,
						debug: {
							inputRaw: typedData.inputRaw,
							inputParsed: typedData.inputParsed,
							inputParseErrors: typedData.inputParseErrors,
						},
					}
				: null,
		};
	}

	// Handle unknown errors
	const isError = err instanceof Error;
	return {
		code: "INTERNAL_SERVER_ERROR",
		message: isDev && isError ? err.message : "An unexpected error occurred",
		statusCode: 500,
		data: null,
		metadata: isDev
			? {
					timestamp,
					stack: isError ? err.stack : undefined,
					debug: {
						inputRaw: typedData.inputRaw,
						inputParsed: typedData.inputParsed,
						inputParseErrors: typedData.inputParseErrors,
					},
				}
			: null,
	};
}

// Improve rate limiting configuration with constants
const RATE_LIMIT_CONFIG = {
	AUTHENTICATED: { limit: 10, window: 10000 }, // 10 requests per 10 seconds
	UNAUTHENTICATED: { limit: 5, window: 10000 }, // 5 requests per 10 seconds
} as const;

// Improve authenticated action with better error handling
export const authenticatedAction = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		const session = await auth();
		if (!session?.user?.id) {
			throw new AuthenticationError();
		}

		const { user } = session;
		await rateLimitByKey({
			key: `${user.id}-global`,
			...RATE_LIMIT_CONFIG.AUTHENTICATED,
		});

		return { user } satisfies { user: SessionUser };
	})
	.createServerAction();

// Improve unauthenticated action with stricter rate limiting
export const unauthenticatedAction = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		await rateLimitByKey({
			key: "unauthenticated-global",
			...RATE_LIMIT_CONFIG.UNAUTHENTICATED,
		});
	});
