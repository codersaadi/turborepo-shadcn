/**
 * Routes accessible to the public are listed here in an array
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/home", "/", "/changelog", "/blog"];

/**
 * Routes for authentication are listed here in an array
 * @type {string[]}
 */
export const authRoutes: string[] = [
	"/auth/signin",
	"/auth/signup",
	"/auth/forgot-password",
	"/auth/new-password",
	"/auth/email_verify",
	"/auth/verify-request",
	"/auth-error",
	"/auth/signin-email",
];
/**
 * Routes start with the api are used for api auth purpose
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The default route to redirect to after login
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
