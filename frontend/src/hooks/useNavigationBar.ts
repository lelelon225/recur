import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export type NavigationDestination = {
  path: string;
  navigate: () => void;
  label: string;
  icon: ReactNode;
};

export function useNavigationBar(destinations: NavigationDestination[]) {
  const location = useLocation();

  // Aktiven Tab aus der aktuellen URL ableiten, statt beim Mount aktiv zu
  // destinations[0] umzuleiten. So bleibt z.B. ein Direktaufruf von /archive
  // (Reload, Lesezeichen, geteilter Link) erhalten, und der Tab zeigt auch
  // nach einem Reload den korrekten aktiven Zustand.
  const activeValue = useMemo(() => {
    const index = destinations.findIndex((d) => d.path === location.pathname);
    return String(index === -1 ? 0 : index);
  }, [destinations, location.pathname]);

  const handleNavigation = useCallback(
    (value: string) => {
      const index = Number(value);
      destinations[index]?.navigate();
    },
    [destinations],
  );

  return { activeValue, handleNavigation };
}