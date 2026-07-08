import { useEffect, useRef, useState } from "react";
import { patchTask } from "@/services/taskService";
import type { Task } from "@/services/taskService";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/lib/toast";

function valuesChanged(values: Task, original: Task): boolean {
  return !(
    values.name === original.name &&
    values.description === original.description &&
    values.category === original.category &&
    values.frequency === original.frequency &&
    values.dateUntil === original.dateUntil?.slice(0, 10)
  );
}

type UseEditTaskFormParams = {
  task: Task;
  onClose: () => void;
  onTaskUpdated?: (task: Task) => void;
};

function useEditTaskForm({ task, onClose, onTaskUpdated }: UseEditTaskFormParams) {
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

    const handleSubmit = async (values: Task) => {
      if (!valuesChanged(values, task)) {
        showWarningToast("Keine Änderungen vorgenommen");
        return;
      }

      setLoading(true);

      try {
        const updatedTask = await patchTask(task.id, { task: values });
        showSuccessToast("Aufgabe erfolgreich aktualisiert");
        onTaskUpdated?.(updatedTask);

        setTimeout(() => {
          if (!isMountedRef.current) return;
          setLoading(false);
          onClose();
        }, 1500);
      } catch (err) {
        showErrorToast(err instanceof Error ? err.message : "Fehler beim Aktualisieren der Aufgabe");
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

  return { loading, handleSubmit };
}

export default useEditTaskForm;