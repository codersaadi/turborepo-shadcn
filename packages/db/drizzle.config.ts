import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:Saadsaad1@localhost:5432/saas_pack",
  },
});
