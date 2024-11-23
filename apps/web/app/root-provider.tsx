import { UIProvider } from "@repo/ui/components/ui-provider";
import type React from "react";

export default function RootProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UIProvider>
            {children}
        </UIProvider>
    );
}
