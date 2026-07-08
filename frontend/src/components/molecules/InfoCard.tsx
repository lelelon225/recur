import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type InfoCardProps = {
  variant?: "error" | "info" | "warning" | "success";
  description?: string;
  title: string;
};

function getVariantClasses(variant: InfoCardProps["variant"]) {
  switch (variant) {
    case "error":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "info":
      return "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800";
    case "warning":
      return "bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800";
    case "success":
      return "bg-green-100 text-green-900 border-green-300 dark:bg-green-950 dark:text-green-100 dark:border-green-800";
    default:
      return "bg-card text-card-foreground border-border";
  }
}

function InfoCard({ variant, description, title }: InfoCardProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className={cn("w-full max-w-[400px] border text-center shadow-md", getVariantClasses(variant))}>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        {description && (
          <CardContent>
            <p>{description}</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default InfoCard;