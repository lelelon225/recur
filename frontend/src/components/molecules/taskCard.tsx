import { Box, Grid } from "@mui/material";
import { type Task } from "../../services/taskService";
import ProgressIndicator from "../atoms/ProgressIndicator";
import TaskTitle from "../atoms/TaskTitle";
import TaskDescription from "../atoms/TaskDescription";
import TaskTimeFrame from "../atoms/TaskTimeFrame";
import TaskFavorite from "../atoms/TaskFavourite";
import TaskCardMenu from "../atoms/TaskCardMenu";

type TaskCardProps = {
  task: Task;
  classname?: string;
  onToggleFavorite?: () => void;
};

function TaskCard({ task, classname, onToggleFavorite }: TaskCardProps) {
  const handleToggle = () => {
    onToggleFavorite?.();
  };

  return (
    <Box className={classname}>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          margin: "8px 0 8px 0",
        }}
      >
        <Grid>
          <ProgressIndicator value={task.progress} />
        </Grid>
        <Grid>
          <TaskCardMenu task={task} onToggleMenu={() => {}} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TaskTitle title={task.name} />
      </Box>
      <TaskDescription description={task.description} />
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "8px 0 8px 0",
        }}
      >
        <Grid>
          <TaskTimeFrame start={task.dateCreated} end={task.dateUntil} />
        </Grid>
        <Grid>
          <TaskFavorite isFavorite={task.isFavorite} onClick={handleToggle} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default TaskCard;
