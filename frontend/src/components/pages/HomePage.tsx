import { useMemo, useState } from "react";
import InfoCard from "../molecules/InfoCard";
import LoadingTime from "../atoms/LoadingTime";
import TaskCardGrid from "../molecules/TaskCardGrid";
import Sorter from "../atoms/Sorter";
import Empty from "../molecules/Empty";
import { FilePlus2 } from "lucide-react";
import { useAddTask } from "@/contexts/AddTaskContext";
import { useTasks } from "@/hooks/useTasks";
import { type SortOptions, sortTasks } from "@/utils/sortTasks";

const noop = () => {};

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
  } = useTasks();

  const handlers = useMemo(
    () => ({
      onToggleFavorite: handleToggleFavorite,
      onToggleMenu: noop,
      onToggleArchive: handleToggleArchive,
      onResetProgress: handleResetProgress,
      onDelete: handleDelete,
      onToggleDone: handleToggleDone,
      onEdit: noop,
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
        icon={() => <FilePlus2 />}
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