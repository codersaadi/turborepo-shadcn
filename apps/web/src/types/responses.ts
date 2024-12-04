import type { Session } from "next-auth";

export type MessageResponse = {
	success: boolean;
	message: string;
};

export type WithSession = {
	session: Session;
};
