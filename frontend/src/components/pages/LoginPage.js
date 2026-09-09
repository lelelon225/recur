import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/organisms/LoginForm";
import { Card, CardContent } from "../ui/card";
import { useLoginForm } from "@/hooks/useLoginForm";
import { Formik } from "formik";
import * as yup from "yup";
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email("Ungültige E-Mail-Adresse")
        .required("E-Mail ist erforderlich"),
    password: yup.string().required("Passwort ist erforderlich"),
});
function LoginPage() {
    const navigate = useNavigate();
    const { handleSubmit, submitDisabled, loading, backendError } = useLoginForm();
    return (<div className="flex min-h-svh items-center justify-center bg-background w-full h-full px-4 py-8">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardContent className="p-6">
          <Formik initialValues={{ email: "", password: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
            {({ values, handleChange, handleSubmit: formikHandleSubmit, handleBlur, errors, touched, }) => (<LoginForm navigate={() => navigate("/register")} onSubmit={formikHandleSubmit} values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} loading={loading} submitDisabled={submitDisabled} backendError={backendError}/>)}
          </Formik>
        </CardContent>
      </Card>
    </div>);
}
export default LoginPage;
