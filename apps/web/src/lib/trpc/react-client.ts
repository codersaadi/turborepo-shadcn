"use client";
import type { AppRouter } from "@repo/api";
import { loggerLink } from "@trpc/client";

import { createTRPCReact } from "@trpc/react-query";
import { endingLink } from "./shared";
/**
 * TRPC Nextjs Client - It will be used with react query
 */
export const trpcLinks = [
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
];
export const trpcReact = createTRPCReact<AppRouter>({});
