import type { Params } from "next/dist/server/request/params";
import type { z } from "zod";
export type SearchParams = Record<string, string | null | number>;
type ParamsInput = Params | string | number | null;

/**
 * Nextjs 15
 */
export async function getParamsStrict<T extends z.ZodTypeAny>(
	paramsPromise: Promise<ParamsInput>,
	schema: T,
) {
	const params = await paramsPromise;
	const result = schema.parse(params);
	return result as Zod.infer<T>;
}
export async function getSearchParams<T extends z.AnyZodObject>(
	searchParamsPromise: Promise<SearchParams>,
	schema: T,
) {
	const searchParams = await searchParamsPromise;
	const result = schema.parse(searchParams);
	return result as Zod.infer<T>;
}
