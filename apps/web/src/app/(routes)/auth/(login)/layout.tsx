import OAuthProviders from "@/auth/components/oauth-provider";
import type React from "react";

interface AuthLayoutProps {
	readonly children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<>
			{children}
			<OAuthProviders />
		</>
	);
}
