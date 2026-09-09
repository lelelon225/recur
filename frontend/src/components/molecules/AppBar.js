import { cn } from "@/lib/utils";
import DarkModeToggle from "@/components/atoms/DarkModeToggle";
function AppBar({ children, className, ...props }) {
    return (<header className={cn("w-full bg-background border-b", className)} {...props}>
      <div className="flex h-20 w-full items-center justify-between px-4">
        {children}
        <DarkModeToggle />
      </div>
    </header>);
}
export default AppBar;
