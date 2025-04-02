"use client";

import { signUpAction } from "@authjs/core/actions/signup";
import { SignupSchema } from "@authjs/core/schema";
import {
	AvatarIcon,
	EnvelopeOpenIcon,
	EyeClosedIcon,
	EyeOpenIcon,
} from "@radix-ui/react-icons";
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
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";
export default function SignUpForm({
	onErrorIgnore
}: {
	onErrorIgnore: (error: unknown) => boolean;
}) {
	const [isPasswordShow, setPasswordShow] = useState(false);
	const { form, message, isPending, onSubmit } = useFormAction({
		schema: SignupSchema,
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		onSubmitAction: signUpAction,
		onErrorIgnore
	});

	return (
		<>
			<h2 className="text-3xl sm:text-4xl tracking-tight font-semibold text-gray-700 dark:text-gray-200 ">
				Create an Account for free
			</h2>
			<Form {...form}>
				<form className="flex flex-col p-1 " onSubmit={onSubmit}>
					<FormField
						control={form.control}
						name={"name"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<div className="relative ">
										<Input
											disabled={isPending}
											placeholder="Name"
											type="text"
											{...field}
										/>
										<AvatarIcon
											className={cn("top-2 right-2 w-5 h-5 absolute")}
										/>
									</div>
								</FormControl>
								<FormFeedback
									type="error"
									message={form.formState.errors.name?.message}
								/>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={"email"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<div className="relative ">
										<Input
											disabled={isPending}
											placeholder="Email"
											type="email"
											{...field}
										/>
										<EnvelopeOpenIcon
											className={cn("top-2 right-2 w-5 h-5 absolute")}
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
											className={cn("")}
											placeholder="********"
											type={isPasswordShow ? "text" : "password"}
											{...field}
										/>
										<span
											onKeyUp={(e) => e.key === "Enter" && onSubmit()}
											className={cn(`top-2 hover:text-sky-500 cursor-pointer
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
									message={form.formState.errors.password?.message}
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
						className="w-full  mt-2"
					>
						Sign Up
					</LoaderButton>
				</form>
				<p className="mt-2">
					<Link
						className=" mr-2 text-sm text-link underline"
						href={"/auth/signin"}
					>
						Aleady Have an Account?
					</Link>
					Sign In to your account
				</p>
			</Form>
		</>
	);
}
