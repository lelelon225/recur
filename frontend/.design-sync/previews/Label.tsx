import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const Default = () => <Label htmlFor="habit-name">Name der Gewohnheit</Label>;

export const WithInput = () => (
  <div className="flex w-64 flex-col gap-1.5">
    <Label htmlFor="habit-name-2">Name der Gewohnheit</Label>
    <Input id="habit-name-2" placeholder="Meditieren" />
  </div>
);

export const WithCheckbox = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="reminder" />
    <Label htmlFor="reminder">Tägliche Erinnerung senden</Label>
  </div>
);

export const Disabled = () => (
  <div className="group flex items-center gap-2" data-disabled="true">
    <Checkbox id="reminder-disabled" disabled />
    <Label htmlFor="reminder-disabled">Erinnerung (nicht verfügbar)</Label>
  </div>
);
