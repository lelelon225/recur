import { useState } from "react";
import CircularProgressWithLabel from "../atoms/progressIndicator";
import TaskTitle from "../atoms/taskTitle";
import TaskDescription from "../atoms/taskDescription";
import TaskFavorite from "../atoms/taskFavorite";
import TaskTimeFrame from "../atoms/taskTimeFrame";
import { Box } from "@mui/material";

interface TaskCardProps {
  title: string;
  description: string;
  start: string;
  end: string;
  progress: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function TaskCard({
  title,
  description,
  start,
  end,
  progress,
  isFavorite = false,
  onToggleFavorite,
}: TaskCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleToggle = () => {
    setFavorite((prev) => !prev);
    onToggleFavorite?.();
  };

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TaskTitle title={title} />
          <TaskFavorite isFavorite={favorite} onClick={handleToggle} />
        </Box>
        <TaskDescription description={description} />
        <TaskTimeFrame start={start} end={end} />
      </Box>
    </Box>
  );
}

export default TaskCard;
