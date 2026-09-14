import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Default = () => (
  <Dialog defaultOpen>
    <DialogTrigger render={<Button variant="outline">Delete task</Button>} />
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this task?</DialogTitle>
        <DialogDescription>
          This action can't be undone. The task and its progress history will
          be permanently removed.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose render={<Button variant="outline">Cancel</Button>} />
        <Button variant="destructive">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const Closed = () => (
  <Dialog>
    <DialogTrigger render={<Button>Open dialog</Button>} />
  </Dialog>
);
