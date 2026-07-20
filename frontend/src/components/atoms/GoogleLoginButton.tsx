import { Button } from "@/components/ui/button";

const GOOGLE_AUTH_URL = "/oauth2/authorization/google";

function GoogleLoginButton() {
    return (
        <Button
            variant="outline"
            className="w-full"
            onClick={() => {
                window.location.href = GOOGLE_AUTH_URL;
            }}
        >
            Mit Google anmelden
        </Button>
    );
}

export default GoogleLoginButton;