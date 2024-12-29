import shared from "repo-ui/tailwind-shared";
import type { Config } from "tailwindcss/types/config";
export default {
	...shared,
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx,jsx,tsx}",
		"./app/**/*.{ts,tsx,jsx,tsx}",
		"./src/**/*.{ts,tsx,jsx,tsx}",
		"../../packages/repo-ui/src/components/**/*.{ts,tsx}",
		"./modules",
	],
} satisfies Config;
