import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { Task } from "@/services/taskService";
import { categoryLabels, frequencyLabels } from "@/lib/taskCategoryStyles";
import { categoryDot } from "@/utils/calendarGrid";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "@/components/atoms/ProgressIndicator";
import DetailDialog from "@/components/molecules/DetailDialog";
import TaskCardMenu from "@/components/organisms/TaskCardMenu";

type TaskDetailDialogProps = {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onToggleArchive: () => void;
  onResetProgress: () => void;
  onDelete: () => void;
  onToggleDone: () => void;
  onTaskUpdated?: (task: Task) => void;
  isArchived: boolean;
};

/** Read-only Task-Detailansicht (Name, Kategorie, Beschreibung, Zeitrahmen,
 * Fortschritt) mit Zugriff auf das ⋮-Menü. Ursprünglich im Kalender gebaut
 * (CalendarPage), für die Habit-Card-Detailansicht (#136) hierher extrahiert,
 * damit beide Stellen exakt dasselbe zeigen statt zu drifted. */
function TaskDetailDialog({
  task,
  open,
  onClose,
  onToggleArchive,
  onResetProgress,
  onDelete,
  onToggleDone,
  onTaskUpdated,
  isArchived,
}: TaskDetailDialogProps) {
  return (
    <DetailDialog open={open} onClose={onClose} title={task?.name}>
      {task && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className={`size-2 rounded-full ${categoryDot[task.category]}`} />
              {categoryLabels[task.category]}
            </div>
            <TaskCardMenu
              task={task}
              onToggleMenu={() => {}}
              onToggleEdit={() => {}}
              onToggleArchive={onToggleArchive}
              onResetProgress={onResetProgress}
              onDelete={onDelete}
              onTaskUpdated={onTaskUpdated}
              isArchived={isArchived}
            />
          </div>

          <div className="flex flex-col gap-2 text-sm">
            {task.description && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Beschreibung</span>
                <span style={{ wordWrap: "break-word" }}>{task.description}</span>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Wiederholung</span>
              <span>{frequencyLabels[task.frequency]}</span>
            </div>
            {task.startTime && (
              <div className="flex gap-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Datum</span>
                  <span>{format(new Date(task.startTime), "dd.MM.yyyy", { locale: de })}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Uhrzeit</span>
                  <span>{format(new Date(task.startTime), "HH:mm", { locale: de })}</span>
                </div>
                {task.durationMinutes && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Dauer</span>
                    <span>{task.durationMinutes} Min.</span>
                  </div>
                )}
              </div>
            )}
            {task.dateUntil && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Fällig bis</span>
                <span>{format(new Date(task.dateUntil), "dd.MM.yyyy", { locale: de })}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
            <div className="flex items-center gap-3">
              <ProgressIndicator value={task.progress} size={40} strokeWidth={4} />
              <span className="text-xs text-muted-foreground">Fortschritt</span>
            </div>
            <Button size="sm" disabled={task.progress >= 100} onClick={onToggleDone}>
              {task.progress >= 100 ? "Erledigt" : "Als erledigt markieren"}
            </Button>
          </div>
        </div>
      )}
    </DetailDialog>
  );
}

export default TaskDetailDialog;
