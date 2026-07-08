import { useCallback, useEffect } from "react";
import type { ReactNode } from "react";

export type NavigationDestination = {
  navigate: () => void;
  label: string;
  icon: ReactNode;
};

export function useNavigationBar(destinations: NavigationDestination[]) {
  useEffect(() => {
    destinations[0]?.navigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigation = useCallback(
    (value: string) => {
      const index = Number(value);
      destinations[index]?.navigate();
    },
    [destinations],
  );

  return { handleNavigation };
}