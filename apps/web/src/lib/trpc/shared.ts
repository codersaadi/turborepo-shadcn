import type { AppRouter } from "@repo/api";
import type { HTTPBatchLinkOptions, HTTPHeaders, TRPCLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
type SharedOptionsHttpBatchLink = Partial<
	HTTPBatchLinkOptions<AnyRouter["_def"]["_config"]["$types"]>
>;

const BASE_URL = "http://localhost:3000";
import { transformer } from "@repo/api/transformer";
export { transformer };
export const getBaseUrl = () => {
	if (typeof window !== "undefined") return "";
	const vc = process.env.VERCEL_URL;
	if (vc) return `https://${vc}`;
	return BASE_URL;
};

const lambdas = ["lamda_name"];

export const endingLink = (opts?: {
	headers?: HTTPHeaders | (() => Promise<HTTPHeaders>);
}) =>
	((runtime) => {
		const sharedOpts = {
			headers: opts?.headers,
			transformer,
		} satisfies SharedOptionsHttpBatchLink;
		const baseUrl = getBaseUrl();
		const edgeLink = httpBatchLink({
			...sharedOpts,
			url: `${baseUrl}/api/trpc/edge`,
		})(runtime);
		const lambdaLink = httpBatchLink({
			...sharedOpts,
			url: `${baseUrl}/api/trpc/lambda`,
		})(runtime);

		return (ctx) => {
			const path = ctx.op.path.split(".") as [string, ...string[]];
			const endpoint = lambdas.includes(path[0]) ? "lambda" : "edge";

			const newCtx = {
				...ctx,
				op: { ...ctx.op, path: path.join(".") },
			};
			return endpoint === "edge" ? edgeLink(newCtx) : lambdaLink(newCtx);
		};
	}) satisfies TRPCLink<AppRouter>;
