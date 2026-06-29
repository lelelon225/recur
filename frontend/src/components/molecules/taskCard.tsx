import CircularProgressWithLabel from "../atoms/progressIndicator";
import TaskTitle from "../atoms/taskTitle";
import TaskDescription from "../atoms/taskDescription";
import TaskTimeFrame from "../atoms/taskTimeFrame";
import { Box } from "@mui/material";

interface TaskCardProps {
  title: string;
  description: string;
  start: string;
  end: string;
  progress: number;
}

function TaskCard({ title, description, start, end, progress }: TaskCardProps) {
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        minWidth: "300px",
        maxWidth: "300px",
        hover: {
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease-in-out",
        },
      }}
    >
      <CircularProgressWithLabel value={progress} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "8px",
        }}
      >
        <TaskTitle title={title} />
        <TaskDescription description={description} />
        <TaskTimeFrame start={start} end={end} />
      </Box>
    </Box>
  );
}

export default TaskCard;
