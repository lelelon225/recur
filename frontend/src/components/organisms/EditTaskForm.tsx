import { Formik } from "formik";
import Form from "@/components/organisms/Form";
import { Separator } from "@/components/ui/separator";
import type { Task } from "@/services/taskService";
import useEditTaskForm from "@/hooks/useEditTaskForm";
import AppDialog from "@/components/molecules/AppDialog";
import { taskValidationSchema } from "@/schemas/taskSchema";

type EditTaskFormProps = {
  task: Task;
  onClose: () => void;
  onTaskUpdated?: (task: Task) => void;
};

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
      validationSchema={taskValidationSchema}
    >
      {({ values, handleChange, handleSubmit: formikHandleSubmit, handleBlur, errors, touched, isValid }) => (
        <AppDialog
          open
          onClose={onClose}
          onSubmit={formikHandleSubmit}
          loading={loading}
          submitDisabled={loading || !isValid}
        >
          <h2 className="mb-2 text-lg font-bold">Bearbeite die Details der Aufgabe</h2>
          <Separator className="h-px w-full" />
          <Form
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