import { MagicSignInForm } from "@/auth/components";
import { APP_NAME } from "@/constants";
import type { Metadata } from "next";
import React from "react";

export default function page() {
	return <MagicSignInForm />;
}

/**
 * Meta data for the signin form page
 */
export const metadata: Metadata = {
	title: `${APP_NAME} - Signin with Email to Continue`,
	description: "...",
};
