import Dialog from "../atoms/Dialog";
import { Formik } from "formik";
import { useState } from "react";
import { patchTask } from "../../services/taskService";
import type { Task } from "../../services/taskService";
import Form from "../molecules/Form";
import * as yup from "yup";
import SnackAlert from "../atoms/SnackAlert";
import Typography from "@mui/material/Typography";

type EditTaskFormProps = {
  task: Task;
  onClose: () => void;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Name ist erforderlich"),
  description: yup.string().required("Beschreibung ist erforderlich"),
  category: yup.string().required("Kategorie ist erforderlich"),
  frequency: yup.string().required("Frequenz ist erforderlich"),
  dateUntil: yup
    .date()
    .required("Fälligkeitsdatum ist erforderlich")
    .min(new Date(), "Fälligkeitsdatum muss in der Zukunft liegen"),
});

function EditTaskForm({ task, onClose }: EditTaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function valuesChanged(values: Task): boolean {
  return !(
    values.name === task.name &&
    values.description === task.description &&
    values.category === task.category &&
    values.frequency === task.frequency &&
    values.dateUntil === task.dateUntil?.slice(0, 10)
  );
  }

  const handleSubmit = async (values: Task) => {
    if (!valuesChanged(values)) {
      setInfo("Keine Änderungen vorgenommen");
      return;
    }

    setLoading(true);
    setSubmitDisabled(true);
    setError(null);

    try {
      await patchTask(task.id, values);
      setSuccess("Aufgabe erfolgreich aktualisiert");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Aktualisieren der Aufgabe");
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

      {info && (
        <SnackAlert open={true} message={info} severity="info" onClose={() => setInfo(null)} />
      )}

      <Formik<Task>
        initialValues={{
          id: task.id,
          name: task.name,
          description: task.description,
          progress: task.progress,
          category: task.category,
          frequency: task.frequency,
          dateUntil: task.dateUntil?.slice(0, 10) || "",
          dateCreated: task.dateCreated,
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
            submitDisabled={submitDisabled}
          >
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: "bold", color: "white" }}>
              Bearbeite die Details der Aufgabe
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

export default EditTaskForm;