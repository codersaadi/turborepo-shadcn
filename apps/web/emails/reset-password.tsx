import { AuthEmailTemplate } from "@/auth/components/auth-email";
import React from "react";

export default function ResetPassword() {
	return <AuthEmailTemplate link="#" type="reset" />;
}
