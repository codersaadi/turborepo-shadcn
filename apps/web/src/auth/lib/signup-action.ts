"use server";
import { SignupSchema, type SignupSchemaType } from "@/auth/auth.schema";
import type { MessageResponse } from "@/types/responses";
import * as userRepository from "@repo/db/data/users";
import { createVerificationToken } from "@repo/db/data/verification-token";
import { authEmail } from "./auth-email";
import { hashMyPassword } from "./common";

export async function signUpAction(
	data: SignupSchemaType,
): Promise<MessageResponse> {
	const validate = SignupSchema.safeParse(data);

	if (!validate.success) {
		return {
			message: validate.error?.errors?.[0]?.message || "Invalid credentials",
			success: false,
		};
	}
	const { email, password, name } = validate.data;
	try {
		const userExists = await userRepository.getUserByEmail(email);
		if (userExists)
			return {
				message: "User already exists",
				success: false,
			};

		// Hash the password
		const hashedPassword = await hashMyPassword(password);
		const user = await userRepository.createUser({
			email,
			password: hashedPassword,
			name,
		});
		if (!user) return { message: "error creating user", success: false };

		const token = await createVerificationToken(email);
		if (!token) return { message: "Something went wrong!", success: false };
		await authEmail(email, "verify", token?.token);
		return { message: "Confirmation Email Sent", success: true };
	} catch (error) {
		console.error(error);
		return {
			message: "An error occurred during sign up",
			success: false,
		};
	}
}
