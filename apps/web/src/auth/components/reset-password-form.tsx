"use client";
import {
	ResetPasswordSchema,
	type ResetPasswordSchemaType,
} from "@/auth/auth.schema";
import type { MessageResponse } from "@/types/responses";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
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
import { cn } from "@repo/ui/lib/utils";
import { useBoolean } from "../../hooks/use-boolean";
import { useFormAction } from "../../hooks/use-form-action";
import { resetPasswordAction } from "../lib/forgot-password";
export default function ResetPasswordForm({
	token,
}: {
	token: string;
}) {
	const { isPasswordShow, setPasswordShow } = useBoolean("passwordShow");
	const { form, isPending, message, onSubmit } = useFormAction({
		schema: ResetPasswordSchema,
		onSubmitAction: (data) => resetPasswordAction(data, token),
		defaultValues: {
			confirmPassword: "",
			password: "",
		},
	});
	return (
		<>
			<h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
			<Form {...form}>
				<form action={""} onSubmit={onSubmit}>
					<FormField
						control={form.control}
						name={"password"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											disabled={isPending}
											placeholder="********"
											type={isPasswordShow ? "text" : "password"}
											{...field}
										/>
										<span
											onKeyUp={(e) => e.key === "Enter" && onSubmit()}
											className={cn(`top-2 z-50 hover:text-sky-500 cursor-pointer
         right-2 absolute`)}
											onClick={() => setPasswordShow(!isPasswordShow)}
										>
											{!isPasswordShow ? (
												<EyeOpenIcon className="w-5 h-5" />
											) : (
												<EyeClosedIcon className="w-5 h-5" />
											)}
										</span>
									</div>
								</FormControl>
								<FormFeedback
									type="error"
									message={form.formState.errors.password?.message}
								/>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={"confirmPassword"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											disabled={isPending}
											placeholder="********"
											type={isPasswordShow ? "text" : "password"}
											{...field}
										/>
										<span
											onKeyUp={(e) => e.key === "Enter" && onSubmit()}
											className={cn(`top-2 z-50 hover:text-sky-500 cursor-pointer
         right-2 absolute`)}
											onClick={() => setPasswordShow(!isPasswordShow)}
										>
											{isPasswordShow ? (
												<EyeOpenIcon className="w-5 h-5" />
											) : (
												<EyeClosedIcon className="w-5 h-5" />
											)}
										</span>
									</div>
								</FormControl>
								<FormFeedback
									type="error"
									message={form.formState.errors.confirmPassword?.message}
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
						Change Password
					</LoaderButton>
				</form>
			</Form>
		</>
	);
}
