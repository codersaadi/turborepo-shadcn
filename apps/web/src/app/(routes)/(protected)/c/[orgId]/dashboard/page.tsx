import { auth } from "@/auth";
import { SignOutButton } from "@/auth/components";
import React from "react";

export default async function page() {
	const session = await auth();
	return (
		<div className="h-screen w-full flex flex-col justify-center items-center ">
			<pre className="break-words">
				{JSON.stringify(
					{
						...session?.user,
						image: `${session?.user.image?.slice(0, 25)}...`,
					},
					null,
					2,
				)}
			</pre>
			<div className="">
				<SignOutButton />
			</div>
		</div>
	);
}
