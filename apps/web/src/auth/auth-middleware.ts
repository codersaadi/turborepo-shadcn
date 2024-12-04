import {
	DEFAULT_LOGIN_REDIRECT,
	SIGNIN_PAGE,
	apiAuthPrefix,
	authRoutes,
	publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import type { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

import authConfig from "@/auth/auth.config";
const { auth } = NextAuth(authConfig);

const getRouteType = (nextUrl: NextURL) => {
	const isApiAuth = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);
	return {
		isApiAuth,
		isAuthRoute,
		isPublicRoute,
	};
};

const withAuth = auth((req) => {
	const isLoggedIn = !!req.auth;
	const { nextUrl } = req;
	const { isApiAuth, isAuthRoute, isPublicRoute } = getRouteType(nextUrl);
	if (isApiAuth) return;

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return NextResponse.next();
	}
	if (!isLoggedIn && !isPublicRoute)
		return Response.redirect(new URL(SIGNIN_PAGE, nextUrl));

	return NextResponse.next();
});

export default withAuth;
