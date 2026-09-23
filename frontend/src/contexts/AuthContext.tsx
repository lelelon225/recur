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
    completeOAuthLogin: () => Promise<void>;
    logout: () => void;
};


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Der Access-Token liegt in einem HttpOnly-Cookie (#160) und ist per JS
        // nicht lesbar - ob eine Session besteht, kann nur der Server sagen.
        async function bootstrap() {
            try {
                const currentUser = await getCurrentUser();
                if (!cancelled) setUser(currentUser);
            } catch {
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
            setUser(response.user);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
            throw err;
        }
    }, []);

    // E-Mail-Verifizierung ist temporär umgangen (#128) - Registrierung
    // startet direkt eine Session wie vor #110 (siehe AuthService#register
    // im Backend).
    const register = useCallback(async (request: RegisterRequest) => {
        setError(null);
        try {
            const response = await registerService(request);
            setUser(response.user);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Registration failed";
            setError(message);
            throw err;
        }
    }, []);

    // Access-Token wurde bereits von exchangeOAuth2Token als HttpOnly-Cookie
    // gesetzt (#160) - hier nur noch den User nachladen.
    const completeOAuthLogin = useCallback(async () => {
        setError(null);
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Google-Login fehlgeschlagen";
            setError(message);
            throw err;
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        logoutService();
    }, []);

    const value: AuthContextValue = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        completeOAuthLogin,
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