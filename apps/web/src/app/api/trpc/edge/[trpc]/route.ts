import { createTrpcApiContext } from "@/lib/trpc/trpc-context";
import { edgeRouter } from "@repo/api/edge";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

// export const runtime ="edge";

const handler = async (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: "/api/trpc/edge",
		router: edgeRouter,
		req: req,
		createContext: () => createTrpcApiContext(req),
		onError: ({ error, path }) => {
			console.log("Error in tRPC handler (edge) on path", path);
			console.error(error);
		},
	});

export { handler as GET, handler as POST };
