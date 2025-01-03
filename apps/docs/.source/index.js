import { toRuntime, toRuntimeAsync } from "fumadocs-mdx";
import * as docs_1 from "../content/docs/deployment/01-setting-up-enviroment.md?collection=docs&hash=d65665186f12fff117c4f8fb4c817ff08b2a968760001f96d78039708398dba6";
import * as docs_2 from "../content/docs/deployment/deploying-to-vps.md?collection=docs&hash=d65665186f12fff117c4f8fb4c817ff08b2a968760001f96d78039708398dba6";
import * as meta_0 from "../content/docs/deployment/meta.json?collection=meta&hash=d65665186f12fff117c4f8fb4c817ff08b2a968760001f96d78039708398dba6";
import * as docs_0 from "../content/docs/index.md?collection=docs&hash=d65665186f12fff117c4f8fb4c817ff08b2a968760001f96d78039708398dba6";
export const docs = [
	toRuntime("doc", docs_0, {
		path: "index.md",
		absolutePath:
			"/home/code/Desktop/monorepos/starter-pack/apps/docs/content/docs/index.md",
	}),
	toRuntime("doc", docs_1, {
		path: "deployment/01-setting-up-enviroment.md",
		absolutePath:
			"/home/code/Desktop/monorepos/starter-pack/apps/docs/content/docs/deployment/01-setting-up-enviroment.md",
	}),
	toRuntime("doc", docs_2, {
		path: "deployment/deploying-to-vps.md",
		absolutePath:
			"/home/code/Desktop/monorepos/starter-pack/apps/docs/content/docs/deployment/deploying-to-vps.md",
	}),
];
export const meta = [
	toRuntime("meta", meta_0, {
		path: "deployment/meta.json",
		absolutePath:
			"/home/code/Desktop/monorepos/starter-pack/apps/docs/content/docs/deployment/meta.json",
	}),
];
