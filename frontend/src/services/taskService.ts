import axios from "axios";
import api from "./api";

export enum TaskFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
  ONCE = "ONCE"
}

export enum TaskCategory {
  WORK = "WORK",
  PERSONAL = "PERSONAL",
  SCHOOL = "SCHOOL",
  OTHER = "OTHER"
}


export interface Task {
  id: string;
  name: string;
  category: string;
  frequency: string;
  description: string;
  dateUntil: string;
  progress: number;
  dateCreated: string;
  daysInSpan?: number | null;
  amountDid?: number | null;
  isFavorite?: boolean | null;
  isArchived?: boolean | null;
}


/** Fields the server owns and the client must never send on create/patch. */
export type ServerOwnedFields = "id" | "dateCreated";

/** Payload shape for creating a new task (no id/dateCreated yet). */
export type NewTask = Omit<Task, ServerOwnedFields>;

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return (
      (err.response?.data as { message?: string } | undefined)?.message ??
      fallback
    );
  }
  return fallback;
}

/**
 * Normalizes a date-only string (e.g. "2222-02-21") or a full ISO string
 * into a full ISO-8601 instant string that java.time.Instant can parse.
 * Passes through null/undefined unchanged.
 */
function toInstantString(date: string | null | undefined): string | null {
  if (date === null || date === undefined || date === "") return null;
  // already has a time component -> just make sure Date can parse it
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Ungültiges Datum: "${date}"`);
  }
  return parsed.toISOString();
}

function normalizeTaskDates<T extends { dateUntil?: string | null }>(task: T): T {
  if (task.dateUntil === undefined) return task;
  return { ...task, dateUntil: toInstantString(task.dateUntil) };
}

function getAllTasks(): Promise<Task[]> {
  return api
    .get("/task")
    .then((response) => response.data as Task[])
    .catch((err: unknown) => {
      throw new Error(
        extractErrorMessage(err, "Fehler beim Abrufen der Aufgaben"),
      );
    });
}
function getFavoriteTasks(): Promise<Task[]> {
  return api
    .get("/task/favorite")
    .then((response) => response.data as Task[])
    .catch((err) => {
      throw new Error(
        err.response?.data?.message || "Fehler beim Abrufen der Favoriten",
      );
    });
}

function getArchivedTasks(): Promise<Task[]> {
  return api
    .get("/task/archived")
    .then((response) => response.data as Task[])
    .catch((err) => {
      throw new Error(
        err.response?.data?.message ||
          "Fehler beim Abrufen der archivierten Aufgaben",
      );
    });
}

function createTask(task: NewTask): Promise<Task> {
  return api
    .post("/task", normalizeTaskDates(task))
    .then((response) => response.data as Task)
    .catch((err: unknown) => {
      throw new Error(
        extractErrorMessage(err, "Fehler beim Erstellen der Aufgabe"),
      );
    });
}

function patchTask(
  id: string,
  task: Partial<Omit<Task, ServerOwnedFields>>,
): Promise<Task> {
  return api
    .patch(`/task/${id}`, normalizeTaskDates(task))
    .then((response) => response.data as Task)
    .catch((err: unknown) => {
      throw new Error(
        extractErrorMessage(err, "Fehler beim Aktualisieren der Aufgabe"),
      );
    });
}

function patchTaskFavorite(id: string, isFavorite: boolean): Promise<Task> {
  return api
    .patch(`/task/${id}/favorite`, { isFavorite })
    .then((response) => response.data as Task)
    .catch((err: unknown) => {
      throw new Error(
        extractErrorMessage(
          err,
          "Fehler beim Aktualisieren des Favoritenstatus",
        ),
      );
    });
}

function patchTaskArchived(id: string, isArchived: boolean): Promise<Task> {
  return api
    .patch(`/task/${id}/archived`, { isArchived })
    .then((response) => response.data as Task)
    .catch((err: unknown) => {
      throw new Error(
        extractErrorMessage(err, "Fehler beim Archivieren der Aufgabe"),
      );
    });
}

function deleteTask(id: string): Promise<void> {
  return api
    .delete(`/task/${id}`)
    .then(() => {})
    .catch((err: unknown) => {
      throw new Error(
        extractErrorMessage(err, "Fehler beim Löschen der Aufgabe"),
      );
    });
}

function deleteAllTasks(): Promise<void> {
  return api
    .delete(`/task/all`)
    .then(() => {})
    .catch((err: unknown) => {
      throw new Error(
        extractErrorMessage(err, "Fehler beim Löschen aller Aufgaben"),
      );
    });
}

export {
  getAllTasks,
  getFavoriteTasks,
  getArchivedTasks,
  createTask,
  patchTask,
  patchTaskFavorite,
  patchTaskArchived,
  deleteTask,
  deleteAllTasks,
};