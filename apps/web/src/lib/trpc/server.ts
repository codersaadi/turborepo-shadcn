import type { AppRouter } from "@repo/api";
import { createTRPCClient, loggerLink } from "@trpc/client";
import { headers } from "next/headers";
import { endingLink } from "./shared";
// TRPC Server Api
export const serverApi = createTRPCClient<AppRouter>({
	links: [
		// Logger link for debugging tRPC requests and responses.
		loggerLink({
			enabled: (opts) =>
				process.env.NODE_ENV === "development" || // Enable in development mode.
				(opts.direction === "down" && opts.result instanceof Error), // Log errors in responses.
		}),
		// Custom link for managing headers and other configurations.
		endingLink({
			headers: async () => {
				const h = new Map(await headers()); // Fetch headers in a server-side context.
				h.delete("connection"); // Remove non-HTTP/1.1 headers.
				h.delete("transfer-encoding"); // Remove transfer-encoding headers.
				h.set("x-trpc-source", "server"); // Set a custom header to identify the request source.
				return Object.fromEntries(h.entries()); // Convert Map to a plain object.
			},
		}),
	],
});

// Re-export input and output types for better type inference in API calls.
export type { RouterInputs, RouterOutputs } from "@repo/api";
