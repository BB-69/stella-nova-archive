import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDebugValue } from "../_DebugTools/hooks/useDebugValue";

export const backgroundColorLight = "#f0f9ff";
export const themeColorLight = "#b8d9fe";
export const backgroundColorDark = "#061144";
export const themeColorDark = "#0d0a20";

export interface ThemeState {
  theme: "dark" | "light" | null;
  isDark: boolean;
  setTheme: (theme: "dark" | "light" | null) => void;
}
const ThemeContext = createContext<ThemeState>({
  theme: null,
  isDark: false,
  setTheme: () => {},
});
export const useTheme = () => useContext(ThemeContext);

function getCurrentTheme(): "dark" | "light" | null {
  const theme = localStorage?.getItem("theme");
  return theme === "dark" || theme === "light" ? theme : null;
}
function currentThemeIsDark() {
  switch (getCurrentTheme()) {
    case "dark":
      return true;
    case "light":
      return false;
    default:
      return (
        window?.matchMedia("(prefers-color-scheme: dark)").matches || false
      );
  }
}
const applyTheme = () => {
  if (typeof document !== "undefined") {
    if (currentThemeIsDark()) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }
};

export function ThemeProvider(props: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  {
    // Debugging
    const [debugTheme, setDebugTheme] = useState<"dark" | "light" | "system">(
      () => (!theme ? "system" : theme)
    );
    useEffect(() => {
      setDebugTheme(!theme ? "system" : theme);
    }, [theme]);
    useDebugValue("theme", debugTheme);
  }

  applyTheme();
  const updateTheme = () => {
    setTheme(getCurrentTheme());
    const isDark = currentThemeIsDark();
    setIsDark(isDark);
    applyTheme();
  };
  useEffect(() => {
    updateTheme();
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", updateTheme);
    const i = setInterval(updateTheme, 1000);
    return () => {
      mql.removeEventListener("change", updateTheme);
      clearInterval(i);
    };
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setTheme: (theme: "dark" | "light" | null) => {
          if (theme !== null) {
            localStorage?.setItem("theme", theme);
          } else {
            localStorage?.removeItem("theme");
          }
          updateTheme();
        },
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme(null);
    else setTheme("light");
  };

  const icon = theme === "light" ? "🌞" : theme === "dark" ? "🌙" : "🎲";

  return (
    <button
      id="theme-toggle"
      onClick={cycle}
      style={{
        cursor: "pointer",
      }}
    >
      {icon}
    </button>
  );
}
