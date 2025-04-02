import { _runtime } from "fumadocs-mdx";
import * as docs_1 from "../content/docs/deployment/01-setting-up-enviroment.md?collection=docs&hash=1743616063876";
// @ts-nocheck -- skip type checking
import * as docs_2 from "../content/docs/deployment/deploying-to-vps.md?collection=docs&hash=1743616063876";
import * as docs_0 from "../content/docs/index.md?collection=docs&hash=1743616063876";
import type * as _source from "../source.config";
export const docs = _runtime.docs<typeof _source.docs>(
	[
		{
			info: {
				path: "index.md",
				absolutePath:
					"/home/syed/Desktop/turborepo-shadcn/apps/docs/content/docs/index.md",
			},
			data: docs_0,
		},
		{
			info: {
				path: "deployment/01-setting-up-enviroment.md",
				absolutePath:
					"/home/syed/Desktop/turborepo-shadcn/apps/docs/content/docs/deployment/01-setting-up-enviroment.md",
			},
			data: docs_1,
		},
		{
			info: {
				path: "deployment/deploying-to-vps.md",
				absolutePath:
					"/home/syed/Desktop/turborepo-shadcn/apps/docs/content/docs/deployment/deploying-to-vps.md",
			},
			data: docs_2,
		},
	],
	[
		{
			info: {
				path: "deployment/meta.json",
				absolutePath:
					"/home/syed/Desktop/turborepo-shadcn/apps/docs/content/docs/deployment/meta.json",
			},
			data: {
				title: "Deployment",
				pages: ["index", "...", "[Vercel](https://vercel.com)"],
			},
		},
	],
);
