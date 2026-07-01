import api from "./api";

export interface Task {
  id: string;
  name: string;
  category: string;
  progress: number;
  goal: string;
  description: string;
  createdAt: Date;
  dateUntil: Date;
}

function getAllTasks(): Promise<Task[]> {
  return api
    .get("/task")
    .then((response) => response.data as Task[])
    .catch((err) => {
      throw new Error(
        err.response?.data?.message || "Fehler beim Abrufen der Aufgaben"
      );
    });
}

function createTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
  return api
    .post("/task", task)
    .then((response) => {
      const task = response.data as any;
      return {
        ...task,
        createdAt: new Date(task.createdAt),
        dateUntil: new Date(task.dateUntil),
      } as Task;
    })
    .catch((err) => {
      throw new Error(
        err.response?.data?.message || "Fehler beim Erstellen der Aufgabe"
      );
    });
}

function patchTask(
  id: string,
  task: Partial<Omit<Task, "id" | "createdAt">>
): Promise<Task> {
  return api
    .patch(`/task/${id}`, task)
    .then((response) => response.data as Task)
    .catch((err) => {
      throw new Error(
        err.response?.data?.message || "Fehler beim Aktualisieren der Aufgabe"
      );
    });
}

function deleteTask(id: string): Promise<void> {
  return api
    .delete(`/task/${id}`)
    .then(() => {})
    .catch((err) => {
      throw new Error(
        err.response?.data?.message || "Fehler beim Löschen der Aufgabe"
      );
    });
}

function deleteAllTasks(): Promise<void> {
  return api
    .delete(`/task/all`)
    .then(() => {})
    .catch((err) => {
      throw new Error(
        err.response?.data?.message || "Fehler beim Löschen aller Aufgaben"
      );
    });
}

export { getAllTasks, createTask, patchTask, deleteTask, deleteAllTasks };
