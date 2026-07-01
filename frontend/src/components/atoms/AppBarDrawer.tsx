import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type AppBarDrawerProps = {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  className?: string;
};

function AppBarDrawer({
  drawerOpen,
  setDrawerOpen,
  className,
}: AppBarDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      className={className}
    >
      <Box>
        <Grid
          container
          sx={{
            spacing: 2,
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="close"
            onClick={() => setDrawerOpen(false)}
            sx={{ alignSelf: "flex-end" }}
          >
            <CloseIcon sx={{ fontSize: "2.5rem" }} />
          </IconButton>
          <Typography variant="h4">Menu</Typography>
          {/* Menu items */}
        </Grid>
      </Box>
    </Drawer>
  );
}

export default AppBarDrawer;
