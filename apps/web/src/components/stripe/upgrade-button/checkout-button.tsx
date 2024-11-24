"use client";

import { generateStripeSessionAction } from "@/lib/stripe/actions";
import { LoaderButton } from "@repo/ui/components/loader-button";
import type { ReactNode } from "react";
import { useServerAction } from "zsa-react";

export function CheckoutButton({
	className,
	children,
	priceId,
}: {
	className?: string;
	children: ReactNode;
	priceId: string;
}) {
	const { execute, isPending } = useServerAction(generateStripeSessionAction);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				execute({ priceId });
			}}
		>
			<LoaderButton isLoading={isPending} className={className}>
				{children}
			</LoaderButton>
		</form>
	);
}
