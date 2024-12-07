import { and, eq } from "drizzle-orm";
import { db } from "..";
import {
  type $OrganizationInviteStatus,
  type OrganizationInvite,
  organizationInvites,
} from "../schema";

export async function createOrganizationInvite(
  data: typeof organizationInvites.$inferInsert
): Promise<OrganizationInvite | null> {
  try {
    const [invite] = await db
      .insert(organizationInvites)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return invite ?? null;
  } catch (error) {
    console.error("Error creating organization invite:", error);
    throw new Error("Could not create organization invite");
  }
}
export async function getActiveInviteByEmail(
  organizationId: string,
  email: string
): Promise<OrganizationInvite | undefined> {
  try {
    return await db.query.organizationInvites.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.organizationId, organizationId),
          operators.eq(fields.email, email),
          operators.eq(fields.status, "pending")
        );
      },
    });
  } catch (error) {
    console.error("Error fetching invite by email:", error);
    throw new Error("Could not fetch invite by email");
  }
}

export async function updateInviteStatus(
  inviteId: string,
  status: $OrganizationInviteStatus
): Promise<void> {
  try {
    await db
      .update(organizationInvites)
      .set({ status })
      .where(eq(organizationInvites.id, inviteId));
  } catch (error) {
    console.error("Error updating invite status:", error);
    throw new Error("Could not update invite status");
  }
}
