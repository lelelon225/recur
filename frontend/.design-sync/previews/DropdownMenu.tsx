import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export const Default = () => (
  <DropdownMenu defaultOpen>
    <DropdownMenuTrigger
      render={
        <Button variant="ghost" size="icon" aria-label="Aufgaben-Menü">
          <MoreVertical />
        </Button>
      }
    />
    <DropdownMenuContent align="start">
      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
      <DropdownMenuItem>Archivieren</DropdownMenuItem>
      <DropdownMenuItem disabled>Fortschritt zurücksetzen</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const WithDestructive = () => (
  <DropdownMenu defaultOpen>
    <DropdownMenuTrigger render={<Button variant="outline">Optionen</Button>} />
    <DropdownMenuContent align="start">
      <DropdownMenuLabel>Aufgabe</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
      <DropdownMenuItem>Duplizieren</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">Löschen</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const Closed = () => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="outline">Aus Archiv entfernen</Button>} />
    <DropdownMenuContent align="start">
      <DropdownMenuItem>Aus Archiv entfernen</DropdownMenuItem>
      <DropdownMenuItem variant="destructive">Löschen</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
