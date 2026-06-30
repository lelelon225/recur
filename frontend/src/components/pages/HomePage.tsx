import TaskCard from "../molecules/taskCard";
import { Box, Container } from "@mui/material";

interface Task {
  title: string;
  description: string;
  start: string;
  end: string;
  progress: number;
}

function HomePage() {
  const tasks: Task[] = [
    {
      title: "Design System Setup",
      description: "Create and document the design system components.",
      start: "9:00 AM",
      end: "12:00 PM",
      progress: 85,
    },
    {
      title: "API Integration",
      description: "Integrate REST API endpoints with frontend.",
      start: "1:00 PM",
      end: "5:00 PM",
      progress: 60,
    },
    {
      title: "Testing",
      description: "Write unit and integration tests for components.",
      start: "10:00 AM",
      end: "3:00 PM",
      progress: 40,
    },
    {
      title: "Documentation",
      description: "Complete project documentation and readme.",
      start: "2:00 PM",
      end: "4:00 PM",
      progress: 25,
    },
    {
      title: "Code Review",
      description: "Review pull requests and provide feedback.",
      start: "11:00 AM",
      end: "12:30 PM",
      progress: 100,
    },
    {
      title: "Performance Optimization",
      description: "Optimize bundle size and render performance.",
      start: "9:00 AM",
      end: "11:00 AM",
      progress: 50,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box
        className="HomePage"
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
        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            title={task.title}
            description={task.description}
            start={task.start}
            end={task.end}
            progress={task.progress}
          />
        ))}
      </Box>
    </Container>
  );
}
export default HomePage;
