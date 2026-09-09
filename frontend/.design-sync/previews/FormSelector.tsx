import { Formik } from "formik";
import FormSelector from "@/components/molecules/FormSelector";

export const CategorySelected = () => (
  <div className="w-64">
    <Formik initialValues={{ category: "PERSONAL" }} onSubmit={() => {}}>
      <FormSelector variant="category" />
    </Formik>
  </div>
);

export const FrequencyPlaceholder = () => (
  <div className="w-64">
    <Formik initialValues={{ frequency: "" }} onSubmit={() => {}}>
      <FormSelector variant="frequency" />
    </Formik>
  </div>
);

export const Disabled = () => (
  <div className="w-64">
    <Formik initialValues={{ category: "WORK" }} onSubmit={() => {}}>
      <FormSelector variant="category" disabled />
    </Formik>
  </div>
);

export const ErrorState = () => (
  <div className="w-64">
    <Formik
      initialValues={{ category: "" }}
      initialTouched={{ category: true }}
      initialErrors={{ category: "Bitte wähle eine Kategorie." }}
      onSubmit={() => {}}
    >
      <FormSelector variant="category" />
    </Formik>
  </div>
);
