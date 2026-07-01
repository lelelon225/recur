import { Paper } from "@mui/material";

type InfoCardProps = {
  variant?: "error" | "info" | "warning" | "success";
  discription?: string;  
  title: string;
};

function InfoCard({ variant, discription, title }: InfoCardProps) {
     return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Paper elevation={3} sx={{ padding: "20px", textAlign: "center", backgroundColor: variant === "error" ? "#f8d7da" : variant === "info" ? "#d1ecf1" : variant === "warning" ? "#fff3cd" : variant === "success" ? "#d4edda" : "#ffffff", color: variant === "error" ? "#721c24" : variant === "info" ? "#0c5460" : variant === "warning" ? "#856404" : variant === "success" ? "#155724" : "#000000", borderRadius: "8px", maxWidth: "400px", width: "100%" }}>
            <h2>{title}</h2>
            <p>{discription}</p>
        </Paper>  
    </div>;
}

export default InfoCard;