import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import GoogleLoginButton from "../atoms/GoogleLoginButton"
import { type FormEvent } from "react";
import { Form as FormikForm } from "formik";

type SignupFormProps = {
  navigate: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

function SignupForm({ handleSubmit, navigate }: SignupFormProps) {
  return (
    <FormikForm className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="firstName">Vorname</FieldLabel>
          <Input id="firstName" type="text" placeholder="John" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Nachname</FieldLabel>
          <Input id="lastName" type="text" placeholder="Doe" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input id="confirm-password" type="password" required />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
        <GoogleLoginButton />
          <FieldDescription className="px-6 text-center">
            Already have an account? <Button variant="link" onClick={navigate} className="p-0">
              Sign in
            </Button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FormikForm>
  )
}

export default SignupForm