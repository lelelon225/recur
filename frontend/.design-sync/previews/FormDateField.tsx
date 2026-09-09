import { Formik } from "formik";
import FormDateField from "@/components/molecules/FormDateField";

export const Default = () => (
  <div className="w-72">
    <Formik initialValues={{ dateUntil: "" }} onSubmit={() => {}}>
      <FormDateField name="dateUntil" label="Bis wann?" />
    </Formik>
  </div>
);

export const WithValue = () => (
  <div className="w-72">
    <Formik initialValues={{ dateUntil: "2026-12-31" }} onSubmit={() => {}}>
      <FormDateField name="dateUntil" label="Bis wann?" />
    </Formik>
  </div>
);

export const ErrorState = () => (
  <div className="w-72">
    <Formik
      initialValues={{ dateUntil: "" }}
      initialTouched={{ dateUntil: true }}
      initialErrors={{ dateUntil: "Bitte wähle ein Enddatum." }}
      onSubmit={() => {}}
    >
      <FormDateField name="dateUntil" label="Bis wann?" />
    </Formik>
  </div>
);
