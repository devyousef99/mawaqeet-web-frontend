import type { NextConfig } from "next";

/**
 * Shell / host zone.
 *
 * Owns the shared entry routes (/, /login) and proxies every other path to the
 * zone that serves it, so all three apps appear on one domain. As the default
 * zone it needs no assetPrefix of its own — but it must forward each zone's
 * prefixed asset path so their JS/CSS resolve.
 *
 * Set ADMIN_DOMAIN / PROVIDER_DOMAIN per environment. They fall back to the dev
 * ports from each app's package.json for local work, but a production build that
 * silently kept localhost would proxy into the void — so require them there.
 */
const isProd = process.env.NODE_ENV === "production";

function zoneOrigin(name: "ADMIN_DOMAIN" | "PROVIDER_DOMAIN", devFallback: string) {
  const value = process.env[name];
  if (value) return value.replace(/\/$/, "");
  if (isProd) {
    throw new Error(
      `${name} is not set. The shell proxies /admin and /provider to the other ` +
      `zones, so each zone's deployment URL must be configured in this project's ` +
      `environment variables (e.g. https://mawaqeet-admin.vercel.app).`
    );
  }
  return devFallback;
}

const ADMIN = zoneOrigin("ADMIN_DOMAIN", "http://localhost:4101");
const PROVIDER = zoneOrigin("PROVIDER_DOMAIN", "http://localhost:4102");

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
