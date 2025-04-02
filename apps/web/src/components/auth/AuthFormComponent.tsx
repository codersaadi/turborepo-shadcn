"use client";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import type React from "react";

// HOC , so we don't have to write redundant code
// isRedirectError is Framework Specific , but authjs client does not depend next.js
export function AuthFormComponent<P extends object>(
	Component: React.ComponentType<P>,
) {
	return function WrappedComponent(props: Omit<P, "onErrorIgnore">) {
		return <Component {...(props as P)} onErrorIgnore={isRedirectError} />;
	};
}
