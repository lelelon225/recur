import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import EditTaskForm from "./EditTaskForm";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import useTaskCardMenu from "@/hooks/useTaskCardMenu";
function TaskCardMenu({ task, onToggleEdit, onToggleMenu, onToggleArchive, onResetProgress, onDelete, onTaskUpdated, isArchived, }) {
    const { open, editOpen, confirmDeleteOpen, confirmResetProgressOpen, canResetProgress, handleOpenChange, handleToggleEdit, handleToggleArchive, handleRequestDelete, handleConfirmDelete, handleCancelDelete, handleRequestResetProgress, handleConfirmResetProgress, handleCancelResetProgress, handleEditClose, } = useTaskCardMenu({
        onToggleMenu,
        onToggleEdit,
        onToggleArchive,
        onResetProgress,
        onDelete,
        isArchived,
        progress: task.progress,
    });
    return (<>
      {editOpen && (<EditTaskForm task={task} onClose={handleEditClose} onTaskUpdated={onTaskUpdated}/>)}

      <ConfirmDialog severity="high" question="Aufgabe löschen" description="Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?" open={confirmDeleteOpen} onOpenChange={(next) => !next && handleCancelDelete()} onConfirm={handleConfirmDelete} confirmText="Löschen" cancelText="Abbrechen" onCancel={handleCancelDelete}/>

      <ConfirmDialog severity="high" question="Fortschritt zurücksetzen" description="Sind Sie sicher, dass Sie den Fortschritt dieser Aufgabe zurücksetzen möchten?" open={confirmResetProgressOpen} onOpenChange={(next) => !next && handleCancelResetProgress()} onConfirm={handleConfirmResetProgress} confirmText="Zurücksetzen" cancelText="Abbrechen" onCancel={handleCancelResetProgress}/>

      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} render={<Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-accent-foreground" aria-label="Aufgaben-Menü">
              <MoreVertical className="h-5 w-5"/>
            </Button>}/>
        <DropdownMenuContent align="start">
          {isArchived ? (<>
              <DropdownMenuItem onClick={handleToggleArchive}>
                Aus Archiv Entfernen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRequestDelete} className="text-destructive">
                Löschen
              </DropdownMenuItem>
            </>) : (<>
              <DropdownMenuItem onClick={handleToggleEdit}>Bearbeiten</DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleArchive}>Archivieren</DropdownMenuItem>
              <DropdownMenuItem onClick={handleRequestResetProgress} disabled={!canResetProgress} className="text-destructive">
                Fortschritt zurücksetzen
              </DropdownMenuItem>
            </>)}
        </DropdownMenuContent>
      </DropdownMenu>
    </>);
}
export default TaskCardMenu;
