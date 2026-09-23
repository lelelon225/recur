import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  withCredentials: true, // sendet HttpOnly access_token-/refresh_token-Cookies mit (#159, #160)
  headers: {
    "Content-Type": "application/json",
  },
});

// CSRF-Token wird nicht mehr per Axios' withXSRFToken aus document.cookie
// gelesen, sondern aus dem X-XSRF-TOKEN-Response-Header übernommen, den
// CsrfCookieFilter (SecurityConfig.java) auf jede Response setzt. Der Header
// spiegelt exakt das Cookie, das der Browser dem Server gerade geschickt hat -
// ein Auseinanderlaufen zwischen dem von JS gelesenen und dem tatsächlich
// gesendeten Cookie (z.B. durch ein zweites Cookie mit anderem Path/Domain)
// konnte sonst zu einem 403-Double-Submit-Mismatch führen, den kein Retry
// beheben konnte, siehe authService.ts.
let csrfToken: string | null = null;

api.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers.set("X-XSRF-TOKEN", csrfToken);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const header = response.headers["x-xsrf-token"];
    if (header) csrfToken = header;
    return response;
  },
  (error) => {
    const header = error?.response?.headers?.["x-xsrf-token"];
    if (header) csrfToken = header;
    return Promise.reject(error);
  }
);

export default api;
