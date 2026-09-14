import DarkModeToggle from "@/components/atoms/DarkModeToggle";
import { SidebarMenu, SidebarMenuItem, SidebarProvider as SidebarProviderFresh } from "@/components/ui/sidebar";

// DarkModeToggle renders a SidebarMenuButton internally, so it needs the
// sidebar context from SidebarProvider to render/behave correctly.
//
// The story-imports plugin only redirects THIS file's own subject
// (DarkModeToggle) to the shared window.Recur bundle; a supporting import
// like SidebarProvider compiles fresh from src/components/ui/sidebar.tsx
// instead, which mints its own SidebarContext object distinct from the one
// window.Recur's (already-compiled) DarkModeToggle -> SidebarMenuButton
// closes over. Wrapping with the fresh SidebarProvider throws
// "useSidebar must be used within a SidebarProvider" even though the JSX
// nests correctly. Pulling SidebarProvider from window.Recur instead keeps
// it on the SAME context instance DarkModeToggle's internals use.
const SidebarProvider: typeof SidebarProviderFresh =
  (typeof window !== "undefined" && (window as any).Recur?.SidebarProvider) ||
  SidebarProviderFresh;
export const Default = () => (
  <SidebarProvider>
    <div className="w-72 p-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <DarkModeToggle />
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  </SidebarProvider>
);

// DarkModeToggle has no prop to force its state — it reads localStorage /
// prefers-color-scheme itself via useDarkMode. Pre-seed that before the
// toggle mounts so this cell renders the "dark" (Moon) branch.
function ForceDarkPreference({ children }: { children: React.ReactNode }) {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", "dark");
  }
  return <>{children}</>;
}

export const DarkActive = () => (
  <SidebarProvider>
    <ForceDarkPreference>
      <div className="w-72 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DarkModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </ForceDarkPreference>
  </SidebarProvider>
);
