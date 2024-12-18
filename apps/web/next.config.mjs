import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const jiti = createJiti(fileURLToPath(import.meta.url));
// Validate env at build time - https://env.t3.gg/docs/nextjs#validate-schema-on-build-(recommended)
async function validateEnv() {
  await jiti.import("../../packages/env/src/index.ts");
}
validateEnv();
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["repo-ui", "@repo/env", "@repo/api"],
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
