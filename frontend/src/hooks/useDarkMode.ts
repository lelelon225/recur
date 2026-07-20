import { useEffect, useState } from "react";

function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored ? stored === "dark" : prefersDark;

    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);

  const toggleDark = (pressed: boolean) => {
    setIsDark(pressed);
    document.documentElement.classList.toggle("dark", pressed);
    localStorage.setItem("theme", pressed ? "dark" : "light");
  };

  return { isDark, toggleDark };
}

export default useDarkMode;