// "use client"

import NextThemeSwitch from "@/components/ThemeSwitch";
import React from "react";
export default async function page() {
	return (
		<div className="pt-4">
			<div className="relative left-0 right-0 translate-x-1/2">
				<NextThemeSwitch />
			</div>
			<div className="max-w-5xl w-full mx-auto text-center">
				<h1 className="text-4xl lg:text-7xl md:text-5xl font-bold dark:text-gray-100 tracking-tig\ht text-gray-800  ">
					Welcome to the app
				</h1>
			</div>
		</div>
	);
}
