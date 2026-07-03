import { Box, Container } from "@mui/material";
import {
  getTasks,
  patchTask,
  deleteTask,
  type Task,
} from "../../services/taskService";
import { useEffect, useState } from "react";
import InfoCard from "../organisms/InfoCard";
import LoadingTime from "../atoms/LoadingTime";
import TaskCard from "../molecules/TaskCard";

function ArchivePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleToggleFavorite(taskId: string) {
    const previousTasks = tasks;
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isFavorite: !task.isFavorite } : task,
    );
    setTasks(updatedTasks);

    const toggledTask = updatedTasks.find((task) => task.id === taskId);
    if (!toggledTask) {
      return;
    }

    patchTask(taskId, { isFavorite: toggledTask.isFavorite ?? false }).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Aktualisieren des Favoritenstatus", err);
    });
  }

  function handleToggleArchive(taskId: string) {
    const previousTasks = tasks;
    const updatedTasks = tasks
      .map((task) =>
        task.id === taskId ? { ...task, isArchived: !task.isArchived } : task,
      )
      .filter((task) => task.isArchived);
    setTasks(updatedTasks);

    patchTask(taskId, { isArchived: false }).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Aktualisieren Archivierungsstatus", err);
    });
  }

  function handleDelete(taskId: string) {
    const previousTasks = tasks;
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    deleteTask(taskId).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Löschen der Aufgabe", err);
    });
  }

  async function fetchArchivedTasks() {
    try {
      const fetchedTasks = await getTasks(true, false);
      setTasks(fetchedTasks);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unbekannter Fehler beim Abrufen der archivierten Aufgaben",
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  if (loading) {
    return <LoadingTime loading={loading} />;
  }

  if (error) {
    return (
      <InfoCard
        variant="error"
        title="Fehler beim Abrufen der archivierten Aufgaben"
        discription={error}
      />
    );
  }

  if (tasks.length === 0 && !loading) {
    return (
      <InfoCard
        variant="info"
        title="Keine archivierten Aufgaben gefunden"
        discription="Archivierte Aufgaben werden hier angezeigt, sobald du welche archivierst."
      />
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        className="archivePage"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          gap: "16px",
        }}
      >
        {tasks.map((task) => (
          <TaskCard
              key={task.id}
              classname="taskCard"
              task={task}
              onToggleFavorite={() => handleToggleFavorite(task.id)}
              onToggleArchive={() => handleToggleArchive(task.id)}
              onDelete={() => handleDelete(task.id)}
            />
        ))}
      </Box>
    </Container>
  );
}

export default ArchivePage;