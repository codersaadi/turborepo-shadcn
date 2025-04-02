"use client";
import { forgotPasswordAction } from "@authjs/core/actions/forgot-password";
import {
	ForgotPasswordSchema,
} from "@authjs/core/schema";
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
import { useFormAction } from "@repo/ui/hooks/use-form";

export default function ForgotPasswordForm(
	{ onErrorIgnore }: {
		onErrorIgnore: (error: unknown) => boolean
	}
) {
	const { form, isPending, onSubmit, message } = useFormAction({
		schema: ForgotPasswordSchema,
		onSubmitAction: forgotPasswordAction,
		defaultValues: {
			email: "",
		},
		onErrorIgnore
	});
	return (
		<>
			<h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
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
						<FormFeedback type={message.type} message={message.message} />
					)}
					<LoaderButton
						isLoading={isPending}
						type="submit"
						className="w-full mt-2 "
					>
						Confirm Reset Password
					</LoaderButton>
				</form>
			</Form>
		</>
	);
}
