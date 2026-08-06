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
      `${name} is not set.\n\n` +
      `The shell proxies /admin and /provider to the other zones, so it cannot be ` +
      `deployed before it knows where they live. On a first deploy this is expected — ` +
      `the zones must exist first:\n\n` +
      `  1. Deploy the admin and provider projects (Root Directory apps/admin, apps/provider)\n` +
      `  2. Copy each one's deployment URL\n` +
      `  3. On THIS project, set:\n` +
      `       ADMIN_DOMAIN=https://<your-admin-project>.vercel.app\n` +
      `       PROVIDER_DOMAIN=https://<your-provider-project>.vercel.app\n` +
      `  4. Redeploy this project\n\n` +
      `Failing here is deliberate: building without these would produce a shell whose ` +
      `/admin and /provider routes proxy to localhost and break at runtime.`
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
