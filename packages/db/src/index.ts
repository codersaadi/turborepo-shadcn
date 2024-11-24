import env from "@repo/env";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
let db: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

if (env.NODE_ENV === "production") {
  pg = postgres(env.DATABASE_URL || "");
  db = drizzle(pg, { schema });
} else {
  if (
    !(global as unknown as { database: PostgresJsDatabase<typeof schema> })
      .database
  ) {
    pg = postgres(env.DATABASE_URL || "");
    (
      global as unknown as { database: PostgresJsDatabase<typeof schema> }
    ).database = drizzle(pg, { schema });
  }
  db = (global as unknown as { database: PostgresJsDatabase<typeof schema> })
    .database;
}

export { db, pg };
