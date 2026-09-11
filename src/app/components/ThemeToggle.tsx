"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "portfolio-theme";
const LIGHT_THEME = "portfolio-light";
const DARK_THEME = "portfolio-dark";

export default function ThemeToggle() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.checked =
        document.documentElement.dataset.theme === DARK_THEME;
    }
  }, []);

  const updateTheme = (dark: boolean) => {
    const theme = dark ? DARK_THEME : LIGHT_THEME;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  };

  return (
    <div className="tooltip tooltip-left" data-tip="Toggle color theme">
      <label
        htmlFor="theme-toggle"
        className="btn swap btn-square swap-rotate bg-base-100"
      >
        <input
          id="theme-toggle"
          ref={inputRef}
          type="checkbox"
          className="theme-controller"
          value={DARK_THEME}
          onChange={(event) => updateTheme(event.target.checked)}
          aria-label="Toggle color theme"
        />
        <svg
          className="swap-off h-5 w-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M5.64 17.66 4.22 19.07l-1.41-1.41 1.41-1.42 1.42 1.42ZM4 11v2H1v-2h3Zm9-9v3h-2V2h2Zm7.78 2.93-1.41 1.41-1.42-1.41 1.42-1.42 1.41 1.42ZM18.36 17.66l1.42-1.42 1.41 1.42-1.41 1.41-1.42-1.41ZM23 11v2h-3v-2h3ZM6.05 4.93 4.63 6.34 3.22 4.93l1.41-1.42 1.42 1.42ZM13 19v3h-2v-3h2Zm-1-12a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
        </svg>
        <svg
          className="swap-on h-5 w-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M21.64 13a1 1 0 0 0-1.05-.14A8.05 8.05 0 0 1 17.22 13 8.15 8.15 0 0 1 11 6.78a8.59 8.59 0 0 1 .14-3.37A1 1 0 0 0 9.86 2.2 10 10 0 1 0 21.8 14.14a1 1 0 0 0-.16-1.14Z" />
        </svg>
      </label>
    </div>
  );
}
