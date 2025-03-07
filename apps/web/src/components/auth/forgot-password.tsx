'use client'
import { ForgotPasswordForm } from "@authjs/client";
import { AuthFormComponent } from "./AuthFormComponent";

export default function ForgotPassword() {
    return AuthFormComponent(ForgotPasswordForm);
}