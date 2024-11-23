"use server";

import type { ExampleFormSchema } from "./form-example-schema";

export async function exampleFormAction(data: ExampleFormSchema) {
	return {
		message: "Form Submitted Successfully",
		success: true,
	};
}
