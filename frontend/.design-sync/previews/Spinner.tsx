import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export const Default = () => (
  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border p-6 text-muted-foreground">
    <Spinner className="size-6" />
    <span className="text-sm">Loading your habits…</span>
  </div>
);

export const InButton = () => (
  <Button disabled>
    <Spinner />
    Saving task…
  </Button>
);

export const Sizes = () => (
  <div className="flex items-center gap-4 text-muted-foreground">
    <Spinner className="size-3" />
    <Spinner className="size-4" />
    <Spinner className="size-6" />
    <Spinner className="size-8" />
  </div>
);
