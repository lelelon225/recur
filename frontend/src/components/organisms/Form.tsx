import type { FormEvent, ChangeEvent, FocusEvent } from "react";
import { Form as FormikForm } from "formik";
import type { FormikErrors, FormikTouched } from "formik";
import { type NewTask } from "@/services/taskService";
import FormTextField from "@/components/molecules/FormTextField";
import FormDateField from "@/components/molecules/FormDateField";
import FormSelector from "@/components/molecules/FormSelector";

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
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={(touched.name || values.name.length > 0) && !!errors.name}
      helperText={(touched.name || values.name.length > 0) ? errors.name : undefined}
      />
      <FormTextField
        name="description"
        label="Beschreibung"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={(touched.description || values.description.length > 0) && !!errors.description}
        helperText={(touched.description || values.description.length > 0) ? errors.description : undefined}
      />
      <FormSelector variant="category" />
      <FormSelector variant="frequency" />
      <FormDateField name="dateUntil" label="Datum bis" />
    </FormikForm>
  );
}

export default Form;