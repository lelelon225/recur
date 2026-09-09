import { useState } from "react";
import { showUndoToast, showSuccessToast } from "@/lib/toast";
function useTaskCardMenu({ onToggleMenu, onToggleEdit, onToggleArchive, onResetProgress, onDelete, isArchived, progress, }) {
    const [editOpen, setEditOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmResetProgressOpen, setConfirmResetProgressOpen] = useState(false);
    const canResetProgress = progress > 0;
    const handleOpenChange = (nextOpen) => {
        setOpen(nextOpen);
        onToggleMenu();
    };
    const handleToggleEdit = (e) => {
        e.stopPropagation();
        setEditOpen(true);
        onToggleEdit();
    };
    const handleToggleArchive = (e) => {
        e.stopPropagation();
        onToggleArchive();
        showUndoToast(isArchived ? "Habit wiederhergestellt" : "Habit archiviert", () => {
            onToggleArchive();
        });
    };
    const handleRequestDelete = (e) => {
        e.stopPropagation();
        setOpen(false);
        setConfirmDeleteOpen(true);
    };
    const handleConfirmDelete = () => {
        onDelete();
        setConfirmDeleteOpen(false);
        showSuccessToast("Habit erfolgreich gelöscht");
    };
    const handleCancelDelete = () => {
        setConfirmDeleteOpen(false);
    };
    // Bei Fortschritt 0 gibt es nichts zurückzusetzen — Dialog erst gar
    // nicht öffnen, auch falls das DropdownMenuItem trotz disabled einen
    // Klick durchlässt.
    const handleRequestResetProgress = (e) => {
        e.stopPropagation();
        if (!canResetProgress)
            return;
        setOpen(false);
        setConfirmResetProgressOpen(true);
    };
    const handleConfirmResetProgress = () => {
        onResetProgress();
        setConfirmResetProgressOpen(false);
    };
    const handleCancelResetProgress = () => {
        setConfirmResetProgressOpen(false);
    };
    const handleEditClose = () => {
        setEditOpen(false);
        onToggleEdit();
    };
    return {
        open,
        editOpen,
        confirmDeleteOpen,
        confirmResetProgressOpen,
        canResetProgress,
        handleOpenChange,
        handleToggleEdit,
        handleToggleArchive,
        handleRequestDelete,
        handleConfirmDelete,
        handleCancelDelete,
        handleRequestResetProgress,
        handleConfirmResetProgress,
        handleCancelResetProgress,
        handleEditClose,
    };
}
export default useTaskCardMenu;
