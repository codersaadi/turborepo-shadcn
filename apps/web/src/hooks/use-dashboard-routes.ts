import { DashboardIcon } from "@radix-ui/react-icons";
import {
	FolderKanbanIcon,
	NewspaperIcon,
	ShieldEllipsisIcon,
	TicketIcon,
	UsersRoundIcon,
} from "lucide-react";
import { useMemo } from "react";
export const useDashboardRoutes = (organization_id: string | null) => {
	const items = useMemo(
		() => [
			{
				title: "Dashboard",
				icon: DashboardIcon,
				url: `/c/${organization_id}/dashboard`,
			},
			{
				title: "Access Control",
				icon: ShieldEllipsisIcon,
				url: `/c/${organization_id}/access-control`,
			},
			{
				title: "Members",
				icon: UsersRoundIcon,
				url: `/c/${organization_id}/members`,
			},
			{
				title: "Posts",
				icon: NewspaperIcon,
				url: `/c/${organization_id}/posts`,
			},
			{
				title: "Tickets",
				icon: TicketIcon,
				url: `/c/${organization_id}/tickets`,
			},
			{
				title: "Projects",
				icon: FolderKanbanIcon,
				url: `/c/${organization_id}/projects`,
			},
		],
		[organization_id],
	);
	return items;
};
