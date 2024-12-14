"use client";
import { updateUserSessAction } from "@/auth/lib/signin-action";
import { trpcReact } from "@/lib/trpc/react-client";
import { LoaderButton } from "@repo/ui/components/loader-button";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";

type SwitchOrgInput = { newOrgId: string };
const useOrgSwitchMutate = () => {
	const router = useRouter();
	const trpcContext = trpcReact.useUtils();
	const pathname = usePathname();

	return trpcReact.organizationRouter.switchUserActiveOrg.useMutation({
		async onSuccess(data, { newOrgId }: SwitchOrgInput) {
			// Invalidate `getUserOrganizations` to refetch the updated organizations list
			trpcContext.organizationRouter.getUserOrganizations.invalidate();

			if (data?.success) {
				// Update the user's session with the new activeOrgId
				await updateUserSessAction({
					user: {
						activeOrgId: newOrgId,
					},
				});

				const newPath = pathname.replace(/\/c\/[^/]+/, `/c/${newOrgId}`); // Replace `/c/:orgId`

				router.replace(newPath); // Navigate to the updated path without reloading
			}
		},
		onError(error) {
			console.error("Error switching organization:", error);
		},
	});
};

export default function SwitchOrgTrigger({
	newOrgId,
	children,
	disabled = false,
}: { children: React.ReactNode; disabled?: boolean } & SwitchOrgInput) {
	const { mutate, isPending } = useOrgSwitchMutate();
	return (
		<LoaderButton
			className="p-0 max-w-full w-full"
			variant={"ghost"}
			onClick={() => mutate({ newOrgId })}
			isLoading={isPending}
			disabled={isPending || disabled}
		>
			{children}
		</LoaderButton>
	);
}
