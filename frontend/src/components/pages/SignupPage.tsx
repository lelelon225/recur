import { useNavigate } from "react-router-dom";
import SignupForm from "../organisms/SignupForm"
import { Card, CardContent } from "../ui/card"
import { useSignUpForm, type SignupFormValues } from "@/hooks/useSignUpForm";
import { Formik } from "formik";
import * as yup from "yup";

const signupSchema = yup.object().shape({
  firstName: yup.string().required("Vorname ist erforderlich"),
  lastName: yup.string().required("Nachname ist erforderlich"),
  email: yup.string().email("Ungültige E-Mail-Adresse").required("E-Mail ist erforderlich"),
  password: yup.string().min(8, "Muss mindestens 8 Zeichen lang sein").required("Passwort ist erforderlich"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwörter stimmen nicht überein")
    .required("Bitte bestätige dein Passwort"),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const { handleSubmit, loading, submitDisabled, backendError } = useSignUpForm();

  return (
    <div className="flex min-h-svh items-center justify-center bg-background w-full h-full px-4 py-8">
        <Card className="w-full max-w-md border-none shadow-lg">
        <CardContent className="p-6">
            <Formik<SignupFormValues>
                initialValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }}
                validationSchema={signupSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, handleSubmit: formikHandleSubmit, handleBlur, errors, touched }) => (
                    <SignupForm
                        navigate={() => navigate("/login")}
                        onSubmit={formikHandleSubmit}
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        loading={loading}
                        submitDisabled={submitDisabled}
                        backendError={backendError}
                    />
                )}
            </Formik>
        </CardContent>
      </Card>
    </div>
  )
}