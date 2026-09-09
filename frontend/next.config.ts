import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Equivalent of vite.config.ts server.allowedHosts — lets `yarn dev`
  // be reached through an ngrok tunnel in dev.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.app"],

  async rewrites() {
    const backend = "http://localhost:8080";
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      { source: "/oauth2/:path*", destination: `${backend}/oauth2/:path*` },
      // Only the OAuth2 callback path under /login, not /login itself —
      // /login is our own route (LoginPage). This rule is a strictly
      // longer/more specific match than any bare "/login" route, so it
      // does not intercept the SPA's login page.
      {
        source: "/login/oauth2/:path*",
        destination: `${backend}/login/oauth2/:path*`,
      },
    ];
  },
};

export default nextConfig;
