import { createOrganization } from "../data/organization";
import {
  createUserOrganizationRelation,
  getUserActiveOrg,
  isInUserOrganizations,
} from "../data/userOrganizations";
import { updateUserActiveOrg } from "../data/users";
import { createTransaction } from "../internal";
import type { userOrganizations } from "../schema";

export async function createOrganizationUseCase(
  data: {
    name: string;
    description?: string;
    slug?: string;
    domain?: string;
    maxMembers?: number;
    ownerId: string;
  },
  SetActive = false,
  role: (typeof userOrganizations.$inferInsert)["role"] = "owner"
) {
  try {
    return await createTransaction(async (trx) => {
      const orgCreated = await createOrganization(data, trx);
      if (!orgCreated) {
        throw new Error("error creating organization");
      }
      console.log("org created successfully");

      await createUserOrganizationRelation(
        {
          userId: data.ownerId,
          organizationId: orgCreated.id,
          status: "active",
          role,
        },
        trx
      );
      console.log("relation created successfully");

      if (SetActive) {
        console.log("setting org to active");

        await updateUserActiveOrg(orgCreated.ownerId, orgCreated.id);
        console.log("updated org active successfully");
      }
      return { orgCreated, SetActive };
    });
  } catch (error) {
    console.log("error creating org ", error);
  }
}

export async function switchOrgUseCase({
  userId,
  currentOrgId,
  newOrgId,
}: {
  userId: string;
  currentOrgId: string;
  newOrgId: string;
}) {
  //  it will only switch to those whose status is active (status can be suspended or pending or as per your requirements, here the status is not about what is in the org id in the session)
  const user = await getUserActiveOrg({
    userId,
    organizationId: currentOrgId,
  });
  if (!user) {
    throw new Error("error getting user with active org");
  }

  const isMemberInNew = await isInUserOrganizations(newOrgId, userId);
  if (!isMemberInNew) {
    throw new Error("member is not in the organization");
  }
  await updateUserActiveOrg(userId, newOrgId);
  return {
    success: true,
    message: `Successfully switched to organization ${newOrgId}.`,
  };
}
