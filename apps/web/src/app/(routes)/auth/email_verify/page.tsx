import { EmailVerifyForm } from "@/auth/components";
import { emailVerifyAction } from "@/auth/lib/emailVerifyAction";
import React from "react";
interface EmailVerifyProps {
	searchParams: Promise<{
		token?: string;
	}>;
}
export default async function page({ searchParams }: EmailVerifyProps) {
	const { token } = await searchParams;
	return <EmailVerifyForm onSubmitAction={emailVerifyAction} token={token} />;
}
