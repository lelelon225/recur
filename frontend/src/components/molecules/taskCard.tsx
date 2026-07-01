import { useState } from "react";
import { Box } from "@mui/material";
import {type Task } from "../../services/taskService";
import ProgressIndicator from "../atoms/ProgressIndicator";
import TaskTitle from "../atoms/TaskTitle";
import TaskDescription from "../atoms/TaskDescription";
import TaskTimeFrame from "../atoms/TaskTimeFrame";
import TaskFavorite from "../atoms/TaskFavourite";


type TaskCardProps = {
  classname?: string;
  onToggleFavorite?: () => void;
} & Task;



function TaskCard({ name, description, date_created, date_until, progress, isFavorite, classname, onToggleFavorite }: TaskCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

    const handleToggle = () => {
    setFavorite((prev) => !prev);
    onToggleFavorite?.();
  };
  
  return (
    <Box className={classname}>
      <ProgressIndicator value={progress} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TaskTitle title={name} />
          <TaskFavorite isFavorite={favorite} onClick={handleToggle} />
        </Box>
        <TaskDescription description={description} />
        <TaskTimeFrame start={date_created} end={date_until} />
      </Box>
  );
}

export default TaskCard;