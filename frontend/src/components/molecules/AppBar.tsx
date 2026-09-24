import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/atoms/UserAvatar";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAuth } from "@/contexts/AuthContext";

type AppBarProps = {
  title?: string;
  // Ob die aktuelle Route eines der 5 primären NAV_ROUTES-Ziele ist - auf
  // Mobile entscheidet das, ob links das Account-Avatar (primäre Route) oder
  // ein Zurück-Chevron (z.B. /account, /settings) angezeigt wird.
  isPrimaryRoute?: boolean;
};

function AppBar({ title, isPrimaryRoute = false }: AppBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isMobile = useBreakpoint() === "mobile";

  // Eine Ebene nach oben statt router.back(): als installierte PWA kann z.B.
  // /settings/notifications ohne In-App-Historie geöffnet werden (letzter
  // Screen beim Schliessen), dann liefe router.back() ins Leere.
  const segments = pathname.split("/").filter(Boolean);
  segments.pop();
  const backHref = segments.length ? `/${segments.join("/")}` : "/";

  if (isMobile) {
    return (
      <header className="grid h-16 shrink-0 grid-cols-[2.75rem_1fr_2.75rem] items-center border-b px-4">
        {isPrimaryRoute && user ? (
          <button
            type="button"
            aria-label="Account"
            onClick={() => router.push("/account")}
            className="justify-self-start rounded-full"
          >
            <UserAvatar user={user} className="h-10 w-10" />
          </button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Zurück"
            className="-ml-1 justify-self-start"
            onClick={() => router.push(backHref)}
          >
            <ChevronLeft />
          </Button>
        )}
        <h1 className="truncate text-center text-lg font-semibold text-foreground">
          {title}
        </h1>
      </header>
    );
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4 self-center!" />
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
    </header>
  );
}

export default AppBar;
