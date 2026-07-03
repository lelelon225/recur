import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import IconButton from "@mui/material/IconButton";

// TaskFavourite.tsx
type TaskFavoriteProps = {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
};

function TaskFavorite({ isFavorite, onClick }: TaskFavoriteProps) {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
    >
      {isFavorite ? (
        <FavoriteOutlinedIcon color="error" />
      ) : (
        <FavoriteBorderOutlinedIcon sx={{ color: "white" }} />
      )}
    </IconButton>
  );
}

export default TaskFavorite;
