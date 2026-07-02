import React from "react";
import { Form as FormikForm } from "formik";
import { type Task } from "../../services/taskService";
import FormTextField from "../atoms/FormTextField";
import FormSelector from "../atoms/FormSelector";
import type { FormikErrors, FormikTouched } from "formik";


type FormProps = {
<<<<<<< HEAD
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
=======
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    values: Task;
    errors: FormikErrors<Task>;
    touched: FormikTouched<Task>;
    className?: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function Form ({ onSubmit, values, handleChange, handleBlur, errors, touched, className }: FormProps) {
    return (
        <FormikForm onSubmit={onSubmit} className={className}>
            <FormTextField
                name="name"
                label="Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && !!errors.name}
                helperText={touched.name ? errors.name : undefined}
                required
            />
            <FormTextField
                name="description"
                label="Beschreibung"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && !!errors.description}
                helperText={touched.description ? errors.description : undefined}
                required
            />
            <FormSelector
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                category={true}
                error={touched.category && !!errors.category}
                helperText={touched.category ? errors.category : undefined}
                required
            />
            <FormSelector
                value={values.frequency}
                onChange={handleChange}
                onBlur={handleBlur}
                category={false}
                error={touched.frequency && !!errors.frequency}
                helperText={touched.frequency ? errors.frequency : undefined}
                required
            />
                <FormTextField
                    name="dateUntil"
                    label="Fälligkeitsdatum"
                    type="date"
                    value={values.dateUntil}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.dateUntil && !!errors.dateUntil}
                    helperText={touched.dateUntil ? errors.dateUntil : undefined}
                    required
                    slotProps={{ 
                        inputLabel: { shrink: true }
                    }}
            />
        </FormikForm>
    );
>>>>>>> 47130b9fbeeb6d4a1bbe955766f4a06e5a8b53be
}

export default Form;
