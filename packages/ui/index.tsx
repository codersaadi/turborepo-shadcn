import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ToastProvider } from "@repo/ui/components/ui/toast";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
export function UIProvider({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			defaultTheme="dark"
			enableSystem
			attribute="class"
			disableTransitionOnChange
		>
			<ToastProvider>
				<TooltipProvider>
					<Toaster />
					{children}
				</TooltipProvider>
			</ToastProvider>
		</ThemeProvider>
	);
}
