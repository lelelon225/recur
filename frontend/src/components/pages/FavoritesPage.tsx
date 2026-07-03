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

function FavoritesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleToggleFavorite(taskId: string) {
    const previousTasks = tasks;
    const updatedTasks = tasks
      .map((task) =>
        task.id === taskId ? { ...task, isFavorite: !task.isFavorite } : task,
      )
      .filter((task) => task.isFavorite);
    setTasks(updatedTasks);

    patchTask(taskId, { isFavorite: false }).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Aktualisieren des Favoritenstatus", err);
    });
  }

  function handleToggleArchive(taskId: string) {
    const previousTasks = tasks;
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    patchTask(taskId, { isArchived: true }).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Archivieren der Aufgabe", err);
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

  async function fetchFavoriteTasks() {
    try {
      const fetchedTasks = await getTasks(false, true);
      setTasks(fetchedTasks.filter((task) => !task.isArchived));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unbekannter Fehler beim Abrufen der Favoriten",
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  useEffect(() => {
    fetchFavoriteTasks();
  }, []);

  if (loading) {
    return <LoadingTime loading={loading} />;
  }

  if (error) {
    return (
      <InfoCard
        variant="error"
        title="Fehler beim Abrufen der Favoriten"
        discription={error}
      />
    );
  }

  if (tasks.length === 0 && !loading) {
    return (
      <InfoCard
        variant="info"
        title="Keine Favoriten gefunden"
        discription="Fügen Sie Aufgaben zu Ihren Favoriten hinzu, um sie hier anzuzeigen."
      />
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        className="favoritesPage"
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

export default FavoritesPage;
