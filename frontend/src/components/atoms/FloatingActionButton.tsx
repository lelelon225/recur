
import { Fab } from "@mui/material";
import Add from "@mui/icons-material/Add";

type FloatingActionButtonProps = {
  onClick: () => void;
};

function FloatingActionButton({ onClick }: FloatingActionButtonProps) {

  return (
    <Fab
          color="primary"
          aria-label="add"
          className="floatingActionButton"
          onClick={onClick}
        >
          <Add sx={{ fontSize: "2rem" }} />
        </Fab> 
  );  
}

export default FloatingActionButton;
