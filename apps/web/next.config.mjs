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
