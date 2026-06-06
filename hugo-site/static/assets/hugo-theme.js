(function () {
  var key = "solo-theme";
  function apply(theme) {
    document.documentElement.dataset.soloTheme = theme;
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem(key, theme); } catch (_) {}
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      var dark = theme === "dark";
      button.textContent = dark ? "日" : "夜";
      button.setAttribute("aria-label", dark ? "切换白天模式" : "切换黑夜模式");
      button.setAttribute("title", dark ? "切换白天模式" : "切换黑夜模式");
    });
  }
  var saved = "dark";
  try { saved = localStorage.getItem(key) || "dark"; } catch (_) {}
  apply(saved === "light" ? "light" : "dark");
  document.addEventListener("click", function (event) {
    var target = event.target && event.target.closest ? event.target.closest("[data-theme-toggle]") : null;
    if (!target) return;
    apply(document.documentElement.dataset.soloTheme === "dark" ? "light" : "dark");
  });
})();
