import { AuthEmailTemplate } from "@repo/email/templates/auth-email";
import React from "react";

export default function ResetPassword() {
	return <AuthEmailTemplate link="#" type="reset" />;
}
