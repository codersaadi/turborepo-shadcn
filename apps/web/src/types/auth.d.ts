export interface MessageResponse {
	message: string;
	success: boolean;
}
import type { User } from "@repo/db/schema";
export type $UserRole = "user" | "admin" | "member";
import type { DefaultSession } from "next-auth";

/**
 * Here you can extend your session and auth types
 */

type SessionUser = Pick<
	User,
	| "id"
	| "name"
	| "email"
	| "role"
	| "emailVerified"
	| "stripeCustomerId"
	| "image"
>;
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: SessionUser;
	}
}
