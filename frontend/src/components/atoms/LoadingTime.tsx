import CircularProgress from "@mui/material/CircularProgress";

type LoadingTimeProps = {
  loading: boolean;
};

function LoadingTime({ loading }: LoadingTimeProps) {
  if (!loading) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress />
    </div>
  );
}



export default LoadingTime;