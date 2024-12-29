import { and, eq } from "drizzle-orm";
import * as v4 from "uuid";
import { db } from "../index";
import { verificationTokens } from "../schema";

export async function getVerificationToken(email: string): Promise<
  | {
      identifier: string;
      token: string;
      expires: Date;
    }
  | null
  | undefined
> {
  try {
    const t = await db.query.verificationTokens.findFirst({
      where(fields, operators) {
        return operators.eq(fields.identifier, email);
      },
    });
    return t;
  } catch (error) {
    console.log("Error in getVerificationToken", error);
    return null;
  }
}
export async function getVerificationTokenByToken(token: string): Promise<
  | {
      identifier: string;
      token: string;
      expires: Date;
    }
  | null
  | undefined
> {
  try {
    const t = await db.query.verificationTokens.findFirst({
      where(fields, operators) {
        return operators.eq(fields.token, token);
      },
    });
    return t;
  } catch (error) {
    console.log("Error in getVerificationToken", error);
    return null;
  }
}

export async function createVerificationToken(email: string) {
  try {
    const exists = await getVerificationToken(email);
    if (exists) {
      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.token, exists.token),
            eq(verificationTokens.identifier, exists.identifier)
          )
        );
    }
    //    creating a new token
    // Assuming 'verificationTokens' is your table and 'db' is your Drizzle ORM instance
    await db.insert(verificationTokens).values({
      identifier: email,
      token: v4.v4(), // Properly invoke the UUID function
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1-hour expiry
    });
    const token = await getVerificationToken(email);

    return token;
  } catch (error) {
    console.log("Error in getVerificationToken", error);
    return null;
  }
}
