/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/env"],
  output: "standalone",
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
