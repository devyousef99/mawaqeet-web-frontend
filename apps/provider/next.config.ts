import type { NextConfig } from "next";

/**
 * Provider zone. Serves every /provider/* path.
 * assetPrefix keeps this zone's /_next assets from colliding with the other
 * zones' assets once the shell proxies them all onto one domain.
 */
const nextConfig: NextConfig = {
  assetPrefix: "/provider-static",
};

export default nextConfig;
