import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { ToastProvider } from "./ui/toast";
import { Toaster } from "./ui/toaster";
import { TooltipProvider } from "./ui/tooltip";
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
