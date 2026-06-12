"use client";

import { useEffect } from "react";

export function ThemeSync() {
  useEffect(() => {
    async function syncTheme() {
      try {
        const response = await fetch("/api/workspace", { cache: "no-store" });
        if (!response.ok) return;
        const workspace = await response.json();
        const theme = workspace.settings?.themeMode === "dark" ? "dark" : "light";
        document.documentElement.dataset.theme = theme;
      } catch {
        document.documentElement.dataset.theme = "light";
      }
    }
    void syncTheme();
  }, []);

  return null;
}
