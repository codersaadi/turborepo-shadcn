import { SigninMagic } from "@/components/auth/signin";
import { APP_NAME } from "@/constants";
import type { Metadata } from "next";
export default SigninMagic
/**
 * Meta data for the signin form page
 */
export const metadata: Metadata = {
	title: `${APP_NAME} - Signin with Email to Continue`,
	description: "...",
};
