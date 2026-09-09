import TaskCardSkeleton from "@/components/organisms/TaskCardSkeleton";

export const Default = () => (
  <div className="w-72">
    <TaskCardSkeleton />
  </div>
);

export const Grid = () => (
  <div className="flex flex-col gap-4">
    <div className="w-72">
      <TaskCardSkeleton />
    </div>
    <div className="w-72">
      <TaskCardSkeleton />
    </div>
    <div className="w-72">
      <TaskCardSkeleton />
    </div>
    <div className="w-72">
      <TaskCardSkeleton />
    </div>
  </div>
);
