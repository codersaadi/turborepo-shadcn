import type { HomeLayoutProps } from "fumadocs-ui/layouts/home";

export const baseOptions: HomeLayoutProps = {
	nav: {
		title: "My App",
		enableSearch: true,
		url: "/",
	},
	githubUrl: "https:/github.com/codersaadi",
	links: [
		{ text: "Option 1", url: "" },
		{ text: "Option 2", url: "" },
		{ text: "Option 3", url: "" },
		{ text: "Option 4", url: "" },
	],
};
