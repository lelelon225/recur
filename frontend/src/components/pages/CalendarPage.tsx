import { useTasksContext } from "@/contexts/TasksContext";
import type { Task } from "@/services/taskService";
import {
  startOfWeek,
  addDays,
  addWeeks,
  isSameDay,
  format,
  startOfDay,
} from "date-fns";
import { de } from "date-fns/locale";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { TaskCategory } from "@/services/taskService";
import { Button } from "../ui/button";
import AppDialog from "../molecules/AppDialog";
import DetailDialog from "../molecules/DetailDialog";
type calendarDay = {
  date: Date;
  isToday: boolean;
  formattedDate: string;
};

function getMonthLabel(weeks: calendarDay[][]): string {
  const firstDay = weeks[0][0].date;
  const lastDay = weeks[0][6].date;

  if (firstDay.getMonth() === lastDay.getMonth()) {
    return `${format(firstDay, "d. ", { locale: de })} - ${format(
      lastDay,
      "d. MMMM yyyy",
      { locale: de }
    )}`;
  }

  if (firstDay.getFullYear() === lastDay.getFullYear()) {
    return `${format(firstDay, "d. MMMM", { locale: de })} – ${format(
      lastDay,
      "d. MMMM yyyy",
      { locale: de }
    )}`;
  }

  return `${format(firstDay, "d. MMMM yyyy", { locale: de })} – ${format(
    lastDay,
    "d. MMMM yyyy",
    { locale: de }
  )}`;
}

function getOneWeek(calendarDate: Date) {
  const weeks: calendarDay[][] = [];
  const weekDays: calendarDay[] = [];
  const weekStart = addWeeks(startOfWeek(calendarDate, { weekStartsOn: 1 }), 0);
  for (let j = 0; j < 7; j++) {
    const day = addDays(weekStart, j);
    weekDays.push({
      date: day,
      isToday: isSameDay(day, new Date()),
      formattedDate: format(day, "dd.MM.yyyy", { locale: de }),
    });
  }
  weeks.push(weekDays);

  return weeks;
}

