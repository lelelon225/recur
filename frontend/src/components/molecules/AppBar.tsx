import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

type AppBarProps = {
  title?: string;
};

function AppBar({ title }: AppBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
    </header>
  );
}

export default AppBar;
