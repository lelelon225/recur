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
  onToggleEdit?: () => void;
  onToggleArchive?: () => void;
  onDelete?: () => void;
  onToggleDone?: () => void;
} & Task;

function TaskCard({
  task,
  classname,
  onToggleFavorite,
  onToggleEdit,
  onToggleMenu,
  onToggleArchive,
  onDelete,
  onToggleDone,
}: TaskCardProps) {

  const clampedProgress = Math.min(100, Math.max(0, task.progress ?? 0));

  const handleDone = () => {
    onToggleDone?.();
  }

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const handleToggleEdit = () => {
    onToggleEdit?.();
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
    <Box className={classname} onClick={handleDone}>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          margin: "8px 0 8px 0",
        }}
      >
        <Grid>
          <ProgressIndicator value={clampedProgress} />
        </Grid>
        <Grid>
          <TaskCardMenu
            task={task}
            onToggleMenu={handleToggleMenu}
            onToggleEdit={handleToggleEdit}
            onToggleArchive={handleToggleArchive}
            onDelete={handleDelete}
            isArchived={task.isArchived}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
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
          <TaskFavorite isFavorite={task.isFavorite} onClick={handleToggleFavorite} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default TaskCard;