import { SignOutButton } from "@authjs/client";
import { auth } from "@authjs/core";
import React from "react";

export default async function page() {
	const session = await auth();
	if (!session) return <p className="text-destructive">unauthorized! you are not authorize to view this content</p>;

	const image = session?.user?.image
		? `${session.user.image.slice(0, 14)}...`
		: null;
	return (
		<div className="max-w-sm w-full mx-auto h-screen flex justify-center items-center flex-col">
			<pre>{JSON.stringify({ ...session.user, image }, null, 2)}</pre>
			<SignOutButton />
		</div>
	);
}
