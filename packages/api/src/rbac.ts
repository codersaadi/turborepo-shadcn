import type { orgRolesArray } from "@repo/db/schema";

// Bitwise Permission Flags
export enum PermissionFlags {
  // Organization Permissions
  ORG_VIEW = 1 << 0, // 1
  ORG_EDIT = 1 << 1, // 2
  ORG_CREATE = 1 << 2, // 4
  ORG_DELETE = 1 << 3, // 8

  // User Permissions
  USER_VIEW = 1 << 4, // 16
  USER_EDIT = 1 << 5, // 32
  USER_CREATE = 1 << 6, // 64
  USER_DELETE = 1 << 7, // 128

  // Course Permissions  - if you add another resource like courses or something

  COURSE_VIEW = 1 << 8, // 256
  COURSE_EDIT = 1 << 9, // 512
  COURSE_CREATE = 1 << 10, // 1024
  COURSE_DELETE = 1 << 11, // 2048
}
// Role Configurations with Bitwise Permissions
export const RolePermissionMap: Record<(typeof orgRolesArray)[number], number> =
  {
    owner:
      PermissionFlags.ORG_VIEW |
      PermissionFlags.ORG_EDIT |
      PermissionFlags.ORG_CREATE |
      PermissionFlags.ORG_DELETE |
      PermissionFlags.USER_VIEW |
      PermissionFlags.USER_EDIT |
      PermissionFlags.USER_CREATE |
      PermissionFlags.USER_DELETE |
      // if you add another resource like courses or something
      PermissionFlags.COURSE_VIEW |
      PermissionFlags.COURSE_EDIT |
      PermissionFlags.COURSE_CREATE |
      PermissionFlags.COURSE_DELETE,

    admin:
      PermissionFlags.ORG_VIEW |
      PermissionFlags.ORG_EDIT |
      PermissionFlags.USER_VIEW |
      PermissionFlags.USER_EDIT |
      // if you add another resource like courses or something
      PermissionFlags.COURSE_VIEW |
      PermissionFlags.COURSE_EDIT |
      PermissionFlags.COURSE_CREATE,

    manager:
      PermissionFlags.ORG_VIEW |
      PermissionFlags.USER_VIEW |
      // if you add another resource like courses or something

      PermissionFlags.COURSE_VIEW |
      PermissionFlags.COURSE_EDIT,
    // if you add another resource like courses or something
    editor:
      PermissionFlags.COURSE_VIEW |
      PermissionFlags.COURSE_EDIT |
      PermissionFlags.COURSE_CREATE,

    viewer: PermissionFlags.COURSE_VIEW,
  };

// Utility Functions for Permission Checking
export function hasPermission(
  userRole: (typeof orgRolesArray)[number],
  permission: PermissionFlags
): boolean {
  const rolePermissions = RolePermissionMap[userRole];
  return (rolePermissions & permission) === permission;
}

export function checkMultiplePermissions(
  userRole: (typeof orgRolesArray)[number],
  permissions: PermissionFlags[]
): boolean {
  return permissions.every((perm) => hasPermission(userRole, perm));
}

export type Role = (typeof orgRolesArray)[number];
