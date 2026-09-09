import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export const Default = () => (
  <TooltipProvider>
    <Tooltip open>
      <TooltipTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Serie">
            <Flame />
          </Button>
        }
      />
      <TooltipContent>12 Tage Serie</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const Bottom = () => (
  <TooltipProvider>
    <Tooltip open>
      <TooltipTrigger render={<Button variant="outline">Archivieren</Button>} />
      <TooltipContent side="bottom">Aufgabe ins Archiv verschieben</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const Closed = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Bearbeiten</Button>} />
      <TooltipContent>Aufgabe bearbeiten</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
