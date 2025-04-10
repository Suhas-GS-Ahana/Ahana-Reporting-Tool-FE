"use client";
import { useEffect, useState } from "react";

const themes = ["root","theme-blue","theme-red","theme-green"];

export default function ThemeChanger() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "theme-light";
  });

  useEffect(() => {
    document.documentElement.classList.remove(...themes);
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="relative">
      <select
        className="p-2 border rounded bg-background text-foreground"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {`${t.replace("theme-", "")} theme`}
          </option>
        ))}
      </select>
    </div>
  );
}
