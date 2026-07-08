import { Spinner } from "@/components/ui/spinner";

type LoadingTimeProps = {
  loading: boolean;
};

function LoadingTime({ loading }: LoadingTimeProps) {
  if (!loading) return null;

  return (
    <div className="flex items-center gap-2 text-base text-muted-foreground justify-center">
      <Spinner className="h-10 w-10" />
      <span>Lädt...</span>
    </div>
  );
}

export default LoadingTime;