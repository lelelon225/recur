import { Formik } from "formik";
import { Separator } from "@/components/ui/separator";
import type { NewTask, Task, TaskCategory, TaskFrequency } from "@/services/taskService";
import useAddTaskForm from "@/hooks/useAddTaskForm";
import AppDialog from "@/components/molecules/AppDialog";
import {taskValidationSchema} from "@/schemas/taskSchema";
import Form from "@/components/organisms/Form";

type AddTaskFormProps = {
  onClose: () => void;
  onTaskCreated?: (task: Task) => void;
};

function AddTaskForm({ onClose, onTaskCreated }: AddTaskFormProps) {
  const { loading, submitDisabled, handleSubmit } = useAddTaskForm({
    onClose,
    onTaskCreated,
  });

  return (
    <Formik<NewTask>
      initialValues={{
        name: "",
        description: "",
        progress: 0,
        category: "" as TaskCategory,
        frequency: "" as TaskFrequency,
        dateUntil: "",
      }}
      onSubmit={handleSubmit}
      validationSchema={taskValidationSchema}
    >
      {({ values, handleChange, handleSubmit: formikHandleSubmit, handleBlur, errors, touched, isValid, dirty }) => (
        <AppDialog
          open
          onClose={onClose}
          onSubmit={formikHandleSubmit}
          loading={loading}
          submitDisabled={submitDisabled || !dirty || !isValid}
        >
          <h2 className="mb-2 text-lg font-bold">Neue Aufgabe hinzufügen</h2>
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

export default AddTaskForm;