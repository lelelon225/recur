import { useMemo, type MouseEvent } from "react";
import { TaskFrequency, type TaskFrequency as TaskFrequencyType } from "@/services/taskService";

// Wie viele Tage ein Frequenz-Intervall abdeckt - Basis für die Rolling-
// Window-Sperre des Abhaken-Buttons (#136). ONCE hat kein Intervall (siehe
// unten, dort zählt nur amountDid > 0 / progress >= 100).
const FREQUENCY_INTERVAL_DAYS: Partial<Record<TaskFrequencyType, number>> = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30,
  YEARLY: 365,
};
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type UseTaskCardParams = {
  progress: number | null | undefined;
  frequency: TaskFrequencyType;
  lastAmountDidAt?: string | null;
  onToggleFavorite?: () => void;
  onToggleEdit?: () => void;
  onToggleMenu?: () => void;
  onToggleArchive?: () => void;
  onResetProgress?: () => void;
  onDelete?: () => void;
  onToggleDone?: () => void;
};

function useTaskCard({
  progress,
  frequency,
  lastAmountDidAt,
  onToggleFavorite,
  onToggleEdit,
  onToggleMenu,
  onToggleArchive,
  onResetProgress,
  onDelete,
  onToggleDone,
}: UseTaskCardParams) {
  const clampedProgress = useMemo(
    () => Math.min(100, Math.max(0, progress ?? 0)),
    [progress]
  );

  // Ob der Abhaken-Button für das aktuelle Frequenz-Intervall bereits
  // "verbraucht" ist. ONCE-Tasks sind nach dem ersten Klick dauerhaft fertig
  // (kein Intervall), alle anderen sperren rollierend für 1 Intervall ab dem
  // letzten Klick (kein Kalender-/Zeitzonen-Abgleich). Kein useMemo, da
  // Date.now() ein impurer Aufruf ist und nicht memoized werden darf.
  const intervalDays = FREQUENCY_INTERVAL_DAYS[frequency];
  const doneForCurrentPeriod =
    frequency === TaskFrequency.ONCE
      ? clampedProgress >= 100
      : Boolean(
          lastAmountDidAt &&
            intervalDays &&
            new Date().getTime() - new Date(lastAmountDidAt).getTime() < intervalDays * ONE_DAY_MS
        );

  const handleDone = () => {
    onToggleDone?.();
  };

  const handleToggleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
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
    doneForCurrentPeriod,
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