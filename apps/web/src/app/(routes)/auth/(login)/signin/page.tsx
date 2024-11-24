import { SignInForm } from "@/auth/components";
import { signInAction } from "@/auth/lib/signin-action";
import type { Metadata } from "next";
import React from "react";

export default function page() {
	return <SignInForm onSubmitAction={signInAction} />;
}

/**
 * Meta data for the signin form page
 */
export const metadata: Metadata = {
	title: "AppName - Signin to Continue ",
	description: "...",
};
