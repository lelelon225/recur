import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { deleteTask, getTasks, patchTask } from "@/services/taskService";
import type { Task } from "@/services/taskService";
import { showErrorToast } from "@/lib/toast";

type TasksContextValue = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  favoriteTasks: Task[];
  archivedTasks: Task[];
  addTask: (newTask: Task) => void;
  handleToggleFavorite: (taskId: string) => Promise<void>;
  handleToggleArchive: (taskId: string) => Promise<void>;
  handleResetProgress: (taskId: string) => Promise<void>;
  handleDelete: (taskId: string) => Promise<void>;
  handleToggleDone: (taskId: string) => Promise<void>;
  handleUpdateTask: (updatedTask: Task) => void;
  fetchTasks: () => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const addTask = useCallback((newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const visibleTasks = useMemo(() => tasks.filter((t) => !t.isArchived), [tasks]);
  const favoriteTasks = useMemo(
    () => tasks.filter((t) => t.isFavorite && !t.isArchived),
    [tasks]
  );
  const archivedTasks = useMemo(() => tasks.filter((t) => t.isArchived), [tasks]);

  const handleToggleFavorite = useCallback(async (taskId: string) => {
    const task = tasksRef.current.find((t) => t.id === taskId);
    if (!task) return;
    const newFavorite = !task.isFavorite;

    const previousTasks = tasksRef.current;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isFavorite: newFavorite } : t))
    );

    await patchTask(taskId, { favorite: newFavorite }).catch((err) => {
      setTasks(previousTasks);
      showErrorToast(err instanceof Error ? err.message : "Fehler beim Aktualisieren des Favoritenstatus");
    });
  }, []);

  const handleToggleArchive = useCallback(async (taskId: string) => {
    const task = tasksRef.current.find((t) => t.id === taskId);
    if (!task) return;
    const newArchived = !task.isArchived;

    const previousTasks = tasksRef.current;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isArchived: newArchived } : t))
    );

    await patchTask(taskId, { archived: newArchived }).catch((err) => {
      setTasks(previousTasks);
      showErrorToast(err instanceof Error ? err.message : "Fehler beim Archivieren der Aufgabe");
    });
  }, []);

  const handleResetProgress = useCallback(async (taskId: string) => {
    const previousTasks = tasksRef.current;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, amountDid: 0, progress: 0 } : task
      )
    );

    await patchTask(taskId, { resetProgress: true, amountDid: 0 }).catch((err) => {
      setTasks(previousTasks);
      showErrorToast(err instanceof Error ? err.message : "Fehler beim Zurücksetzen des Fortschritts");
    });
  }, []);

  const handleDelete = useCallback(async (taskId: string) => {
    const previousTasks = tasksRef.current;
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    await deleteTask(taskId).catch((err) => {
      setTasks(previousTasks);
      showErrorToast(err instanceof Error ? err.message : "Fehler beim Löschen der Aufgabe");
    });
  }, []);

  const handleToggleDone = useCallback(async (taskId: string) => {
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
        showErrorToast(err instanceof Error ? err.message : "Fehler beim Aktualisieren der erledigten Menge");
      });
  }, []);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  }, []);

  const value: TasksContextValue = {
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

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error("useTasksContext muss innerhalb von TasksProvider verwendet werden");
  }
  return ctx;
}