import type { Params } from "next/dist/server/request/params";
import { z } from "zod";

// Define the type for search parameters
export type SearchParams = Record<string, string | null | number>;
type ParamsInput = Params | string | number | null;

// Function to validate data against a Zod schema
async function schemaResultAsync<T extends z.ZodTypeAny>(
  data: Promise<unknown> | unknown,
  schema: T
): Promise<Zod.infer<T>> {
  try {
    // Wait for data if it's a promise, then parse it
    const parsedData = await (data instanceof Promise
      ? data
      : Promise.resolve(data));
    return schema.parse(parsedData);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      // Here you can log the error and return a structured error message
      console.error("Validation Error:", error.errors);
      throw new Error(
        `Validation Error: ${error.errors.map((err) => err.message).join(", ")}`
      );
    }
    // Handle unexpected errors
    console.error("Unexpected Error:", error);
    throw new Error("An unexpected error occurred.");
  }
}

// Function to get and validate route parameters
export async function getParamsStrict<T extends z.ZodTypeAny>(
  params: Promise<ParamsInput>,
  schema: T
): Promise<Zod.infer<T>> {
  return schemaResultAsync(params, schema);
}

// Function to get and validate search parameters
export async function getSearchParams<T extends z.AnyZodObject>(
  searchParams: Promise<SearchParams>,
  schema: T
): Promise<Zod.infer<T>> {
  return schemaResultAsync(searchParams, schema);
}
