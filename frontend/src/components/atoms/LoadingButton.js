import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
function LoadingButton({ loading, disabled, children, ...props }) {
    return (<Button disabled={disabled || loading} {...props}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : children}
    </Button>);
}
export default LoadingButton;
