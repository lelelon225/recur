import Dialog from "../atoms/Dialog";
import { Formik } from "formik";
import { useState } from "react";
import { createTask } from "../../services/taskService";
import type { Task } from "../../services/taskService";
import Form from "../molecules/Form";
import * as yup from "yup";
import { Typography } from "@mui/material";

type AddTaskFormProps = {
  onClose: () => void;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Name ist erforderlich"),
  description: yup.string().required("Beschreibung ist erforderlich"),
  category: yup.string().required("Kategorie ist erforderlich"),
  frequency: yup.string().required("Frequenz ist erforderlich"),
  dateUntil: yup.date().required("Fälligkeitsdatum ist erforderlich").min(new Date(), "Fälligkeitsdatum muss in der Zukunft liegen"),
});

function AddTaskForm({ onClose }: AddTaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: Task) => {
    setLoading(true);
    setSubmitDisabled(true);
    try {
      await createTask(values);
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unbekannter Fehler beim Erstellen der Aufgabe"
      );
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={true} onClose={handleClose} loading={loading} submitDisabled={submitDisabled}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: "bold", color:"white" }}>
        Neue Aufgabe hinzufügen
      </Typography>
      <Formik<Task>
        initialValues={{
          name: "",
          description: "",
          category: "",
          frequency: "",
          progress: 0,
          goal: "",
          dateUntil: null,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
            <Form
              onSubmit={handleSubmit}
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
              className="addTaskForm" 
            />
          )}
      </Formik>
      {error && <div className="formError">{error}</div>}
    </Dialog>
  );
}

export default AddTaskForm;