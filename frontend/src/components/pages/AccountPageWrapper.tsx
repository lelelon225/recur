import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import useUserDetails from "@/hooks/useUserDetails";
import AccountPage from "./AccountPage";

function AccountPageWrapper() {
  const { user } = useUserDetails();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <AccountPage
      firstName={user.firstName}
      lastName={user.lastName}
      email={user.email}
      avatarUrl={user.avatarUrl}
      onClose={() => navigate(-1)}
    />
  );
}

export default AccountPageWrapper;
