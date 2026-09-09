import { useEffect, useRef, useState } from "react";
import { createTask, } from "@/services/taskService";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
function useAddTaskForm({ onClose, onTaskCreated }) {
    const [loading, setLoading] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const isMountedRef = useRef(true);
    useEffect(() => {
        // Explizit auf true setzen statt uns nur auf den useRef-Initialwert zu
        // verlassen: In React 18 Strict Mode (Dev) wird dieser Effect einmal
        // gemountet, sofort gecleant und dann erneut gemountet. Ohne dieses
        // Zurücksetzen bleibt isMountedRef nach dem Doppel-Invoke dauerhaft
        // "false", obwohl die Komponente aktiv ist - der Dialog würde dann nie
        // aus dem Loading-State herauskommen.
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    const handleSubmit = async (values) => {
        setLoading(true);
        setSubmitDisabled(true);
        const combined = new Date(`${values.startDate}T${values.startTimeOfDay}`);
        const startTimeIso = combined.toISOString();
        const payload = {
            name: values.name,
            description: values.description,
            category: values.category,
            frequency: values.frequency,
            dateUntil: values.dateUntil,
            progress: 0,
            durationMinutes: Number(values.durationMinutes),
            startTime: startTimeIso,
        };
        try {
            const createdTask = await createTask(payload);
            showSuccessToast("Aufgabe erfolgreich erstellt.");
            onTaskCreated?.(createdTask);
            setTimeout(() => {
                if (!isMountedRef.current)
                    return;
                setLoading(false);
                onClose();
            }, 1500);
        }
        catch (err) {
            showErrorToast(err instanceof Error
                ? err.message
                : "Fehler beim Erstellen der Aufgabe.");
            if (isMountedRef.current) {
                setLoading(false);
                setSubmitDisabled(false);
            }
        }
    };
    return { loading, submitDisabled, handleSubmit };
}
export default useAddTaskForm;
