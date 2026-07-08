import InfoCard from "@/components/molecules/InfoCard";
import LoadingTime from "@/components/atoms/LoadingTime";
import Empty from "@/components/molecules/Empty";
import { OctagonXIcon } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useMemo } from "react";
import TaskCardGrid from "@/components/molecules/TaskCardGrid";

const noop = () => {};

function FavoritesPage() {
  const {
    loading,
    favoriteTasks,
    error,
    handleToggleFavorite,
    handleToggleArchive,
    handleDelete,
  } = useTasks();

  const handlers = useMemo(
    () => ({
      onToggleFavorite: handleToggleFavorite,
      onToggleMenu: noop,
      onToggleArchive: handleToggleArchive,
      onTaskUpdated: noop,
      onResetProgress: noop,
      onDelete: handleDelete,
      onToggleDone: noop,
      onEdit: noop,
    }),
    [handleToggleFavorite, handleToggleArchive, handleDelete],
  );

  if (loading) {
    return <LoadingTime loading={loading} />;
  }

  if (error) {
    return (
      <InfoCard
        variant="error"
        title="Fehler beim Abrufen der Favoriten"
        description={error}
      />
    );
  }

  if (favoriteTasks.length === 0) {
    return (
      <Empty
        icon={() => <OctagonXIcon className="w-12 h-12 text-gray-400" />}
        title="Keine favorisierten Habits"
        description="Es gibt derzeit keine favorisierten Habits."
        buttonText="Zurück zu den Habits"
        onButtonClick={() => window.location.assign("/")}
      />
    );
  }

  return (
    <div>
      <TaskCardGrid
        sortedTasks={favoriteTasks}
        handlers={handlers}
        direction="row"
      />
    </div>
  );
}

export default FavoritesPage;