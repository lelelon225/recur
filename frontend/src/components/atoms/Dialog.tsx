import { Dialog as MuiDialog, DialogActions, DialogContent, DialogContentText, Button } from "@mui/material";

type DialogProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    onSubmit?: () => void;
};

function Dialog({ open, onClose, children, onSubmit }: DialogProps) {
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
            <DialogContentText>
                {children}
            </DialogContentText>
        </DialogContent>
            <Button autoFocus onClick={onClose}>
                Close
            </Button>
        <DialogActions>
            <Button autoFocus onClick={onSubmit}>
                Submit
            </Button>

        </DialogActions>
      </MuiDialog>
    );
}

export default Dialog;