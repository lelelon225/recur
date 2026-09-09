import { createContext, useCallback, useContext, useState, } from "react";
import ImportQuartalsplanDialog from "@/components/organisms/ImportQuartalsplanDialog";
const ImportQuartalsplanContext = createContext(null);
export function ImportQuartalsplanProvider({ children, }) {
    const [showImportDialog, setShowImportDialog] = useState(false);
    const openImportQuartalsplan = useCallback(() => {
        setShowImportDialog(true);
    }, []);
    function handleClose() {
        setShowImportDialog(false);
    }
    return (<ImportQuartalsplanContext.Provider value={{ openImportQuartalsplan }}>
      {children}
      {showImportDialog && (<ImportQuartalsplanDialog onClose={handleClose}/>)}
    </ImportQuartalsplanContext.Provider>);
}
export function useImportQuartalsplan() {
    const ctx = useContext(ImportQuartalsplanContext);
    if (!ctx) {
        throw new Error("useImportQuartalsplan muss innerhalb von ImportQuartalsplanProvider verwendet werden");
    }
    return ctx;
}
