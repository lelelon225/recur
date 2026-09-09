import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import useDarkMode from "@/hooks/useDarkMode";
import { SidebarMenuButton } from "@/components/ui/sidebar";
function DarkModeToggle() {
    const { isDark, toggleDark } = useDarkMode();
    return (<SidebarMenuButton onClick={() => toggleDark(!isDark)} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground", isDark ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground")}>
      {isDark ? (<>
          <Moon className="h-4 w-4"/>
          <span>Dark Mode</span>
        </>) : (<>
          <Sun className="h-4 w-4"/>
          <span>Light Mode</span>
        </>)}
    </SidebarMenuButton>);
}
export default DarkModeToggle;
