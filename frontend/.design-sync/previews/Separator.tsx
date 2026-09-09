import { Separator } from "@/components/ui/separator";

export const Horizontal = () => (
  <div className="w-72">
    <div className="text-sm font-medium text-foreground">Morning run</div>
    <div className="text-sm text-muted-foreground">3km around the park</div>
    <Separator className="my-2" />
    <div className="text-sm font-medium text-foreground">Read 20 pages</div>
    <div className="text-sm text-muted-foreground">Any book, keep the streak</div>
  </div>
);

export const Vertical = () => (
  <div className="flex h-8 items-center gap-3 text-sm text-muted-foreground">
    <span>Daily</span>
    <Separator orientation="vertical" />
    <span>Weekly</span>
    <Separator orientation="vertical" />
    <span>Monthly</span>
  </div>
);
