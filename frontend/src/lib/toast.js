import { toast } from "sonner";
const commonOptions = {
    duration: 3000,
};
export function showToast(message) {
    toast(message, commonOptions);
}
export function showToastWithAction(message, action) {
    toast(message, {
        ...commonOptions,
        action,
    });
}
export function showUndoToast(message, onUndo) {
    toast(message, {
        ...commonOptions,
        action: {
            label: "Rückgängig",
            onClick: onUndo,
        },
    });
}
export function showInfoToast(message) {
    toast.info(message, {
        ...commonOptions,
        className: "!bg-blue-500 !text-white dark:!bg-blue-600",
    });
}
export function showErrorToast(message) {
    toast.error(message, {
        ...commonOptions,
        className: "!bg-destructive !text-destructive-foreground",
    });
}
export function showSuccessToast(message) {
    toast.success(message, {
        ...commonOptions,
        className: "!bg-green-500 !text-white dark:!bg-green-600",
    });
}
export function showWarningToast(message) {
    toast.warning(message, {
        ...commonOptions,
        className: "!bg-amber-500 !text-white dark:!bg-amber-600",
    });
}
