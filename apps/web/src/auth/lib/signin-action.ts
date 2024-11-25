"use server";
import { AuthError } from "next-auth";

import { signOut } from "@/auth";
import { signIn } from "@/auth";

import type { MessageResponse } from "@/types/responses";
import * as userRepository from "@repo/db/data/users";
import { createVerificationToken } from "@repo/db/data/verification-token";
import { LoginSchema, type LoginSchemaType } from "../auth.schema";
export { signOut };

export async function signInAction(
	data: LoginSchemaType,
): Promise<MessageResponse> {
	const validate = LoginSchema.safeParse(data);
	if (!validate.success) {
		return {
			message: validate?.error?.errors?.[0]?.message || "Invalid Data",
			success: false,
		};
	}

	const { email, password } = validate.data;
	const user = await userRepository.getUserByEmail(email);
	const ERROR_INVALID_CREDENTIALS = "Invalid credentials";
	// if user is not found or email or password is not provided
	if (!user || !user.email || !user.password) {
		return {
			message: ERROR_INVALID_CREDENTIALS,
			success: false,
		};
	}
	// if user is not verified
	if (!user.emailVerified) {
		const token = await createVerificationToken(email);
		if (!token) {
			return { message: "Something went wrong!", success: false };
		}
		// await sendEmailVerification(email, token?.token);
		return {
			message: "Confirmation Email Sent",
			success: true,
		};
	}
	try {
		await signIn("credentials", {
			email,
			password,
		});

		return {
			message: "Sign In Sucessfully",
			success: true,
		};
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { message: ERROR_INVALID_CREDENTIALS, success: false };
				// you can improve error handling here , as per you requirements
				default:
					return { message: "Something went wrong!", success: false };
			}
		}
		throw error;
	}
}
