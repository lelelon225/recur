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
  return NextResponse.rewrite(url);
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
