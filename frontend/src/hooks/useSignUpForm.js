import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
function useSignUpForm() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [backendError, setBackendError] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const handleSubmit = async (values) => {
        setLoading(true);
        setSubmitDisabled(true);
        setBackendError(undefined);
        try {
            const { confirmPassword, ...request } = values;
            void confirmPassword;
            await register(request);
            navigate("/", { replace: true });
        }
        catch (error) {
            setBackendError(error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten");
        }
        finally {
            setLoading(false);
            setSubmitDisabled(false);
        }
    };
    return { handleSubmit, backendError, loading, submitDisabled };
}
export { useSignUpForm };
