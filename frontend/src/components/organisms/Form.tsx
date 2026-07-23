import type { FormEvent, ChangeEvent, FocusEvent } from "react";
import { Form as FormikForm } from "formik";
import type { FormikErrors, FormikTouched } from "formik";
import { type TaskCategory, type TaskFrequency } from "@/services/taskService";
import FormTextField from "@/components/molecules/FormTextField";
import FormDateField from "@/components/molecules/FormDateField";
import FormSelector from "@/components/molecules/FormSelector";
import FormTimeField from "@/components/molecules/FormTimeField";

export type FormValues = {
  name: string;
  description: string;
  category: TaskCategory | "";
  frequency: TaskFrequency | "";
  dateUntil: string;
  durationMinutes: number | null;
  startDate: string;
  startTimeOfDay: string;
  startTime: string | null;
};

type FormProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  values: FormValues;
  errors: FormikErrors<FormValues>;
  touched: FormikTouched<FormValues>;
  className?: string;
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
        helperText={
          touched.name || values.name.length > 0 ? errors.name : undefined
        }
      />
      <FormTextField
        name="description"
        label="Beschreibung"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          (touched.description || values.description.length > 0) &&
          !!errors.description
        }
        helperText={
          touched.description || values.description.length > 0
            ? errors.description
            : undefined
        }
      />
      <FormSelector variant="category" />
      <FormSelector variant="frequency" />
      <FormTextField
        name="durationMinutes"
        label="Dauer (Minuten)"
        value={values.durationMinutes ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          (touched.durationMinutes || (values.durationMinutes ?? 0) > 0) &&
          !!errors.durationMinutes
        }
        helperText={
          touched.durationMinutes || (values.durationMinutes ?? 0) > 0
            ? errors.durationMinutes
            : undefined
        }
      />
      <FormDateField name="startDate" label="Startdatum" />
      <FormTimeField
        name="startTimeOfDay"
        label="Startzeit"
        value={values.startTimeOfDay}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <FormDateField name="dateUntil" label="Datum bis" />
    </FormikForm>
  );
}
export default Form;
