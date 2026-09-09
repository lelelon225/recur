import { createContext, useContext, useState, useEffect, useCallback, } from "react";
import { register as registerService, login as loginService, getCurrentUser, setToken, clearToken, isLoggedIn, logout as logoutService, } from "../services/authService";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let cancelled = false;
        async function bootstrap() {
            if (!isLoggedIn()) {
                setIsLoading(false);
                return;
            }
            try {
                const currentUser = await getCurrentUser();
                if (!cancelled)
                    setUser(currentUser);
            }
            catch {
                clearToken();
                if (!cancelled)
                    setUser(null);
            }
            finally {
                if (!cancelled)
                    setIsLoading(false);
            }
        }
        bootstrap();
        return () => {
            cancelled = true;
        };
    }, []);
    const login = useCallback(async (request) => {
        setError(null);
        try {
            const response = await loginService(request);
            setToken(response.token);
            setUser(response.user);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
            throw err;
        }
    }, []);
    const register = useCallback(async (request) => {
        setError(null);
        try {
            const response = await registerService(request);
            setToken(response.token);
            setUser(response.user);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Registration failed";
            setError(message);
            throw err;
        }
    }, []);
    const completeOAuthLogin = useCallback(async (token) => {
        setError(null);
        try {
            setToken(token);
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        }
        catch (err) {
            clearToken();
            const message = err instanceof Error ? err.message : "Google-Login fehlgeschlagen";
            setError(message);
            throw err;
        }
    }, []);
    const logout = useCallback(() => {
        setUser(null);
        logoutService();
    }, []);
    const value = {
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
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
