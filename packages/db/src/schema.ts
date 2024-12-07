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

// REUSABLES
const TIMESTAMPS = {
  createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .default(sql`now()`)
    .$onUpdate(() => sql`now()`),
};

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
    ...TIMESTAMPS,
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

/**
 * Multi Tenacy from here
 */

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
    ownerId: uuid("ownerId")
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

export const orgRolesArray = [
  "owner", // Full control of the organization
  "admin", // Can manage most aspects of the org
  "manager", // Can manage content and some settings
  "editor", // Can create and edit content
  "viewer", // Read-only access
] as const;
export const orgRolesEnum = pgEnum("org_role", orgRolesArray);
export type $UserOrgStatus = "active" | "pending" | "suspended";
// Mapping table for user to organization
export const userOrganizations = pgTable("user_organization", {
  userId: uuid("userId") // Change to uuid
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  role: orgRolesEnum("org_role").default("viewer"),
  status: text("status").$type<$UserOrgStatus>().default("active"),
});

// Invite Status
export const inviteStatusArray = [
  "pending", // Invitation sent but not accepted
  "accepted", // Invitation accepted
  "declined", // Invitation declined
  "revoked", // Invitation canceled by org admin
] as const;
export const inviteStatusEnum = pgEnum("invite_status", inviteStatusArray);
export type $OrganizationInviteStatus = (typeof inviteStatusArray)[number];
// Separate Invite Tokens Table
export const orgInviteTokens = pgTable(
  "org_invite_tokens",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    token: text("token").notNull().unique(),

    inviteId: uuid("invite_id").notNull(), // Reference to the invite, not directly to a table

    // Token-specific metadata
    createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
    expiresAt: timestamp("expires_at", { mode: "date" })
      .notNull()
      // Expires in 7 days
      .default(sql`now() + interval '7 days'`),

    // Token usage tracking
    usedAt: timestamp("used_at", { mode: "date" }),
    isValid: boolean("is_valid").default(true),
  },
  (table) => [uniqueIndex("org_invite_token_unique_idx").on(table.token)]
);

// Organization Invites Table
export const organizationInvites = pgTable(
  "organization_invites",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    email: text("email").notNull(),

    invitedByUserId: uuid("invited_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Remove token from this table
    role: orgRolesEnum("role").default("viewer"),

    status: inviteStatusEnum("status").default("pending"),

    createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .default(sql`now()`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("org_invite_unique_idx").on(table.organizationId, table.email),
  ]
);

// Type Exports
export type OrgInviteToken = typeof orgInviteTokens.$inferSelect;
export type OrganizationInvite = typeof organizationInvites.$inferSelect;

// Type Exports
export type User = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type ResetPasswordToken = typeof resetPasswordTokens.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Accounts = typeof accounts.$inferSelect;
export type NewsLetter = typeof newsletters.$inferSelect;
export type UserOrganization = typeof userOrganizations.$inferSelect;
export type Organization = typeof organizations.$inferSelect;

/**
 * E Learning Platform Related
 */

// Course Difficulty Levels
export const courseDifficultyLevels = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;
export const courseDifficulty = pgEnum(
  "course_difficulty",
  courseDifficultyLevels
);

// Course Status
export const courseStatusArray = ["draft", "published", "archived"] as const;
export const courseStatus = pgEnum("course_status", courseStatusArray);

// Lesson Types
export const lessonTypeArray = [
  "video",
  "text",
  "quiz",
  "assignment",
  "interactive",
] as const;
export const lessonType = pgEnum("lesson_type", lessonTypeArray);

// Courses Table
export const courses = pgTable(
  "courses",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    description: text("description"),

    instructorId: uuid("instructor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    difficulty: courseDifficulty("difficulty").default("beginner"),
    status: courseStatus("status").default("draft"),

    thumbnailUrl: text("thumbnail_url"),
    price: integer("price").default(0), // in cents

    duration: integer("duration"), // total course duration in minutes
    totalLessons: integer("total_lessons").default(0),

    prerequisites: text("prerequisites"),

    createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .default(sql`now()`)
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("course_title_idx").on(table.title)]
);

// Lessons Table
export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    description: text("description"),

    lessonType: lessonType("lesson_type").notNull(),

    content: text("content"), // Could be video URL, text content, etc.

    order: integer("order").notNull(), // Lesson sequence in course

    duration: integer("duration"), // lesson duration in minutes

    isPreview: boolean("is_preview").default(false),

    resourceUrls: text("resource_urls"), // JSON array of additional resources

    createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .default(sql`now()`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("lesson_course_order_idx").on(table.courseId, table.order),
  ]
);

// Enrollments Table
export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),

    status: text("status")
      .$type<"active" | "completed" | "dropped">()
      .notNull()
      .default("active"),

    progress: integer("progress").default(0), // percentage of course completed

    startDate: timestamp("start_date", { mode: "date" }).default(sql`now()`),
    completedAt: timestamp("completed_at", { mode: "date" }),

    lastAccessedAt: timestamp("last_accessed_at", { mode: "date" }),
  },
  (table) => [
    uniqueIndex("enrollment_unique_idx").on(table.userId, table.courseId),
  ]
);

// Quizzes Table
export const quizzes = pgTable("quizzes", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),

  passingScore: integer("passing_score").default(70), // percentage

  timeLimit: integer("time_limit"), // quiz time limit in minutes

  createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .default(sql`now()`)
    .$onUpdate(() => new Date()),
});

// Quiz Attempts Table
export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),

    score: integer("score").notNull(),
    passed: boolean("passed").notNull(),

    startedAt: timestamp("started_at", { mode: "date" }).default(sql`now()`),
    completedAt: timestamp("completed_at", { mode: "date" }),
  },
  (table) => [
    uniqueIndex("quiz_attempt_unique_idx").on(table.userId, table.quizId),
  ]
);

// Type Exports
export type Course = typeof courses.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
