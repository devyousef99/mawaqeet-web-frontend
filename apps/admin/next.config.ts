import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import type { NextConfig } from "next";

/**
 * Admin microfrontend. Serves every /admin/* path.
 *
 * Asset prefixing is handled by withMicrofrontends — do not set assetPrefix
 * manually, and do not add basePath (unsupported with Vercel Microfrontends).
 */
const nextConfig: NextConfig = {};

export default withMicrofrontends(nextConfig);
