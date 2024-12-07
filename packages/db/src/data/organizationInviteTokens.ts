import { eq } from "drizzle-orm";
import { db } from "..";
import { type OrganizationInvite, orgInviteTokens } from "../schema";

export async function createInviteToken(data: {
  inviteId: string;
  token: string;
  expiresAt?: Date;
}): Promise<void> {
  try {
    await db.insert(orgInviteTokens).values(data);
  } catch (error) {
    console.error("Error creating invite token:", error);
    throw new Error("Could not create invite token");
  }
}
export async function validateInviteToken(
  token: string
): Promise<OrganizationInvite | null> {
  try {
    // Fetch the invite token and its related invite
    const inviteToken = await db.query.orgInviteTokens.findFirst({
      where(fields, operators) {
        return operators.eq(fields.token, token);
      },
    });

    if (!inviteToken || inviteToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired token");
    }

    // Fetch the organization invite related to the token
    const organizationInvite = await db.query.organizationInvites.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, inviteToken.inviteId);
      },
    });

    if (!organizationInvite) {
      throw new Error("Invite not found");
    }

    return organizationInvite;
  } catch (error) {
    console.error("Error validating invite token:", error);
    throw new Error("Could not validate invite token");
  }
}

export async function markInviteTokenAsUsed(token: string): Promise<void> {
  try {
    await db
      .update(orgInviteTokens)
      .set({ usedAt: new Date() })
      .where(eq(orgInviteTokens.token, token));
  } catch (error) {
    console.error("Error marking invite token as used:", error);
    throw new Error("Could not mark invite token as used");
  }
}
