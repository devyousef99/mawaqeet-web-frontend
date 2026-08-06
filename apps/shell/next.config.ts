import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import type { NextConfig } from "next";

/**
 * Shell — the default microfrontend. Owns "/" and "/login".
 *
 * Routing to the admin and provider apps is declared in microfrontends.json and
 * handled by Vercel Microfrontends, so this config carries no rewrites of its
 * own. Do not add basePath (unsupported) or a manual assetPrefix
 * (withMicrofrontends handles asset routing).
 */
const nextConfig: NextConfig = {};

export default withMicrofrontends(nextConfig);
