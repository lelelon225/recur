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

type calendarDay = {
  date: Date;
  isToday: boolean;
  formattedDate: string;
};

function getMonthLabel(weeks: calendarDay[][]): string {
  const firstDay = weeks[0][0].date;
  const lastDay = weeks[3][6].date;

  if (firstDay.getMonth() === lastDay.getMonth()) {
    return format(firstDay, "MMMM yyyy", { locale: de });
  }

  return `${format(firstDay, "MMMM", { locale: de })} – ${format(
    lastDay,
    "MMMM yyyy",
    { locale: de }
  )}`;
}

function getFourWeeks(calendarDate: Date) {
  const weeks: calendarDay[][] = [];
  for (let i = 0; i < 4; i++) {
    const weekDays: calendarDay[] = [];
    const weekStart = addWeeks(
      startOfWeek(calendarDate, { weekStartsOn: 1 }),
      i
    );
    for (let j = 0; j < 7; j++) {
      const day = addDays(weekStart, j);
      weekDays.push({
        date: day,
        isToday: isSameDay(day, new Date()),
        formattedDate: format(day, "dd.MM.yyyy", { locale: de }),
      });
    }
    weeks.push(weekDays);
  }
  return weeks;
}

function occursOn(task: Task, date: Date): boolean {
  const taskDate = new Date(task.dateCreated);
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

function getTaskHour(task: Task): string {
  const taskDate = new Date(task.dateCreated);
  return taskDate.getHours().toString().padStart(2, "0");
}

function DayModal({
  day,
  tasks,
  onClose,
}: {
  day: calendarDay;
  tasks: Task[];
  onClose: () => void;
}) {
  const dayTasks = tasks.filter((task) => occursOn(task, day.date));
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#141416] rounded-2xl p-6 max-h-[80vh] overflow-y-auto w-[400px] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {format(day.date, "EEEE, d. MMMM", { locale: de })}
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {hours.map((hour) => {
          const hourTasks = dayTasks.filter(
            (task) => getTaskHour(task) === hour
          );

          return (
            <div
              key={hour}
              className="flex gap-3 border-t border-white/10 py-2"
            >
              <span className="text-xs text-white/40 w-10 shrink-0">
                {hour}:00
              </span>
              <div className="flex flex-col gap-1">
                {hourTasks.map((task) => (
                  <div key={task.id} className="text-sm">
                    {task.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarGrid() {
  const { tasks, loading } = useTasksContext();
  const [weekOfset, setWeekOfset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<calendarDay | null>(null);

  const weeks = getFourWeeks(addWeeks(new Date(), weekOfset));
  const monthLabel = getMonthLabel(weeks);

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
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
          {week.map((day) => {
            const dayTasks = tasks.filter((task) => occursOn(task, day.date));

            return (
              <div
                key={day.formattedDate}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-start justify-start gap-1 rounded-lg p-2 min-h-[100px] border border-white/10 cursor-pointer hover:border-white/30 transition ${
                  day.isToday ? "bg-blue-600/25" : ""
                }`}
              >
                <span className="text-sm font-semibold">
                  {day.date.getDate()}
                </span>
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="text-xs text-gray-400 truncate w-full"
                  >
                    {task.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}

      {selectedDay && (
        <DayModal
          day={selectedDay}
          tasks={tasks}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

export default CalendarGrid;
