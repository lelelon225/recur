import ErrorPage from "@/components/pages/ErrorPage";
import InlineErrorFallback from "@/components/error/InlineErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
function ReactErrorBoundary({ variant = "page", errorCode, errorMessage, className, fullScreen = true, children, }) {
    return (<ErrorBoundary FallbackComponent={({ error, resetErrorBoundary }) => variant === "inline" ? (<InlineErrorFallback resetErrorBoundary={resetErrorBoundary} errorMessage={errorMessage ?? error?.message} className={className}/>) : (<ErrorPage resetErrorBoundary={resetErrorBoundary} errorCode={errorCode} errorMessage={errorMessage ?? error?.message} fullScreen={fullScreen}/>)} onError={(error, errorInfo) => {
            console.error(error);
            console.error(errorInfo);
        }}>
            {children}
        </ErrorBoundary>);
}
export default ReactErrorBoundary;
