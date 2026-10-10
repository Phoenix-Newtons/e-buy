import { useCallback, useState } from "react";

export type ThemeMode = "light" | "dark";

function readInitialTheme(): ThemeMode {
  // index.html applies the saved or system theme before first paint; mirror it here.
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme(): { theme: ThemeMode; toggleTheme: () => void } {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);

  // Only an explicit toggle is persisted, so users without a saved choice keep following their system setting.
  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: ThemeMode = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        window.localStorage.setItem("ebuy:theme", next);
      } catch {
        // Ignore storage failures; the theme still applies for this visit.
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
