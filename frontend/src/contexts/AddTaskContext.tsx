import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import AddTaskForm from "@/components/organisms/AddTaskForm";
import type { Task } from "@/services/taskService";
import { useTasksContext } from "@/contexts/TasksContext";

type AddTaskContextValue = {
  openAddTaskForm: () => void;
};

const AddTaskContext = createContext<AddTaskContextValue | null>(null);

export function AddTaskProvider({ children }: { children: ReactNode }) {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const { addTask } = useTasksContext();

  const openAddTaskForm = useCallback(() => {
    setShowAddTaskForm(true);
  }, []);

  function handleClose() {
    setShowAddTaskForm(false);
  }

  function handleTaskCreated(task: Task) {
    addTask(task);
  }

  return (
    <AddTaskContext.Provider value={{ openAddTaskForm }}>
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