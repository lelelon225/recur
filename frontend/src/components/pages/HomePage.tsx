import { useMemo, useState } from "react";
import { FilePlus2 } from "lucide-react";
import Empty from "@/components/molecules/Empty";
import { type SortOptions, sortTasks } from "@/utils/sortTasks";
import TaskCardGrid from "@/components/molecules/TaskCardGrid";
import Sorter from "@/components/atoms/Sorter";
import { useAddTask } from "@/contexts/AddTaskContext";
import { useTasksContext } from "@/contexts/TasksContext";
import TaskCardGridSkeleton from "../molecules/TaskCardGridSkeleton";

function HomePage() {
  const {
    tasks,
    loading,
    handleToggleFavorite,
    handleToggleArchive,
    handleResetProgress,
    handleDelete,
    handleToggleDone,
    handleUpdateTask,
  } = useTasksContext();

  const handlers = useMemo(
    () => ({
      onToggleFavorite: handleToggleFavorite,
      onToggleArchive: handleToggleArchive,
      onResetProgress: handleResetProgress,
      onDelete: handleDelete,
      onToggleDone: handleToggleDone,
      onTaskUpdated: handleUpdateTask,
    }),
    [
      handleToggleFavorite,
      handleToggleArchive,
      handleResetProgress,
      handleDelete,
      handleToggleDone,
      handleUpdateTask,
    ],
  );

  const [sortBy, setSortBy] = useState<SortOptions>("date descending");
  const { openAddTaskForm } = useAddTask();

  const sortedTasks = useMemo(() => sortTasks(tasks, sortBy), [tasks, sortBy]);

  if (loading) {
    return <TaskCardGridSkeleton count={6} direction="row" />;
  }

  if (tasks.length === 0) {
    return (
      <Empty
        icon={() => <FilePlus2 className="w-12 h-12 text-gray-400" />}
        title="Keine Aufgaben"
        description="Es gibt derzeit keine Aufgaben."
        buttonText="Aufgabe erstellen"
        onButtonClick={openAddTaskForm}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end">
        <Sorter sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <TaskCardGrid
        sortedTasks={sortedTasks}
        handlers={handlers}
        direction="row"
      />
    </div>
  );
}
export default HomePage;