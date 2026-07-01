import Typography from "@mui/material/Typography";

function TaskTimeFrame({ start, end }: { start: string | null; end: string | null }) {
  const formatDate = (d: string) => {
    const date = new Date(d);
  return isNaN(date.getTime()) ? null : date.toLocaleDateString();
  };
  return (
    <Typography variant="h6" component="h5" color="text.secondary">
      {start && end
        ? `${formatDate(start)} - ${formatDate(end)}`
        : start
        ? `Ab ${formatDate(start)}`
        : end
        ? `Bis ${formatDate(end)}`
        : "Kein Zeitraum angegeben"}
    </Typography>
  );
}

export default TaskTimeFrame;
