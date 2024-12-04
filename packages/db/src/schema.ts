import { sql } from "drizzle-orm";
import {
  boolean,
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
    activeOrgId: uuid("activeOrgId"), // Change to uuid
    createdAt: timestamp("createdAt", { mode: "date" }).default(sql`now()`),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .default(sql`now()`)
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("user_email_idx").on(table.email)]
);

// Organizations table
export const organizations = pgTable(
  "organization",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    slug: text("slug").unique(),
    logoUrl: text("logo_url"),
    ownerId: uuid("ownerId") // Change to uuid
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    domain: text("domain"),
    memberCount: integer("member_count").default(0),
    maxMembers: integer("max_members").default(50),
    createdAt: timestamp("createdAt", { mode: "date" }).default(sql`now()`),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .default(sql`now()`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("org_name_idx").on(table.name),
    uniqueIndex("org_slug_idx").on(table.slug),
  ]
);

// Mapping table for user to organization
export const userOrganizations = pgTable("user_organization", {
  userId: uuid("userId") // Change to uuid
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  active: boolean("active").default(false),
  roleId: uuid("roleId") // Change to uuid
    .notNull()
    .references(() => organizationRoles.id),
});

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

// Invite Status Enum
export const inviteStatusArray = [
  "pending",
  "accepted",
  "declined",
  "canceled",
] as const;
export type InviteStatus = (typeof inviteStatusArray)[number];
export const inviteStatus = pgEnum("inviteStatus", inviteStatusArray);

// Permissions table
export const permissions = pgTable("permissions", {
  id: uuid("id") // Change to uuid
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  permissionKey: text("permissionKey").notNull().unique(),
  objectType: text("objectType"),
  organizationId: uuid("organizationId").references(() => organizations.id, {
    onDelete: "cascade",
  }),
  description: text("description"),
  isSystemDefined: boolean("is_system_defined").default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).default(sql`now()`),
});

// Organization Roles table
export const organizationRoles = pgTable("organizationRoles", {
  id: uuid("id") // Change to uuid
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "cascade",
  }),
  isPredefined: boolean("is_predefined").default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).default(sql`now()`),
});

export const userEffectivePermissions = pgTable("userEffectivePermissions", {
  userId: uuid("userId") // User associated with these permissions
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organizationId") // Organization context
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  permissions: text("permissions").notNull(), // JSON array of permission keys
  updatedAt: timestamp("updatedAt", { mode: "date" }).default(sql`now()`),
});

// Role Permissions table (Many-to-Many)
export const rolePermissionsTable = pgTable("rolePermissions", {
  id: serial("id").primaryKey(),
  roleId: uuid("roleId") // Change to uuid
    .notNull()
    .references(() => organizationRoles.id, { onDelete: "cascade" }),
  permissionId: uuid("permissionId") // Change to uuid
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
});

// User Roles table (Many-to-Many)
export const userRolesTable = pgTable("userRoles", {
  id: serial("id").primaryKey(),
  userId: uuid("userId") // Change to uuid
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("roleId") // Change to uuid
    .notNull()
    .references(() => organizationRoles.id, { onDelete: "cascade" }),
});

// Organization Members table
export const organizationMembers = pgTable(
  "organization_member",
  {
    id: uuid("id") // Change to uuid
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    organizationId: uuid("organizationId")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("userId") // Change to uuid
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("roleId") // Change to uuid
      .notNull()
      .references(() => organizationRoles.id),
    assignedById: uuid("assignedById").references(() => users.id),
    joinedAt: timestamp("joinedAt", { mode: "date" }).default(sql`now()`),
  },
  (table) => [
    uniqueIndex("org_member_unique_idx").on(table.organizationId, table.userId),
  ]
);

// Organization Invites table
export const organizationInvites = pgTable(
  "organization_invite",
  {
    id: uuid("id") // Change to uuid
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    organizationId: uuid("organizationId")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    invitedEmail: text("invitedEmail").notNull(),
    invitedById: uuid("invitedById") // Change to uuid
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("roleId") // Change to uuid
      .notNull()
      .references(() => organizationRoles.id),
    status: inviteStatus("status").notNull().default("pending"),
    expiresAt: timestamp("expiresAt", { mode: "date" }).default(
      sql`now() + interval '7 days'`
    ),
    createdAt: timestamp("createdAt", { mode: "date" }).default(sql`now()`),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .default(sql`now()`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("org_invite_unique_idx").on(
      table.organizationId,
      table.invitedEmail
    ),
  ]
);

// Organization Invite Tokens table
export const organizationInviteTokens = pgTable("organization_invite_token", {
  id: uuid("id") // Change to uuid
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  inviteId: uuid("inviteId") // Change to uuid
    .notNull()
    .references(() => organizationInvites.id, { onDelete: "cascade" }),
  token: text("token")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  expiresAt: timestamp("expiresAt", { mode: "date" })
    .default(sql`now() + interval '7 days'`)
    .notNull(),
  usedAt: timestamp("usedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).default(sql`now()`),
});

// Type Exports
export type Organization = typeof organizations.$inferSelect;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type User = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type ResetPasswordToken = typeof resetPasswordTokens.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Accounts = typeof accounts.$inferSelect;
export type NewsLetter = typeof newsletters.$inferSelect;
export type OrganizationInvite = typeof organizationInvites.$inferSelect;
export type Permissions = typeof permissions.$inferSelect;
export type OrganizationRoles = typeof organizationRoles.$inferSelect;
