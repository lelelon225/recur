import { TaskCategory } from "@/services/taskService";
export const categoryStyles = {
    [TaskCategory.WORK]: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800",
    [TaskCategory.PERSONAL]: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
    [TaskCategory.SCHOOL]: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
    [TaskCategory.OTHER]: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800",
};
export const categoryLabels = {
    [TaskCategory.WORK]: "Arbeit",
    [TaskCategory.PERSONAL]: "Persönlich",
    [TaskCategory.SCHOOL]: "Schule",
    [TaskCategory.OTHER]: "Andere",
};
export const ALL_CATEGORIES_LABEL = "Alle";
export const frequencyLabels = {
    DAILY: "Täglich",
    WEEKLY: "Wöchentlich",
    MONTHLY: "Monatlich",
    YEARLY: "Jährlich",
    ONCE: "Einmalig",
};
