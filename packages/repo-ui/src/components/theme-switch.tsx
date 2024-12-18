"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import React, { useEffect } from "react";

export function ThemeSwitch({
	LoadingComponent,
}: {
	LoadingComponent: React.ReactNode;
}) {
	const DARK_THEME = "dark";
	const LIGHT_THEME = "light";
	const [mounted, setMounted] = React.useState(false);
	const { setTheme, resolvedTheme } = useTheme();
	useEffect(() => setMounted(true), []);
	if (!mounted) {
		return LoadingComponent;
	}

	if (resolvedTheme === DARK_THEME) {
		return (
			<SunIcon className="w-5 h-5  " onClick={() => setTheme(LIGHT_THEME)} />
		);
	}
	if (resolvedTheme === LIGHT_THEME) {
		return (
			<MoonIcon
				className="w-5 h-5     rounded-md"
				onClick={() => setTheme(DARK_THEME)}
			/>
		);
	}
}
