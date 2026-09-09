import { Formik } from "formik";
import LoginForm from "@/components/organisms/LoginForm";
import type { LoginRequest } from "@/types/auth";

const noop = () => {};

export const Default = () => (
  <div className="w-96">
    <Formik<LoginRequest>
      initialValues={{ email: "", password: "" }}
      onSubmit={noop}
    >
      {(formik) => (
        <LoginForm
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

export const WithBackendError = () => (
  <div className="w-96">
    <Formik<LoginRequest>
      initialValues={{ email: "amelie@recur.app", password: "" }}
      initialTouched={{ email: true, password: true }}
      initialErrors={{ password: "Passwort ist erforderlich." }}
      onSubmit={noop}
    >
      {(formik) => (
        <LoginForm
          navigate={noop}
          onSubmit={formik.handleSubmit}
          values={formik.values}
          errors={formik.errors}
          touched={formik.touched}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          backendError="E-Mail oder Passwort ist ungültig."
        />
      )}
    </Formik>
  </div>
);

export const Loading = () => (
  <div className="w-96">
    <Formik<LoginRequest>
      initialValues={{ email: "amelie@recur.app", password: "geheim123" }}
      onSubmit={noop}
    >
      {(formik) => (
        <LoginForm
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
