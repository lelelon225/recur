import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TaskCardMenu from "@/components/organisms/TaskCardMenu";
import ProgressIndicator from "@/components/atoms/ProgressIndicator";
import TaskTitle from "@/components/atoms/TaskTitle";
import { TaskCategory, TaskFrequency, type Task } from "@/services/taskService";

const noop = () => {};

const baseTask: Task = {
  id: "1",
  name: "Morgenlauf",
  category: TaskCategory.PERSONAL,
  frequency: TaskFrequency.DAILY,
  description: "3km rund um den Park vor dem Frühstück.",
  dateUntil: "2026-12-31",
  progress: 40,
  dateCreated: "2026-01-01",
  isFavorite: true,
  durationMinutes: 30,
  startTime: "07:00",
};

export const Default = () => (
  <div className="w-72">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <ProgressIndicator value={baseTask.progress} />
        <TaskCardMenu
          task={baseTask}
          onToggleMenu={noop}
          onToggleEdit={noop}
          onToggleArchive={noop}
          onResetProgress={noop}
          onDelete={noop}
          isArchived={false}
        />
      </CardHeader>
      <CardContent>
        <TaskTitle title={baseTask.name} />
      </CardContent>
    </Card>
  </div>
);

export const Archived = () => (
  <div className="w-72">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <ProgressIndicator value={0} />
        <TaskCardMenu
          task={{ ...baseTask, name: "Buch lesen", progress: 0 }}
          onToggleMenu={noop}
          onToggleEdit={noop}
          onToggleArchive={noop}
          onResetProgress={noop}
          onDelete={noop}
          isArchived
        />
      </CardHeader>
      <CardContent>
        <TaskTitle title="Buch lesen" />
      </CardContent>
    </Card>
  </div>
);
