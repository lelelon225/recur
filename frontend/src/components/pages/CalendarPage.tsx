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

function CalendarGrid() {
  const { tasks, loading } = useTasksContext();
  const [weekOfset, setWeekOfset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<calendarDay | null>(null);

  const weeks = getOneWeek(addWeeks(new Date(), weekOfset));
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
    </div>
  );
}

export default CalendarGrid;
