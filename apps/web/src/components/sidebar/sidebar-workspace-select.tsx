"use client";

import { trpcReact } from "@/lib/trpc/react-client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@repo/ui/components/ui/sidebar";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { Building, Building2, ChevronsUpDown } from "lucide-react";
import type { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { AddOrganizationModal } from "../add-organization-modal";
import SwitchOrgTrigger from "./SwitchOrgTrigger";

export default function SidebarWorkspaceSelect({
	session,
}: {
	session: Session;
}) {
	const {
		data: organizations = [],
		error,
		isError,
		isLoading,
	} = trpcReact.organizationRouter.getUserOrganizations.useQuery();

	const [activeOrg, setActiveOrg] = useState(() =>
		organizations?.find((org) => org.id === session?.user?.activeOrgId),
	);

	useEffect(() => {
		const updatedActiveOrg = organizations.find(
			(org) => org.id === session?.user?.activeOrgId,
		);
		if (updatedActiveOrg) {
			setActiveOrg(updatedActiveOrg);
		}
	}, [organizations, session?.user?.activeOrgId]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton className="w-full justify-between">
					{isLoading ? (
						<span className="flex items-center gap-2">
							<Building className="h-4 w-4 shrink-0" />
							<Skeleton className="h-5 w-24" />
						</span>
					) : (
						<>
							<span className="flex items-center gap-2 min-w-0">
								<Building className="h-4 w-4 shrink-0" />
								<span className="truncate">
									{activeOrg?.name || "Select Workspace"}
								</span>
							</span>
							<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
						</>
					)}
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side="bottom"
				// align="start"
				// side="right"
				className="w-64 p-2 max-h-[calc(100vh-4rem)] overflow-y-auto"
			>
				<h3 className="mb-2 px-2 text-sm font-semibold">Organizations</h3>
				{isLoading && (
					<div className="space-y-1">
						{[...Array(3)].map((e, i) => (
							<Skeleton key={`${e}-${i.toString()}`} className="h-8 w-full" />
						))}
					</div>
				)}
				{isError && (
					<div className="p-2 text-sm text-destructive">
						Error:{" "}
						{error instanceof Error
							? error.message
							: "Failed to load organizations"}
					</div>
				)}
				{!isLoading &&
					!isError &&
					organizations.map((organization) => {
						const isActive = organization.id === session?.user?.activeOrgId;

						return (
							<SwitchOrgTrigger
								disabled={isActive}
								newOrgId={organization.id}
								key={organization.slug}
							>
								<DropdownMenuItem
									disabled={isActive}
									className="flex items-center justify-between w-full p-2"
								>
									<span className="flex items-center gap-2 min-w-0">
										{isActive && (
											<span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
										)}
										<Building2 className="h-4 w-4 shrink-0" />
										<span className="truncate">{organization.name}</span>
									</span>
									{organization.ownerId === session?.user?.id && (
										<span className="rounded-full bg-sky-600 text-white px-1.5 py-0.5 text-xs font-semibold text-primary-foreground shrink-0">
											Owner
										</span>
									)}
								</DropdownMenuItem>
							</SwitchOrgTrigger>
						);
					})}
				<div className="mt-2 pt-2 border-t">
					<AddOrganizationModal />
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
