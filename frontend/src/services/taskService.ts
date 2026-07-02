import axios from "axios";
import api from "./api";

export type TaskFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "ONCE";
export type TaskCategory = "WORK" | "PERSONAL" | "SCHOOL" | "OTHER";

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  progress: number;
  goal: string;
  description: string | null;
  dateUntil: string | null;
  dateCreated: string | null;
  isFavorite?: boolean;
  isArchived?: boolean;
}

/** Fields the server owns and the client must never send on create/patch. */
type ServerOwnedFields = "id" | "dateCreated";

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string } | undefined)?.message ?? fallback;
  }
  return fallback;
}

function getAllTasks(): Promise<Task[]> {
  return api
    .get("/task")
    .then((response) => response.data as Task[])
    .catch((err: unknown) => {
      throw new Error(extractErrorMessage(err, "Fehler beim Abrufen der Aufgaben"));
    });
}

function getFavoriteTasks(): Promise<Task[]> {
  return api
    .get("/task/favorite")
    .then((response) => response.data as Task[])
    .catch((err) => {
      throw new Error(
        err.response?.data?.message || "Fehler beim Abrufen der Favoriten"
      );
    });
}

function createTask(task: Omit<Task, "id" | "date_created">): Promise<Task> {
  return api
    .post("/task", task)
    .then((response) => response.data as Task)
    .catch((err: unknown) => {
      throw new Error(extractErrorMessage(err, "Fehler beim Erstellen der Aufgabe"));
    });
}

function patchTask(
  id: string,
  task: Partial<Omit<Task, ServerOwnedFields>>
): Promise<Task> {
  return api
    .patch(`/task/${id}`, task)
    .then((response) => response.data as Task)
    .catch((err: unknown) => {
      throw new Error(extractErrorMessage(err, "Fehler beim Aktualisieren der Aufgabe"));
    });
}

function patchTaskFavorite(id: string, isFavorite: boolean): Promise<Task> {
  return api
    .patch(`/task/${id}/favorite`, { isFavorite })
    .then((response) => response.data as Task)
    .catch((err: unknown) => {
      throw new Error(extractErrorMessage(err, "Fehler beim Aktualisieren des Favoritenstatus"));
    });
}

function patchTaskArchived(id: string, isArchived: boolean): Promise<Task> {
  return api
    .patch(`/task/${id}/archived`, { isArchived })
    .then((response) => response.data as Task)
    .catch((err: unknown) => {
      throw new Error(extractErrorMessage(err, "Fehler beim Archivieren der Aufgabe"));
    });
}

function deleteTask(id: string): Promise<void> {
  return api
    .delete(`/task/${id}`)
    .then(() => {})
    .catch((err: unknown) => {
      throw new Error(extractErrorMessage(err, "Fehler beim Löschen der Aufgabe"));
    });
}

function deleteAllTasks(): Promise<void> {
  return api
    .delete(`/task/all`)
    .then(() => {})
    .catch((err: unknown) => {
      throw new Error(extractErrorMessage(err, "Fehler beim Löschen aller Aufgaben"));
    });
}

export {
  getAllTasks,
  getFavoriteTasks,
  createTask,
  patchTask,
  patchTaskFavorite,
  patchTaskArchived,
  deleteTask,
  deleteAllTasks,
};
