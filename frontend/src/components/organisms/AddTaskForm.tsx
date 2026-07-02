import Dialog from "../atoms/Dialog";
import { Formik } from "formik";
import { useState } from "react";
import { createTask } from "../../services/taskService";
import type { Task } from "../../services/taskService";
import Form from "../molecules/Form";
import * as yup from "yup";

type AddTaskFormProps = {
  onClose: () => void;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Name ist erforderlich"),
  description: yup.string().required("Beschreibung ist erforderlich"),
  category: yup.string().required("Kategorie ist erforderlich"),
  progress: yup
    .number()
    .min(0, "Fortschritt muss mindestens 0 sein")
    .max(100, "Fortschritt darf höchstens 100 sein")
    .required("Fortschritt ist erforderlich"),
  goal: yup.string().required("Ziel ist erforderlich"),
  dateUntil: yup.date().nullable(),
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
      <Formik<Task>
        initialValues={{
          name: "",
          description: "",
          category: "",
          progress: 0,
          goal: "",
          dateUntil: null,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            values={values}
            handleChange={handleChange}
            className="addTaskForm"
          />
        )}
      </Formik>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </Dialog>
  );
}

export default AddTaskForm;