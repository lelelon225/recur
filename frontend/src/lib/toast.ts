import { toast } from "sonner";

const commonOptions = {
  duration: 3000,
};

export function showToast(message: string) {
  toast(message, commonOptions);
}

type ToastAction = {
  label: string;
  onClick: () => void;
};

export function showToastWithAction(message: string, action: ToastAction) {
  toast(message, {
    ...commonOptions,
    action,
  });
}

export function showUndoToast(message: string, onUndo: () => void) {
  toast(message, {
    ...commonOptions,
    action: {
      label: "Rückgängig",
      onClick: onUndo,
    },
  });
}

export function showInfoToast(message: string) {
  toast.info(message, {
    ...commonOptions,
    className: "!bg-blue-500 !text-white dark:!bg-blue-600",
  });
}

export function showErrorToast(message: string) {
  toast.error(message, {
    ...commonOptions,
    className: "!bg-destructive !text-destructive-foreground",
  });
}

export function showSuccessToast(message: string) {
  toast.success(message, {
    ...commonOptions,
    className: "!bg-green-500 !text-white dark:!bg-green-600",
  });
}

export function showWarningToast(message: string) {
  toast.warning(message, {
    ...commonOptions,
    className: "!bg-amber-500 !text-white dark:!bg-amber-600",
  });
}