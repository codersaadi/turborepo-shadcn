import { toRuntime, toRuntimeAsync } from "fumadocs-mdx";
import * as docs_1 from "../content/docs/deployment/01-setting-up-enviroment.md?collection=docs&hash=16f73492517c3dbfac642ae260388964e62eb9f436e57b863d09f7cae1037e1e";
import * as docs_2 from "../content/docs/deployment/deploying-to-vps.md?collection=docs&hash=16f73492517c3dbfac642ae260388964e62eb9f436e57b863d09f7cae1037e1e";
import * as meta_0 from "../content/docs/deployment/meta.json?collection=meta&hash=16f73492517c3dbfac642ae260388964e62eb9f436e57b863d09f7cae1037e1e";
import * as docs_0 from "../content/docs/index.md?collection=docs&hash=16f73492517c3dbfac642ae260388964e62eb9f436e57b863d09f7cae1037e1e";
export const docs = [
	toRuntime("doc", docs_0, {
		path: "index.md",
		absolutePath:
			"/home/code/Desktop/starter-pack/apps/docs/content/docs/index.md",
	}),
	toRuntime("doc", docs_1, {
		path: "deployment/01-setting-up-enviroment.md",
		absolutePath:
			"/home/code/Desktop/starter-pack/apps/docs/content/docs/deployment/01-setting-up-enviroment.md",
	}),
	toRuntime("doc", docs_2, {
		path: "deployment/deploying-to-vps.md",
		absolutePath:
			"/home/code/Desktop/starter-pack/apps/docs/content/docs/deployment/deploying-to-vps.md",
	}),
];
export const meta = [
	toRuntime("meta", meta_0, {
		path: "deployment/meta.json",
		absolutePath:
			"/home/code/Desktop/starter-pack/apps/docs/content/docs/deployment/meta.json",
	}),
];
