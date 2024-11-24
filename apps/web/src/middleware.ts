import authConfig from "@/auth/auth.config";
import NextAuth from "next-auth";
import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authRoutes,
	publicRoutes,
} from "./routes";
const { auth } = NextAuth(authConfig);
export default auth((req) => {
	const isLoggedIn = !!req.auth;
	const { nextUrl } = req;
	const isApiAuth = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute =
		publicRoutes.includes(nextUrl.pathname) ||
		nextUrl.pathname.startsWith("/blog");
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);
	if (isApiAuth) {
		return;
	}
	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return;
	}
	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL("/auth/signin", nextUrl));
	}
	return;
});
export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
