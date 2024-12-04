export interface MessageResponse {
	message: string;
	success: boolean;
}
import type { User } from "@repo/db/schema";
export type $UserRole = "user" | "admin" | "member";
import type { DefaultSession } from "next-auth";
import type { NextRequest } from "next/server";

/**
 * Here you can extend your session and auth types
 */

type SessionUser = Pick<
	User,
	| "id"
	| "name"
	| "email"
	| "roleId"
	| "emailVerified"
	| "stripeCustomerId"
	| "image"
	| "activeOrgId"
>;
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: SessionUser;
	}
	interface NextAuthRequest extends NextRequest {
		auth: Session | null;
	}
	interface NextAuthApiRequest extends NextAuthRequest {
		auth: Session;
	}
}
