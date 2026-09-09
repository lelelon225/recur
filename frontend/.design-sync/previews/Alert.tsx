import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon, TriangleAlertIcon } from "lucide-react";

export const Default = () => (
  <Alert className="w-full max-w-sm">
    <InfoIcon />
    <AlertTitle>Streak reminder</AlertTitle>
    <AlertDescription>
      You haven&apos;t logged &quot;Morning run&quot; yet today. Complete it
      before midnight to keep your 12-day streak.
    </AlertDescription>
  </Alert>
);

export const Destructive = () => (
  <Alert variant="destructive" className="w-full max-w-sm">
    <TriangleAlertIcon />
    <AlertTitle>Task overdue</AlertTitle>
    <AlertDescription>
      &quot;Submit weekly report&quot; was due yesterday and hasn&apos;t been
      marked complete.
    </AlertDescription>
  </Alert>
);

export const WithAction = () => (
  <Alert className="w-full max-w-sm">
    <InfoIcon />
    <AlertTitle>Sync paused</AlertTitle>
    <AlertDescription>
      Recur couldn&apos;t reach the server. Your changes are saved locally.
    </AlertDescription>
    <AlertAction>
      <Button size="sm" variant="outline">
        Retry
      </Button>
    </AlertAction>
  </Alert>
);
