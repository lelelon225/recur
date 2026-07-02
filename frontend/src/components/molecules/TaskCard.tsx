import { Box, Grid } from "@mui/material";
import ProgressIndicator from "../atoms/ProgressIndicator";
import TaskDescription from "../atoms/TaskDescription";
import TaskTitle from "../atoms/TaskTitle";
import TaskTimeFrame from "../atoms/TaskTimeFrame";
import { type Task } from "../../services/taskService";
import TaskFavorite from "../atoms/TaskFavourite";
import TaskCardMenu from "../atoms/TaskCardMenu";

type TaskCardProps = {
  task: Task;
  classname?: string;
  onToggleFavorite?: () => void;
  onToggleMenu?: () => void;
  onToggleArchive?: () => void;
  onDelete?: () => void;
};

function TaskCard({
  task,
  classname,
  onToggleFavorite,
  onToggleMenu,
  onToggleArchive,
  onDelete,
}: TaskCardProps) {
  const { name, description, dateCreated, dateUntil, progress, isFavorite, isArchived } = task;

  const handleToggle = () => {
    onToggleFavorite?.();
  };

  const handleEdit = () => {
    onToggleMenu?.();
  };

  const handleToggleMenu = () => {
    onToggleMenu?.();
  };

  const handleToggleArchive = () => {
    onToggleArchive?.();
  };

  const handleDelete = () => {
    onDelete?.();
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
          <TaskCardMenu
            task={task}
            onToggleMenu={handleToggleMenu}
            onToggleArchive={handleToggleArchive}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isArchived={isArchived}
          />
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