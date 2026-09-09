import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import { Button } from "@/components/ui/button";

export const Default = () => (
  <ConfirmDialog
    open
    onOpenChange={() => {}}
    question="Fortschritt zurücksetzen"
    description="Sind Sie sicher, dass Sie den Fortschritt dieser Aufgabe zurücksetzen möchten?"
    onConfirm={() => {}}
    confirmText="Zurücksetzen"
    cancelText="Abbrechen"
  />
);

export const HighSeverity = () => (
  <ConfirmDialog
    open
    onOpenChange={() => {}}
    severity="high"
    question="Aufgabe löschen"
    description="Sind Sie sicher, dass Sie diese Aufgabe löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
    onConfirm={() => {}}
    confirmText="Löschen"
    cancelText="Abbrechen"
  />
);

export const Closed = () => (
  <ConfirmDialog
    trigger={<Button variant="outline">Habit archivieren</Button>}
    question="Habit archivieren"
    description="Das Habit wird in dein Archiv verschoben und aus der aktiven Liste entfernt."
    onConfirm={() => {}}
  />
);
