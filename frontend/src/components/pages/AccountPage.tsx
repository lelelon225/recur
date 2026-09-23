import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import { useState } from "react";
import * as yup from "yup";
import type { UserResponse as User } from "@/types/auth";
import { patchUser } from "@/services/authService";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingButton from "@/components/atoms/loading/LoadingButton";
import AccountForm from "@/components/organisms/settings/AccountForm";
import { useAuth } from "@/contexts/AuthContext";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Vorname ist erforderlich"),
  lastName: yup.string().required("Nachname ist erforderlich"),
  avatarUrl: yup.string().url("Ungültige URL").nullable().notRequired(),
});

function AccountPage() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
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
    <div className="mx-auto max-w-xl px-4 py-6">
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
        }) => (
          <>
            <AccountForm
              onSubmit={handleSubmit}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              disabled={saving}
              className="flex flex-col gap-2"
            />
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            <LoadingButton
              type="button"
              onClick={() => handleSubmit()}
              loading={saving}
              disabled={!dirty}
              className="mt-4"
            >
              Speichern
            </LoadingButton>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AccountPage;
