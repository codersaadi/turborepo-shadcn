"use server";

import * as userRepository from "@repo/db/data/users";
import { getVerificationTokenByToken } from "@repo/db/data/verification-token";
import type { MessageResponse } from "../types";
export async function emailVerifyAction(
  token?: string
): Promise<MessageResponse> {
  if (!token) {
    return {
      message: "invaild token",
      success: false,
    };
  }
  try {
    const dbToken = await getVerificationTokenByToken(token);
    if (!dbToken) {
      return {
        message: "invalid request or token may have been expired",
        success: false,
      };
    }
    //  check if token is  valid
    const expired = new Date(dbToken.expires) < new Date();
    if (expired) {
      return {
        message: "token has been expired",
        success: false,
      };
    }
    //  check if user exists
    const userExists = await userRepository.getUserByEmail(dbToken.identifier);

    if (!userExists) {
      return {
        message: "user not found, try to signup first",
        success: false,
      };
    }

    await userRepository.verifyUserEmail(userExists.id, dbToken.identifier);

    return {
      message: "Email Verified Sucessfully",
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      message: "something went wrong",
      success: false,
    };
  }
}
