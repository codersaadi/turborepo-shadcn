import ReactQueryProvider from "@/lib/trpc/trpc-client-provider";
import { UIProvider } from "@repo/ui/components/ui-provider";
import type React from "react";

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
