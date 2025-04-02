import { Signup } from "@/components/auth/signup";
import { APP_NAME } from "@/constants";
import type { Metadata } from "next";
export default Signup;
/**
 * Meta data for the signup form page
 */
export const metadata: Metadata = {
	title: `${APP_NAME} -Create an Account for free`,
	description: "...",
};
