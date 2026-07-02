<<<<<<< HEAD
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
} from "@mui/material";
=======
import { Dialog as MuiDialog, DialogActions, DialogContent, Button } from "@mui/material";
>>>>>>> 47130b9fbeeb6d4a1bbe955766f4a06e5a8b53be

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onSubmit?: () => void;
  loading?: boolean;
  submitDisabled?: boolean;
};

<<<<<<< HEAD
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
=======
function Dialog({ open, onClose, children, onSubmit, loading, submitDisabled }: DialogProps) {
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
            {children}
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={onClose} variant="outlined" color="primary" size="large">
                Close
            </Button>
            <Button autoFocus onClick={onSubmit} variant="contained" color="primary" size="large" loading={loading} disabled={submitDisabled}>
                Submit
            </Button>
        </DialogActions>
      </MuiDialog>
    );
>>>>>>> 47130b9fbeeb6d4a1bbe955766f4a06e5a8b53be
}

export default Dialog;
