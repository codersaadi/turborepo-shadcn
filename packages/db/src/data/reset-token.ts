import { eq } from "drizzle-orm";
import * as v4 from "uuid";
import { db } from "../index";
import { resetPasswordTokens } from "../schema";

export async function getResetPasswordToken(email: string) {
  try {
    const t = await db.query.resetPasswordTokens.findFirst({
      where(fields, operators) {
        return operators.eq(fields.email, email);
      },
    });
    return t;
  } catch (error) {
    console.log("Error in getResetPasswordToken", error);
    return null;
  }
}
export async function getResetPasswordTokenByToken(token: string) {
  try {
    const t = await db.query.resetPasswordTokens.findFirst({
      where(fields, operators) {
        return operators.eq(fields.token, token);
      },
    });
    return t;
  } catch (error) {
    console.log("Error in getResetPasswordToken", error);
    return null;
  }
}
export async function createResetPasswordToken(email: string) {
  try {
    const exists = await getResetPasswordToken(email);
    if (exists) {
      await deleteResetTokenByEmail(email);
    }
    //    creating a new token
    await db
      .insert(resetPasswordTokens)
      .values({
        email,
        token: v4.v4(),
        expires: new Date(Date.now() + 1000 * 60 * 60),
      })
      .execute();
    const token = await getResetPasswordToken(email);
    return token;
  } catch (error) {
    console.log("Error in getResetPasswordToken", error);
    return null;
  }
}
export async function deleteResetTokenByEmail(email: string) {
  await db
    .delete(resetPasswordTokens)
    .where(eq(resetPasswordTokens.email, email));
}
