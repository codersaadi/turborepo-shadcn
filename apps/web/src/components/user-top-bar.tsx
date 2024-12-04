import NextThemeSwitch from "@/components/ThemeSwitch";
import { AnimatedSearch } from "@repo/ui/components/animated-search";
import { SidebarTrigger } from "@repo/ui/components/ui/sidebar";
import { Bell, Settings } from "lucide-react";
import React from "react";
export default function UserTopBar() {
	return (
		<div className="h-16 px-4 w-full flex justify-center flex-col">
			<div className="h-12 flex items-center gap-2 px-2 bg-blue-500  text-white dark:bg-neutral-900 border rounded-lg justify-between">
				<div className="flex items-center gap-1">
					<SidebarTrigger />
					<AnimatedSearch variant="sm" iconPosition="left" />
				</div>
				<div className="flex items-center gap-3 ">
					<Settings className="w-5 h-5" />
					<Bell className="w-5 h-5" />
					<NextThemeSwitch />
				</div>
			</div>
		</div>
	);
}
