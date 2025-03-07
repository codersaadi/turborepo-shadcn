"use client";
import type { AppRouter } from "@repo/api";
import {
	type QueryClient,
	QueryClientProvider,
	isServer,
} from "@tanstack/react-query";
import { createTRPCClient } from "@trpc/client";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import { TRPCProvider, trpcLinks } from "./react-client";
export let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
	if (isServer) return makeQueryClient();
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

export default function ReactQueryProvider({
	children,
}: { children: React.ReactNode }) {
	const [queryClient] = useState(() => getQueryClient());
	const [trpcClient] = useState(() => {
		return createTRPCClient<AppRouter>({
			links: trpcLinks,
		});
	});

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}
