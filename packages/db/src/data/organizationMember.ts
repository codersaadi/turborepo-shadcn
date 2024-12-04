import { and, eq } from "drizzle-orm";
import { db } from "..";
import { type OrganizationMember, organizationMembers } from "../schema";

/**
 * Add a new member to an organization.
 *
 * @param data - The member's details, including organizationId, userId, roleId, and assignedById.
 * @throws An error if the member cannot be added.
 */
export async function addOrganizationMember(
  data: {
    organizationId: string;
    userId: string;
    roleId: string;
    assignedById: string;
  },
  trx = db
): Promise<void> {
  try {
    await trx.insert(organizationMembers).values(data).onConflictDoNothing();
  } catch (error) {
    console.error("Error adding organization member:", error);
    throw new Error("Could not add organization member");
  }
}

/**
 * Remove a member from an organization.
 *
 * @param organizationId - The ID of the organization.
 * @param userId - The ID of the user to be removed.
 * @throws An error if the member cannot be removed.
 */
export async function removeOrganizationMember(
  organizationId: string,
  userId: string
): Promise<void> {
  try {
    await db
      .delete(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId)
        )
      )
      .execute();
  } catch (error) {
    console.error("Error removing organization member:", error);
    throw new Error("Could not remove organization member");
  }
}

/**
 * Get all members of a specific organization.
 *
 * @param organizationId - The ID of the organization.
 * @returns A list of organization members.
 * @throws An error if the members cannot be fetched.
 */
export async function getOrganizationMembers(
  organizationId: string
): Promise<OrganizationMember[]> {
  try {
    return await db.query.organizationMembers.findMany({
      where(fields, operators) {
        return operators.eq(fields.organizationId, organizationId);
      },
    });
  } catch (error) {
    console.error("Error fetching organization members:", error);
    throw new Error("Could not fetch organization members");
  }
}

/**
 * Update the role of a specific organization member.
 *
 * @param organizationId - The ID of the organization.
 * @param userId - The ID of the user whose role will be updated.
 * @param newRoleId - The new role ID to assign.
 * @throws An error if the role cannot be updated.
 */
export async function updateOrganizationMemberRole(
  organizationId: string,
  userId: string,
  newRoleId: string
): Promise<void> {
  try {
    await db
      .update(organizationMembers)
      .set({ roleId: newRoleId })
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId)
        )
      )
      .execute();
  } catch (error) {
    console.error("Error updating organization member role:", error);
    throw new Error("Could not update organization member role");
  }
}

/**
 * Check if a user is a member of a specific organization.
 *
 * @param organizationId - The ID of the organization.
 * @param userId - The ID of the user to check.
 * @returns A boolean indicating membership status.
 * @throws An error if membership cannot be verified.
 */
export async function isOrganizationMember(
  organizationId: string,
  userId: string
): Promise<boolean> {
  try {
    const member = await db.query.organizationMembers.findFirst({
      where(fields, operators) {
        return and(
          operators.eq(fields.organizationId, organizationId),
          operators.eq(fields.userId, userId)
        );
      },
    });
    return !!member;
  } catch (error) {
    console.error("Error checking organization membership:", error);
    throw new Error("Could not verify organization membership");
  }
}

/**
 * Count all members in an organization.
 *
 * @param organizationId - The ID of the organization.
 * @returns The total number of members in the organization.
 * @throws An error if the count cannot be retrieved.
 */
export async function countOrganizationMembers(
  organizationId: string
): Promise<number> {
  try {
    // Using $count utility with filter
    const count = await db.$count(
      organizationMembers,
      eq(organizationMembers.organizationId, organizationId)
    );
    return count; // Returns as a number
  } catch (error) {
    console.error("Error counting organization members:", error);
    throw new Error("Could not count organization members");
  }
}

/**
 * Fetch details of a specific organization member.
 *
 * @param organizationId - The ID of the organization.
 * @param userId - The ID of the user to retrieve.
 * @returns The organization member details, or undefined if not found.
 * @throws An error if the member details cannot be fetched.
 */
export async function getOrganizationMember(
  organizationId: string,
  userId: string
): Promise<OrganizationMember | undefined> {
  try {
    return await db.query.organizationMembers.findFirst({
      where(fields, operators) {
        return and(
          operators.eq(fields.organizationId, organizationId),
          operators.eq(fields.userId, userId)
        );
      },
    });
  } catch (error) {
    console.error("Error fetching organization member details:", error);
    throw new Error("Could not fetch organization member details");
  }
}
