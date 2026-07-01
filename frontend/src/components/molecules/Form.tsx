import React from "react";
import { Form as FormikForm } from "formik";
import { TextField, Button } from "@mui/material";
import { type Task } from "../../services/taskService";

type FormProps = {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    values: Task;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};

function Form ({ onSubmit, values, handleChange, className }: FormProps) {
    return (
        <FormikForm onSubmit={onSubmit} className={className}>
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
                label="Progress"
                type="number"
                value={values.progress}
                onChange={handleChange}
                name="progress"
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
                value={values.date_until || ""}
                onChange={handleChange}
                name="date_until"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </FormikForm>
    );
}

export default Form;