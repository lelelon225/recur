import { useEffect, useRef, useState } from "react";
import { createTask, type NewTask, type Task } from "../services/taskService";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/lib/toast";

function isFormEmpty(values: NewTask): boolean {
  return (
    !values.name ||
    !values.description ||
    !values.category ||
    !values.frequency ||
    !values.dateUntil
  );
}

type UseAddTaskFormParams = {
  onClose: () => void;
  onTaskCreated?: (task: Task) => void;
};

function useAddTaskForm({ onClose, onTaskCreated }: UseAddTaskFormParams) {
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

  const handleSubmit = async (values: NewTask) => {
    if (isFormEmpty(values)) {
      showWarningToast("Bitte füllen Sie alle erforderlichen Felder aus.");
      return;
    }

    setLoading(true);
    setSubmitDisabled(true);

    try {
      const createdTask = await createTask(values);
      showSuccessToast("Aufgabe erfolgreich erstellt.");
      onTaskCreated?.(createdTask);

      setTimeout(() => {
        if (!isMountedRef.current) return;
        setLoading(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      showErrorToast(err instanceof Error ? err.message : "Fehler beim Erstellen der Aufgabe.");
      if (isMountedRef.current) {
        setLoading(false);
        setSubmitDisabled(false);
      }
    }
  };

  return { loading, submitDisabled, handleSubmit, isFormEmpty };
}

export default useAddTaskForm;