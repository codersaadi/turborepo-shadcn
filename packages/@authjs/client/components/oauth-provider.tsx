"use client";
import { signIn } from "next-auth/react";
import SigninWithProviders, { type SigninWithProvidersProps, type AvailableProviders } from "./signin-with-providers";

export default function OAuthProviders({ redirectTo, options }: {
	redirectTo: string
} & {
	options: Partial<Omit<SigninWithProvidersProps, 'action'>>
}) {
	const signinWithProvidersAction = async (provider: AvailableProviders) => {
		signIn(provider, {
			redirectTo: redirectTo,
		});
	};
	return (
		<SigninWithProviders
			action={signinWithProvidersAction}
			{...options}
		/>
	);
}
