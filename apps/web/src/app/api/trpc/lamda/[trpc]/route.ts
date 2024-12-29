import { createTrpcApiContext } from "@/lib/trpc/trpc-context";
import { lambdaRouter } from "@repo/api/lambda";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
// Stripe is incompatible with Edge runtimes due to using Node.js events
// export const runtime = "edge";

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: "/api/trpc/lambda",
		router: lambdaRouter,
		req,
		createContext: () => createTrpcApiContext(req),
		onError: ({ error, path }) => {
			console.log("Error in tRPC handler (lambda) on path", path);
			console.error(error);
		},
	});

export { handler as GET, handler as POST };
