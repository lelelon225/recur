import Dialog from "../atoms/Dialog";
import { Formik } from "formik";
import { useState } from "react";
import { createTask, TaskCategory, TaskFrequency } from "../../services/taskService";
import type { NewTask } from "../../services/taskService";
import SnackAlert from "../atoms/SnackAlert";
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

function isFormEmpty(values: NewTask): boolean {
  return (
    !values.name &&
    !values.description &&
    !values.category &&
    !values.frequency &&
    !values.dateUntil
  );
}

function AddTaskForm({ onClose }: AddTaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emptyAlertOpen, setEmptyAlertOpen] = useState(false);

  const handleSubmit = async (values: NewTask) => {
    if (isFormEmpty(values)) {
      setEmptyAlertOpen(true);
      return;
    }

    setLoading(true);
    setSubmitDisabled(true);
    setError(null);

    try {
      await createTask(values);
      setSuccess("Aufgabe erfolgreich erstellt.");
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
      setError("Fehler beim Erstellen der Aufgabe.");
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {error && (
        <SnackAlert
          message={error}
          severity="error"
          open={true}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <SnackAlert
          message={success}
          severity="success"
          open={true}
          onClose={() => setSuccess(null)}
        />
      )}

      {emptyAlertOpen && (
        <SnackAlert
          message="Bitte füllen Sie alle erforderlichen Felder aus."
          severity="warning"
          open={true}
          onClose={() => setEmptyAlertOpen(false)}
        />
      )}

      <Formik<NewTask>
        initialValues={{
          name: "",
          description: "",
          progress: 0,
          category: "" as TaskCategory,
          frequency:"" as TaskFrequency,
          dateUntil: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, handleSubmit: formikHandleSubmit, handleBlur, errors, touched }) => (
          <Dialog
            open={true}
            onClose={handleClose}
            onSubmit={formikHandleSubmit}
            loading={loading}
            submitDisabled={submitDisabled || isFormEmpty(values)}
          >
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: "bold", color: "white" }}>
              Neue Aufgabe hinzufügen
            </Typography>
            <Form
              className="taskForm"
              onSubmit={formikHandleSubmit}
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
          </Dialog>
        )}
      </Formik>
    </>
  );
}

export default AddTaskForm;