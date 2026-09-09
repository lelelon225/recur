import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// w-96 isn't used anywhere in the real app source, so Tailwind's JIT scan
// (which only covers src/, not .design-sync/previews/) would tree-shake it
// out of the shipped CSS and the element would render unstyled/full-width
// with no error. Use an inline width instead of a Tailwind class here.
const fieldGroupBoxStyle = { width: 384 };

export const Default = () => (
  <div style={fieldGroupBoxStyle}>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="fg-name">Habit name</FieldLabel>
        <Input id="fg-name" defaultValue="Read 20 pages" />
      </Field>
      <Field>
        <FieldLabel htmlFor="fg-duration">Duration (minutes)</FieldLabel>
        <Input id="fg-duration" defaultValue="30" />
        <FieldDescription>How long this habit usually takes.</FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="fg-favorite" defaultChecked />
        <FieldLabel htmlFor="fg-favorite">Mark as favorite</FieldLabel>
      </Field>
    </FieldGroup>
  </div>
);

export const WithLegendAndSeparator = () => (
  <div style={fieldGroupBoxStyle}>
    <FieldSet>
      <FieldLegend>Reminder settings</FieldLegend>
      <FieldGroup>
        <Field orientation="horizontal">
          <Checkbox id="fg-notify" defaultChecked />
          <FieldLabel htmlFor="fg-notify">Notify before start time</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="fg-streak" />
          <FieldLabel htmlFor="fg-streak">Warn when streak is at risk</FieldLabel>
        </Field>
      </FieldGroup>
      <FieldSeparator>then</FieldSeparator>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fg-time">Reminder time</FieldLabel>
          <Input id="fg-time" type="time" defaultValue="07:00" />
        </Field>
      </FieldGroup>
    </FieldSet>
  </div>
);
