import { auth } from "@/auth";
import { SignOutButton } from "@/auth/components";
import React from "react";

export default async function page() {
	const session = await auth();
	return (
		<div className="h-screen w-full flex justify-center flex-col items-center">
			<pre>{JSON.stringify(session, null, 2)}</pre>
			<div className="">
				<SignOutButton />
			</div>
		</div>
	);
}
