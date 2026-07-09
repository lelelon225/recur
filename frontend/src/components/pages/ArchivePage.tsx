import InfoCard from "@/components/molecules/InfoCard";
import LoadingTime from "@/components/atoms/LoadingTime";
import Empty from "@/components/molecules/Empty";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import ArchiveSelectionToolbar from "@/components/molecules/ArchiveSelectionToolbar";
import { OctagonXIcon } from "lucide-react";
import { useTasksContext } from "@/contexts/TasksContext";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TaskCardGrid from "@/components/molecules/TaskCardGrid";
import useArchiveSelection from "@/hooks/useArchiveSelection";

function ArchivePage() {
  const navigate = useNavigate();

  const {
    archivedTasks,
    loading,
    error,
    handleToggleFavorite,
    handleToggleArchive,
    handleDelete,
  } = useTasksContext();

  const archivedTaskIds = useMemo(() => archivedTasks.map((task) => task.id), [archivedTasks]);

  const {
    selectMode,
    selectedIds,
    selectedCount,
    allSelected,
    toggleSelect,
    enterSelectMode,
    exitSelectMode,
    toggleAllSelected,
    confirmBulkDeleteOpen,
    requestBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
  } = useArchiveSelection({ taskIds: archivedTaskIds, onDelete: handleDelete });

  const handlers = useMemo(
    () => ({
      onToggleFavorite: handleToggleFavorite,
      onToggleArchive: handleToggleArchive,
      onDelete: handleDelete,
      onToggleSelect: toggleSelect,
    }),
    [handleToggleFavorite, handleToggleArchive, handleDelete, toggleSelect],
  );

  if (loading) return <LoadingTime loading={loading} />;
  if (error) return (
    <InfoCard variant="error" title="Fehler beim Abrufen der archivierten Aufgaben" description={error} />
  );

  if (archivedTasks.length === 0) {
    return (
      <Empty
        title="Keine archivierten Habits"
        description="Es gibt derzeit keine archivierten Habits."
        buttonText="Zurück zu den Habits"
        onButtonClick={() => navigate("/")}
        icon={() => <OctagonXIcon className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="w-full pb-20">
      <ConfirmDialog
        severity="high"
        question="Habits löschen"
        description={`Sind Sie sicher, dass Sie ${selectedCount} ${selectedCount === 1 ? "Habit" : "Habits"} löschen möchten? Dies kann nicht rückgängig gemacht werden.`}
        open={confirmBulkDeleteOpen}
        onOpenChange={(next) => !next && cancelBulkDelete()}
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
        confirmText="Löschen"
        cancelText="Abbrechen"
      />

      <ArchiveSelectionToolbar
        selectMode={selectMode}
        selectedCount={selectedCount}
        allSelected={allSelected}
        onEnterSelectMode={enterSelectMode}
        onExitSelectMode={exitSelectMode}
        onToggleAllSelected={toggleAllSelected}
        onRequestBulkDelete={requestBulkDelete}
      />

      <TaskCardGrid
        sortedTasks={archivedTasks}
        handlers={handlers}
        direction="column"
        selectMode={selectMode}
        selectedIds={selectedIds}
      />
    </div>
  );
}

export default ArchivePage;