import { Dialog as MuiDialog, DialogActions, DialogContent, Button } from "@mui/material";

type DialogProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    onSubmit?: () => void;
    loading?: boolean;
    submitDisabled?: boolean;
};

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
}

export default Dialog;