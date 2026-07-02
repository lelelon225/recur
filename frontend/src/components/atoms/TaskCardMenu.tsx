import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import EditTaskForm from "../organisms/EditTaskForm";
import type { Task } from "../../services/taskService";

type TaskCardMenuProps = {
  task: Task;
  onToggleMenu: () => void;
};

function TaskCardMenu({ task, onToggleMenu }: TaskCardMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = () => {
    onToggleMenu();
    handleClose();
  };

  const handleEdit = () => {
    setEditOpen(true);
    handleClose();
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{ padding: 0, margin: "8px 0 8px 0" }}
        aria-label="Task Card Menu"
      >
        <MenuIcon sx={{ padding: 0, color: "white" }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleToggle}>Delete</MenuItem>
      </Menu>

      {editOpen && <EditTaskForm task={task} onClose={handleEditClose} />}
    </Box>
  );
}

export default TaskCardMenu;
