import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@repo/db";
import { accounts, sessions, users, verificationTokens } from "@repo/db/schema";
export const adapter = DrizzleAdapter(db, {
	accountsTable: accounts,
	sessionsTable: sessions,
	usersTable: users,
	verificationTokensTable: verificationTokens,
});
