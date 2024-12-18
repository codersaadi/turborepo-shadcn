"use client";
import { signOut } from "next-auth/react";
import { Button } from "repo-ui/components/ui/button";
import { cn } from "repo-ui/lib/utils";
export default function SignOutButton({ callback }: { callback?: () => void }) {
	return (
		<Button
			variant={"default"}
			size={"sm"}
			className={cn(
				"bg-destructive/15 z-40 text-red-500 hover:bg-red-600 hover:bg-opacity-50 hover:text-white  rounded-full  w-full",
			)}
			onClick={async () => {
				await signOut();
				if (callback) callback();
			}}
		>
			Sign Out
		</Button>
	);
}
