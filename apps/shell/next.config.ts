import type { NextConfig } from "next";

/**
 * Shell / host zone.
 *
 * Owns the shared entry routes (/, /login) and proxies every other path to the
 * zone that serves it, so all three apps appear on one domain. As the default
 * zone it needs no assetPrefix of its own — but it must forward each zone's
 * prefixed asset path so their JS/CSS resolve.
 *
 * Set ADMIN_DOMAIN / PROVIDER_DOMAIN per environment; the localhost values are
 * the dev ports from each app's package.json.
 */
const ADMIN = process.env.ADMIN_DOMAIN ?? "http://localhost:4101";
const PROVIDER = process.env.PROVIDER_DOMAIN ?? "http://localhost:4102";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/admin", destination: `${ADMIN}/admin` },
      { source: "/admin/:path+", destination: `${ADMIN}/admin/:path+` },
      { source: "/admin-static/:path+", destination: `${ADMIN}/admin-static/:path+` },

      { source: "/provider", destination: `${PROVIDER}/provider` },
      { source: "/provider/:path+", destination: `${PROVIDER}/provider/:path+` },
      { source: "/provider-static/:path+", destination: `${PROVIDER}/provider-static/:path+` },
    ];
  },
};

export default nextConfig;
