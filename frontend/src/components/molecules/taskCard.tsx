import CircularProgressWithLabel from "../atoms/progressIndicator";
import TaskTitle from "../atoms/taskTitle";
import TaskDescription from "../atoms/taskDescription";
import TaskTimeFrame from "../atoms/taskTimeFrame";
import { Box } from "@mui/material";
import {type Task } from "../../services/taskService";


type TaskCardProps = {
  classname?: string;
} & Task;



function TaskCard({ name, description, date_created, date_until, progress, classname }: TaskCardProps) {
  return (
    <Box className={classname}>
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