import { Formik } from "formik";
import * as yup from "yup";;
import Form from "./Form";
import { Separator } from "@/components/ui/separator";
import type { NewTask, Task, TaskCategory, TaskFrequency } from "../../services/taskService";
import useAddTaskForm from "@/hooks/useAddTaskForm";
import AppDialog from "../molecules/AppDialog";

type AddTaskFormProps = {
  onClose: () => void;
  onTaskCreated?: (task: Task) => void;
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

function AddTaskForm({ onClose, onTaskCreated }: AddTaskFormProps) {
  const { loading, submitDisabled, handleSubmit, isFormEmpty } = useAddTaskForm({
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
      validationSchema={validationSchema}
    >
      {({ values, handleChange, handleSubmit: formikHandleSubmit, handleBlur, errors, touched }) => (
        <AppDialog
          open
          onClose={onClose}
          onSubmit={formikHandleSubmit}
          loading={loading}
          submitDisabled={submitDisabled || isFormEmpty(values)}
        >
          <h2 className="mb-2 text-lg font-bold">Neue Aufgabe hinzufügen</h2>
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

export default AddTaskForm;