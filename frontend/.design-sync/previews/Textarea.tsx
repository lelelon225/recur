import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Default = () => (
  <div className="w-72">
    <Textarea placeholder="Beschreibe deine Gewohnheit..." />
  </div>
);

export const WithLabel = () => (
  <div className="flex w-72 flex-col gap-1.5">
    <Label htmlFor="task-description">Beschreibung</Label>
    <Textarea
      id="task-description"
      defaultValue="3km um den Park, lockeres Tempo, am besten vor dem Frühstück."
    />
  </div>
);

export const Disabled = () => (
  <div className="w-72">
    <Textarea defaultValue="Archivierte Aufgabe – nicht mehr bearbeitbar." disabled />
  </div>
);

export const Invalid = () => (
  <div className="flex w-72 flex-col gap-1.5">
    <Label htmlFor="task-description-invalid">Beschreibung</Label>
    <Textarea id="task-description-invalid" aria-invalid placeholder="Erforderlich" />
  </div>
);
