"use client";
import type { AppRouter } from "@repo/api";
import {
	type QueryClient,
	QueryClientProvider,
	isServer,
} from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import { trpcLinks } from "./react-client";
export let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
	if (isServer) return makeQueryClient();
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
export const trpcReact = createTRPCReact<AppRouter>({});

export default function ReactQueryProvider({
	children,
}: { children: React.ReactNode }) {
	const [queryClient] = useState(() => getQueryClient());
	const [trpcClient] = useState(() => {
		return trpcReact.createClient({
			links: trpcLinks,
		});
	});

	return (
		<trpcReact.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpcReact.Provider>
	);
}
