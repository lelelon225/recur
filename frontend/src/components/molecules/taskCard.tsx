import { Box, Grid } from "@mui/material";
import { type Task } from "../../services/taskService";
import ProgressIndicator from "../atoms/ProgressIndicator";
import TaskTitle from "../atoms/TaskTitle";
import TaskDescription from "../atoms/TaskDescription";
import TaskTimeFrame from "../atoms/TaskTimeFrame";
import TaskFavorite from "../atoms/TaskFavourite";
import TaskCardMenu from "../atoms/TaskCardMenu";

type TaskCardProps = Pick<Task,
  "name" | "category" | "description" | "dateCreated" | "dateUntil" | "progress" | "isFavorite"
> & {
  classname?: string;
  onToggleFavorite?: () => void;
  onToggleMenu?: () => void;
};

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
      <Grid container sx={{ justifyContent: "space-between", alignItems: "flex-start", margin: "8px 0 8px 0" }}>
        <Grid>
          <ProgressIndicator value={progress} />
        </Grid>
        <Grid>
          <TaskCardMenu onToggleMenu={handleToggleMenu} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TaskTitle title={name} />
      </Box>
      <TaskDescription description={description} />
      <Grid
        container
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 8px 0" }}
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