import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Enum Types
type ProviderType = "oauth" | "email" | "credentials";
export const rolesEnumArray = ["user", "admin", "member"] as const;
export const userRole = pgEnum("role", rolesEnumArray);

export const accountStatusArray = [
  "suspended",
  "disabled",
  "active",
  "onboarding",
] as const;
export const accountStatus = pgEnum("accountStatus", accountStatusArray);

const DEFAULT_ACCOUNT_STATUS: (typeof accountStatusArray)[number] =
  "onboarding";

// Users table
export const users = pgTable(
  "user",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()) // Change to uuid
      .unique(),
    name: text("name"),
    email: text("email").unique(),
    password: text("password"),
    status: accountStatus("accountStatus").default(DEFAULT_ACCOUNT_STATUS),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    stripeCustomerId: text("stripeCustomerId"),
    image: text("image"),
    createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .default(sql`now()`)
      .$onUpdate(() => sql`now()`),
  },
  (table) => [uniqueIndex("user_email_idx").on(table.email)]
);

// Accounts table
export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId") // Change to uuid
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
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ]
);

// Sessions table
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId") // Change to uuid
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification Tokens table
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);

// Reset Password Tokens table
export const resetPasswordTokens = pgTable("resetPasswordToken", {
  id: uuid("id") // Change to uuid
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: uuid("userId") // Change to uuid
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  stripeSubscriptionId: text("stripeSubscriptionId").notNull(),
  stripeCustomerId: text("stripeCustomerId").notNull(),
  stripePriceId: text("stripePriceId").notNull(),
  stripeCurrentPeriodEnd: timestamp("expires", { mode: "date" }).notNull(),
});

// Newsletters table
export const newsletters = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
});

// Type Exports
export type User = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type ResetPasswordToken = typeof resetPasswordTokens.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Accounts = typeof accounts.$inferSelect;
export type NewsLetter = typeof newsletters.$inferSelect;
