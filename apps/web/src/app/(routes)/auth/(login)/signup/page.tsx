import { SignUpForm } from "@/auth/components";
import { signUpAction } from "@/auth/lib/signup-action";
import type { Metadata } from "next";

import React from "react";

export default function page() {
	return <SignUpForm onSubmitAction={signUpAction} />;
}

/**
 * Meta data for the signin form page
 */
export const metadata: Metadata = {
	title: "AppName -Create an Account for free ",
	description: "...",
};
