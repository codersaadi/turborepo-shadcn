import ReactQueryProvider from "@/lib/trpc/trpc-client-provider";
import { AnalyticsProvider } from "@repo/analytics";
import type React from "react";
import { UIProvider } from "repo-ui/components/ui-provider";
export default async function RootProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AnalyticsProvider options={{ posthog: false }}>
			<ReactQueryProvider>
				<UIProvider>{children}</UIProvider>
			</ReactQueryProvider>
		</AnalyticsProvider>
	);
}
