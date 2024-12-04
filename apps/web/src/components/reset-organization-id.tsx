"use client";

import { usePathname, useRouter } from "next/navigation";

export default function ResetOrganizationId({
	activeOrgId,
}: {
	activeOrgId: string;
}) {
	const pathname = usePathname();
	const pathparts = pathname.split("/");
	const organizationId =
		pathparts[1] === "c" && typeof pathparts[2] === "string"
			? pathparts[2]
			: "";
	const router = useRouter();
	if (activeOrgId !== organizationId) {
		router.replace(`/c/${activeOrgId}/${pathparts?.[3] ?? "dashboard"}`);
	}
	return null;
}
