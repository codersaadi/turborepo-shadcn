"use client";

import { signInAction } from "@authjs/core/actions/signin";
import { LoginSchema } from "@authjs/core/schema";
import { AvatarIcon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { FormFeedback } from "repo-ui/components/form-feedback";
import { LoaderButton } from "repo-ui/components/loader-button";
import { Button } from "repo-ui/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "repo-ui/components/ui/form";
import { Input } from "repo-ui/components/ui/input";
import { useFormAction } from "repo-ui/hooks/use-form";
import { cn } from "repo-ui/lib/utils";
export default function SignInForm({
	className,
	onErrorIgnore

}: {
	className?: string;
	onErrorIgnore: (error: unknown) => boolean;
}) {
	const [isPasswordShow, setPasswordShow] = useState(false);
	const { form, message, isPending, onSubmit } = useFormAction({
		schema: LoginSchema,
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmitAction: signInAction,
		onErrorIgnore
	});

	return (
		<>
			<h2 className="text-3xl tracking-tight font-semibold text-gray-700 dark:text-gray-200 pb-1 ">
				Sign In to Continue
			</h2>
			<p className="text-gray-700/70 dark:text-gray-400/70">
				Enter you credentials to continue
			</p>
			<Form {...form}>
				<form
					action={""}
					className={cn("flex flex-col gap-3", className)}
					onSubmit={onSubmit}
				>
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
											placeholder="Email"
											type="email"
											{...field}
											className=""
										/>
										<AvatarIcon
											className={cn("top-2 w-5 h-5 right-2 absolute")}
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
											className=""
											placeholder="*********"
											type={isPasswordShow ? "text" : "password"}
											{...field}
										/>
										<span
											onKeyUp={(e) => {
												e.key === "Enter" && onSubmit(e);
											}}
											className={cn(`top-2  hover:text-sky-500 cursor-pointer
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

					<Link
						className=" text-red-600 dark:text-red-500   hover:underline"
						href={"/auth/forgot-password"}
					>
						Forgot Password?
					</Link>
					<LoaderButton isLoading={isPending} variant={"default"} type="submit">
						Sign In
					</LoaderButton>
				</form>
				<SignInFooter>
					<Link href="/auth/signin-email">
						<Button className="text-md mx-auto w-full mt-4" variant={"link"}>
							Sign In with Email
						</Button>
					</Link>
				</SignInFooter>
			</Form>
		</>
	);
}

export const SignInFooter = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<p className="pt-3  text-center">
				<Link href={"/auth/signup"} className="text-link font-medium px-2">
					Create an account!
				</Link>
				if you don't have one
			</p>
		</>
	);
};
