import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// w-80 isn't used anywhere in the real app source, so Tailwind's JIT scan
// (which only covers src/, not .design-sync/previews/) would tree-shake it
// out of the shipped CSS and the element would render unstyled/full-width
// with no error. Use an inline width instead of a Tailwind class here.
const fieldBoxStyle = { width: 320 };

export const Default = () => (
  <div style={fieldBoxStyle}>
    <Field>
      <FieldLabel htmlFor="habit-name">Habit name</FieldLabel>
      <Input id="habit-name" defaultValue="Morning run" />
      <FieldDescription>Shown on the task card and in reminders.</FieldDescription>
    </Field>
  </div>
);

export const Horizontal = () => (
  <div style={fieldBoxStyle}>
    <Field orientation="horizontal">
      <Checkbox id="notify" defaultChecked />
      <FieldLabel htmlFor="notify">Send a reminder notification</FieldLabel>
    </Field>
  </div>
);

export const Invalid = () => (
  <div style={fieldBoxStyle}>
    <Field data-invalid="true">
      <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
      <Input id="duration" defaultValue="0" aria-invalid />
      <FieldError>Duration must be greater than 0.</FieldError>
    </Field>
  </div>
);

export const WithContent = () => (
  <div style={fieldBoxStyle}>
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor="streak">Keep streak reminders</FieldLabel>
        <FieldDescription>
          Get a nudge before your streak resets at midnight.
        </FieldDescription>
      </FieldContent>
      <Checkbox id="streak" defaultChecked />
    </Field>
  </div>
);
