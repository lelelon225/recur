import { useEffect, useState } from "react";

function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored ? stored === "dark" : prefersDark;

    // Intentional: initial theme can only be read after mount (localStorage/
    // matchMedia aren't available during Next's SSR pass) - starting state
    // synchronously here would mismatch the server-rendered HTML. This is
    // the known load-time flash tracked as a follow-up in AGENT_TASK.md (T10).
    // eslint-disable-next-line react-hooks/set-state-in-effect
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