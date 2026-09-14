import TaskTitle from "@/components/atoms/TaskTitle";

export const Default = () => (
  <div className="w-72">
    <TaskTitle title="Morning run" />
  </div>
);

export const LongTitle = () => (
  <div className="w-72">
    <TaskTitle title="Stretch and mobility routine before bed" />
  </div>
);
