"use client";
import { SigninWithProviders } from "@/auth/components";
import type { AvailableProviders } from "@/auth/components/signin-with-providers";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import React from "react";

export default function OAuthProviders() {
	const signinWithProvidersAction = async (provider: AvailableProviders) => {
		signIn(provider, {
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	};
	return (
		<div>
			<SigninWithProviders
				action={signinWithProvidersAction}
				withDescription={true}
				orPosition="top"
			/>
		</div>
	);
}
