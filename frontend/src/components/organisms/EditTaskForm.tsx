import Dialog from "../atoms/Dialog";
import { Formik } from "formik";
import { useState } from "react";
import { patchTask } from "../../services/taskService";
import type { Task } from "../../services/taskService";
import Form from "../molecules/Form";
import * as yup from "yup";

type EditTaskFormProps = {
  task: Task;
  onClose: () => void;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Name ist erforderlich"),
  description: yup.string().required("Beschreibung ist erforderlich"),
  category: yup.string().required("Kategorie ist erforderlich"),
  frequency: yup.string().required("Frequenz ist erforderlich"),
  dateUntil: yup.date().required("Fälligkeitsdatum ist erforderlich").min(new Date(), "Fälligkeitsdatum muss in der Zukunft liegen"),
});

function EditTaskForm({task, onClose }: EditTaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: Partial<Task>) => {
    setLoading(true);
    setSubmitDisabled(true);
    setError(null);
    try {
      await patchTask(task.id, values);
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unbekannter Fehler beim Bearbeiten der Aufgabe"
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
    <Dialog
      open={true}
      onClose={handleClose}
      loading={loading}
      submitDisabled={submitDisabled}
    >
      <Formik
        initialValues={{
          name: task.name,
          description: task.description,
          category: task.category,
          frequency: task.frequency,
          dateUntil: task.dateUntil,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <Form
            values={values}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            errors={errors}
            touched={touched}
            submitDisabled={submitDisabled}
          />
        )}
      </Formik>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </Dialog>
  );
}

export default EditTaskForm;
