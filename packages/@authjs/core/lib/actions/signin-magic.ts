"use server";
import type { MagicSignInType } from "@authjs/core/schema";
import env from "@repo/env";
import { signIn } from "../..";

const HOST = env.NEXT_PUBLIC_HOST || "http://localhost:3000";
export async function signinMagic(
  data: MagicSignInType,
  isRedirectError: (error: unknown) => boolean
) {
  try {
    await signIn("resend", { email: data.email });
    return {
      message: `An email link has been sent to ${data.email}. Please check your inbox.`,
      success: true,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      return handleSignInRedirectError(
        error as Error & { digest: string },
        data
      );
    }
    return {
      message: error instanceof Error ? error.message : "Failed to Send Email",
      success: false,
    };
  }
}

const handleSignInRedirectError = (
  error: Error & { digest: string },
  data: MagicSignInType
) => {
  let digest = error.digest;
  type Digest = typeof error.digest;
  const replace = "NEXT_REDIRECT;replace;";
  const isNotFound = `${replace + HOST}/auth/signup;303;` === error.digest;
  const successDigest = `${
    replace + HOST
  }/api/auth/verify-request?provider=resend&type=email;303;`;
  const isSuccess = error.digest === successDigest;
  if (isNotFound) {
    digest =
      `${replace}${HOST}/auth/signup?callbackError=badSignInEmail&email=${
        data.email
      }&at=${new Date().toLocaleTimeString()};303` as Digest;
  } else if (isSuccess) {
    digest =
      `${replace}${HOST}/auth/verify-request?email=${data.email}&provider=resend&type=email;303` as Digest;
  }

  const err = { ...error, digest };
  throw err;
};
