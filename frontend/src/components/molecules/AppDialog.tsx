import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/atoms/LoadingButton";

type AppDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  onSubmit?: () => void;
  loading?: boolean;
  submitDisabled?: boolean;
};

function AppDialog({
  open,
  onClose,
  title,
  children,
  onSubmit,
  loading,
  submitDisabled,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}

        {children}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <LoadingButton onClick={onSubmit} disabled={submitDisabled} loading={loading}>
            Submit
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AppDialog;