import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTasks, patchTask, deleteTask, type Task } from "../services/taskService";
import { useAddTask } from "@/contexts/AddTaskContext";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subscribeTaskCreated } = useAddTask();

  const tasksRef = useRef<Task[]>(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unbekannter Fehler beim Abrufen der Aufgaben"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  function addTask(newTask: Task) {
    setTasks((prev) => [...prev, newTask]);
  }

  useEffect(() => {
    return subscribeTaskCreated((task) => addTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeTaskCreated]);

  const visibleTasks = useMemo(() => tasks.filter((t) => !t.isArchived), [tasks]);
  const favoriteTasks = useMemo(
    () => tasks.filter((t) => t.isFavorite && !t.isArchived),
    [tasks]
  );
  const archivedTasks = useMemo(() => tasks.filter((t) => t.isArchived), [tasks]);

  async function handleToggleFavorite(taskId: string) {
    const task = tasksRef.current.find((t) => t.id === taskId);
    if (!task) return;
    const newFavorite = !task.isFavorite;

    const previousTasks = tasksRef.current;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isFavorite: newFavorite } : t))
    );

    await patchTask(taskId, { favorite: newFavorite }).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Aktualisieren des Favoritenstatus", err);
    });
  }

  async function handleToggleArchive(taskId: string) {
    const task = tasksRef.current.find((t) => t.id === taskId);
    if (!task) return;
    const newArchived = !task.isArchived;

    const previousTasks = tasksRef.current;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isArchived: newArchived } : t))
    );

    await patchTask(taskId, { archived: newArchived }).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Archivieren der Aufgabe", err);
    });
  }

  async function handleResetProgress(taskId: string) {
    const previousTasks = tasksRef.current;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, amountDid: 0, progress: 0 } : task
      )
    );

    await patchTask(taskId, { resetProgress: true, amountDid: 0 }).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Zurücksetzen des Fortschritts", err);
    });
  }

  async function handleDelete(taskId: string) {
    const previousTasks = tasksRef.current;
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    await deleteTask(taskId).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Löschen der Aufgabe", err);
    });
  }

  async function handleToggleDone(taskId: string) {
    const targetTask = tasksRef.current.find((task) => task.id === taskId);
    if (!targetTask) return;

    const newAmountDid = (targetTask.amountDid ?? 0) + 1;
    const previousTasks = tasksRef.current;

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, amountDid: newAmountDid } : task))
    );

    await patchTask(taskId, { amountDid: newAmountDid })
      .then((updatedTask) => {
        setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)));
      })
      .catch((err) => {
        setTasks(previousTasks);
        console.error("Fehler beim Aktualisieren der erledigten Menge", err);
      });
  }

  function handleUpdateTask(updatedTask: Task) {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  }

  return {
    tasks: visibleTasks,
    loading,
    error,
    favoriteTasks,
    archivedTasks,
    addTask,
    handleToggleFavorite,
    handleToggleArchive,
    handleResetProgress,
    handleDelete,
    handleToggleDone,
    handleUpdateTask,
    fetchTasks,
  };
}