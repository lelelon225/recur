import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
function useLoginForm() {
    const [backendError, setBackendError] = useState(undefined);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        setLoading(true);
        setBackendError(undefined);
        setSubmitDisabled(true);
        try {
            await login(values);
            navigate("/", { replace: true });
        }
        catch (error) {
            setBackendError(error instanceof Error
                ? "Ungültige E-Mail oder Passwort"
                : "Ein unbekannter Fehler ist aufgetreten");
        }
        finally {
            setLoading(false);
            setSubmitDisabled(false);
        }
    };
    return { handleSubmit, backendError, loading, submitDisabled };
}
export { useLoginForm };
