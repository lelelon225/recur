import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type FloatingActionButtonProps = {
  onClick?: () => void;
};

function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      size="icon"
      onClick={onClick}
      className="relative z-10 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg shrink-0"
    >
      <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
    </Button>
  );
}

export default FloatingActionButton;