"use client";
import { SignUpForm } from "@authjs/client";
import { AuthFormComponent } from "./AuthFormComponent";

export function Signup() {
	return AuthFormComponent(SignUpForm);
}
