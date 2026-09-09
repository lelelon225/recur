import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Default = () => (
  <div className="w-64">
    <Input placeholder="Morning run" />
  </div>
);

export const WithLabel = () => (
  <div className="flex w-64 flex-col gap-1.5">
    <Label htmlFor="task-name">Aufgabenname</Label>
    <Input id="task-name" defaultValue="30 Minuten lesen" />
  </div>
);

export const Disabled = () => (
  <div className="w-64">
    <Input placeholder="Nicht verfügbar" disabled />
  </div>
);

export const Invalid = () => (
  <div className="flex w-64 flex-col gap-1.5">
    <Label htmlFor="task-name-invalid">Aufgabenname</Label>
    <Input id="task-name-invalid" defaultValue="" aria-invalid placeholder="Erforderlich" />
  </div>
);

export const Types = () => (
  <div className="flex w-64 flex-col gap-3">
    <Input type="text" placeholder="Streak-Ziel" />
    <Input type="number" placeholder="30" />
    <Input type="time" defaultValue="07:00" />
  </div>
);
