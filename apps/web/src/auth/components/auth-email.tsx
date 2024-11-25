import { logoUrl } from "@/constants";
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

interface EmailTemplateProps {
	link: string;
	type: "verify" | "reset" | "confirmation";
	username?: string;
}

const templateConfig = {
	verify: {
		previewText: "Verify your email address",
		heading: "Verify your email",
		mainText:
			"Thanks for signing up! Please verify your email address to get started.",
		buttonText: "Verify Email",
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
	reset: {
		previewText: "Reset your password",
		heading: "Reset your password",
		mainText:
			"We received a request to reset your password. Click the button below to choose a new password.",
		buttonText: "Reset Password",
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
	confirmation: {
		previewText: "Confirm your email address",
		heading: "Confirm your email address",
		mainText:
			"Thanks for signing up! Please confirm your email address to get started.",
		buttonText: "Confirm Email",
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
};

export function AuthEmailTemplate({
	link,
	type,
	username,
}: EmailTemplateProps) {
	const config = templateConfig[type];

	return (
		<Html>
			<Head />
			<Preview>{config.previewText}</Preview>
			<Tailwind>
				<Body className="bg-gray-50 font-sans">
					<Container className="mx-auto my-[40px] max-w-[465px] rounded-lg border border-solid border-gray-200 bg-white p-8 shadow-sm">
						{/* Logo Section */}
						<Section className="text-center">
							<Img
								src={logoUrl}
								width="40"
								height="40"
								alt="Logo"
								className="mx-auto"
							/>
						</Section>

						{/* Header Section */}
						<Heading className="mx-0 my-6 text-center text-2xl font-bold text-gray-800">
							{config.heading}
						</Heading>

						{/* Greeting */}
						<Text className="text-gray-700 text-base mb-4">
							Hello {username ? username : "there"},
						</Text>

						{/* Main Content */}
						<Text className="text-gray-700 text-base mb-6">
							{config.mainText}
						</Text>

						{/* CTA Button */}
						<Section className="text-center mb-8">
							<Button
								className="inline-block rounded-lg bg-blue-600 text-white px-6 py-3 text-center text-sm font-semibold no-underline"
								href={link}
							>
								{config.buttonText}
							</Button>
						</Section>

						{/* Alternative Link */}
						<Text className="text-gray-600 text-sm mb-6">
							Or copy and paste this URL into your browser:{" "}
							<Link href={link} className="text-blue-600 break-all">
								{link}
							</Link>
						</Text>

						<Hr className="border border-solid border-gray-200 my-6" />

						{/* Footer */}
						<Text className="text-gray-500 text-sm">{config.footerText}</Text>

						<Section className="mt-8">
							<Text className="text-xs text-gray-400 text-center">
								© {new Date().getFullYear()} Your App Name. All rights reserved.
								<br />
								123 Street Name, City, Country
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
