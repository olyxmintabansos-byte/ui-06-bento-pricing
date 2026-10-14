import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/ui-06-bento-pricing",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
