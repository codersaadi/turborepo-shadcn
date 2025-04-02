import { createAuthMiddleware } from "@authjs/core/middleware";
import type { AppRouteHandlerFn } from "next/dist/server/route-modules/app-route/module";
import {
  DEFAULT_LOGIN_REDIRECT,
  SIGNIN_PAGE,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

const middleware = createAuthMiddleware({
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  loginRedirect: DEFAULT_LOGIN_REDIRECT,
  signin: SIGNIN_PAGE,
}) as AppRouteHandlerFn;
export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
