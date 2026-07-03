import { Box, Container, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import EditTaskForm from "../organisms/EditTaskForm";
import type { Task } from "../../services/taskService";

type TaskCardMenuProps = {
  task: Task;
  onToggleMenu: () => void;
  onToggleEdit: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  isArchived: boolean;
};

function TaskCardMenu({
  task,
  onToggleEdit,
  onToggleMenu,
  onToggleArchive,
  onDelete,
  isArchived,
}: TaskCardMenuProps) {

  const [editOpen, setEditOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onToggleMenu();
  };


  const handleClose = () => {
    setAnchorEl(null);
    onToggleMenu();
    setEditOpen(false);
  };

  const handleToggleEdit = () => { 
    handleClose();
    setEditOpen(true);
    onToggleEdit();
    
  };

  const handleToggleArchive = () => {
    onToggleArchive();
    handleClose();
  };

  const handleDelete = () => {
    onDelete();
    handleClose();
  };

  return (
        <>
        {editOpen && (
          <EditTaskForm
            task={task}
            onClose={() => {
              handleClose();
              onToggleEdit();
            }}
          />
        )}


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
          {isArchived
            ? [
                <MenuItem key="unarchive" onClick={handleToggleArchive}>
                  Unarchive
                </MenuItem>,
                <MenuItem key="delete" onClick={handleDelete}>
                  Delete
                </MenuItem>,
              ]
            : [
                <MenuItem key="edit" onClick={handleToggleEdit}>
                  Edit
                </MenuItem>,
                <MenuItem key="archive" onClick={handleToggleArchive}>
                  Archive
                </MenuItem>,
              ]}
        </Menu>
      </Box>
      </>
  );
}

export default TaskCardMenu;
