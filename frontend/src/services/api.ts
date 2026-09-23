import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  withCredentials: true, // sendet HttpOnly access_token-/refresh_token-Cookies mit (#159, #160)
  // Axios schickt den XSRF-TOKEN-Cookie standardmässig nur same-origin als
  // X-XSRF-TOKEN-Header mit; Frontend und Backend liegen auf verschiedenen
  // Subdomains, also muss das für Cross-Origin-Requests erzwungen werden (#160).
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
