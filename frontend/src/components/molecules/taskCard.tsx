import { Box, Grid } from "@mui/material";
import ProgressIndicator from "../atoms/ProgressIndicator";
import TaskDescription from "../atoms/TaskDescription";
import TaskTitle from "../atoms/TaskTitle";
import TaskTimeFrame from "../atoms/TaskTimeFrame";
import { type Task } from "../../services/taskService";
import TaskFavorite from "../atoms/TaskFavourite";
import TaskCardMenu from "../atoms/TaskCardMenu";

type TaskCardProps = {
  classname?: string;
  onToggleFavorite?: () => void;
  onToggleMenu?: () => void;
} & Task;

function TaskCard({
  name,
  description,
  dateCreated,
  dateUntil,
  progress,
  isFavorite,
  classname,
  onToggleFavorite,
  onToggleMenu,
}: TaskCardProps) {
  const handleToggle = () => {
    onToggleFavorite?.();
  };

  const handleToggleMenu = () => {
    onToggleMenu?.();
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
          <ProgressIndicator value={progress} />
        </Grid>
        <Grid>
          <TaskCardMenu onToggleMenu={handleToggleMenu} />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TaskTitle title={name} />
      </Box>
      <TaskDescription description={description} />
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
          <TaskTimeFrame start={dateCreated} end={dateUntil} />
        </Grid>
        <Grid>
          <TaskFavorite isFavorite={isFavorite} onClick={handleToggle} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default TaskCard;
