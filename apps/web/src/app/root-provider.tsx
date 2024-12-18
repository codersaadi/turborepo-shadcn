import ReactQueryProvider from "@/lib/trpc/trpc-client-provider";
import type React from "react";
import { UIProvider } from "repo-ui/components/ui-provider";

export default async function RootProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ReactQueryProvider>
			<UIProvider>{children}</UIProvider>
		</ReactQueryProvider>
	);
}
