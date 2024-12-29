import { ProjectStructure } from "@/components/ProjectStructure";
import NextThemeSwitch from "@/components/ThemeSwitch";
import { Code, Rocket, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "repo-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "repo-ui/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "repo-ui/components/ui/table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "repo-ui/components/ui/tabs";

export default function Page() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="container mx-auto py-6 flex justify-between items-center">
				<h1 className="text-2xl font-bold">TurboRepo Starter</h1>
				<NextThemeSwitch />
			</header>

			<main className="container mx-auto py-12 max-w-5xl">
				<section className="text-center mb-12">
					<h2 className="text-4xl font-bold mb-4">
						Welcome to Your Dev Environment
					</h2>
					<p className="text-xl text-muted-foreground mb-8">
						Get started with this feature-packed Turborepo starter
					</p>
					<div className="flex justify-center gap-4">
						<Button asChild>
							<Link href="https://github.com/codersaadi/turborepo-shadcn">
								View on GitHub
							</Link>
						</Button>
						<Button disabled variant="outline" asChild>
							<span>Documentation (soon)</span>
						</Button>
					</div>
				</section>

				<section className="mb-12">
					<h3 className="text-2xl font-semibold mb-6">Features</h3>
					<div className="grid md:grid-cols-3 gap-6">
						<Card>
							<CardHeader>
								<Rocket className="w-8 h-8 mb-2 text-primary" />
								<CardTitle>Turbocharged Setup</CardTitle>
							</CardHeader>
							<CardContent>
								Monorepo structure with Next.js apps and shared packages for
								maximum efficiency.
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<Zap className="w-8 h-8 mb-2 text-primary" />
								<CardTitle>Modern Stack</CardTitle>
							</CardHeader>
							<CardContent>
								TypeScript, tRPC, Auth.js, and more for a robust development
								experience.
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<Code className="w-8 h-8 mb-2 text-primary" />
								<CardTitle>Developer Friendly</CardTitle>
							</CardHeader>
							<CardContent>
								Biome for linting, Husky for Git hooks, and conventional commits
								built-in.
							</CardContent>
						</Card>
					</div>
				</section>

				<section className="mb-12">
					<h3 className="text-2xl font-semibold mb-6">Feature Overview</h3>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[200px]">Category</TableHead>
									<TableHead>Features</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium">
										Core Technologies
									</TableCell>
									<TableCell>
										TypeScript, Next.js, Strict ESM modules support, Fuma for
										documentation, Auth.js, tRPC
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Authentication & Security
									</TableCell>
									<TableCell>
										Auth.js 5, OAuth Providers, Type-safe User Sessions
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Data & API</TableCell>
									<TableCell>
										Typesafe API Layer (end-to-end type inference, shared
										schemas), React Query Integration (automatic caching,
										optimistic updates)
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">UI & Styling</TableCell>
									<TableCell>shadcn/ui components, Tailwind CSS</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Code Quality</TableCell>
									<TableCell>Biome for linting and formatting</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										DevOps & Deployment
									</TableCell>
									<TableCell>
										Docker support, Workspace-aware commands, Turborepo remote
										caching
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Git Workflow</TableCell>
									<TableCell>
										Husky for Git hooks, Commitlint for conventional commit
										messages, Automated pre-commit quality checks
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Additional Integrations
									</TableCell>
									<TableCell>
										Stripe Payments, Resend for transactional emails,
										react-email for email templates
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">
										Project Structure
									</TableCell>
									<TableCell>
										Monorepo with apps (docs, web) and packages (repo-ui, api,
										env, db, analytics, typescript-config, biome-config, authjs,
										email, rate-limit)
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</section>
				<ProjectStructure />
				<section className="max-w-3xl">
					<h3 className="text-2xl font-semibold mb-6">Quick Start</h3>
					<Tabs defaultValue="install" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="install">Install</TabsTrigger>
							<TabsTrigger value="develop">Develop</TabsTrigger>
							<TabsTrigger value="deploy">Deploy</TabsTrigger>
						</TabsList>
						<TabsContent value="install">
							<Card>
								<CardHeader>
									<CardTitle>Installation</CardTitle>
									<CardDescription>
										Get your development environment set up.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<code className="block bg-muted p-4 rounded-md">
										git clone https://github.com/codersaadi/turborepo-shadcn.git
										my-app
										<br />
										cd my-app
										<br />
										pnpm install
									</code>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="develop">
							<Card>
								<CardHeader>
									<CardTitle>Development</CardTitle>
									<CardDescription>
										Start your development server.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<code className="block bg-muted p-4 rounded-md">
										pnpm dev
									</code>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="deploy">
							<Card>
								<CardHeader>
									<CardTitle>Deployment</CardTitle>
									<CardDescription>
										Build and deploy your application.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<code className="block bg-muted p-4 rounded-md">
										pnpm build
										<br />
										pnpm start
									</code>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</section>
			</main>

			<footer className="container mx-auto py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} TurboRepo Starter. Created with ❤️ by
				<Link href="https://github.com/codersaadi">Saad Bukhari</Link>
			</footer>
		</div>
	);
}
