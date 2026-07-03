import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import IconButton from "@mui/material/IconButton";

type TaskFavoriteProps = {
  isFavorite: boolean;
  onClick: () => void;
};

function TaskFavorite({
  isFavorite,
  onClick,
}: TaskFavoriteProps) {


  return (
    <IconButton  onClick={onClick}>
      {isFavorite ? (
        <FavoriteOutlinedIcon color="error" />
      ) : (
        <FavoriteBorderOutlinedIcon sx={{ color: "white" }} />
      )}
    </IconButton>
  );
}

export default TaskFavorite;
