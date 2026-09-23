import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import { useState } from "react";
import * as yup from "yup";
import type { UserResponse as User } from "@/types/auth";
import { patchUser } from "@/services/authService";
import { Skeleton } from "@/components/ui/skeleton";
import AccountForm from "./AccountForm";
import { useAuth } from "@/contexts/AuthContext";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Vorname ist erforderlich"),
  lastName: yup.string().required("Nachname ist erforderlich"),
  avatarUrl: yup.string().url("Ungültige URL").nullable().notRequired(),
});

function AccountSection() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return <Skeleton className="h-40 w-full" />;
  }

  const handleSubmit = async (
    values: Partial<User>,
    { resetForm }: FormikHelpers<Partial<User>>
  ) => {
    setError(null);
    setSaving(true);
    try {
      const saved = await patchUser({
        firstName: values.firstName,
        lastName: values.lastName,
        avatarUrl: values.avatarUrl,
      } as User);
      updateUser(saved);
      resetForm({ values: saved });
    } catch (err) {
      resetForm({ values: user });
      setError(
        err instanceof Error
          ? err.message
          : "Unbekannter Fehler beim Bearbeiten des Accounts"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Formik<Partial<User>>
      initialValues={user}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        touched,
        dirty,
        handleChange,
        handleBlur,
        handleSubmit,
        submitForm,
      }) => (
        <>
          <AccountForm
            onSubmit={handleSubmit}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={(event) => {
              handleBlur(event);
              if (dirty) submitForm();
            }}
            disabled={saving}
            className="flex flex-col gap-2"
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </>
      )}
    </Formik>
  );
}

export default AccountSection;
