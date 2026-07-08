import { useId, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskCategory, TaskFrequency } from "../../services/taskService";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { CATEGORY_OPTIONS, FREQUENCY_OPTIONS } from "../../constants/taskOptions";

type FormSelectorProps = {
  value: TaskCategory | TaskFrequency | "";
  variant: "category" | "frequency";
  error?: boolean;
  helperText?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  className?: string;
};

type SelectOnValueChange = React.ComponentProps<typeof Select>["onValueChange"];
type SelectOnOpenChange = React.ComponentProps<typeof Select>["onOpenChange"];

function FormSelector({
  value,
  variant,
  error,
  helperText,
  onChange,
  onBlur,
  disabled,
  className,
}: FormSelectorProps) {
  const uid = useId();
  const isCategory = variant === "category";
  const fieldId = `${variant}-${uid}`;
  const label = isCategory ? "Kategorie" : "Frequenz";

  const justSelectedRef = useRef(false);

  const items: { value: TaskCategory | TaskFrequency; label: string }[] = isCategory
    ? CATEGORY_OPTIONS
    : FREQUENCY_OPTIONS;

  const handleValueChange: SelectOnValueChange = (newValue) => {
    justSelectedRef.current = true;
    onChange({
      target: { name: variant, value: newValue ?? "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleOpenChange: SelectOnOpenChange = (open) => {
    if (open) return;

    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    onBlur?.({
      target: { name: variant },
    } as unknown as React.FocusEvent<HTMLInputElement>);
  };

  return (
    <Field data-invalid={error ? "true" : "false"} className={className}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Select
        items={items}
        value={value || ""}
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
      {error && <FieldError>{helperText}</FieldError>}
    </Field>
  );
}

export default FormSelector;