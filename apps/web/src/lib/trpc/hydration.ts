import "server-only";
import { makeQueryClient } from "@/lib/trpc/query-client";
import type { AppRouter } from "@repo/api";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCallerFactory } from "./caller";
// Create a stable getter for the query client.
// This ensures that the same client is reused during the same request, improving performance and consistency.
export const getQueryClient = cache(makeQueryClient);
// This is a server caller only , it has the headers and auth
const caller = createCallerFactory();

// Create hydration helpers for tRPC and React Query integration in server components.
export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
	caller, // Use the server-side caller for API interaction.
	getQueryClient, // Pass the cached query client for data management.
);
// const HydrateClient: (props: {
//   children: React.ReactNode;
// }) => React.JSX.Element
// HoC to hydrate the query client for a client component to pick up the prefetched promise and skip an initial client-side fetch.
