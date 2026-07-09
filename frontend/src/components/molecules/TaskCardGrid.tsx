import TaskCard from "@/components/organisms/TaskCard";
import { type Task } from "@/services/taskService";
import { cn } from "@/lib/utils";

type TaskCardHandlers = {
  onToggleFavorite?: (taskId: string) => void;
  onToggleMenu?: (taskId: string) => void;
  onToggleArchive?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onResetProgress?: (taskId: string) => void;
  onToggleDone?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onTaskUpdated?: (task: Task) => void;
  onToggleSelect?: (taskId: string) => void;
};

type TaskCardGridProps = {
  sortedTasks: Task[];
  direction?: "row" | "column";
  handlers: TaskCardHandlers;
  selectMode?: boolean;
  selectedIds?: Set<string>;
};

function TaskCardGrid({
  sortedTasks,
  handlers,
  direction,
  selectMode = false,
  selectedIds,
}: TaskCardGridProps) {
  return (
    <div
      className={cn(
        "grid w-full gap-4 p-4",
        direction === "column"
          ? "grid-cols-1"
          : "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleFavorite={() => handlers.onToggleFavorite?.(task.id)}
          onToggleMenu={() => handlers.onToggleMenu?.(task.id)}
          onToggleArchive={() => handlers.onToggleArchive?.(task.id)}
          onResetProgress={() => handlers.onResetProgress?.(task.id)}
          onDelete={() => handlers.onDelete?.(task.id)}
          onToggleEdit={() => handlers.onEdit?.(task.id)}
          onToggleDone={() => handlers.onToggleDone?.(task.id)}
          onTaskUpdated={handlers.onTaskUpdated}
          selectMode={selectMode}
          selected={selectedIds?.has(task.id) ?? false}
          onToggleSelect={() => handlers.onToggleSelect?.(task.id)}
        />
      ))}
    </div>
  );
}

export default TaskCardGrid;