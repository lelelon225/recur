import axios from "axios";
import api from "./api";
export const TaskFrequency = {
    DAILY: "DAILY",
    WEEKLY: "WEEKLY",
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY",
    ONCE: "ONCE",
};
export const TaskCategory = {
    WORK: "WORK",
    PERSONAL: "PERSONAL",
    SCHOOL: "SCHOOL",
    OTHER: "OTHER",
};
function extractErrorMessage(err, fallback) {
    if (axios.isAxiosError(err)) {
        return (err.response?.data?.message ??
            fallback);
    }
    return fallback;
}
/**
 * Normalizes a date-only string (e.g. "2222-02-21") or a full ISO string
 * into a full ISO-8601 instant string that java.time.Instant can parse.
 * Passes through null/undefined unchanged.
 */
function toInstantString(date) {
    if (date === null || date === undefined || date === "")
        return null;
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
        throw new Error(`Ungültiges Datum: "${date}"`);
    }
    return parsed.toISOString();
}
function normalizeTaskDates(task) {
    if (task.dateUntil === undefined)
        return task;
    return { ...task, dateUntil: toInstantString(task.dateUntil) };
}
function getTasks(archived, favorite) {
    return api
        .get("/task", { params: { archived, favorite } })
        .then((response) => response.data)
        .catch((err) => {
        throw new Error(extractErrorMessage(err, "Fehler beim Abrufen der Aufgaben"));
    });
}
function createTask(task) {
    return api
        .post("/task", normalizeTaskDates(task))
        .then((response) => response.data)
        .catch((err) => {
        throw new Error(extractErrorMessage(err, "Fehler beim Erstellen der Aufgabe"));
    });
}
function patchTask(id, options = {}) {
    const { task = {}, resetProgress, favorite, archived, amountDid } = options;
    return api
        .patch(`/task/${id}`, normalizeTaskDates(task), {
        params: { resetProgress, favorite, archived, amountDid },
    })
        .then((response) => response.data)
        .catch((err) => {
        throw new Error(extractErrorMessage(err, "Fehler beim Aktualisieren der Aufgabe"));
    });
}
function deleteTask(id) {
    return api
        .delete(`/task/${id}`)
        .then(() => { })
        .catch((err) => {
        throw new Error(extractErrorMessage(err, "Fehler beim Löschen der Aufgabe"));
    });
}
function deleteAllTasks() {
    return api
        .delete(`/task`)
        .then(() => { })
        .catch((err) => {
        throw new Error(extractErrorMessage(err, "Fehler beim Löschen aller Aufgaben"));
    });
}
export { getTasks, createTask, patchTask, deleteTask, deleteAllTasks };
