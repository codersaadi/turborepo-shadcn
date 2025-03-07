// migrate.js
const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const postgres = require("postgres");

const connectionString = process.env.DATABASE_URL || "fallback_strinng";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

async function connectWithRetry(retries = MAX_RETRIES) {
  try {
    console.log("Attempting database connection...");
    const pg = postgres(connectionString);
    const db = drizzle(pg);

    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations completed successfully");

    await pg.end();
  } catch (error) {
    console.error("Connection error:", error);
    if (retries > 0) {
      console.log(
        `Database connection failed. Retrying in ${
          RETRY_DELAY / 1000
        } seconds... (${retries} attempts remaining)`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      await connectWithRetry(retries - 1);
    } else {
      console.error("Max retries reached. Could not connect to the database.");
      throw error;
    }
  }
}

connectWithRetry().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
