import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const Default = () => (
  <Popover defaultOpen>
    <PopoverTrigger render={<Button variant="outline">Serie anzeigen</Button>} />
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Aktuelle Serie</PopoverTitle>
        <PopoverDescription>
          Du hast diese Gewohnheit 12 Tage in Folge abgeschlossen.
        </PopoverDescription>
      </PopoverHeader>
    </PopoverContent>
  </Popover>
);

export const WithContent = () => (
  <Popover defaultOpen>
    <PopoverTrigger render={<Button variant="outline">Erinnerung einstellen</Button>} />
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Erinnerungszeit</PopoverTitle>
        <PopoverDescription>
          Lege fest, wann wir dich täglich an "Meditieren" erinnern sollen.
        </PopoverDescription>
      </PopoverHeader>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Abbrechen
        </Button>
        <Button size="sm">Speichern</Button>
      </div>
    </PopoverContent>
  </Popover>
);

export const Closed = () => (
  <Popover>
    <PopoverTrigger render={<Button variant="outline">Details</Button>} />
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Details</PopoverTitle>
        <PopoverDescription>Weitere Infos zu dieser Aufgabe.</PopoverDescription>
      </PopoverHeader>
    </PopoverContent>
  </Popover>
);
