import { useCallback, useEffect, useRef, useState } from "react";
import { patchTask } from "@/services/taskService";
import { showErrorToast, showSuccessToast, showWarningToast, } from "@/lib/toast";
function valuesChanged(values, original) {
    const normStr = (str) => str ?? "";
    const normDuration = (value) => value ?? null;
    const origDate = original.dateUntil ? original.dateUntil.slice(0, 10) : "";
    const valDate = values.dateUntil ? values.dateUntil.slice(0, 10) : "";
    const origStartDate = original.startTime
        ? original.startTime.slice(0, 10)
        : "";
    const valStartDate = values.startDate ? values.startDate.slice(0, 10) : "";
    const origStartTime = original.startTime
        ? new Date(original.startTime).toISOString()
        : "";
    const valStartTime = values.startDate && values.startTimeOfDay
        ? new Date(`${values.startDate}T${values.startTimeOfDay}`).toISOString()
        : "";
    return !(normStr(values.name) === normStr(original.name) &&
        normStr(values.description) === normStr(original.description) &&
        normStr(values.category) === normStr(original.category) &&
        normStr(values.frequency) === normStr(original.frequency) &&
        values.progress === original.progress &&
        normDuration(values.durationMinutes) ===
            normDuration(original.durationMinutes) &&
        valDate === origDate &&
        valStartDate === origStartDate &&
        valStartTime === origStartTime);
}
function useEditTaskForm({ task, onClose, onTaskUpdated, }) {
    const [loading, setLoading] = useState(false);
    const isMountedRef = useRef(true);
    const timeoutRef = useRef(null);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    const handleSubmit = useCallback(async (values) => {
        if (!valuesChanged(values, task)) {
            showWarningToast("Keine Änderungen vorgenommen");
            return;
        }
        setLoading(true);
        const startTimeIso = values.startDate && values.startTimeOfDay
            ? new Date(`${values.startDate}T${values.startTimeOfDay}`).toISOString()
            : null;
        const { startDate, startTimeOfDay, ...restValues } = values;
        const payload = {
            ...restValues,
            startTime: startTimeIso,
        };
        try {
            const updatedTask = await patchTask(task.id, { task: payload });
            showSuccessToast("Aufgabe erfolgreich aktualisiert");
            onTaskUpdated?.(updatedTask);
            timeoutRef.current = setTimeout(() => {
                if (!isMountedRef.current)
                    return;
                setLoading(false);
                onClose();
            }, 1500);
        }
        catch (err) {
            showErrorToast(err instanceof Error
                ? err.message
                : "Fehler beim Aktualisieren der Aufgabe");
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [task, onClose, onTaskUpdated]);
    return { loading, handleSubmit };
}
export default useEditTaskForm;
