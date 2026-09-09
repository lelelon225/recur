import { useEffect, useRef } from "react";
function useFormCache(key, values, setValues) {
    const loaded = useRef(false);
    useEffect(() => {
        if (loaded.current)
            return;
        const cached = localStorage.getItem(key);
        if (cached) {
            setValues(JSON.parse(cached));
        }
        loaded.current = true;
    }, [key, setValues]);
    useEffect(() => {
        if (!loaded.current)
            return;
        localStorage.setItem(key, JSON.stringify(values));
    }, [key, values]);
    return {
        clearCache: () => localStorage.removeItem(key),
    };
}
export default useFormCache;
