import { Form as FormikForm } from "formik";
import FormTextField from "@/components/molecules/FormTextField";
import FormDateField from "@/components/molecules/FormDateField";
import FormSelector from "@/components/molecules/FormSelector";
import FormTimeField from "@/components/molecules/FormTimeField";
function Form({ onSubmit, values, handleChange, handleBlur, errors, touched, className, }) {
    return (<FormikForm onSubmit={onSubmit} className={className}>
      <FormTextField name="name" label="Name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={(touched.name || values.name.length > 0) && !!errors.name} helperText={touched.name || values.name.length > 0 ? errors.name : undefined}/>
      <FormTextField name="description" label="Beschreibung" value={values.description} onChange={handleChange} onBlur={handleBlur} error={(touched.description || values.description.length > 0) &&
            !!errors.description} helperText={touched.description || values.description.length > 0
            ? errors.description
            : undefined}/>
      <FormSelector variant="category"/>
      <FormSelector variant="frequency"/>
      <FormTextField name="durationMinutes" label="Dauer (Minuten)" value={values.durationMinutes ?? ""} onChange={handleChange} onBlur={handleBlur} error={(touched.durationMinutes || (values.durationMinutes ?? 0) > 0) &&
            !!errors.durationMinutes} helperText={touched.durationMinutes || (values.durationMinutes ?? 0) > 0
            ? errors.durationMinutes
            : undefined}/>
      <FormDateField name="startDate" label="Startdatum"/>
      <FormTimeField name="startTimeOfDay" label="Startzeit" value={values.startTimeOfDay} onChange={handleChange} onBlur={handleBlur}/>

      <FormDateField name="dateUntil" label="Datum bis"/>
    </FormikForm>);
}
export default Form;
