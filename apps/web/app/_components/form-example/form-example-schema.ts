import { z } from "zod";

export const exampleFormSchema = z.object({
	email: z.string().email(),
});

export type ExampleFormSchema = z.infer<typeof exampleFormSchema>;
