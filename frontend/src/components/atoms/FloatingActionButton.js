import { Button } from "@/components/ui/button";
import { useAddTask } from "@/contexts/AddTaskContext";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
function FloatingActionButton({ onClick, className }) {
    const { openAddTaskForm } = useAddTask();
    return (<Button size="icon" onClick={() => (onClick ? onClick() : openAddTaskForm())} className={cn(className, "z-10 h-18 w-18 sm:h-14 sm:w-14 rounded-full shadow-lg shrink-0")}>
      <Plus className="h-6 w-6 sm:h-7 sm:w-7"/>
    </Button>);
}
export default FloatingActionButton;
