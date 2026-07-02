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
  name: yup.string(),
  description: yup.string(),
  category: yup.string(),
  progress: yup
    .number()
    .min(0, "Fortschritt muss mindestens 0 sein")
    .max(100, "Fortschritt darf höchstens 100 sein"),
  goal: yup.string(),
  dateUntil: yup.date().nullable(),
});

function EditTaskForm({ task, onClose }: EditTaskFormProps) {
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
      <Formik<Partial<Task>>
        initialValues={{
          name: task.name,
          description: task.description,
          category: task.category,
          progress: task.progress,
          goal: task.goal,
          dateUntil: task.dateUntil,
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

export default EditTaskForm;
