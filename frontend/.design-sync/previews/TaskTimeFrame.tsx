import TaskTimeFrame from "@/components/atoms/TaskTimeFrame";

export const Default = () => (
  <TaskTimeFrame start="2026-01-05" end="2026-12-31" />
);

export const StartOnly = () => <TaskTimeFrame start="2026-03-01" end={null} />;

export const EndOnly = () => <TaskTimeFrame start={null} end="2026-06-30" />;

export const NoTimeFrame = () => <TaskTimeFrame start={null} end={null} />;
