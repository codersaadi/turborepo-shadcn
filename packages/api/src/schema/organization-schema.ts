import { z } from "zod";

export const createOrganizationInput = z.object({
  name: z.string().max(70, "cannot exceed 70 characters"),
  description: z.string().max(140, "cannot exceed 140 characters"),
  domain: z.string(),
  maxMembers: z.number(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationInput>;

export const organizationIdInput = z.object({
  organizationId: z.string(),
});

export const organizationSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Organization name must be at least 2 characters.",
    })
    .max(80, {
      message: "Max limit 80 characters , reached",
    }),
  description: z.string().optional(),
  logoUrl: z.string().url({ message: "Please enter a valid URL." }).optional(),
  domain: z.string().optional(),
  maxMembers: z.number().int().min(1).max(1000).default(50),
  isActive: z.boolean().default(false),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;

export const switchOrgSchema = z.object({
  newOrgId: z.string().uuid(),
});
