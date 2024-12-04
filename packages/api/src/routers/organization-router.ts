import { getUserOrganizations } from "@repo/db/data/organization";
import {
  createOrganizationUseCase,
  switchOrgUseCase,
} from "@repo/db/usecases/organization";
import { z } from "zod";
import { organizationSchema } from "../schema/organization-schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
export const organizationRouter = createTRPCRouter({
  switchUserActiveOrg: protectedProcedure
    .input(
      z.object({
        newOrgId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await switchOrgUseCase({
        userId: ctx.auth.user.id,
        currentOrgId: ctx.auth.user.activeOrgId as string,
        newOrgId: input.newOrgId,
      });
    }),

  getUserOrganizations: protectedProcedure.query(async ({ ctx }) => {
    return await getUserOrganizations(ctx.auth.user.id);
  }),

  createOrganization: protectedProcedure
    .input(organizationSchema)
    .mutation(async ({ ctx, input }) => {
      const { isActive: SetActive, ...data } = input;
      return await createOrganizationUseCase(
        {
          ...data,
          ownerId: ctx.auth.user.id,
        },
        SetActive
      );
    }),
});
