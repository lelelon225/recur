import { Formik } from "formik";
import SignupForm from "@/components/organisms/SignupForm";
import type { SignupFormValues } from "@/hooks/useSignUpForm";

const noop = () => {};

const emptyValues: SignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const Default = () => (
  <div className="w-96">
    <Formik<SignupFormValues> initialValues={emptyValues} onSubmit={noop}>
      {(formik) => (
        <SignupForm
          navigate={noop}
          onSubmit={formik.handleSubmit}
          values={formik.values}
          errors={formik.errors}
          touched={formik.touched}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
        />
      )}
    </Formik>
  </div>
);

export const WithErrors = () => (
  <div className="w-96">
    <Formik<SignupFormValues>
      initialValues={{
        firstName: "Amelie",
        lastName: "",
        email: "amelie@recur",
        password: "123",
        confirmPassword: "1234",
      }}
      initialTouched={{
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        confirmPassword: true,
      }}
      initialErrors={{
        lastName: "Nachname wird benötigt.",
        email: "Bitte gib eine gültige E-Mail-Adresse ein.",
        password: "Muss mindestens 8 Zeichen lang sein.",
        confirmPassword: "Passwörter stimmen nicht überein.",
      }}
      onSubmit={noop}
    >
      {(formik) => (
        <SignupForm
          navigate={noop}
          onSubmit={formik.handleSubmit}
          values={formik.values}
          errors={formik.errors}
          touched={formik.touched}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          backendError="Diese E-Mail-Adresse wird bereits verwendet."
        />
      )}
    </Formik>
  </div>
);

export const Loading = () => (
  <div className="w-96">
    <Formik<SignupFormValues>
      initialValues={{
        firstName: "Amelie",
        lastName: "Novak",
        email: "amelie@recur.app",
        password: "geheim123",
        confirmPassword: "geheim123",
      }}
      onSubmit={noop}
    >
      {(formik) => (
        <SignupForm
          navigate={noop}
          onSubmit={formik.handleSubmit}
          values={formik.values}
          errors={formik.errors}
          touched={formik.touched}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          loading
          submitDisabled
        />
      )}
    </Formik>
  </div>
);
