import { MagicSignInForm } from "@/auth/components";
import { signinMagic } from "@/auth/lib/signin_magic-action";
import React from "react";

export default function page() {
	return <MagicSignInForm onSubmitAction={signinMagic} />;
}
