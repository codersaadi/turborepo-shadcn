import { cn } from "@repo/ui/lib/utils";
import { FileIcon, FolderIcon } from "lucide-react";

type TreeNode = {
	name: string;
	children?: TreeNode[];
	type?: "dir" | "file";
};

const projectStructure: TreeNode = {
	name: "root",
	children: [
		{
			name: "apps",
			children: [{ name: "docs" }, { name: "web" }],
		},

		{
			name: "packages",
			children: [
				{ name: "@repo/ui" },
				{ name: "api" },
				{ name: "db" },
				{ name: "email" },
				{ name: "env" },
				{ name: "@plugins" },
				{ name: "rate-limit" },
				{ name: "analytics" },
				{
					name: "@authjs",
					children: [
						{
							name: "client",
						},
						{
							name: "core",
						},
					],
				},
			],
		},
		{
			name: "tooling",
			children: [{ name: "biome-config" }, { name: "typescript-config" }],
		},
		{ name: "package.json", type: "file" },
		{ name: "turbo.json", type: "file" },
		{ name: "README.md", type: "file" },
	],
};

const TreeNode = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
	const isFolder = node.type === "dir" || !node.type;
	return (
		<div
			className={cn("ml-2", {
				"ml-4": isFolder && depth === 1,
				"ml-6": isFolder && depth === 2,
				"ml-8": isFolder && depth > 2,
			})}
		>
			<div className="flex items-center">
				{isFolder ? (
					<FolderIcon className="w-4 h-4 mr-2 text-yellow-500" />
				) : (
					<FileIcon className="w-4 h-4 mr-2 text-blue-500" />
				)}
				<span>{node.name}</span>
			</div>
			{node.children?.map((child, index) => (
				<TreeNode
					key={`${child.name}-${index}`}
					node={child}
					depth={depth + 1}
				/>
			))}
		</div>
	);
};

export function ProjectStructure() {
	return (
		<div className="bg-muted p-4 rounded-lg overflow-auto max-h-[38rem]">
			<TreeNode node={projectStructure} />
		</div>
	);
}
