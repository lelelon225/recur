import { createContext, useCallback, useContext, useState, } from "react";
import AddTaskForm from "@/components/organisms/AddTaskForm";
import { useTasksContext } from "@/contexts/TasksContext";
const AddTaskContext = createContext(null);
export function AddTaskProvider({ children }) {
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [prefill, setPrefill] = useState(null);
    const { addTask } = useTasksContext();
    const openAddTaskForm = useCallback((newPrefill) => {
        setPrefill(newPrefill ?? null);
        setShowAddTaskForm(true);
    }, []);
    function handleClose() {
        setShowAddTaskForm(false);
        setPrefill(null);
    }
    function handleTaskCreated(task) {
        addTask(task);
    }
    return (<AddTaskContext.Provider value={{ openAddTaskForm }}>
      {children}
      {showAddTaskForm && (<AddTaskForm onClose={handleClose} onTaskCreated={handleTaskCreated} prefill={prefill ?? undefined}/>)}
    </AddTaskContext.Provider>);
}
export function useAddTask() {
    const ctx = useContext(AddTaskContext);
    if (!ctx) {
        throw new Error("useAddTask muss innerhalb von AddTaskProvider verwendet werden");
    }
    return ctx;
}
