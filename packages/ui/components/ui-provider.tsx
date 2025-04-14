import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
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
			<NuqsAdapter>
				<ToastProvider>
					<TooltipProvider>
						<Toaster />
						{children}
					</TooltipProvider>
				</ToastProvider>
			</NuqsAdapter>
		</ThemeProvider>
	);
}
