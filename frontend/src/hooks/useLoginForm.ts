import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useLoginForm() {
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            await login({ email, password });
            navigate("/", { replace: true });
        } catch {
            // error wird bereits im AuthContext gesetzt
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isSubmitting,
        error,
        handleSubmit,
    };
}