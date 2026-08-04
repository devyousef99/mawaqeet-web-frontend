import type { NextConfig } from "next";

/**
 * Admin zone. Serves every /admin/* path.
 * assetPrefix keeps this zone's /_next assets from colliding with the other
 * zones' assets once the shell proxies them all onto one domain.
 */
const nextConfig: NextConfig = {
  assetPrefix: "/admin-static",
};

export default nextConfig;
