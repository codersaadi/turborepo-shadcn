"use client";
import { updateUserSessAction } from "@/auth/lib/signin-action";
import { trpcReact } from "@/lib/trpc/react-client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type OrganizationFormValues,
	organizationSchema,
} from "@repo/api/schema";
import { Button } from "@repo/ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Switch } from "@repo/ui/components/ui/switch";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { toast } from "@repo/ui/hooks/use-toast";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function AddOrganizationModal() {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const form = useForm<OrganizationFormValues>({
		resolver: zodResolver(organizationSchema),
		defaultValues: {
			name: "",
			description: "",
			isActive: false,
			logoUrl: "",
			domain: "",
			maxMembers: 50,
		},
	});
	const { mutate } =
		trpcReact.organizationRouter.createOrganization.useMutation({
			async onSuccess(data) {
				setOpen(false);
				if (data) {
					if (data.SetActive && data.orgCreated) {
						await updateUserSessAction({
							user: {
								activeOrgId: data.orgCreated.id,
							},
						});
					}
					toast({
						title: "Organization has been created",
					});
					if (data?.SetActive) {
						return router.push("/c/redirect");
					}
				}
			},
		});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"ghost"} className="w-full">
					<span className="inline-flex items-center gap-1">
						<Plus /> Add Workspace
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Organization</DialogTitle>
					<DialogDescription>
						Create a new organization for your team. Click save when you're
						done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => mutate(data))}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Acme Corp" {...field} />
									</FormControl>
									<FormDescription>Your organization's name.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="absolute top-1 left-2 sm:right-16 sm:left-auto">
							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center space-x-3 space-y-0">
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={(val) => field.onChange(val)}
											/>
										</FormControl>
										<FormLabel className="font-semibold">Active</FormLabel>
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Brief description of your organization"
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="logoUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Logo URL</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com/logo.png"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										A URL to your organization's logo.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="domain"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Domain</FormLabel>
									<FormControl>
										<Input placeholder="acme.com" {...field} />
									</FormControl>
									<FormDescription>
										Your organization's domain name.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="maxMembers"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Max Members</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={(e) =>
												field.onChange(Number.parseInt(e.target.value, 10))
											}
										/>
									</FormControl>
									<FormDescription>
										Maximum number of members allowed (1-1000).
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Save
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
