import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const Default = () => (
  <AlertDialog defaultOpen>
    <AlertDialogTrigger render={<Button variant="destructive">Aufgabe löschen</Button>} />
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Aufgabe löschen</AlertDialogTitle>
        <AlertDialogDescription>
          Sind Sie sicher, dass Sie diese Aufgabe löschen möchten? Dieser
          Vorgang kann nicht rückgängig gemacht werden.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
        <AlertDialogAction variant="destructive">Löschen</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const ResetProgress = () => (
  <AlertDialog defaultOpen>
    <AlertDialogTrigger render={<Button variant="outline">Fortschritt zurücksetzen</Button>} />
    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogTitle>Fortschritt zurücksetzen</AlertDialogTitle>
        <AlertDialogDescription>
          Sind Sie sicher, dass Sie den Fortschritt dieser Aufgabe zurücksetzen
          möchten?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
        <AlertDialogAction>Zurücksetzen</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const Closed = () => (
  <AlertDialog>
    <AlertDialogTrigger render={<Button variant="destructive">Konto löschen</Button>} />
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Konto löschen</AlertDialogTitle>
        <AlertDialogDescription>
          Alle deine Gewohnheiten und dein Verlauf werden dauerhaft entfernt.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
        <AlertDialogAction variant="destructive">Löschen</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
