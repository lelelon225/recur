import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import {
    register as registerService,
    login as loginService,
    getCurrentUser,
    setToken,
    clearToken,
    isLoggedIn,
    logout as logoutService,
} from "../services/authService";
import type { UserResponse, RegisterRequest, LoginRequest } from "../types/auth";

type AuthContextValue = {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (request: LoginRequest) => Promise<void>;
    register: (request: RegisterRequest) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // On mount: if a valid token exists, fetch the current user
    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            if (!isLoggedIn()) {
                setIsLoading(false);
                return;
            }
            try {
                const currentUser = await getCurrentUser();
                if (!cancelled) setUser(currentUser);
            } catch {
                // token invalid/expired/backend unreachable — clear it, don't throw
                clearToken();
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        bootstrap();
        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async (request: LoginRequest) => {
        setError(null);
        try {
            const response = await loginService(request);
            setToken(response.token);
            setUser(response.user);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
            throw err;
        }
    }, []);

    const register = useCallback(async (request: RegisterRequest) => {
        setError(null);
        try {
            const response = await registerService(request);
            setToken(response.token);
            setUser(response.user);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Registration failed";
            setError(message);
            throw err;
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        logoutService(); // clears token + redirects to /login
    }, []);

    const value: AuthContextValue = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}