import { Moon, Sun } from "lucide-react";
import { Toggle } from "@base-ui/react/toggle";
import { cn } from "@/lib/utils";
import useDarkMode from "@/hooks/useDarkMode";

function DarkModeToggle() {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <Toggle
      pressed={isDark}
      onPressedChange={toggleDark}
      aria-label={isDark ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md",
        "text-foreground/70 hover:bg-accent hover:text-foreground",
        "data-[pressed]:bg-accent data-[pressed]:text-foreground",
        "transition-colors"
      )}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Toggle>
  );
}

export default DarkModeToggle;