function occursOn(task: Task, date: Date): boolean {
  const taskDate = new Date(task.startTime);
  const taskUntilDate = new Date(task.dateUntil);

  if (
    startOfDay(date) < startOfDay(taskDate) ||
    startOfDay(date) > startOfDay(taskUntilDate)
  ) {
    return false;
  }

  switch (task.frequency) {
    case "DAILY":
      return true;
    case "WEEKLY":
      return taskDate.getDay() === date.getDay();
    case "MONTHLY":
      return taskDate.getDate() === date.getDate();
    case "YEARLY":
      return (
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    case "ONCE":
      return isSameDay(taskDate, date);
    default:
      return false;
  }
}

function getTaskStartRow(task: Task) {
  const taskDate = new Date(task.startTime);
  const hoursFromEight = taskDate.getHours() - 8 + taskDate.getMinutes() / 60;

  const calculatedRow = Math.floor(hoursFromEight * 4) + 2;
  const startRow = Math.max(2, calculatedRow);

  const rowSpan = Math.max(1, Math.ceil((task.durationMinutes || 0) / 15));

  return { startRow, rowSpan };
}

function CalendarGrid() {
  const { tasks, loading } = useTasksContext();
  const [weekOfset, setWeekOfset] = useState(0);

  const weeks = getOneWeek(addWeeks(new Date(), weekOfset));
  const monthLabel = getMonthLabel(weeks);
  const currentWeek = weeks[0];

  const [activeCategory, setActiveCategory] = useState<TaskCategory | "All">(
    "All"
  );

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const categoryStyles: Record<TaskCategory, string> = {
    [TaskCategory.WORK]:
      "bg-rose-500/20 text-black-200 border-rose-500/25 dark:bg-red-950 dark:text-red-200 dark:border-red-500/25",
    [TaskCategory.PERSONAL]:
      "bg-emerald-500/20 text-black-200 border-emerald-500/25 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-500/25",
    [TaskCategory.SCHOOL]:
      "bg-sky-500/20 text-black-200 border-sky-500/25 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-500/25",
    [TaskCategory.OTHER]:
      "bg-zinc-500/20 text-black-200 border-zinc-500/25 dark:bg-zinc-600 dark:text-gray-200 dark:border-zinc-500/25",
  };

  const categoryLabels: Record<TaskCategory | "All", string> = {
    [TaskCategory.WORK]: "Arbeit",
    [TaskCategory.PERSONAL]: "Persönlich",
    [TaskCategory.SCHOOL]: "Bildung",
    [TaskCategory.OTHER]: "Sonstiges",
    All: "Alle",
  };

  const categories = Object.values(TaskCategory);

  const visibleTasks =
    activeCategory === "All"
      ? tasks
      : tasks.filter((task) => task.category === activeCategory);

  const hours = Array.from({ length: 16 }, (_, i) =>
    (i + 8).toString().padStart(2, "0")
  );

  const arrowRight = (
    <ArrowRight className="size-5 hover:scale-125 transition-transform duration-200" />
  );
  const arrowLeft = (
    <ArrowLeft className="size-5 hover:scale-125 transition-transform duration-200" />
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="mb-4 text-lg font-semibold">{monthLabel}</h2>

        <div className="right-0 mb-4 flex items-center justify-end gap-2">
          <div onClick={() => setWeekOfset(weekOfset - 1)}>{arrowLeft}</div>
          <div onClick={() => setWeekOfset(weekOfset + 1)}>{arrowRight}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "left",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <Button
          onClick={() => setActiveCategory("All")}
          className={activeCategory === "All" ? "..." : "..."}
        >
          Alle
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            variant={activeCategory === cat ? "default" : "outline"}
          >
            <span
              className={`size-2 rounded-full mr-2 ${
                categoryStyles[cat].split(" ")[0]
              }`}
            />
            {categoryLabels[cat]}
          </Button>
        ))}
      </div>
      <div
        className="grid border rounded-lg overflow-x-auto"
        style={{
          gridTemplateColumns: "80px repeat(7, minmax(120px, 1fr))",
          gridTemplateRows: "auto repeat(64, 15px)",
        }}
      >
        <div className="p-2 font-bold text-center border-b border-r bg-muted/50 flex items-center justify-center">
          Zeit
        </div>

        {currentWeek.map((day, index) => (
          <div
            key={day.formattedDate}
            className="p-2 border-b border-r text-center font-medium text-xs bg-muted/30"
            style={{ gridColumn: index + 2, gridRow: 1 }}
          >
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              {format(day.date, "EEEE", { locale: de })}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {format(day.date, "dd.MM.", { locale: de })}
            </div>
          </div>
        ))}

        {hours.map((hour, hourIdx) => {
          const rowIndex = hourIdx * 4 + 2;

          return (
            <div
              key={hour}
              className="contents"
              style={{ fontWeight: "bold", fontSize: "0.875rem" }}
            >
              <div
                style={{
                  gridColumn: 1,
                  gridRow: `${rowIndex} / span 4`,
                  textAlign: "center",
                }}
              >
                {hour}:00
              </div>
              {currentWeek.map((day, dayIdx) => (
                <div
                  key={`${day.formattedDate}-${hour}`}
                  style={{
                    gridColumn: dayIdx + 2,
                    gridRow: `${rowIndex} / span 4`,
                  }}
                  className="border-b border-r p-1 relative cursor-pointer hover:bg-muted/20"
                ></div>
              ))}
            </div>
          );
        })}

        {currentWeek.map((day, dayIdx) => {
          const dayTasks = visibleTasks.filter((task) =>
            occursOn(task, day.date)
          );
          const colIndex = dayIdx + 2;

          return dayTasks.map((task) => {
            const { startRow, rowSpan } = getTaskStartRow(task);

            const categoryClass =
              categoryStyles[task.category] ??
              "bg-gray-100 text-gray-800 border-gray-300";

            return (
              <div
                key={`${task.id}-${day.formattedDate}`}
                onClick={() => setSelectedTask(task)}
                style={{
                  gridColumn: colIndex,
                  gridRow: `${startRow} / span ${rowSpan}`,
                  zIndex: 10,
                }}
                className={`border rounded px-1 py-0.5 text-[10px] truncate overflow-hidden font-medium ${categoryClass}`}
                title={task.name}
              >
                {task.name}
              </div>
            );
          });
        })}
      </div>
      <DetailDialog
        open={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.name}
      >
        <span className="text-sm text-muted-foreground">
          {selectedTask?.description && (
            <div className="mt-2" style={{ wordWrap: "break-word" }}>
              <strong>Beschreibung:</strong> {selectedTask.description}
            </div>
          )}
          {selectedTask?.durationMinutes && (
            <div className="mt-2">
              <strong>Dauer:</strong> {selectedTask.durationMinutes} Minuten
            </div>
          )}
          {selectedTask?.startTime && (
            <div className="mt-2">
              <strong>Startdatum:</strong>{" "}
              {format(selectedTask.startTime, "dd.MM.yyyy", { locale: de })}
            </div>
          )}
          {selectedTask?.startTime && (
            <div className="mt-2">
              <strong>Uhrzeit:</strong>{" "}
              {format(selectedTask.startTime, "HH:mm", { locale: de })}
            </div>
          )}
          {selectedTask?.dateUntil && (
            <div className="mt-2">
              <strong>Endzeit:</strong>{" "}
              {format(selectedTask.dateUntil, "dd.MM.yyyy", { locale: de })}
            </div>
          )}
        </span>
      </DetailDialog>
    </div>
  );
}

export default CalendarGrid;
