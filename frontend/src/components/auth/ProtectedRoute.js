import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
/**
 * Wraps a route that requires authentication.
 * - While the initial auth check is running, shows a loading state
 *   (prevents a flash of the login page for already-logged-in users).
 * - If not authenticated, redirects to /login and remembers where the
 *   user was trying to go, so we can send them back after login.
 * - Otherwise renders the protected content.
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (<div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8 text-primary"/>
      </div>);
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }}/>;
    }
    return <>{children}</>;
}
export default ProtectedRoute;
