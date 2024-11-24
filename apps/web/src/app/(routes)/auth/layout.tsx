import AuthFlexLayout from "@/auth/components/AuthFlexLayout";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthFlexLayout>{children}</AuthFlexLayout>;
}
