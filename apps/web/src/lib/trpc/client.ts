import type { AppRouter } from "@repo/api";
import { loggerLink } from "@trpc/client";
import { createTRPCClient } from "@trpc/client";

import { endingLink } from "./shared";
// TRPC Client Api for Client Components with "use client"
export const clientApi = createTRPCClient<AppRouter>({
	links: [
		loggerLink({
			enabled: (opts) =>
				process.env.NODE_ENV === "development" ||
				(opts.direction === "down" && opts.result instanceof Error),
		}),
		endingLink({
			headers: {
				"x-trpc-source": "client",
			},
		}),
	],
});

export type { RouterInputs, RouterOutputs } from "@repo/api";
