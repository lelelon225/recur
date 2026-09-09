import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
function DetailDialog({ open, onClose, title, children }) {
    return (<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        {title && (<DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>)}
        {children}
      </DialogContent>
    </Dialog>);
}
export default DetailDialog;
