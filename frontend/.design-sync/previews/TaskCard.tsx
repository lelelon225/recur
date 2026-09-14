import TaskCard from "@/components/organisms/TaskCard";
import { TaskCategory, TaskFrequency, type Task } from "@/services/taskService";

const baseTask: Task = {
  id: "1",
  name: "Morning run",
  category: TaskCategory.PERSONAL,
  frequency: TaskFrequency.DAILY,
  description: "3km around the park before breakfast, easy pace.",
  dateUntil: "2026-12-31",
  progress: 60,
  dateCreated: "2026-01-01",
  isFavorite: true,
  durationMinutes: 30,
  startTime: "07:00",
};

export const Default = () => (
  <div className="w-72">
    <TaskCard task={baseTask} />
  </div>
);

export const Complete = () => (
  <div className="w-72">
    <TaskCard task={{ ...baseTask, name: "Read 20 pages", progress: 100, isFavorite: false, description: "Any book, just keep the habit going." }} />
  </div>
);

export const SelectMode = () => (
  <div className="w-72">
    <TaskCard task={baseTask} selectMode selected />
  </div>
);
