import { and, eq } from "drizzle-orm";
import { db } from "..";
import { userOrganizations } from "../schema";

export const createUserOrganizationRelation = async (
  data: typeof userOrganizations.$inferInsert,
  trx = db
) => {
  return await trx.insert(userOrganizations).values(data);
};

type userOrganizationInput = {
  userId: string;
  organizationId: string;
};
export const getUserActiveOrg = async (data: userOrganizationInput) => {
  return db.query.userOrganizations.findFirst({
    where(fields, operators) {
      return operators.and(
        operators.eq(fields.organizationId, data.organizationId),
        operators.eq(fields.userId, data.userId),
        operators.eq(fields.status, "active")
      );
    },
  });
};
/**
 * Check if a user is a member of a specific organization.
 *
 * @param organizationId - The ID of the organization to check against
 * @param userId - The ID of the user to check
 * @returns Promise<boolean> - Returns true if the user is in the organization; otherwise, false
 */
export const isInUserOrganizations = async (
  organizationId: string,
  userId: string
): Promise<boolean> => {
  const result = await db
    .select()
    .from(userOrganizations)
    .where(
      and(
        eq(userOrganizations.userId, userId),
        eq(userOrganizations.organizationId, organizationId)
      )
    )
    .execute();

  // If the user-organization mapping exists, it means the user is part of the organization.
  return result.length > 0;
};
