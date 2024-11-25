import { SignUpForm } from "@/auth/components";
import { APP_NAME } from "@/constants";
import type { Metadata } from "next";

import React from "react";

export default function page() {
	return <SignUpForm />;
}

/**
 * Meta data for the signup form page
 */
export const metadata: Metadata = {
	title: `${APP_NAME} -Create an Account for free`,
	description: "...",
};
