import React from "react";
import { Form as FormikForm } from "formik";
import { TextField } from "@mui/material";
import { type Task } from "../../services/taskService";

type FormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  values: Partial<Task>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

function Form({ onSubmit, values, handleChange, className }: FormProps) {
  return (
    <FormikForm onSubmit={onSubmit} className={className} id="editTaskForm">
      <TextField
        label="Name"
        value={values.name}
        onChange={handleChange}
        name="name"
      />
      <TextField
        label="Description"
        value={values.description}
        onChange={handleChange}
        name="description"
      />
      <TextField
        label="Category"
        value={values.category}
        onChange={handleChange}
        name="category"
      />
      <TextField
        label="Goal"
        value={values.goal}
        onChange={handleChange}
        name="goal"
      />
      <TextField
        label="Date Until"
        type="date"
        value={values.dateUntil || ""}
        onChange={handleChange}
        name="dateUntil"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </FormikForm>
  );
}

export default Form;
