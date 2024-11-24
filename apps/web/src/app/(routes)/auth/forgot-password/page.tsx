import { ForgotPasswordForm } from "@/auth/components";
import { forgotPasswordAction } from "@/auth/lib/forgot-password";
import React from "react";

export default function page() {
	return <ForgotPasswordForm onSubmitAction={forgotPasswordAction} />;
}
