import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { History, Heart, Archive, Calendar, Users } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { AddTaskProvider } from "@/contexts/AddTaskContext";
import { ImportQuartalsplanProvider } from "@/contexts/ImportQuartalsplanContext";
import Fab from "@/components/atoms/FloatingActionButton";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import AppSidebar from "../organisms/sidebar/AppSidebar";
import AppBar from "../molecules/AppBar";

type DefaultLayoutProps = {
  children: ReactNode;
  pageTitle?: string;
};

const NAV_ROUTES = [
  { path: "/", label: "Neuste", icon: History },
  { path: "/favorites", label: "Favoriten", icon: Heart },
  { path: "/archive", label: "Archiv", icon: Archive },
  { path: "/calendar", label: "Kalender", icon: Calendar },
  { path: "/groups", label: "Gruppen", icon: Users },
] as const;

function DefaultLayout({ children, pageTitle }: DefaultLayoutProps) {
  const router = useRouter();

  const destinations = NAV_ROUTES.map(({ path, label, icon: Icon }) => ({
    path,
    navigate: () => router.push(path),
    label,
    icon: Icon,
  }));

  return (
    <AddTaskProvider>
      <ImportQuartalsplanProvider>
        <SidebarProvider>
          <AppSidebar destinations={destinations} />

          <SidebarInset>
            <AppBar title={pageTitle} />

            <div className="flex mx-auto w-full max-w-6xl px-4 py-6 pb-24">
              <main className="w-full">{children}</main>
            </div>

            <Toaster position="bottom-left" />
            <Fab className="fixed bottom-4 right-4" />
          </SidebarInset>
        </SidebarProvider>
      </ImportQuartalsplanProvider>
    </AddTaskProvider>
  );
}

export default DefaultLayout;
