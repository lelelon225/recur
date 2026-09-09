import api from "./api";
export async function register(request) {
    return await api
        .post("/auth/register", request)
        .then((response) => response.data)
        .catch((error) => {
        throw new Error(error?.response?.data?.message ?? "Registration failed");
    });
}
export async function login(request) {
    return await api
        .post("/auth/login", request)
        .then((response) => response.data)
        .catch((error) => {
        throw new Error(error?.response?.data?.message ?? "Login failed");
    });
}
export async function getCurrentUser() {
    return await api
        .get("/auth/me")
        .then((response) => response.data)
        .catch((error) => {
        throw new Error(error?.response?.data?.message ?? "Failed to fetch current user");
    });
}
export function setToken(token) {
    localStorage.setItem("authToken", token);
}
export function getToken() {
    return localStorage.getItem("authToken");
}
export function clearToken() {
    localStorage.removeItem("authToken");
}
export function isLoggedIn() {
    const token = getToken();
    try {
        if (!token)
            return false;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        return exp > currentTime;
    }
    catch (error) {
        console.error("Error checking login status:", error);
        return false;
    }
}
export function logout() {
    clearToken();
    window.location.href = "/login";
}
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export function patchUser(user) {
    return api
        .patch("/auth/me", user)
        .then((response) => response.data)
        .catch((error) => {
        throw new Error(error?.response?.data?.message ?? "Failed to update user");
    });
}
/**
 * A 401 from any endpoint other than login/register means our token is
 * missing, expired, or invalid. Clear it and send the user to /login
 * instead of leaving the app in a half-authenticated state.
 */
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/me"];
api.interceptors.response.use((response) => response, (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;
    const isAuthEndpoint = url
        ? AUTH_ENDPOINTS.some((path) => url.includes(path))
        : false;
    if (status === 401 && !isAuthEndpoint) {
        clearToken();
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }
    return Promise.reject(error);
});
