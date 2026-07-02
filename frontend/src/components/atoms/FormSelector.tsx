import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { type TaskCategory, type TaskFrequency } from "../../services/taskService";
import type {SelectProps} from "@mui/material/Select";

type FormSelectorProps = {
  value: TaskCategory | TaskFrequency;
  category: boolean;
  error?: boolean;
  helperText?: string;
} & SelectProps;

function FormSelector({ value, category, error, helperText, ...props }: FormSelectorProps) {
  const field = category ? "category" : "frequency";
  const label = category ? "Kategorie" : "Frequenz";
  const labelId = category ? "category-label" : "frequency-label";

  const items = category
    ? [
        { value: "WORK", label: "Arbeit" },
        { value: "PERSONAL", label: "Persönlich" },
        { value: "SCHOOL", label: "Schule" },
        { value: "OTHER", label: "Andere" },
      ]
    : [
        { value: "DAILY", label: "Täglich" },
        { value: "WEEKLY", label: "Wöchentlich" },
        { value: "MONTHLY", label: "Monatlich" },
        { value: "YEARLY", label: "Jährlich" },
        { value: "ONCE", label: "Einmalig" },
      ];

  return (
    <FormControl fullWidth margin="normal" error={error}>
      <InputLabel sx={{ color: "white" }} id={labelId}>
        {label}
      </InputLabel>
      <Select
        className="formSelector"
        labelId={labelId}
        name={field}
        value={value}
        label={label}
        {...props}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default FormSelector;