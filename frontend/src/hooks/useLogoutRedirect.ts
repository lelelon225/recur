import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearToken } from "@/services/authService";

const REDIRECT_DELAY_MS = 1200;

/**
 * Clears the token and holds on this page briefly so the user actually
 * sees why they're being sent to /login, instead of an instant, silent
 * redirect (see #145).
 */
export function useLogoutRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const expired = searchParams.get("reason") === "expired";

    useEffect(() => {
        clearToken();
        const timer = setTimeout(() => router.replace("/login"), REDIRECT_DELAY_MS);
        return () => clearTimeout(timer);
    }, [router]);

    return {
        title: expired ? "Sitzung abgelaufen" : "Abmeldung läuft…",
        description: "Du wirst weitergeleitet.",
    };
}
