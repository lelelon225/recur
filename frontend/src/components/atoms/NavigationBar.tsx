import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useEffect, useState, type ReactNode } from "react";
import type { BottomNavigationProps } from "@mui/material/BottomNavigation";

type NavigationBarProps = BottomNavigationProps & {
  destinations: {
    navigate: () => void;
    label: string;
    icon: ReactNode;
  }[];
};

function NavigationBar({ className, destinations }: NavigationBarProps) {
  const [value, setValue] = useState(0);

  function handleNavigation(index: number) {
    setValue(index);
    destinations[index].navigate();
  }

  useEffect(() => {
    destinations[0].navigate();
  }, []);

  return (
    <Box sx={{ width: "100%" }} className={className}>
      <BottomNavigation value={value} onChange={(_, v) => setValue(v)}>
        {destinations.map((destination, index) => (
          <BottomNavigationAction
            key={index}
            label={destination.label}
            icon={destination.icon}
            onClick={() => {
              handleNavigation(index);
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}

export default NavigationBar;
