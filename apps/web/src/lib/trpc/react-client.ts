"use client";
import type { AppRouter } from "@repo/api";
import { loggerLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

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
		client: true, // to have fetch credentials : "include"
	}),
];
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
