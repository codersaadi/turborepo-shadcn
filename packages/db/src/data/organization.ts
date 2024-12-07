import { and, eq, sql } from "drizzle-orm";

import { db } from "..";
import { type Organization, organizations, userOrganizations } from "../schema";
import { createOrganizationUseCase } from "../usecases/organization";
import { generateSlug } from "../utils/generate-string";
import { generateRandomName } from "../utils/random-name";
export async function createDefaultOrganization(userId: string) {
  const name = generateRandomName();
  const data = {
    name,
    slug: generateSlug(name),
    description: "This is the default organization of the current user",
    ownerId: userId,
  };
  return createOrganizationUseCase(data, true); // active is true
}
export async function createOrganization(
  data: {
    name: string;
    description?: string;
    slug?: string;
    domain?: string;
    logoUrl?: string;
    maxMembers?: number;
    ownerId: string;
  },
  trx = db
): Promise<Organization | null> {
  try {
    const [newOrg] = await trx
      .insert(organizations)
      .values({ ...data, slug: data?.slug || generateSlug(data.name) })
      .onConflictDoNothing()
      .returning();
    return newOrg ?? null;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw new Error("Could not create organization");
  }
}
export async function getOrganizationBySlug(
  slug: string,
  trx = db
): Promise<Organization | undefined> {
  try {
    return await trx.query.organizations.findFirst({
      where(fields, operators) {
        return operators.eq(fields.slug, slug);
      },
    });
  } catch (error) {
    console.error("Error fetching organization by slug:", error);
    throw new Error("Could not fetch organization by slug");
  }
}

/**
 * Update an organization.
 *
 * @param id - The organization's ID.
 * @param data - The updated data for the organization.
 * @returns The updated organization or null if not found.
 */
export async function updateOrganization(
  id: string,
  data: Partial<{
    name: string;
    description?: string;
    slug: string;
    domain?: string;
    maxMembers?: number;
  }>
): Promise<Organization | null> {
  try {
    const [updatedOrg] = await db
      .update(organizations)
      .set(data)
      .where(eq(organizations.id, id))
      .returning();
    return updatedOrg ?? null;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw new Error("Could not update organization");
  }
}

/**
 * Fetch an organization by ID.
 *
 * @param id - The organization's ID.
 * @returns The organization or null if not found.
 */
export async function getOrganizationById(
  id: string
): Promise<Organization | undefined> {
  try {
    return await db.query.organizations.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, id);
      },
    });
  } catch (error) {
    console.error("Error fetching organization by ID:", error);
    throw new Error("Could not fetch organization by ID");
  }
}
/**
 * Fetch an organization of user by ID (owner action).
 *
 * @param id - The organization's ID.
 * @returns The organization or null if not found.
 */
export async function getUserOrganization(
  id: string,
  userId: string
): Promise<Organization | undefined> {
  try {
    return await db.query.organizations.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.ownerId, userId),
          operators.eq(fields.id, id)
        );
      },
    });
  } catch (error) {
    console.error("Error fetching organization by ID:", error);
    throw new Error("Could not fetch organization by ID");
  }
}
export async function deleteOrganization(id: string): Promise<boolean> {
  try {
    const result = await db
      .delete(organizations)
      .where(eq(organizations.id, id))
      .execute();

    return result.count > 0; // Use the `count` property
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw new Error("Could not delete organization");
  }
}

/**
 * List all organizations of user.
 *
 * @param limit - Maximum number of organizations to return.
 * @param offset - Number of organizations to skip for pagination.
 * @returns A list of organizations.
 */
export async function listOrganizations(
  userId: string,
  limit = 10,
  offset = 0
) {
  try {
    const orgs = await db.query.organizations.findMany({
      where(fields, operators) {
        return operators.eq(fields.ownerId, userId);
      },
      // orderBy(fields, operators) {
      //   return operators.desc(fields.createdAt);
      // },
    });
    return orgs;
  } catch (error) {
    console.error("Error listing organizations:", error);
    throw new Error("Could not list organizations");
  }
}

/**
 * Check if an organization exists by slug.
 *
 * @param slug - The organization's slug.
 * @returns True if the organization exists, otherwise false.
 */
export async function organizationExistsBySlug(slug: string): Promise<boolean> {
  try {
    const org = await db.query.organizations.findFirst({
      where(fields, operators) {
        return operators.eq(fields.slug, slug);
      },
    });
    return org !== null;
  } catch (error) {
    console.error("Error checking if organization exists by slug:", error);
    throw new Error("Could not check organization existence");
  }
}

// export async function getActiveOrganization(id : string , userId : string){
// const organization = await getOrganizationById(id)
// const member = await getOrganizationMember(id, userId)
// return {
//   organization,
// }

// }
export async function getUserOrganizations(userId: string) {
  // Fetch all organizations the user is a member of, regardless of their role
  const orgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      description: organizations.description,
      slug: organizations.slug,
      logoUrl: organizations.logoUrl,
      ownerId: organizations.ownerId,
    })
    .from(organizations)
    .innerJoin(
      userOrganizations,
      sql`${userOrganizations.userId} = ${userId} AND ${userOrganizations.organizationId} = ${organizations.id}`
    )
    .execute();

  return orgs;
}
