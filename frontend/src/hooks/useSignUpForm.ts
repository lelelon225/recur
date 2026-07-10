import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useSignUpForm() {
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            await register({ email, password, firstName, lastName });
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
        firstName,
        setFirstName,
        lastName,
        setLastName,
        isSubmitting,
        error,
        handleSubmit,
    };
}