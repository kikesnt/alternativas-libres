"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createLocalStorageStore } from "@/lib/stores";

type Theme = "system" | "light" | "dark";

const store = createLocalStorageStore<Theme>("al_theme", "al-theme-change");

const etiquetas: Record<Theme, string> = {
  system: "Automático",
  light: "Claro",
  dark: "Oscuro",
};

const iconos: Record<Theme, string> = {
  system: "◐",
  light: "☀",
  dark: "☾",
};

export function ThemeToggle() {
  const stored = useSyncExternalStore(
    store.subscribe,
    store.get,
    () => "system" as Theme,
  );
  const theme: Theme = stored ?? "system";

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const next: Theme =
    theme === "system" ? "light" : theme === "light" ? "dark" : "system";

  return (
    <button
      type="button"
      onClick={() => store.set(next)}
      title={`Tema: ${etiquetas[theme]}`}
      aria-label={`Cambiar tema (actual: ${etiquetas[theme]})`}
      className="rounded-md border border-border px-2.5 py-1.5 text-sm text-muted hover:text-fg"
    >
      <span aria-hidden="true">{iconos[theme]}</span>
    </button>
  );
}
