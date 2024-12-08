import type { Params } from "next/dist/server/request/params";
import type { z } from "zod";
export type SearchParams = Record<string, string | null | number>;
type ParamsInput = Params | string | number | null;
async function schemaResultAsync<T extends z.ZodTypeAny>(
  data: Promise<unknown> | unknown,
  schema: T
) {
  const parsedData = await (data instanceof Promise
    ? data
    : Promise.resolve(data));
  return schema.parse(parsedData) as Zod.infer<T>;
}

export async function getParamsStrict<T extends z.ZodTypeAny>(
  params: Promise<ParamsInput>,
  schema: T
) {
  return schemaResultAsync(params, schema);
}
export async function getSearchParams<T extends z.AnyZodObject>(
  searchParams: Promise<SearchParams>,
  schema: T
) {
  return schemaResultAsync(searchParams, schema);
}
