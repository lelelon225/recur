import Typography from "@mui/material/Typography";

function TaskTitle({ title }: { title: string }) {
  return (
    <Typography variant="h5" component="h2" gutterBottom>
      {title}
    </Typography>
  );
}

export default TaskTitle;
