import { useId, useRef } from "react";
import { useField } from "formik";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskCategory, TaskFrequency } from "@/services/taskService";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CATEGORY_OPTIONS, FREQUENCY_OPTIONS } from "@/constants/taskOptions";

type FormSelectorProps = {
  variant: "category" | "frequency";
  disabled?: boolean;
  className?: string;
};

type SelectOnValueChange = React.ComponentProps<typeof Select>["onValueChange"];
type SelectOnOpenChange = React.ComponentProps<typeof Select>["onOpenChange"];

function FormSelector({ variant, disabled, className }: FormSelectorProps) {
  const uid = useId();
  const isCategory = variant === "category";
  const fieldId = `${variant}-${uid}`;
  const label = isCategory ? "Kategorie" : "Frequenz";

  // useField bindet direkt an Formik, statt Value/onChange/onBlur/Error von
  // aussen durchgereicht zu bekommen und über synthetische Events zu simulieren
  // (analog zum Muster in useDateField.ts).
  const [field, meta, helpers] = useField<TaskCategory | TaskFrequency | "">(variant);
  const { setValue, setTouched } = helpers;

  const justSelectedRef = useRef(false);

  const items: { value: TaskCategory | TaskFrequency; label: string }[] = isCategory
    ? CATEGORY_OPTIONS
    : FREQUENCY_OPTIONS;

  const error = meta.touched && !!meta.error;
  const helperText = meta.touched ? meta.error : undefined;

  const handleValueChange: SelectOnValueChange = (newValue) => {
    justSelectedRef.current = true;
    setValue(newValue ?? "");
  };

  const handleOpenChange: SelectOnOpenChange = (open) => {
    if (open) return;

    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    setTouched(true, true);
  };

  return (
    <Field data-invalid={error ? "true" : "false"} className={className}>
      <FieldLabel className="mt-3" htmlFor={fieldId}>{label}</FieldLabel>
      <Select
        items={items}
        value={field.value || ""}
        onValueChange={handleValueChange}
        onOpenChange={handleOpenChange}
        disabled={disabled}
      >
        <SelectTrigger id={fieldId} aria-invalid={error}>
          <SelectValue placeholder={`Wähle eine ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <FieldError className="text-sm text-destructive ">
          {helperText}
        </FieldError>
      )}
    </Field>
  );
}

export default FormSelector;