import { NextResponse, type NextRequest } from "next/server";

// next.config.ts's rewrites() is resolved once at `next build` time and its
// destination gets frozen into .next/routes-manifest.json - reading
// process.env.BACKEND_URL there only ever sees the *build* container's
// environment, never the one passed to `docker run`. This proxy runs as
// real server code on every request instead, so BACKEND_URL is read fresh
// at request time - the actual replacement for nginx's ${BACKEND_HOST}
// template substitution, not next.config.ts's rewrites().
export default function proxy(request: NextRequest) {
  const backend = process.env.BACKEND_URL ?? "http://localhost:8080";
  const { pathname, search } = request.nextUrl;
  const url = new URL(pathname + search, backend);

  // Rewriting to an absolute URL replaces the Host header with the
  // backend's own address, so without these the backend has no way to
  // know the public origin it's actually being reached through - Spring's
  // OAuth2 redirect-uri templating ({baseUrl}/login/oauth2/code/{id})
  // would otherwise resolve to the internal backend address instead of
  // the public one, breaking Google's redirect_uri check.
  const headers = new Headers(request.headers);
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  headers.set("x-forwarded-host", forwardedHost);
  headers.set("x-forwarded-proto", request.headers.get("x-forwarded-proto") ?? "https");
  // Next's own rewrite machinery sets x-forwarded-port to the port this
  // container's dev server is actually listening on (e.g. 3000), which
  // Spring then appends to the host above, producing a public-facing
  // redirect_uri with a stray internal port baked in. forwardedHost only
  // carries its own port when the original request explicitly had one
  // (e.g. local dev), so only keep x-forwarded-port then - otherwise drop
  // it and let the scheme's default port apply.
  if (!forwardedHost.includes(":")) {
    headers.delete("x-forwarded-port");
  }

  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: [
    "/api/:path*",
    "/oauth2/:path*",
    // Only the OAuth2 callback path under /login, not /login itself -
    // /login is our own route (LoginPage). This matcher is strictly more
    // specific than the bare "/login" route, so it doesn't intercept it.
    "/login/oauth2/:path*",
  ],
};
