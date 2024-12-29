import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const jiti = createJiti(fileURLToPath(import.meta.url));
// Validate env at build time - https://env.t3.gg/docs/nextjs#validate-schema-on-build-(recommended)
async function validateEnv() {
	await jiti.import("../../packages/env/index.ts");
}
validateEnv();
/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"repo-ui",
		"@repo/env",
		"@repo/api",
		"@repo/db",
		"@authjs/client",
		"@authjs/core",
	],
	// output: "standalone",
	images: {
		remotePatterns: [
			{
				hostname: "*",
				protocol: "https",
			},
		],
	},
};

export default nextConfig;
