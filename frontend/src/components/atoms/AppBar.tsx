import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Box,
} from "@mui/material";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";

type AppBarProps = MuiAppBarProps & {
  children: React.ReactNode;
};

function AppBar({ children, ...props }: AppBarProps) {
  return (
    <MuiAppBar position="static" {...props}>
      <Toolbar>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>{children}</Box>

          <IconButton color="inherit" aria-label="menu">
            <MenuIcon sx={{ fontSize: "3rem" }} />
          </IconButton>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}

export default AppBar;