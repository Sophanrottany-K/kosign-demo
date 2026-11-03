import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  trailingSlash: true,
  partialPrefetching: true,
};

export default nextConfig;
