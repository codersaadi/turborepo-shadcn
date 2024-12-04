import {
	QueryClient,
	defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { transformer } from "./shared";

export function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: 2, // Number of retries on failure
				refetchOnWindowFocus: false, // Disable refetch on window focus
				staleTime: 5 * 60 * 1000, // 5 minutes of cache freshness
			},
			dehydrate: {
				serializeData: transformer.serialize,
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === "pending",
			},
			hydrate: {
				deserializeData: transformer.deserialize,
			},
		},
	});
}
