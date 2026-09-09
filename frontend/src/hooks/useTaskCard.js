import { useMemo } from "react";
function useTaskCard({ progress, onToggleFavorite, onToggleEdit, onToggleMenu, onToggleArchive, onResetProgress, onDelete, onToggleDone, }) {
    const clampedProgress = useMemo(() => Math.min(100, Math.max(0, progress ?? 0)), [progress]);
    const handleDone = () => {
        onToggleDone?.();
    };
    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        onToggleFavorite?.();
    };
    const handleToggleEdit = () => onToggleEdit?.();
    const handleToggleMenu = () => onToggleMenu?.();
    const handleToggleArchive = () => onToggleArchive?.();
    const handleDelete = () => onDelete?.();
    const handleResetProgress = () => onResetProgress?.();
    return {
        clampedProgress,
        handleDone,
        handleToggleFavorite,
        handleToggleEdit,
        handleToggleMenu,
        handleToggleArchive,
        handleDelete,
        handleResetProgress,
    };
}
export default useTaskCard;
