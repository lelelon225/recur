import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export type NavigationDestination = {
  path: string;
  navigate: () => void;
  label: string;
  icon: LucideIcon;
};

export function useNavigationBar(destinations: NavigationDestination[]) {
  const location = useLocation();

  // Aktiven Tab aus der aktuellen URL ableiten, statt beim Mount aktiv zu
  // destinations[0] umzuleiten. So bleibt z.B. ein Direktaufruf von /archive
  // (Reload, Lesezeichen, geteilter Link) erhalten, und der Tab zeigt auch
  // nach einem Reload den korrekten aktiven Zustand.
  const activeValue = useMemo(() => {
    const match = destinations.find((d) => d.path === location.pathname);
    return match?.path ?? destinations[0]?.path ?? "";
  }, [destinations, location.pathname]);

  const handleNavigation = useCallback(
    (path: string) => {
      destinations.find((d) => d.path === path)?.navigate();
    },
    [destinations],
  );

  return { activeValue, handleNavigation };
}