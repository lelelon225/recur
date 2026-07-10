import api from "./api";
import {
    type UserResponse,
    type AuthResponse,
    type RegisterRequest,
    type LoginRequest,
} from "../types/auth";


export async function register(request: RegisterRequest): Promise<AuthResponse> {
    return await api
        .post("/auth/register", request)
        .then((response) => response.data as AuthResponse)
        .catch((error) => {
            throw new Error(error?.response?.data?.message ?? "Registration failed");
        });
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
    return await api
        .post("/auth/login", request)
        .then((response) => response.data as AuthResponse)
        .catch((error) => {
            throw new Error(error?.response?.data?.message ?? "Login failed");
        });
}

export async function getCurrentUser(): Promise<UserResponse> {
    return await api
        .get("/auth/me")
        .then((response) => response.data as UserResponse)
        .catch((error) => {
            throw new Error(error?.response?.data?.message ?? "Failed to fetch current user");
        });
}

export function setToken(token: string): void {
    localStorage.setItem("authToken", token);
}

export function getToken(): string | null {
    return localStorage.getItem("authToken");
}

export function clearToken(): void {
    localStorage.removeItem("authToken");
}

export function isLoggedIn(): boolean {
    const token = getToken();
    try {
        if (!token) return false;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        return exp > currentTime;
    } catch (error) {
        console.error("Error checking login status:", error);
        return false;
    }
}

export function logout(): void {
    clearToken();
    window.location.href = "/login";
}

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);