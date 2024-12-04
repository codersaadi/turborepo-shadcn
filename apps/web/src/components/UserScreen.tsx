import { Button } from "@repo/ui/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

export const screenConfig = [
	{
		title: "Access Control",
		slug: "access-control",
	},
	{
		title: "Members",
		slug: "members",
	},
	{
		title: "Posts",
		slug: "posts",
	},
	{
		title: "Manage Workspaces",
		slug: "manage-workspaces",
	},
] as const;

export default function UserScreen({
	metaDataSlug,
}: {
	metaDataSlug: (typeof screenConfig)[number]["slug"];
}) {
	const metaData = screenConfig.find((val) => val.slug === metaDataSlug);
	return (
		<div className="">
			<div className="flex items-center justify-between px-5">
				<h3 className="text-3xl ">{metaData?.title}</h3>
				<div className="">
					<Button className="items-center text-sm " size={"sm"}>
						<Plus /> Create Role
					</Button>
				</div>
			</div>
		</div>
	);
}
