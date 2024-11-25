import { ForgotPasswordForm } from "@/auth/components";
import { APP_NAME } from "@/constants";
import type { Metadata } from "next";
import React from "react";

export default function page() {
	return <ForgotPasswordForm />;
}
export const metadata: Metadata = {
	title: `${APP_NAME} - Forgot Account Password`,
	description: "...",
};
