import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type OAuthCallbackStatus = "loading" | "error";

export function useOAuthCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { completeOAuthLogin } = useAuth();

    const [status, setStatus] = useState<OAuthCallbackStatus>("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setErrorMessage("Kein Token in der Antwort von Google erhalten.");
            return;
        }

        completeOAuthLogin(token)
            .then(() => router.replace("/"))
            .catch((err) => {
                setStatus("error");
                setErrorMessage(err instanceof Error ? err.message : "Google-Login fehlgeschlagen.");
            });
    }, [searchParams, completeOAuthLogin, router]);

    return { status, errorMessage };
}