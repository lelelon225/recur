import type { FormEvent, ChangeEvent, FocusEvent } from "react";
import { Form as FormikForm } from "formik";
import type { FormikErrors, FormikTouched } from "formik";
import { type NewTask } from "../../services/taskService";
import FormTextField from "../molecules/FormTextField";
import FormDateField from "../molecules/FormDateField";
import FormSelector from "../molecules/FormSelector";

type FormProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  values: NewTask;
  errors: FormikErrors<NewTask>;
  touched: FormikTouched<NewTask>;
  className?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function Form({
  onSubmit,
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
  className,
}: FormProps) {
  return (
    <FormikForm onSubmit={onSubmit} className={className}>
      <FormTextField
        name="name"
        label="Name"
        className="mb-4"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && !!errors.name}
        helperText={touched.name ? errors.name : undefined}
      />
      <FormTextField
        name="description"
        label="Beschreibung"
        className="mb-4"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.description && !!errors.description}
        helperText={touched.description ? errors.description : undefined}
      />
      <FormSelector
        variant="category"
        className="mb-4"
        value={values.category}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.category && !!errors.category}
        helperText={touched.category ? errors.category : undefined}
      />
      <FormSelector
        variant="frequency"
        className="mb-4"
        value={values.frequency}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.frequency && !!errors.frequency}
        helperText={touched.frequency ? errors.frequency : undefined}
      />
      <FormDateField name="dateUntil" label="Datum bis" />
    </FormikForm>
  );
}

export default Form;