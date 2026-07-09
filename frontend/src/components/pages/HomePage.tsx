import { useMemo, useState } from "react";
import { FilePlus2 } from "lucide-react";
import InfoCard from "@/components/molecules/InfoCard";
import Empty from "@/components/molecules/Empty";
import { type SortOptions, sortTasks } from "@/utils/sortTasks";
import TaskCardGrid from "@/components/molecules/TaskCardGrid";
import Sorter from "@/components/atoms/Sorter";
import LoadingTime from "@/components/atoms/LoadingTime";
import { useAddTask } from "@/contexts/AddTaskContext";
import { useTasksContext } from "@/contexts/TasksContext";

function HomePage() {
  const {
    tasks,
    loading,
    error,
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
    return <LoadingTime loading={loading} />;
  }

  if (error) {
    return (
      <InfoCard
        variant="error"
        title="Fehler beim Abrufen der Aufgaben"
        description={error}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty
        icon={() => <FilePlus2 className="w-12 h-12 text-gray-400" />}
        title="Keine Habits"
        description="Es gibt derzeit keine Habits."
        buttonText="Habit erstellen"
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