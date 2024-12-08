"use client";
import { usePathname } from "next/navigation";
import type React from "react";

export default function NavinkActiveIndicator({
	children,
	url,
}: {
	children: React.ReactNode;
	url: string;
}) {
	const pathname = usePathname();
	const pathParts = pathname.split("/"); // eg ['','c', 'uuid', 'page']
	const isActive = pathParts[3] === url.split("/")?.[3];
	return (
		<span
			className={`${isActive ? "text-blue-500 animate-in transition-all duration-300" : ""}`}
		>
			{children}
		</span>
	);
}
