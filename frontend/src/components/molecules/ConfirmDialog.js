import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
function ConfirmDialog({ severity, trigger, question, description, onConfirm, onCancel, confirmText, cancelText, open, onOpenChange, }) {
    const buttonVariant = severity === "high" ? "destructive" : "default";
    return (<AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger render={trigger}/>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{question}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText || "Abbrechen"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant={buttonVariant}>
            {confirmText || "Fortfahren"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>);
}
export default ConfirmDialog;
