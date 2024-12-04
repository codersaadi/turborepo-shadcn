import { auth } from "@/auth";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import UserTopBar from "@/components/user-top-bar";
import { getParamsStrict } from "@/lib/getParams";
import { SidebarProvider } from "@repo/ui/components/ui/sidebar";
import type { Params } from "next/dist/server/request/params";
import { redirect } from "next/navigation";
import type React from "react";
import { z } from "zod";
export default async function layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<Params>;
}) {
	const session = await auth();
	if (!session) return null;
	const resolvedParams = await getParamsStrict(
		params,
		z.object({
			orgId: z.string(),
		}),
	);
	if (session.user.activeOrgId !== resolvedParams.orgId) {
		return redirect(`/c/${session.user.activeOrgId}/dashboard`);
	}
	return (
		<SidebarProvider>
			<AppSidebar session={session} />
			<div className="w-full">
				<UserTopBar />
				{children}
			</div>
		</SidebarProvider>
	);
}
