
import Dialog from "../atoms/Dialog";

type AddTaskFormProps = {
  onClose: () => void;
};

function AddTaskForm({ onClose }: AddTaskFormProps) {

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={true} onClose={handleClose}>
        <h2>Aufgabe hinzufügen</h2>
      </Dialog>
  );
}

export default AddTaskForm;
