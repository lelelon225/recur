import { Formik } from "formik";
import type { Task } from "@/services/taskService";
import * as yup from "yup";
import AppDialog from "@/components/molecules/AppDialog";
import Form from "./Form";
import useEditTaskForm, {
  type EditableTaskFields,
} from "@/hooks/useEditTaskForm";

type EditTaskFormProps = {
  task: Task;
  onClose: () => void;
  onTaskUpdated?: (task: Task) => void;
};

const validationSchema = yup.object().shape({
  name: yup.string(),
  description: yup.string(),
  category: yup.string(),
  progress: yup
    .number()
    .min(0, "Fortschritt muss mindestens 0 sein")
    .max(100, "Fortschritt darf höchstens 100 sein"),
  frequency: yup.string(),
  dateUntil: yup.date().nullable(),
  durationMinutes: yup
    .number()
    .min(1, "Dauer muss mindestens 1 Minute betragen")
    .required("Dauer ist erforderlich"),
  startDate: yup.date().required("Startdatum ist erforderlich"),
  startTimeOfDay: yup.string().required("Startzeit ist erforderlich"),
});

function EditTaskForm({ task, onClose, onTaskUpdated }: EditTaskFormProps) {
  const { loading, handleSubmit } = useEditTaskForm({
    task,
    onClose,
    onTaskUpdated,
  });

  return (
    <Formik<EditableTaskFields>
      initialValues={{
        name: task.name ?? "",
        description: task.description ?? "",
        category: task.category ?? "",
        frequency: task.frequency ?? "",
        progress: task.progress ?? 0,
        dateUntil: task.dateUntil ? task.dateUntil.slice(0, 10) : "",
        durationMinutes: task.durationMinutes ?? null,
        startDate: task.startTime ? task.startTime.slice(0, 10) : "",
        startTimeOfDay: task.startTime ? task.startTime.slice(11, 16) : "",
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit: formikHandleSubmit,
        errors,
        touched,
        dirty,
        isValid,
      }) => (
        <AppDialog
          open
          onClose={onClose}
          title="Bearbeite die Details der Aufgabe"
          onSubmit={() => formikHandleSubmit()}
          loading={loading}
          submitDisabled={loading || !dirty || !isValid}
        >
          <Form
            onSubmit={formikHandleSubmit}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
            className="addTaskForm"
          />
        </AppDialog>
      )}
    </Formik>
  );
}

export default EditTaskForm;
