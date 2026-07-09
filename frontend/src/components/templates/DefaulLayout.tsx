import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { History, Heart, Archive } from "lucide-react";
import AppBar from "@/components/molecules/AppBar";
import NavigationBar from "@/components/organisms/NavigationBar";
import { Toaster } from "@/components/ui/sonner";
import { AddTaskProvider } from "@/contexts/AddTaskContext";

type DefaultLayoutProps = {
  children: ReactNode;
  pageTitle?: string;
};

const NAV_ROUTES = [
  { path: "/", label: "Neuste", icon: History },
  { path: "/favorites", label: "Favoriten", icon: Heart },
  { path: "/archive", label: "Archiv", icon: Archive },
] as const;

function DefaultLayout({ children, pageTitle }: DefaultLayoutProps) {
  const navigate = useNavigate();

  const destinations = NAV_ROUTES.map(({ path, label, icon: Icon }) => ({
  path,
  navigate: () => navigate(path),
  label,
  icon: <Icon className="h-5 w-5" />,
}));

  return (
    <AddTaskProvider>
      <div className="flex min-h-screen flex-col">
        <AppBar>
          <h1 className="text-3xl font-bold tracking-wide">RECUR</h1>
        </AppBar>
        <div className="flex mx-auto w-full max-w-6xl px-4 py-6 pb-24">
          <div className="mb-6 flex w-full flex-col gap-4">
            <h1 className="text-left text-xl font-semibold text-foreground">{pageTitle}</h1>
            <main>{children}</main>
          </div>
        </div>
        <Toaster position="bottom-left" />
        <NavigationBar destinations={destinations} />
      </div>
    </AddTaskProvider>
  );
}

export default DefaultLayout;