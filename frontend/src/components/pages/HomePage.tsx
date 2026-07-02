import { Box, Container } from "@mui/material";
import { getAllTasks, patchTaskFavorite, type Task } from "../../services/taskService";
import { useEffect, useState } from "react";
import InfoCard from "../organisms/InfoCard";
import Fab from "../atoms/FloatingActionButton";
import AddTaskForm from "../organisms/AddTaskForm";
import LoadingTime from "../atoms/LoadingTime";
import TaskCard from "../molecules/TaskCard";

function HomePage() {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function showForm() {
    setShowAddTaskForm(true);
  }

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

    patchTaskFavorite(taskId, toggledTask.isFavorite ?? false).catch((err) => {
      setTasks(previousTasks);
      console.error("Fehler beim Aktualisieren des Favoritenstatus", err);
    });
  }

  async function fetchTasks() {
    try {
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unbekannter Fehler beim Abrufen der Aufgaben",
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return <LoadingTime loading={loading} />;
  }

  if (error) {
    return (
      <InfoCard
        variant="error"
        title="Fehler beim Abrufen der Aufgaben"
        discription={error}
      />
    );
  }

  if (tasks.length === 0 && !loading) {
    return (
      <InfoCard
        variant="info"
        title="Keine Aufgaben gefunden"
        discription="Es wurden keine Aufgaben in der Datenbank gefunden. Bitte erstellen Sie eine neue Aufgabe."
      />
    );
  }

  return (
    <>
      <Container maxWidth="lg">
        {showAddTaskForm && (
          <AddTaskForm onClose={() => setShowAddTaskForm(false)} />
        )}

        <Box
          className="homePage"
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
              classname="taskCard"
              key={task.id}
              name={task.name}
              category={task.category}
              description={task.description}
              dateCreated={task.dateCreated}
              dateUntil={task.dateUntil}
              progress={task.progress}
              isFavorite={task.isFavorite}
              onToggleFavorite={() => handleToggleFavorite(task.id)}
            />
          ))}
          <Fab onClick={showForm} />
        </Box>
      </Container>
    </>
  );
}
export default HomePage;
