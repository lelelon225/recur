import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import DarkModeToggle from "@/components/atoms/DarkModeToggle";

type AppBarProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

function AppBar({ children, className, ...props }: AppBarProps) {
  return (
    <header className={cn("w-full bg-background border-b", className)} {...props}>
      <div className="flex h-20 w-full items-center justify-between px-4">
        {children}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default AppBar;