import type { NextConfig } from "next";

/**
 * Set NEXT_PUBLIC_BASE_PATH=/repo-name when deploying to a GitHub Pages
 * project site (e.g. https://user.github.io/portfolio/). Leave empty for a
 * user/organisation Pages site or a custom domain.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath } : {}),
  reactStrictMode: true,
};

export default nextConfig;
