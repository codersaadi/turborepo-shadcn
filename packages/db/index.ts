import * as schema from "@repo/db/schema";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
let db: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

if (process.env.NODE_ENV === "production") {
  pg = postgres(
    process.env.DATABASE_URL ||
      "postgresql://postgres:Saadsaad1@localhost:5432/saas_pack"
  );
  db = drizzle(pg, { schema });
} else {
  if (
    !(global as unknown as { database: PostgresJsDatabase<typeof schema> })
      .database
  ) {
    pg = postgres(process.env.DATABASE_URL || "");
    (
      global as unknown as { database: PostgresJsDatabase<typeof schema> }
    ).database = drizzle(pg, { schema });
  }
  db = (global as unknown as { database: PostgresJsDatabase<typeof schema> })
    .database;
}

export { db, pg };
