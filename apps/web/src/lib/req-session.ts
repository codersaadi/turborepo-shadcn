import { type NextRequest, NextResponse } from "next/server";

export const createAuthErrorResponse = (message?: string) => {
  const error = createAuthenticationError(message);
  return NextResponse.json(
    { error: error.message },
    { status: error.statusCode }
  );
};
import { auth } from "@/auth";
import type { Session } from "@authjs/core/types";
import { createAuthenticationError } from "@repo/api/errors";
export const getSessionFromRequest = async (
  req: NextRequest
): Promise<Session | null> => {
  try {
    const response = await auth(async (req, ctx) => {
      const auth = req.auth;

      // Create a Response to align with the expectations of `auth`
      return new Response(JSON.stringify({ auth }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
      // @ts-ignore
    })(req, {});

    // Ensure headers like cookies do not propagate unintentionally
    if (!response?.ok) {
      console.error("Session retrieval failed with status:", response?.status);
      return null;
    }

    // Parse the JSON safely
    const data = (await response.json()) as { auth: Session | null };

    if (!data?.auth) {
      console.warn("Unexpected session data format:", data);
      return null;
    }

    return data.auth as Session | null;
  } catch (error) {
    console.error("Error during session retrieval:", error);
    return null; // Fallback to null if an error occurs
  }
};
