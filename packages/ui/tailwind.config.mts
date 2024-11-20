import type { Config } from "tailwindcss/types/config";
import shared from "./tailwind-shared.mjs";

export default {
	...shared,
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx,jsx,tsx}",
		"./app/**/*.{ts,tsx,jsx,tsx}",
		"./src/**/*.{ts,tsx,jsx,tsx}",
	],
} satisfies Config;
