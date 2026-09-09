import { AlertTriangle, FileQuestion, ShieldAlert, ServerCrash, WifiOff, } from "lucide-react";
export const ERROR_OPTIONS = {
    400: { icon: AlertTriangle, message: "Ungültige Anfrage" },
    401: { icon: ShieldAlert, message: "Nicht autorisiert" },
    403: { icon: ShieldAlert, message: "Zugriff verweigert" },
    404: { icon: FileQuestion, message: "Seite nicht gefunden" },
    500: { icon: ServerCrash, message: "Interner Serverfehler" },
    503: { icon: WifiOff, message: "Dienst nicht verfügbar" },
};
export const DEFAULT_ERROR_OPTION = {
    icon: AlertTriangle,
    message: "Ein unbekannter Fehler ist aufgetreten",
};
