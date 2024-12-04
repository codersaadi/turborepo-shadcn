import { eq } from "drizzle-orm";
import { db } from "..";
import {
  organizationRoles,
  permissions,
  rolePermissionsTable,
} from "../schema";

interface AssignPermissionsInput {
  roleId: string;
  permissionIds: string[]; // Array of permission IDs
}

export async function getPermissionsForRole(roleId: string) {}
