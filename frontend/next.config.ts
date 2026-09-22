import type { NextConfig } from "next";
import withPWAInit, { runtimeCaching as defaultRuntimeCaching } from "@ducanh2912/next-pwa";

// next-pwa's default runtimeCaching NetworkFirst-caches any same-origin GET,
// including our /api, /oauth2, /login/oauth2 backend-proxy routes (see
// src/proxy.ts) - that means live task data and OAuth redirects could be
// served stale from cache. These three prefixes are prepended as NetworkOnly
// so they're matched (and excluded from caching) before the defaults below.
const BACKEND_PROXY_PREFIXES = ["/api", "/oauth2", "/login/oauth2"];

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  // No SW in dev - HMR + a service worker fighting over cached assets is
  // more trouble than it's worth locally.
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: ({ url, sameOrigin }) =>
          sameOrigin && BACKEND_PROXY_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)),
        handler: "NetworkOnly",
      },
      ...defaultRuntimeCaching,
    ],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Next 16's dev server auto-generates AGENTS.md/CLAUDE.md in this
  // directory otherwise, which collides with the repo's own hand-maintained
  // root CLAUDE.md and just adds noise on every `yarn dev`.
  agentRules: false,

  // Standalone output for a small production Docker image (server.js +
  // a pruned node_modules) - see frontend/Dockerfile.
  output: "standalone",

  // Equivalent of vite.config.ts server.allowedHosts — lets `yarn dev`
  // be reached through an ngrok tunnel in dev.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.app"],

  // The /api, /oauth2, and /login/oauth2 backend proxy used to live here
  // as rewrites() - moved to src/proxy.ts because rewrites() is resolved
  // once at `next build` time (frozen into .next/routes-manifest.json),
  // which can't read a per-container BACKEND_URL supplied at `docker run`
  // time. See src/proxy.ts for the actual proxy logic.
};

export default withPWA(nextConfig);
