import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Default = () => (
  <Sheet defaultOpen>
    <SheetTrigger render={<Button variant="outline">Edit habit</Button>} />
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit habit</SheetTitle>
        <SheetDescription>
          Update the details for &quot;Morning run&quot;. Changes apply to
          future occurrences only.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-4 px-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sheet-name">Name</Label>
          <Input id="sheet-name" defaultValue="Morning run" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sheet-time">Start time</Label>
          <Input id="sheet-time" type="time" defaultValue="07:00" />
        </div>
      </div>
      <SheetFooter>
        <Button>Save changes</Button>
        <SheetClose render={<Button variant="outline">Cancel</Button>} />
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export const LeftSide = () => (
  <Sheet defaultOpen>
    <SheetTrigger render={<Button variant="outline">Open filters</Button>} />
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>Filter habits</SheetTitle>
        <SheetDescription>
          Narrow down your task list by category and frequency.
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
);

export const BottomSide = () => (
  <Sheet defaultOpen>
    <SheetTrigger render={<Button variant="outline">Quick add</Button>} />
    <SheetContent side="bottom">
      <SheetHeader>
        <SheetTitle>Quick add task</SheetTitle>
        <SheetDescription>
          Create a new recurring task without leaving this page.
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
);
