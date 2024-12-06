import { db, pg } from "..";
import { users } from "../schema";

async function main() {
  const userData = {
    email: "codestacklab@xyz.com",
    password: "$2a$10$eBWPibRqL/mAbrmbDEHD5efcAOtREelYr1wqM0VymHiCIjWCsIUlW",
    name: "Saadi",
    emailVerified: new Date(),
  };
  const [createdUser] = await db
    .insert(users)
    .values(userData)
    .onConflictDoNothing()
    .returning();
  if (!createdUser) throw new Error("error creating user");
  // await createDefaultOrganization(createdUser.id); id using multi tenacy
  console.log("Successfully seeded the user");
  await pg.end();
}

main();
