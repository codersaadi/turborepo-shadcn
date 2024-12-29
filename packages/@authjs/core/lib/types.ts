import type { Session } from "next-auth";
import type { User } from "../../../db/schema";
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
