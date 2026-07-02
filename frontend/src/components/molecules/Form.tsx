import React from "react";
import { Form as FormikForm } from "formik";
import { type Task } from "../../services/taskService";
import FormTextField from "../atoms/FormTextField";
import FormSelector from "../atoms/FormSelector";

type FormErrors = Partial<Record<keyof Task, string>>;
type FormTouched = Partial<Record<keyof Task, boolean>>;

type FormProps = {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    values: Task;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
    errors: FormErrors;
    touched: FormTouched;
    className?: string;
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
            />
            <FormTextField
                name="description"
                label="Beschreibung"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && !!errors.description}
                helperText={touched.description ? errors.description : undefined}
            />
            <FormSelector
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                category={true}
                error={touched.category && !!errors.category}
                helperText={touched.category ? errors.category : undefined}
            />
            <FormSelector
                value={values.frequency}
                onChange={handleChange}
                onBlur={handleBlur}
                category={false}
                error={touched.frequency && !!errors.frequency}
                helperText={touched.frequency ? errors.frequency : undefined}
            />
            <FormTextField
                name="dateUntil"
                label="Fälligkeitsdatum"
                type="date"
                value={values.dateUntil}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.dateUntil && !!errors.dateUntil}
                helperText={touched.dateUntil ? errors.dateUntil : undefined}
            />
        </FormikForm>
    );
}

export default Form;