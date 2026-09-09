import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { deleteTask, getTasks, patchTask } from "@/services/taskService";
import { showErrorToast } from "@/lib/toast";
import { useAuth } from "@/contexts/AuthContext";
const TasksContext = createContext(null);
export function TasksProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showBoundary } = useErrorBoundary();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const tasksRef = useRef(tasks);
    useEffect(() => {
        tasksRef.current = tasks;
    }, [tasks]);
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedTasks = await getTasks();
            setTasks(fetchedTasks);
        }
        catch (err) {
            showBoundary(err);
        }
        finally {
            setLoading(false);
        }
    }, [showBoundary]);
    // Erst laden, sobald der AuthContext fertig gebootstrapped ist UND ein
    // gültiger User eingeloggt ist. Vorher/ohne Login gäbe es 401s, die den
    // ganzen Baum via showBoundary() crashen würden (z.B. auf /login selbst).
    useEffect(() => {
        if (isAuthLoading)
            return;
        if (!isAuthenticated) {
            setTasks([]);
            setLoading(false);
            return;
        }
        fetchTasks();
    }, [isAuthenticated, isAuthLoading, fetchTasks]);
    const addTask = useCallback((newTask) => {
        setTasks((prev) => [...prev, newTask]);
    }, []);
    const visibleTasks = useMemo(() => tasks.filter((t) => !t.isArchived), [tasks]);
    const favoriteTasks = useMemo(() => tasks.filter((t) => t.isFavorite && !t.isArchived), [tasks]);
    const archivedTasks = useMemo(() => tasks.filter((t) => t.isArchived), [tasks]);
    const handleToggleFavorite = useCallback(async (taskId) => {
        const task = tasksRef.current.find((t) => t.id === taskId);
        if (!task)
            return;
        const newFavorite = !task.isFavorite;
        const previousTasks = tasksRef.current;
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, isFavorite: newFavorite } : t)));
        await patchTask(taskId, { favorite: newFavorite }).catch((err) => {
            setTasks(previousTasks);
            showErrorToast(err instanceof Error ? err.message : "Fehler beim Aktualisieren des Favoritenstatus");
        });
    }, []);
    const handleToggleArchive = useCallback(async (taskId) => {
        const task = tasksRef.current.find((t) => t.id === taskId);
        if (!task)
            return;
        const newArchived = !task.isArchived;
        const previousTasks = tasksRef.current;
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, isArchived: newArchived } : t)));
        await patchTask(taskId, { archived: newArchived }).catch((err) => {
            setTasks(previousTasks);
            showErrorToast(err instanceof Error ? err.message : "Fehler beim Archivieren der Aufgabe");
        });
    }, []);
    const handleResetProgress = useCallback(async (taskId) => {
        const previousTasks = tasksRef.current;
        setTasks((prev) => prev.map((task) => task.id === taskId ? { ...task, amountDid: 0, progress: 0 } : task));
        await patchTask(taskId, { resetProgress: true, amountDid: 0 }).catch((err) => {
            setTasks(previousTasks);
            showErrorToast(err instanceof Error ? err.message : "Fehler beim Zurücksetzen des Fortschritts");
        });
    }, []);
    const handleDelete = useCallback(async (taskId) => {
        const previousTasks = tasksRef.current;
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        await deleteTask(taskId).catch((err) => {
            setTasks(previousTasks);
            showErrorToast(err instanceof Error ? err.message : "Fehler beim Löschen der Aufgabe");
        });
    }, []);
    const handleToggleDone = useCallback(async (taskId) => {
        const targetTask = tasksRef.current.find((task) => task.id === taskId);
        if (!targetTask)
            return;
        const newAmountDid = (targetTask.amountDid ?? 0) + 1;
        const previousTasks = tasksRef.current;
        setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, amountDid: newAmountDid } : task)));
        await patchTask(taskId, { amountDid: newAmountDid })
            .then((updatedTask) => {
            setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)));
        })
            .catch((err) => {
            setTasks(previousTasks);
            showErrorToast(err instanceof Error ? err.message : "Fehler beim Aktualisieren der erledigten Menge");
        });
    }, []);
    const handleUpdateTask = useCallback((updatedTask) => {
        setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    }, []);
    const value = {
        tasks: visibleTasks,
        loading,
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
