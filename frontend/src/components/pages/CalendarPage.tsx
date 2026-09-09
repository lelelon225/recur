import { useState } from "react";
import { addWeeks, addMonths, format } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useTasksContext } from "@/contexts/TasksContext";
import { useAddTask } from "@/contexts/AddTaskContext";
import { TaskCategory, type Task, type TaskCategory as TaskCategoryType } from "@/services/taskService";
import { categoryLabels, ALL_CATEGORIES_LABEL } from "@/lib/taskCategoryStyles";
import {
  getWeekDays,
  getMonthGrid,
  getWeekLabel,
  getMonthLabel,
  categoryDot,
} from "@/utils/calendarGrid";
import { toDateOnlyString } from "@/utils/formatDate";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import DetailDialog from "@/components/molecules/DetailDialog";
import CalendarWeekView from "@/components/organisms/CalendarWeekView";
import CalendarMonthView from "@/components/organisms/CalendarMonthView";

type ViewMode = "month" | "week";

function CalendarGrid() {
  const { tasks, loading } = useTasksContext();
  const { openAddTaskForm } = useAddTask();

  const [view, setView] = useState<ViewMode>("month");
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState<TaskCategoryType | "All">(
    "All"
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const categories = Object.values(TaskCategory);
  const visibleTasks =
    activeCategory === "All"
      ? tasks
      : tasks.filter((task) => task.category === activeCategory);

  function goToday() {
    setAnchorDate(new Date());
  }

  function goPrev() {
    setAnchorDate((d) => (view === "month" ? addMonths(d, -1) : addWeeks(d, -1)));
  }

  function goNext() {
    setAnchorDate((d) => (view === "month" ? addMonths(d, 1) : addWeeks(d, 1)));
  }

  function handleSelectDay(date: Date) {
    openAddTaskForm({ startDate: toDateOnlyString(date) });
  }

  function handleSelectSlot(date: Date, hour: number) {
    openAddTaskForm({
      startDate: toDateOnlyString(date),
      startTimeOfDay: `${String(hour).padStart(2, "0")}:00`,
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const weekDays = getWeekDays(anchorDate);
  const monthWeeks = getMonthGrid(anchorDate);
  const label = view === "month" ? getMonthLabel(anchorDate) : getWeekLabel(weekDays);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 rounded-full border border-border p-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={goPrev}
              aria-label="Zurück"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={goNext}
              aria-label="Weiter"
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="rounded-full" onClick={goToday}>
            Heute
          </Button>
          <h2 className="text-xl font-semibold tracking-tight capitalize">{label}</h2>
        </div>

        <div className="flex items-center gap-0.5 rounded-full border border-border p-0.5">
          <Button
            variant={view === "month" ? "default" : "ghost"}
            size="sm"
            className="rounded-full"
            onClick={() => setView("month")}
          >
            Monat
          </Button>
          <Button
            variant={view === "week" ? "default" : "ghost"}
            size="sm"
            className="rounded-full"
            onClick={() => setView("week")}
          >
            Woche
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveCategory("All")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeCategory === "All"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {ALL_CATEGORIES_LABEL}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className={`size-1.5 rounded-full ${categoryDot[cat]}`} />
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {view === "month" ? (
        <CalendarMonthView
          weeks={monthWeeks}
          tasks={visibleTasks}
          onSelectTask={setSelectedTask}
          onSelectDay={handleSelectDay}
        />
      ) : (
        <CalendarWeekView
          days={weekDays}
          tasks={visibleTasks}
          onSelectTask={setSelectedTask}
          onSelectSlot={handleSelectSlot}
        />
      )}

      <DetailDialog
        open={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.name}
      >
        {selectedTask && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className={`size-2 rounded-full ${categoryDot[selectedTask.category]}`} />
              {categoryLabels[selectedTask.category]}
            </div>

            <div className="flex flex-col gap-2 text-sm">
              {selectedTask.description && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Beschreibung</span>
                  <span style={{ wordWrap: "break-word" }}>{selectedTask.description}</span>
                </div>
              )}
              {selectedTask.startTime && (
                <div className="flex gap-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Datum</span>
                    <span>
                      {format(new Date(selectedTask.startTime), "dd.MM.yyyy", { locale: de })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Uhrzeit</span>
                    <span>
                      {format(new Date(selectedTask.startTime), "HH:mm", { locale: de })}
                    </span>
                  </div>
                  {selectedTask.durationMinutes && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground">Dauer</span>
                      <span>{selectedTask.durationMinutes} Min.</span>
                    </div>
                  )}
                </div>
              )}
              {selectedTask.dateUntil && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Fällig bis</span>
                  <span>
                    {format(new Date(selectedTask.dateUntil), "dd.MM.yyyy", { locale: de })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </DetailDialog>
    </div>
  );
}

export default CalendarGrid;
