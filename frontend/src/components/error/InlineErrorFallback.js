import { AlertTriangle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
function InlineErrorFallback({ resetErrorBoundary, errorMessage, className }) {
    return (<Card className={cn("min-h-auto min-w-auto border-destructive/20 bg-destructive/5", className)}>
            <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
                <AlertTriangle className="size-6 text-destructive"/>
                <p className="text-sm text-muted-foreground">
                    {errorMessage || "Dieser Inhalt konnte nicht angezeigt werden."}
                </p>
                {resetErrorBoundary && (<Button variant="outline" size="sm" onClick={resetErrorBoundary}>
                        <RotateCcw className="size-3.5"/>
                        Erneut versuchen
                    </Button>)}
            </CardContent>
        </Card>);
}
export default InlineErrorFallback;
