import { createAuthMiddleware } from "@authjs/core/middleware";
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
});
export default middleware;

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
