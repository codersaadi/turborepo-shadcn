"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isRedirectError } from "next/dist/client/components/redirect";
import { useState, useTransition } from "react";
import {
	type DefaultValues,
	type FieldValues,
	type UseFormReturn,
	useForm,
} from "react-hook-form";
import type { z } from "zod";

export type FormMessage = {
	type: "error" | "success";
	message: string;
};
const messageResponseTypeGuard = <R,>(
	response: Awaited<R>,
): FormMessage | undefined => {
	if (
		response &&
		typeof response === "object" &&
		"success" in response &&
		typeof response.success === "boolean" &&
		"message" in response &&
		typeof response.message === "string"
	) {
		return {
			type: !response.success ? "error" : "success",
			message: response.message,
		};
	}
	return;
};
export interface FormSubmitProps<
	T extends z.ZodSchema<FieldValues>,
	R = unknown,
> {
	schema: T;
	defaultValues: DefaultValues<z.infer<T>>;
	onSubmitAction: (data: z.infer<T>) => Promise<R>;
	onSuccess?: (response: R) => void; // Success callback
	onError?: (error: unknown) => void; // Error callback
	successMessage?: string;
	errorMessage?: string;
}

export const useFormAction = <T extends z.ZodSchema<FieldValues>, R = unknown>(
	props: FormSubmitProps<T, R>,
) => {
	const { schema, defaultValues, onSubmitAction, onSuccess, onError } = props;

	const form: UseFormReturn<z.infer<T>> = useForm<z.infer<T>>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const [message, setMessage] = useState<FormMessage | null>(null);
	const [isPending, startTransition] = useTransition();

	const onSubmit = (action: (data: z.infer<T>) => Promise<R>) => {
		return async (data: z.infer<T>) => {
			setMessage(null);

			startTransition(async () => {
				try {
					const response = await action(data);

					if (onSuccess) {
						onSuccess(response);
						const msgRes = messageResponseTypeGuard(response);
						if (msgRes) {
							setMessage(msgRes);
							return;
						}
					}

					setMessage({
						type: "success",
						message: props.successMessage ?? "Submission successful.",
					});
				} catch (error) {
					if (isRedirectError(error)) {
						return;
					}

					if (process.env.NODE_ENV !== "production") {
						console.error("Submission Error:", error);
					}

					if (onError) {
						onError(error);
					}

					setMessage({
						type: "error",
						message:
							props.errorMessage ?? "Submission failed. Please try again.",
					});
				}
			});
		};
	};

	return {
		form,
		message,
		isPending,
		onSubmit: form.handleSubmit(onSubmit(onSubmitAction)),
	};
};
