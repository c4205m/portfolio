import { useTheme } from "../context/ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div id="theme" className="theme-switcher">
      <input
        type="radio"
        name="theme-toggle"
        id="theme-dark"
        value="dark"
        checked={theme === "dark"}
        onChange={() => setTheme("dark")}
      />
      <input
        type="radio"
        name="theme-toggle"
        id="theme-light"
        value="light"
        checked={theme === "light"}
        onChange={() => setTheme("light")}
      />
      <label lang="en" htmlFor="theme-dark">
        dark
      </label>
      <label lang="en" htmlFor="theme-light">
        light
      </label>
    </div>
  );
}
