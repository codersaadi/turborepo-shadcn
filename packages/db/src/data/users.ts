import { eq } from "drizzle-orm";
import { db } from "../index";
import { type User, accounts, users } from "../schema";

/**
 * Fetch user by email.
 *
 * @param email - The user's email address.
 * @returns The user or null if not found.
 */
export async function getUserByEmail(email: string): Promise<
  | {
      id: string;
      name: string | null;
      email: string | null;
      password: string | null;
      status: "suspended" | "disabled" | "active" | "onboarding" | null;
      emailVerified: Date | null;
      stripeCustomerId: string | null;
      activeOrgId: string | null;
      image: string | null;
      createdAt: Date | null;
    }
  | undefined
> {
  try {
    return await db.query.users.findFirst({
      where(fields, operators) {
        return operators.eq(fields.email, email);
      },
    });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Could not fetch user by email");
  }
}

/**
 * Fetch user by ID.
 *
 * @param id - The user's ID.
 * @returns The user or null if not found.
 */
export async function getUserById(id: string): Promise<
  | {
      id: string;
      name: string | null;
      email: string | null;
      password: string | null;
      status: "suspended" | "disabled" | "active" | "onboarding" | null;
      emailVerified: Date | null;
      stripeCustomerId: string | null;
      image: string | null;
      createdAt: Date | null;
      activeOrgId: string | null;
    }
  | undefined
> {
  try {
    return await db.query.users.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, id);
      },
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Could not fetch user by ID");
  }
}

/**
 * Verify the user's email.
 *
 * @param id - The user's ID.
 * @param email - The new email to set (optional).
 */
export async function verifyUserEmail(
  id: string,
  email?: string
): Promise<void> {
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: email ? email : undefined,
    })
    .where(eq(users.id, id));
}

/**
 * Create a new user.
 *
 * @param user - The user data.
 * @returns The newly created user or null if not created.
 */
export async function createUser(user: {
  email: string;
  password: string;
  name: string;
}): Promise<User | null> {
  const [newUser] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return newUser ?? null;
}

/**
 * Update user's password.
 *
 * @param email - The user's email address.
 * @param password - The new password.
 */
export async function updateUserPassword(
  email: string,
  password: string
): Promise<void> {
  await db
    .update(users)
    .set({ password })
    .where(eq(users.email, email))
    .execute();
}

/**
 * Check if a user exists by ID.
 *
 * @param userId - The user's ID.
 * @returns True if user exists, otherwise false.
 */
export async function userExists(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user !== null;
}

/**
 * Create a Stripe customer record for a user.
 *
 * @param userId - The user's ID.
 * @param stripeCustomerId - The Stripe customer ID.
 */
export async function createStripeCustomerRecord({
  userId,
  stripeCustomerId,
}: {
  userId: string;
  stripeCustomerId: string;
}): Promise<void> {
  await db
    .update(users)
    .set({
      stripeCustomerId,
    })
    .where(eq(users.id, userId));
}

/**
 * Delete user and associated account data.
 *
 * @param userId - The user's ID.
 */
export async function deleteUserWithData(userId: string): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(accounts).where(eq(accounts.userId, userId));
      await tx.delete(users).where(eq(users.id, userId));
    });
  } catch (error) {
    console.error("Error deleting user with data:", error);
    throw new Error("Could not delete user with data");
  }
}

export async function updateUserActiveOrg(
  userId: string,
  newOrgId: string,
  trx = db
) {
  await db
    .update(users)
    .set({ activeOrgId: newOrgId })
    .where(eq(users.id, userId));
}
