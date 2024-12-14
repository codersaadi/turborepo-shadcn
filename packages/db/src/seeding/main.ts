import { db, pg } from "..";
import {
  createDefaultOrganization,
  getOrganizationById,
} from "../data/organization";
import { getUserByEmail } from "../data/users";
import { users } from "../schema";

async function main() {
  try {
    const userData = {
      email: "codestacklab@xyz.com",
      password: "$2a$10$id9Rm2kCKtV08Jj3sW.sZO0vGKf.W8RbxfjzhwhQLYSldbj37zFRC",
      name: "Saadi",
      emailVerified: new Date(),
    };

    // Check if user already exists
    let seedUser = await getUserByEmail(userData.email);

    if (!seedUser) {
      const [createdUser] = await db
        .insert(users)
        .values(userData)
        .onConflictDoNothing()
        .returning();

      if (!createdUser) {
        throw new Error("Error creating user. User might already exist.");
      }

      seedUser = createdUser;
      console.log("User seeded successfully.");
    } else {
      console.log("User already exists.");
    }

    // Ensure organization creation
    const activeOrgId = seedUser.activeOrgId;

    if (activeOrgId) {
      const existingOrg = await getOrganizationById(activeOrgId);

      if (existingOrg) {
        console.log("Organization already exists.");
      } else {
        console.log("Creating default organization for activeOrgId...");
        await createDefaultOrganizationForUser(seedUser);
      }
    } else {
      console.log(
        "No activeOrgId found. Creating a new default organization..."
      );
      await createDefaultOrganizationForUser(seedUser);
    }
  } catch (error) {
    console.error("An error occurred during the seed process:", error);
  } finally {
    await pg.end();
    console.log("Database connection closed.");
  }
}

async function createDefaultOrganizationForUser(
  seedUser: typeof users.$inferInsert
) {
  if (!seedUser.id) {
    throw new Error("User ID is missing. Cannot create organization.");
  }

  try {
    await createDefaultOrganization(seedUser.id);
    console.log("Default organization created successfully.");
  } catch (err) {
    console.error("Error creating default organization:", err);
  }
}

main();
