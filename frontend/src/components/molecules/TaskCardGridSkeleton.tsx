import TaskCardSkeleton from "@/components/organisms/TaskCardSkeleton";
import { cn } from "@/lib/utils";

type TaskCardSkeletonGridProps = {
  count?: number;
  direction?: "row" | "column";
};

function TaskCardSkeletonGrid({
  count = 6,
  direction,
}: TaskCardSkeletonGridProps) {
  return (
    <div
      className={cn(
        "grid w-full gap-4 p-4",
        direction === "column"
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default TaskCardSkeletonGrid;