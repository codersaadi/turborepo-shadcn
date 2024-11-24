import React from "react";
import NextThemeSwitch from "./_components/ThemeSwitch";
import FormExample from "./_components/form-example/form-example";
export default function page() {
	return (
		<div className="pt-4">
			<div className="relative left-0 right-0 translate-x-1/2">
				<NextThemeSwitch />
			</div>
			<div className="max-w-5xl w-full mx-auto text-center">
				<h1 className="text-4xl lg:text-7xl md:text-5xl font-bold dark:text-gray-100 tracking-tight text-gray-800  ">
					Welcome to the app
				</h1>
				<p className="text-md text-gray-600 dark:text-gray-300">
					Here is a form example with a form hook for you
				</p>
			</div>
			<div className="mx-auto max-w-sm ">
				<FormExample />
			</div>

		</div>
	);
}
