import { createOrganization } from "../data/organization";
import {
  createUserOrganizationRelation,
  getUserActiveOrg,
  isInUserOrganizations,
} from "../data/userOrganizations";
import { updateUserActiveOrg } from "../data/users";
import { createTransaction } from "../internal";

export async function createOrganizationUseCase(
  data: {
    name: string;
    description?: string;
    slug?: string;
    domain?: string;
    maxMembers?: number;
    ownerId: string;
  },
  SetActive = false
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
        },
        trx
      );
      console.log("relation created successfully");

      if (SetActive) {
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