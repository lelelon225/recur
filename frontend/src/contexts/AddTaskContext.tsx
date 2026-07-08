import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import AddTaskForm from "@/components/organisms/AddTaskForm";
import type { Task } from "@/services/taskService";

type TaskCreatedListener = (task: Task) => void;

type AddTaskContextValue = {
  openAddTaskForm: () => void;
  subscribeTaskCreated: (listener: TaskCreatedListener) => () => void;
};

const AddTaskContext = createContext<AddTaskContextValue | null>(null);

export function AddTaskProvider({ children }: { children: ReactNode }) {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const listenersRef = useRef<Set<TaskCreatedListener>>(new Set());

  const subscribeTaskCreated = useCallback((listener: TaskCreatedListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const openAddTaskForm = useCallback(() => {
    setShowAddTaskForm(true);
  }, []);

  function handleClose() {
    setShowAddTaskForm(false);
  }

  function handleTaskCreated(task: Task) {
    listenersRef.current.forEach((listener) => listener(task));
  }

  return (
    <AddTaskContext.Provider value={{ openAddTaskForm, subscribeTaskCreated }}>
      {children}
      {showAddTaskForm && (
        <AddTaskForm onClose={handleClose} onTaskCreated={handleTaskCreated} />
      )}
    </AddTaskContext.Provider>
  );
}

export function useAddTask() {
  const ctx = useContext(AddTaskContext);
  if (!ctx) {
    throw new Error("useAddTask muss innerhalb von AddTaskProvider verwendet werden");
  }
  return ctx;
}