import NextAuth from "next-auth";
import authConfig from "./auth.config";
const { auth } = NextAuth(authConfig);
interface AuthMiddlewareConfig {
  publicRoutes: string[];
  authRoutes: string[];
  apiAuthPrefix: string;
  loginRedirect: string;
  signin: string;
}
export const createAuthMiddleware = ({
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  signin,
  loginRedirect,
}: AuthMiddlewareConfig) => {
  return auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const isApiAuth = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    if (isApiAuth) return;

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(loginRedirect, nextUrl));
      }
      return;
    }
    if (!isLoggedIn && !isPublicRoute)
      return Response.redirect(new URL(signin, nextUrl));
    return;
  });
};
