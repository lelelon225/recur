import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
function TaskFavorite({ isFavorite, onClick }) {
    return (<Button variant="ghost" size="icon" className="hover:bg-accent" onClick={(e) => {
            e.stopPropagation();
            onClick(e);
        }}>
      <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")}/>
    </Button>);
}
export default TaskFavorite;
