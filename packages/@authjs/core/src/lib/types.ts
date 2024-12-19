import type { User } from "@repo/db/schema";
import type { Session } from "next-auth";
export type MessageResponse = {
  success: boolean;
  message: string;
};

export type WithSession = {
  session: Session;
};

export type { Session };
export type SessionUser = Pick<
  User,
  "id" | "name" | "email" | "emailVerified" | "stripeCustomerId" | "image"
>;
