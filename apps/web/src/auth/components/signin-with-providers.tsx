"use client";
import { useMemo } from "react";

import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { GithubIcon, GoogleIcon } from "./auth-icons";

export type AvailableProviders = "credentials" | "github" | "google" | "email";

interface Provider {
	name: string;
	Icon: React.FC<{
		size: number;
		className?: string;
	}>;
}

export default function SigninWithProviders({
	action,
	orPosition,
	withDescription,
}: {
	action: (provider: AvailableProviders) => Promise<void>;
	withDescription?: boolean;
	orPosition?: "top" | "bottom";
}) {
	// Define your providers array and use `as const` to ensure the type inference
	const providers = useMemo<Provider[]>(
		() => [
			{
				name: "google",
				Icon: GoogleIcon,
			},
			{
				name: "github",
				Icon: GithubIcon,
			},
		],
		[],
	);

	return (
		<div className="space-y-6 py-2 w-full">
			{orPosition === "top" && <OrComponent />}
			<div
				className={cn(
					"grid gap-4 w-full place-items-center place-content-center ",
					withDescription ? "grid-cols-1" : "grid-cols-3 ",
				)}
			>
				{providers.map((provider) => (
					<Button
						key={provider.name}
						onClick={() => action(provider.name as AvailableProviders)}
						className={cn(
							"",
							withDescription
								? "w-full gap-3 py-2 px-4 rounded-md"
								: "aspect-square p-2 rounded-full",
						)}
					>
						<provider.Icon size={24} />
						{withDescription && (
							<span className="text-sm ">Continue with {provider.name}</span>
						)}
					</Button>
				))}
			</div>
			{orPosition === "bottom" && <OrComponent />}
		</div>
	);
}

function OrComponent() {
	return (
		<div className="flex items-center justify-center w-full">
			<div className="w-full border-t border-gray-300 dark:border-gray-600" />
			<span className="px-3 text-sm text-gray-500 dark:text-gray-400 w-full text-nowrap">
				or continue with
			</span>
			<div className="w-full border-t border-gray-300 dark:border-gray-600" />
		</div>
	);
}
