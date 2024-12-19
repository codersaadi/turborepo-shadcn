import { auth } from "@authjs/core";
import {
  appRouter,
  createCallerFactory as innerCallerFactory,
} from "@repo/api";
import { headers } from "next/headers";

// Server-side caller factory
export const createCallerFactory = () =>
  innerCallerFactory(appRouter)(async () => {
    return {
      auth: await auth(),
      headers: await headers(),
    };
  });
