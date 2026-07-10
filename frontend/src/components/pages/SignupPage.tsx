
import { useNavigate } from "react-router-dom";
import SignupForm from "../organisms/SignupForm"
import { Card, CardContent } from "../ui/card"
import { useSignUpForm } from "@/hooks/useSignUpForm";

export default function SignupPage() {
  const navigate = useNavigate();
  const { handleSubmit } = useSignUpForm();
  return (
    <div className="flex min-h-svh items-center justify-center bg-background w-full h-full px-4 py-8">
        <Card className="w-full max-w-md border-none shadow-lg">
        <CardContent className="p-6">
            <SignupForm navigate={() => navigate("/login")} handleSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
