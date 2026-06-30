


import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useState, type ReactNode } from 'react';
import type {BottomNavigationProps} from '@mui/material/BottomNavigation';

type NavigationBarProps = BottomNavigationProps & {
  destinations: {
    navigate: () => void;
    label: string;
    icon: ReactNode;
  }[];
};

function NavigationBar({ className, destinations }: NavigationBarProps) {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ width: 500 }} className={className}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          event.preventDefault(); // Prevent the default behavior of the click event
        }}
      >
        {destinations.map((destination, index) => (
          <BottomNavigationAction
            key={index}
            onClick={() => destination.navigate()}
            label={destination.label}
            icon={destination.icon}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}

export default NavigationBar;
