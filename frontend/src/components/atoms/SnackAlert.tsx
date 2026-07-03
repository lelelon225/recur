import { Snackbar, Alert, Slide as MuiSlide } from "@mui/material";
import type { SlideProps } from "@mui/material/Slide";
import type { AlertProps } from "@mui/material/Alert";

type SnackAlertProps = {
  message: string;
  severity: "error" | "warning" | "info" | "success";
  open: boolean;
  onClose: () => void;
} & AlertProps;

function getColorBySeverity(severity: "error" | "warning" | "info" | "success") {
  switch (severity) {
    case "error":
      return "#ff1b0a";
    case "warning":
      return "#ff9800";
    case "info":
      return "#2196f3";
    case "success":
      return "#4caf50";
    default:
      return "#2196f3";
  }
}

function getTextColorBySeverity(severity: "error" | "warning" | "info" | "success") {
  switch (severity) {
    case "warning":
      return "#000000";
    default:
      return "#ffffff";
  }
}

function SlideTransition(props: SlideProps) {
  return <MuiSlide {...props} direction={props.in ? "right" : "left"} />;
}

function SnackAlert({ message, severity, open, onClose, sx, ...props }: SnackAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      slots={{ transition: SlideTransition }}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1000 }}
    >
      <Alert
        severity={severity}
        {...props}
        sx={{
          width: "100%",
          fontSize: "1.5rem",
          fontWeight: "bold",
          backgroundColor: getColorBySeverity(severity),
          color: getTextColorBySeverity(severity),
          ...sx,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackAlert;