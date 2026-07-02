import { TextField } from "@mui/material";
import type {TextFieldProps} from "@mui/material/TextField";

type FormTextFieldProps = {
  name: string;
  label: string;
  value: string | number | null;
  error?: boolean;
  helperText?: string;
  type?: string;
} & TextFieldProps;

function FormTextField({ name, label, value, error, helperText, ...props }: FormTextFieldProps) {
  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      name={name}
      label={label}
      value={value || ""}
      error={error}
      helperText={helperText}
      {...props}
    />
  );
}

export default FormTextField;