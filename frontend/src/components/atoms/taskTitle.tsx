import Typography from "@mui/material/Typography";

function TaskTitle({ title }: { title: string }) {
  return (
    <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h4" gutterBottom>
      {title}
    </Typography>
  );
}

export default TaskTitle;
