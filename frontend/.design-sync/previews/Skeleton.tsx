import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const TaskCardLoading = () => (
  <Card className="flex h-full w-72 flex-col">
    <CardHeader className="flex flex-row items-center justify-between gap-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-6 w-6 rounded-md" />
    </CardHeader>
    <CardContent className="flex flex-1 flex-col gap-2">
      <Skeleton className="h-5 w-2/3" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="mt-auto flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export const ListLoading = () => (
  <div className="w-72 space-y-2 rounded-xl border border-border bg-card p-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ))}
  </div>
);
