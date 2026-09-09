import TaskCard from "@/components/organisms/TaskCard";
import ReactErrorBoundary from "@/components/error/ReactErrorBoundary";
import { cn } from "@/lib/utils";
function TaskCardGrid({ sortedTasks, handlers, direction, selectMode = false, selectedIds, }) {
    return (<div className={cn("grid w-full gap-4 p-4", direction === "column"
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
      {sortedTasks.map((task) => (<ReactErrorBoundary key={task.id} variant="inline" errorMessage="Dieses Habit konnte nicht angezeigt werden.">
          <TaskCard task={task} onToggleFavorite={() => handlers.onToggleFavorite?.(task.id)} onToggleMenu={() => handlers.onToggleMenu?.(task.id)} onToggleArchive={() => handlers.onToggleArchive?.(task.id)} onResetProgress={() => handlers.onResetProgress?.(task.id)} onDelete={() => handlers.onDelete?.(task.id)} onToggleEdit={() => handlers.onEdit?.(task.id)} onToggleDone={() => handlers.onToggleDone?.(task.id)} onTaskUpdated={handlers.onTaskUpdated} selectMode={selectMode} selected={selectedIds?.has(task.id) ?? false} onToggleSelect={() => handlers.onToggleSelect?.(task.id)}/>
        </ReactErrorBoundary>))}
    </div>);
}
export default TaskCardGrid;
