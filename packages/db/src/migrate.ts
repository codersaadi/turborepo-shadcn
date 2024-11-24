// This file is to get the migration to run in the Dockerfile right
// before the service runs.
require("dotenv").config();
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const pg = postgres(process.env.DATABASE_URL || "");
const database = drizzle(pg);

async function main() {
  await migrate(database, { migrationsFolder: "drizzle" });
  await pg.end();
}

main();
