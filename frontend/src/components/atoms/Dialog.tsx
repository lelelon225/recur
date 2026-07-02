import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
} from "@mui/material";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onSubmit?: () => void;
  loading?: boolean;
  submitDisabled?: boolean;
};

function Dialog({
  open,
  onClose,
  children,
  loading,
  submitDisabled,
}: DialogProps) {
  return (
    <MuiDialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      className="customDialog"
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <Box>{children}</Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} variant="outlined" color="primary">
          Close
        </Button>
        <Button
          autoFocus
          type="submit"
          form="editTaskForm"
          variant="contained"
          color="primary"
          loading={loading}
          disabled={submitDisabled}
        >
          Submit
        </Button>
      </DialogActions>
    </MuiDialog>
  );
}

export default Dialog;
