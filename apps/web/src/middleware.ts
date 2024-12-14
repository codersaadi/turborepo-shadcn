import withAuth from "./auth/auth-middleware";

export default withAuth;
// adjust it as per your needs , this matcher is basic , from the docs
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
