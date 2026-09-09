import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const Default = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="cb-default" />
    <Label htmlFor="cb-default">10.000 Schritte gehen</Label>
  </div>
);

export const Checked = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="cb-checked" defaultChecked />
    <Label htmlFor="cb-checked">Wasser trinken (2L)</Label>
  </div>
);

export const Disabled = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="cb-disabled" disabled />
    <Label htmlFor="cb-disabled">Yoga (Premium-Feature)</Label>
  </div>
);

export const DisabledChecked = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="cb-disabled-checked" disabled defaultChecked />
    <Label htmlFor="cb-disabled-checked">Morgenroutine abgeschlossen</Label>
  </div>
);

export const Invalid = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="cb-invalid" aria-invalid />
    <Label htmlFor="cb-invalid">Nutzungsbedingungen akzeptieren</Label>
  </div>
);
