import { AppBar as MuiAppBar, Toolbar, Box } from "@mui/material";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

type AppBarProps = MuiAppBarProps & {
  children: React.ReactNode;
};

function AppBar({ children, ...props }: AppBarProps) {
  return (
    <>
      <MuiAppBar position="static" {...props}>
        <Toolbar>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {children}
          </Box>
        </Toolbar>
      </MuiAppBar>
    </>
  );
}

export default AppBar;
