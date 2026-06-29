import Typography from "@mui/material/Typography";

function TaskTimeFrame({ start, end }: { start: string; end: string }) {
  return (
    <Typography variant="body2" component="h6" color="text.secondary">
      {start} <span>-</span> {end}
    </Typography>
  );
}

export default TaskTimeFrame;
