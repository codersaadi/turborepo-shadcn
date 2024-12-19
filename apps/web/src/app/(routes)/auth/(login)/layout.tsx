import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { OAuthProviders } from "@authjs/client";
import type React from "react";

interface AuthLayoutProps {
	readonly children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<>
			{children}
			<OAuthProviders options={{
				orPosition: "top",
				withDescription: true
			}} redirectTo={DEFAULT_LOGIN_REDIRECT} />
		</>
	);
}
