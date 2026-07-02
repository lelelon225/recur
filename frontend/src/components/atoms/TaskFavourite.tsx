import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import IconButton from "@mui/material/IconButton";

function TaskFavorite({
  isFavorite,
  onClick,
}: {
  isFavorite: boolean;
  onClick: () => void;
}) {


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
