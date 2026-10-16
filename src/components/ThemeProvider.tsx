"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "crimson" | "cryo";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "crimson",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("crimson");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("migol_theme") as Theme | null;
      if (saved === "cryo" || saved === "crimson") {
        document.documentElement.setAttribute("data-theme", saved);
        requestAnimationFrame(() => {
          setThemeState(saved);
        });
      }
    } catch {
      // localStorage may be disabled in private mode
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("migol_theme", newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const next = theme === "crimson" ? "cryo" : "crimson";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
