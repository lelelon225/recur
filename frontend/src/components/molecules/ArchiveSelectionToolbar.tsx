import { Button } from "@/components/ui/button";
import { CheckSquareIcon, Trash2Icon, XIcon } from "lucide-react";

type ArchiveSelectionToolbarProps = {
  selectMode: boolean;
  selectedCount: number;
  allSelected: boolean;
  onEnterSelectMode: () => void;
  onExitSelectMode: () => void;
  onToggleAllSelected: () => void;
  onRequestBulkDelete: () => void;
};

function ArchiveSelectionToolbar({
  selectMode,
  selectedCount,
  allSelected,
  onEnterSelectMode,
  onExitSelectMode,
  onToggleAllSelected,
  onRequestBulkDelete,
}: ArchiveSelectionToolbarProps) {
  if (!selectMode) {
    return (
      <div className="flex items-center justify-between gap-4 px-4 pt-4">
        <div />
        <Button variant="outline" size="sm" onClick={onEnterSelectMode}>
          <CheckSquareIcon className="h-4 w-4 mr-1" />
          Auswählen
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 px-4 pt-4">
      <span className="text-sm text-muted-foreground">{selectedCount} ausgewählt</span>
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <Button variant="destructive" size="sm" onClick={onRequestBulkDelete}>
            <Trash2Icon className="h-4 w-4 mr-1" />
            {selectedCount} {selectedCount === 1 ? "Habit" : "Habits"} löschen
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onToggleAllSelected}>
          {allSelected ? "Auswahl aufheben" : "Alle auswählen"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onExitSelectMode}>
          <XIcon className="h-4 w-4 mr-1" />
          Abbrechen
        </Button>
      </div>
    </div>
  );
}

export default ArchiveSelectionToolbar;