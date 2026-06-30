import CircularProgressWithLabel from "../atoms/progressIndicator";
import TaskTitle from "../atoms/taskTitle";
import TaskDescription from "../atoms/taskDescription";
import TaskTimeFrame from "../atoms/taskTimeFrame";
import { Box } from "@mui/material";
import {type Task } from "../../services/taskService";



function TaskCard({ name, description, date_created, date_until, progress }: Task) {
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
        minHeight: "150px",
        "&:hover": {
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
        <TaskTitle title={name} />
        <TaskDescription description={description} />
        <TaskTimeFrame start={date_created} end={date_until} />
      </Box>
    </Box>
  );
}

export default TaskCard;