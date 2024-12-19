import AuthFlexLayout from "@/components/AuthFlexLayout";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthFlexLayout>
			{children}
		</AuthFlexLayout>
	);
}
