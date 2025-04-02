import { type NextRequest, NextResponse } from "next/server";

export const createAuthErrorResponse = (message?: string) => {
	const error = createAuthenticationError(message);
	return NextResponse.json(
		{ error: error.message },
		{ status: error.statusCode },
	);
};
import { auth } from "@authjs/core";
import type { Session } from "@authjs/core/types";
import { createAuthenticationError } from "@repo/api/errors";
export const getSessionFromRequest = async (
	req: NextRequest,
): Promise<Session | null> => {
	// TLDR : This will work
	// BUT IT WILL BE BETTER TO EXTRACT IT FROM THE REQUEST, Here we have the server same as the server which is serving routes (trpc), therefore it is okay to use it.
	return auth();
};
