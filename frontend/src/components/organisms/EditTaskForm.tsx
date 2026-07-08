import { Formik } from "formik";
import * as yup from "yup";
import Form from "@/components/organisms/Form";
import { Separator } from "@/components/ui/separator";
import type { Task } from "@/services/taskService";
import useEditTaskForm from "@/hooks/useEditTaskForm";
import AppDialog from "@/components/molecules/AppDialog";

type EditTaskFormProps = {
  task: Task;
  onClose: () => void;
  onTaskUpdated?: (task: Task) => void;
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

function EditTaskForm({ task, onClose, onTaskUpdated }: EditTaskFormProps) {
  const { loading, handleSubmit } = useEditTaskForm({ task, onClose, onTaskUpdated });

  return (
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
        <AppDialog
          open
          onClose={onClose}
          onSubmit={formikHandleSubmit}
          loading={loading}
          submitDisabled={loading}
        >
          <h2 className="mb-2 text-lg font-bold">Bearbeite die Details der Aufgabe</h2>
          <Separator className="mb-4 h-px w-full" />
          <Form
            className="taskForm"
            onSubmit={formikHandleSubmit}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
        </AppDialog>
      )}
    </Formik>
  );
}

export default EditTaskForm;