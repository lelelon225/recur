import AuthStatusCard from "@/components/molecules/AuthStatusCard";
import { useLogoutRedirect } from "@/hooks/useLogoutRedirect";

function LogoutPage() {
    const { title, description } = useLogoutRedirect();

    return <AuthStatusCard status="loading" title={title} description={description} />;
}

export default LogoutPage;
