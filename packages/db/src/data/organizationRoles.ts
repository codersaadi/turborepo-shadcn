import { and, eq } from "drizzle-orm";
import { db } from "..";
import { organizationRoles } from "../schema";

interface CreateRoleInput {
  name: string;
  description?: string;
  organizationId?: string; // Null for predefined roles
  isPredefined?: boolean; // Default to false
  isDefault?: boolean; // Default to false
}

export async function createRole(input: CreateRoleInput) {
  const { name, description, organizationId, isPredefined = false } = input;

  // Insert role
  const [role] = await db
    .insert(organizationRoles)
    .values({
      name,
      description,
      organizationId,
      isPredefined,
    })
    .returning();

  return role;
}
export async function deleteRole(roleId: string) {
  // Delete the role (will cascade to rolePermissions due to foreign key constraints)
  const deleted = await db
    .delete(organizationRoles)
    .where(eq(organizationRoles.id, roleId))
    .returning();

  return deleted;
}

export async function getRolesForOrganization(
  organizationId: string,
  includePredefined = true
) {
  const roles = await db
    .select()
    .from(organizationRoles)
    .where(
      includePredefined
        ? and(
            eq(organizationRoles.organizationId, organizationId),
            eq(organizationRoles.isPredefined, false)
          )
        : eq(organizationRoles.organizationId, organizationId)
    );

  return roles;
}

export async function getOwnerRole() {
  // Check if the owner role already exists for this organization
  const [existingRole] = await db
    .select()
    .from(organizationRoles)
    .where(
      and(
        // eq(organizationRoles.organizationId, organizationId),
        eq(organizationRoles.name, "org_owner") // Assuming the owner role is named "Owner"
      )
    );

  if (existingRole) {
    return existingRole;
  }

  // If it doesn't exist, create a new owner role
  const [newRole] = await db
    .insert(organizationRoles)
    .values({
      name: "org_owner",
      description: "Organization owner with full permissions.",
      isPredefined: true,
    })
    .returning();

  return newRole;
}
