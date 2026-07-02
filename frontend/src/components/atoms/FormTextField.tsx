import React from "react";
import { TextField } from "@mui/material";

type FormTextFieldProps = {
  name: string;
  label: string;
  value: string | number | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  type?: string;
};

function FormTextField({ name, label, value, onChange, onBlur, error, helperText, ...props }: FormTextFieldProps) {
  return (
    <TextField
      className="formTextField"
      fullWidth
      margin="normal"
      variant="outlined"
      name={name}
      label={label}
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      {...props}
    />
  );
}

export default FormTextField;