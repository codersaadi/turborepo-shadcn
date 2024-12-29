import { databaseAliveTest } from "@repo/db/data/newsletter";

export const POST = async () => {
  const alive = await databaseAliveTest();
  if (!alive)
    return new Response("Database Error! Not Working as Expected", {
      status: 500,
    });
  return new Response("OK", { status: 200 });
};
