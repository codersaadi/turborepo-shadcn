'use client'
import { ResetPasswordForm } from "@/components/auth/new-password";
import Link from "next/link";
import React from "react";
import { Button } from "repo-ui/components/ui/button";
interface ResetPasswordProps {
	searchParams: Promise<{
		token?: string;
	}>;
}

export default async function page({ searchParams }: ResetPasswordProps) {
	const { token } = await searchParams;
	if (!token) {
		return (
			<Link href={"/auth/signin"}>
				<Button>Go Back to Sign In</Button>
			</Link>
		);
	}
	return <ResetPasswordForm token={token} />;
}
