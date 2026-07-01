import Typography from "@mui/material/Typography";

function TaskDescription({ description }: { description: string }) {
  return (
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  );
}

export default TaskDescription;
