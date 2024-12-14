// import { useDashboardRoutes } from "@/hooks/use-dashboard-routes";
import type { WithSession } from "@/types/responses";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar";
import Link from "next/link";
import NavinkActiveIndicator from "./nav-link";
import { NavUserWrapper } from "./nav-user";
import SidebarWorkspaceSelect from "./sidebar-workspace-select";

export function AppSidebar({ session }: WithSession) {
	// const items = useDashboardRoutes(session.user.activeOrgId);
	return (
		<Sidebar collapsible="icon" variant="sidebar">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarWorkspaceSelect session={session} />
							</SidebarMenuItem>
							{/* {items.map((item) => (
								<SidebarMenuItem className="pt-3" key={item.title}>
									<NavinkActiveIndicator url={item.url}>
										<SidebarMenuButton asChild>
											<Link href={item.url}>
												<item.icon className="!w-6 !h-6" />
												<span className="text-lg">{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</NavinkActiveIndicator>
								</SidebarMenuItem>
							))} */}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUserWrapper session={session} />
			</SidebarFooter>
		</Sidebar>
	);
}
