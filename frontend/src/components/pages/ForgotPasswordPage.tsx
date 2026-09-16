import { useRouter } from "next/navigation";
import { MailCheck, AlertCircle } from "lucide-react";
import LegalFooterLinks from "@/components/molecules/LegalFooterLinks";
import FormTextField from "@/components/molecules/FormTextField";
import LoadingButton from "@/components/atoms/LoadingButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldGroup } from "@/components/ui/field";
import { useForgotPasswordForm, type ForgotPasswordFormValues } from "@/hooks/useForgotPasswordForm";
import { Formik, Form } from "formik";
import * as yup from "yup";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Ungültige E-Mail-Adresse").required("E-Mail ist erforderlich"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { handleSubmit, loading, submitDisabled, backendError, submittedEmail } = useForgotPasswordForm();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background w-full h-full px-4 py-8">
      <Card className="w-full max-w-md border-none shadow-lg">
        {submittedEmail ? (
          <CardHeader className="flex flex-col items-center gap-3 text-center pb-2">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="size-7 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Prüfe deine E-Mails
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Falls ein Konto mit der Adresse {submittedEmail} existiert, haben wir
              dir einen Link zum Zurücksetzen deines Passworts gesendet.
            </CardDescription>
            <Button
              variant="link"
              className="p-0"
              onClick={() => router.push("/login")}
            >
              Zurück zum Login
            </Button>
          </CardHeader>
        ) : (
          <CardContent className="p-6">
            <Formik<ForgotPasswordFormValues>
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, errors, touched }) => (
                <Form className="flex flex-col gap-6">
                  <FieldGroup>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <h1 className="text-2xl font-bold">Passwort vergessen?</h1>
                      <p className="text-sm text-balance text-muted-foreground">
                        Gib deine E-Mail-Adresse ein, wir senden dir einen Link zum
                        Zurücksetzen deines Passworts.
                      </p>
                    </div>

                    {backendError && (
                      <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription>{backendError}</AlertDescription>
                      </Alert>
                    )}

                    <FormTextField
                      name="email"
                      label="E-Mail"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={(touched.email || values.email.length > 0) && !!errors.email}
                      helperText={
                        touched.email || values.email.length > 0 ? errors.email : undefined
                      }
                    />

                    <Field>
                      <LoadingButton
                        type="submit"
                        className="w-full font-semibold"
                        loading={loading}
                        disabled={submitDisabled}
                      >
                        Link senden
                      </LoadingButton>
                    </Field>

                    <Button
                      type="button"
                      variant="link"
                      className="p-0 self-center"
                      onClick={() => router.push("/login")}
                    >
                      Zurück zum Login
                    </Button>
                  </FieldGroup>
                </Form>
              )}
            </Formik>
          </CardContent>
        )}
      </Card>
      <LegalFooterLinks />
    </div>
  );
}
