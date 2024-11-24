import type React from "react";
import OAuthProviders from "./oauth-provider";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<OAuthProviders />
		</>
	);
}
