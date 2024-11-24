import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
type ProviderType = "oauth" | "email" | "credentials";
export const rolesEnumArray = ["user", "admin", "member"] as const;
export const userRole = pgEnum("role", rolesEnumArray);
export type AccountStatus = (typeof accountStatusArray)[number];
export const accountStatusArray = [
  "suspended",
  "disabled",
  "active",
  "onboarding",
] as const;
export const accountStatus = pgEnum("accountStatus", accountStatusArray);
const DEFAULT_ACCOUNT_STATUS: (typeof accountStatusArray)[number] =
  "onboarding";
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  role: userRole("role")
    .notNull()
    .$defaultFn(() => "user"),
  status: accountStatus("accountStatus").default(DEFAULT_ACCOUNT_STATUS),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  stripeCustomerId: text("stripeCustomerId"),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).default(sql`now()`),
});
// Define the accounts table
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<ProviderType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
// Define the verification tokens table
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    primaryKey: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

// Define the resetPasswordTokens table
export const resetPasswordTokens = pgTable("resetPasswordToken", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  stripeSubscriptionId: text("stripeSubscriptionId").notNull(),
  stripeCustomerId: text("stripeCustomerId").notNull(),
  stripePriceId: text("stripePriceId").notNull(),
  stripeCurrentPeriodEnd: timestamp("expires", { mode: "date" }).notNull(),
});

/**
 * Any Third Party you will use, it will track your emails,newsletters, and keep a good record of them, yet we are saving it , in case you just want to leave their service or they dumb your data
 */
export const newsletters = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
});

/**
 * exporting types ,from this file , this way , you will get better grip on you schema
 */
export type User = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;

export type ResetPasswordToken = typeof resetPasswordTokens.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Accounts = typeof accounts.$inferSelect;
export type NewsLetter = typeof newsletters.$inferSelect;
