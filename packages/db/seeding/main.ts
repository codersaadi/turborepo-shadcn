import { db, pg } from "..";
import { users } from "../schema";

async function main() {
  const userData = {
    email: "codersaadi@xyz.com",
    password: "$2a$10$k004FluJIF2/l/ykBZDx6eFqz9SAtxHCNbLsDH3jaOD8x9Meji7/O",
    name: "Saadi",
    emailVerified: new Date(),
  }; // password is codersaadi
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
