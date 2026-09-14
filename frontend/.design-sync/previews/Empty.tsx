import Empty from "@/components/molecules/Empty";
import { FilePlus2, Star, Archive } from "lucide-react";

export const Default = () => (
  <div className="w-full max-w-sm">
    <Empty
      icon={() => <FilePlus2 className="h-10 w-10 text-muted-foreground" />}
      title="No habits yet"
      description="Create your first recurring task to start building a streak."
      buttonText="Create habit"
      onButtonClick={() => {}}
    />
  </div>
);

export const NoFavorites = () => (
  <div className="w-full max-w-sm">
    <Empty
      icon={() => <Star className="h-10 w-10 text-muted-foreground" />}
      title="No favorites yet"
      description="Mark a habit as favorite to see it here for quick access."
    />
  </div>
);

export const EmptyArchive = () => (
  <div className="w-full max-w-sm">
    <Empty
      icon={() => <Archive className="h-10 w-10 text-muted-foreground" />}
      title="Archive is empty"
      description="Tasks you archive will show up here so you can restore them later."
      buttonText="Back to tasks"
      onButtonClick={() => {}}
    />
  </div>
);
