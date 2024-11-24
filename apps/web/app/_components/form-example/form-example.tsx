"use client";
import { useFormAction } from "@/_hooks/use-form-action";
import { FormFeedback } from "@repo/ui/components/form-feedback";
import { LoaderButton } from "@repo/ui/components/loader-button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import React from "react";
import { exampleFormAction } from "./form-example-action";
import { exampleFormSchema } from "./form-example-schema";
export default function FormExample() {
	const { form, message, onSubmit, isPending } = useFormAction({
		schema: exampleFormSchema,
		onSubmitAction: exampleFormAction,
		defaultValues: {
			email: "",
		},
	});
	return (
		<Form {...form}>
			<form onSubmit={onSubmit}>
				<FormField
					control={form.control}
					name={"email"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										disabled={isPending}
										placeholder="xyz@yourmail.com"
										type={"email"}
										{...field}
									/>
								</div>
							</FormControl>
							<FormFeedback
								type="error"
								message={form.formState.errors.email?.message}
							/>
						</FormItem>
					)}
				/>
				{message && (
					<FormFeedback {...message} />
				)}
				<LoaderButton
					isLoading={isPending}
					type="submit"
					className="w-full mt-2 "
				>
					Confirm form
				</LoaderButton>
			</form>
		</Form>
	);
}
