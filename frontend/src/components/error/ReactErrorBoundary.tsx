import ErrorPage from "@/components/pages/ErrorPage";
import InlineErrorFallback from "@/components/error/InlineErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { type ReactNode } from "react";

type ReactErrorBoundaryProps = {
    variant?: "page" | "inline";
    errorCode?: number;
    errorMessage?: string;
    className?: string;
    children?: ReactNode;
};

function ReactErrorBoundary({
    variant = "page",
    errorCode,
    errorMessage,
    className,
    children,
}: ReactErrorBoundaryProps) {
    return (
        <ErrorBoundary
            FallbackComponent={({ error, resetErrorBoundary }) =>
                variant === "inline" ? (
                    <InlineErrorFallback
                        resetErrorBoundary={resetErrorBoundary}
                        errorMessage={errorMessage ?? error?.message}
                        className={className}
                    />
                ) : (
                    <ErrorPage
                        resetErrorBoundary={resetErrorBoundary}
                        errorCode={errorCode}
                        errorMessage={errorMessage ?? error?.message}
                    />
                )
            }
            onError={(error, errorInfo) => {
                console.error(error);
                console.error(errorInfo);
            }}
        >
            {children}
        </ErrorBoundary>
    );
}

export default ReactErrorBoundary;