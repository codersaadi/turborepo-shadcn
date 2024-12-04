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
        operators.eq(fields.active, true)
      );
    },
  });
};
