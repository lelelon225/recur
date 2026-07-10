import LoginForm  from "@/components/organisms/LoginForm"
import { Card, CardContent } from "../ui/card"
import { useNavigate } from "react-router-dom";
import { useLoginForm } from "@/hooks/useLoginForm";

function LoginPage() {
  const navigate = useNavigate();
  const { handleSubmit } = useLoginForm();

  return (
    <div className="flex min-h-svh items-center justify-center bg-background w-full h-full px-4 py-8">
        <Card className="w-full max-w-md border-none shadow-lg">
            <CardContent className="p-6">
                <LoginForm handleSubmit={handleSubmit} navigate={() => navigate("/register")} />
            </CardContent>
        </Card>
    </div>
  )
}



export default LoginPage