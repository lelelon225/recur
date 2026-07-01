import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

function TaskFavorite({
  isFavorite,
  onClick,
}: {
  isFavorite: boolean;
  onClick: () => void;
}) {


  return (
    <div onClick={onClick}>
      {isFavorite ? (
        <FavoriteOutlinedIcon color="error" />
      ) : (
        <FavoriteBorderOutlinedIcon />
      )}
    </div>
  );
}

export default TaskFavorite;
