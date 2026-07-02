import Typography from "@mui/material/Typography";

function TaskDescription({ description }: { description: string | null }) {
  return (
    <Typography variant="h6" color="text.secondary">
      {description}
    </Typography>
  );
}

export default TaskDescription;
