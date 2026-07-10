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

type LoginFormProps = {
  navigate: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function LoginForm({ handleSubmit, navigate }: LoginFormProps) {
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit">
            Login
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <GoogleLoginButton />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Button variant="link" onClick={navigate} className="p-0">
              Sign Up  
            </Button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm