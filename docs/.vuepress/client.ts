import { defineClientConfig } from "vuepress/client";
import SearchPage from "./components/SearchPage.vue";
import SoloPage from "./components/SoloPage.vue";

const THEME_KEY = "solo-theme";

function applySoloTheme(theme: "light" | "dark") {
  document.documentElement.dataset.soloTheme = theme;
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem(THEME_KEY, theme);

  document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((button) => {
    const label = theme === "dark" ? "日" : "夜";
    if (button.textContent !== label) button.textContent = label;
    button.setAttribute("aria-label", theme === "dark" ? "切换白天模式" : "切换黑夜模式");
    button.setAttribute("title", theme === "dark" ? "切换白天模式" : "切换黑夜模式");
  });
}

function getInitialSoloTheme(): "light" | "dark" {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default defineClientConfig({
  enhance({ app }) {
    app.component("SoloPage", SoloPage);
    app.component("SearchPage", SearchPage);
  },
  setup() {
    if (typeof window === "undefined") return;

    const syncTheme = () => applySoloTheme(getInitialSoloTheme());
    syncTheme();

    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target.closest("[data-theme-toggle]") : null;
      if (!target) return;
      const current = document.documentElement.dataset.soloTheme === "dark" ? "dark" : "light";
      applySoloTheme(current === "dark" ? "light" : "dark");
    });

    new MutationObserver(syncTheme).observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});
