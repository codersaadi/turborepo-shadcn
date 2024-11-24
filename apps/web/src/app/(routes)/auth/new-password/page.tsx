import type { ResetPasswordSchemaType } from "@/auth/auth.schema";
import { ResetPasswordForm } from "@/auth/components";
import { resetPasswordAction } from "@/auth/lib/forgot-password";
import React from "react";
interface ResetPasswordProps {
	searchParams: Promise<{
		token?: string;
	}>;
}

export default async function page({ searchParams }: ResetPasswordProps) {
	const { token } = await searchParams;
	const resetPassword = (data: ResetPasswordSchemaType) =>
		resetPasswordAction(data, token);
	return <ResetPasswordForm onSubmitAction={resetPassword} />;
}
