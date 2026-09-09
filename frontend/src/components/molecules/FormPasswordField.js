import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormTextField from "./FormTextField";
function FormPasswordField({ name, label, value, onChange, onBlur, error, helperText, }) {
    const [showPassword, setShowPassword] = useState(false);
    return (<FormTextField name={name} label={label} type={showPassword ? "text" : "password"} value={value} onChange={onChange} onBlur={onBlur} error={error} helperText={helperText} endAdornment={<button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"} tabIndex={-1}>
          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
        </button>}/>);
}
export default FormPasswordField;
