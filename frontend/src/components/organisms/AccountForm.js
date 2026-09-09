import { Form as FormikForm } from "formik";
import FormTextField from "@/components/molecules/FormTextField";
function AccountForm({ onSubmit, values, handleChange, handleBlur, errors, touched, className, }) {
    return (<FormikForm onSubmit={onSubmit} className={className}>
      <FormTextField name="firstName" label="Vorname" value={values.firstName ?? ""} onChange={handleChange} onBlur={handleBlur} error={!!touched.firstName && !!errors.firstName} helperText={touched.firstName ? errors.firstName : undefined}/>
      <FormTextField name="lastName" label="Nachname" value={values.lastName ?? ""} onChange={handleChange} onBlur={handleBlur} error={!!touched.lastName && !!errors.lastName} helperText={touched.lastName ? errors.lastName : undefined}/>
      <FormTextField name="email" label="E-Mail" type="email" value={values.email ?? ""} onChange={handleChange} onBlur={handleBlur} error={!!touched.email && !!errors.email} helperText={touched.email ? errors.email : undefined}/>
      <FormTextField name="avatarUrl" label="Avatar-URL" value={values.avatarUrl ?? ""} onChange={handleChange} onBlur={handleBlur} error={!!touched.avatarUrl && !!errors.avatarUrl} helperText={touched.avatarUrl ? errors.avatarUrl : undefined}/>
    </FormikForm>);
}
export default AccountForm;
