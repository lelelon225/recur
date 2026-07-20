import { defineConfig, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Bei ngrok -> Vite -> Backend hat der Request zwei Proxy-Hops. ngrok
// terminiert TLS und setzt bereits X-Forwarded-Proto: https, X-Forwarded-Host:
// <ngrok-domain>. Vite selbst läuft nur über http, daher würde "xfwd: true"
// von node-http-proxy seinen EIGENEN (falschen) "http"-Wert an den bereits
// vorhandenen Header anhängen ("https,http"), was Spring's
// ForwardedHeaderFilter falsch interpretiert - das Backend baut die
// OAuth2-redirect_uri dann mit http:// statt https:// -> Google lehnt sie
// mit redirect_uri_mismatch ab.
// Fix: xfwd aus, Original-Header vom Client stattdessen explizit und
// einmalig durchreichen.
//
// Zusätzlicher Fix: x-forwarded-port wurde vorher hart auf 80/443 gesetzt,
// unabhängig vom tatsächlichen Port (z.B. 5173 bei lokalem Dev). Weil 80/443
// Standard-Ports sind, lässt Spring beim Zusammenbauen der redirect_uri den
// Port komplett weg -> "http://localhost/login/oauth2/code/google" statt
// "http://localhost:5173/login/oauth2/code/google" -> redirect_uri_mismatch.
// Fix: Port aus dem Host-Header extrahieren statt zu raten.
const backendProxy: ProxyOptions = {
  target: "http://localhost:8080",
  changeOrigin: true,
  secure: false,
  configure: (proxy) => {
    proxy.on("proxyReq", (proxyReq, req) => {
      const forwardedProto =
        (req.headers["x-forwarded-proto"] as string) || "http";
      const forwardedHost =
        (req.headers["x-forwarded-host"] as string) || req.headers.host || "";

      // Port aus dem Host-Header extrahieren (z.B. "localhost:5173" -> "5173").
      // Nur falls kein Port im Host steht (z.B. reines "example.com" bei
      // ngrok/Prod ohne expliziten Port), auf den Standard-Port zurückfallen.
      const hostParts = forwardedHost.split(":");
      const forwardedPort =
        hostParts.length > 1
          ? hostParts[1]
          : forwardedProto === "https"
          ? "443"
          : "80";

      proxyReq.setHeader("x-forwarded-proto", forwardedProto);
      proxyReq.setHeader("x-forwarded-host", forwardedHost);
      proxyReq.setHeader("x-forwarded-port", forwardedPort);
    });
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,

    allowedHosts: [".ngrok-free.dev", ".ngrok.app"],

    proxy: {
      "/api": backendProxy,
      "/oauth2": backendProxy,
      // Nur der OAuth2-Callback von Google muss ans Backend, NICHT "/login"
      // selbst - das ist unsere eigene SPA-Route (LoginPage). Ein zu weiter
      // Prefix-Match auf "/login" würde auch manuelle Aufrufe von /login
      // abfangen und ans Backend schicken, wo es dafür keinen Handler gibt
      // (-> 500 als JSON statt der Login-Seite).
      "/login/oauth2": backendProxy,
    },
  },
});
