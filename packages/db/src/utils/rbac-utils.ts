// Hierarchical Namespace-Based Permissions
export enum PermissionNamespace {
  GLOBAL = "global",
  ORGANIZATION = "organization",
  PROJECT = "project",
  RESOURCE = "resource",
}

export enum Objects {
  EMAIL = "email",
  MEMBER = "member",
  POSTS = "posts",
  ROLE = "role",
  PERMISSIONS = "permissions",
  TICKETS = "tickets",
}

// Permission Action Types (CRUD and Advanced)
export enum PermissionAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
  ADMIN = "admin",
  INVITE = "invite",
  ASSIGN = "assign",
}

/**
 * only admin can add and delete permissions, and assign.
 */
