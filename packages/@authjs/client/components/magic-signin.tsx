"use client";

import { signinMagic } from "@authjs/core/actions/signin-magic";
import { MagicSignInSchema } from "@authjs/core/schema";
import { AvatarIcon } from "@radix-ui/react-icons";
import { FormFeedback } from "@repo/ui/components/form-feedback";
import { LoaderButton } from "@repo/ui/components/loader-button";
import { Button } from "@repo/ui/components/ui/button";
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
import { SignInFooter } from "./signin-form";

export default function MagicSignInForm({
	// className,
	onErrorIgnore,

}: {
	onErrorIgnore: (error: unknown) => boolean;
}) {
	const { form, message, isPending, onSubmit } = useFormAction({
		onSubmitAction: async (data) => {
			return signinMagic(data, onErrorIgnore)
		},
		schema: MagicSignInSchema,
		defaultValues: {
			email: "",
		},
		onErrorIgnore
	});
	return (
		<>
			<h2 className="font-semibold text-xl">Sign In with Email</h2>

			<Form {...form}>
				<form className="py-6 space-y-4" onSubmit={onSubmit}>
					<FormField
						control={form.control}
						name={"email"}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Email</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											disabled={isPending}
											placeholder="Enter your email"
											type="email"
											{...field}
											className="rounded-md px-4 py-2"
										/>
										<AvatarIcon
											className={cn(
												"top-2 w-5 h-5 right-3 absolute text-gray-400",
											)}
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

					<LoaderButton className="w-full" type="submit" isLoading={isPending}>
						Sign In With Email
					</LoaderButton>
				</form>

				{/* Feedback message */}
				{message && (
					<div className="mt-4">
						<FormFeedback message={message.message} type={message.type} />
					</div>
				)}
			</Form>
			<SignInFooter>
				<Link href="/auth/signin">
					<Button className="text-md mx-auto w-full mt-4" variant={"link"}>
						Sign In with Credentials
					</Button>
				</Link>
			</SignInFooter>
			<style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
		</>
	);
}
