/* AI 导航前端逻辑 - 纯静态，加载 data/tools.json */
(function () {
  "use strict";

  const CAT_EMOJI = {
    "AI写作": "✍️", "AI绘画/图像": "🎨", "AI编程/开发": "💻",
    "AI办公/生产力": "📊", "AI视频": "🎬", "AI聊天助手": "💬",
    "AI音频": "🎵", "AI设计": "🖌️", "AI智能体": "🤖",
    "商业/金融": "💼", "AI教育/研究": "📚", "生活/趣味": "🎮",
    "营销/SEO": "📈", "AI训练模型": "🧠", "AI搜索": "🔍",
    "AI内容检测": "🛡️", "AI提示词": "📝", "其他": "🧩"
  };

  const state = { data: null, activeCat: null, query: "" };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  function catId(name) {
    return "cat-" + name.toLowerCase().replace(/[\/\s]+/g, "-");
  }

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function letterAvatar(name) {
    const ch = (name || "?").trim().charAt(0).toUpperCase();
    return `<div class="tool-ico-fallback">${escapeHtml(ch)}</div>`;
  }

  function toolCard(tool) {
    const hasIcon = tool.icon && !/favicon\.png$/.test(tool.icon);
    const icon = hasIcon
      ? `<img class="tool-ico" loading="lazy" src="${escapeHtml(tool.icon)}" alt="" onerror="this.outerHTML='${letterAvatar(tool.name).replace(/'/g, "&#39;")}'">`
      : letterAvatar(tool.name);
    const multi = (tool.source || "").includes(",");
    const dot = multi ? '<span class="src-dot" title="多源收录"></span>' : "";
    const desc = tool.desc ? escapeHtml(tool.desc) : "暂无简介";
    return `<a class="tool-card" href="${escapeHtml(tool.url)}" target="_blank" rel="noopener nofollow" title="${escapeHtml(tool.name)}">
      ${icon}
      <div class="tool-body">
        <div class="tool-name">${dot}${escapeHtml(tool.name)}</div>
        <div class="tool-desc">${desc}</div>
      </div>
    </a>`;
  }

  function renderSidebar() {
    const nav = $("#catNav");
    const cats = state.data.categories;
    nav.innerHTML = cats.map(c => `
      <a class="cat-link" data-cat="${escapeHtml(c.name)}" href="#${catId(c.name)}">
        <span class="cat-emoji">${CAT_EMOJI[c.name] || "🔹"}</span>
        <span class="cat-label">${escapeHtml(c.name)}</span>
        <span class="cat-count">${c.count}</span>
      </a>`).join("");

    nav.addEventListener("click", e => {
      const link = e.target.closest(".cat-link");
      if (!link) return;
      closeSidebar();
    });
  }

  function renderHero() {
    $("#heroCount").textContent = state.data.meta.total_tools.toLocaleString();
    const top = state.data.categories.slice(0, 8);
    $("#heroTags").innerHTML = top.map(c =>
      `<span class="hero-tag" data-cat="${escapeHtml(c.name)}">${CAT_EMOJI[c.name] || ""} ${escapeHtml(c.name)}</span>`
    ).join("");
    $("#heroTags").addEventListener("click", e => {
      const tag = e.target.closest(".hero-tag");
      if (!tag) return;
      const el = document.getElementById(catId(tag.dataset.cat));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
    const meta = state.data.meta;
    $("#metaInfo").textContent = `${meta.total_tools} 工具 · ${meta.total_categories} 分类`;
    $("#footerMeta").textContent = `数据更新于 ${meta.last_updated} · 来源 ${meta.sources.join(" / ")}`;
  }

  function groupTools() {
    const groups = {};
    state.data.categories.forEach(c => (groups[c.name] = []));
    state.data.tools.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }

  function renderSections() {
    const groups = groupTools();
    const wrap = $("#sections");
    const html = state.data.categories.map(c => {
      const tools = groups[c.name] || [];
      if (!tools.length) return "";
      return `<section class="cat-section" id="${catId(c.name)}">
        <div class="cat-head">
          <span class="bar"></span>
          <h2>${CAT_EMOJI[c.name] || ""} ${escapeHtml(c.name)}</h2>
          <span class="num">${tools.length} 个工具</span>
        </div>
        <div class="tool-grid">${tools.map(toolCard).join("")}</div>
      </section>`;
    }).join("");
    wrap.innerHTML = html;
  }

  function renderSearch() {
    const q = state.query.trim().toLowerCase();
    const bar = $("#searchBar");
    const wrap = $("#sections");
    if (!q) {
      bar.hidden = true;
      $(".hero").style.display = "";
      renderSections();
      return;
    }
    $(".hero").style.display = "none";
    const matched = state.data.tools.filter(t =>
      (t.name || "").toLowerCase().includes(q) ||
      (t.desc || "").toLowerCase().includes(q) ||
      (t.category || "").toLowerCase().includes(q)
    );
    bar.hidden = false;
    $("#searchResultText").innerHTML = `找到 <b>${matched.length}</b> 个与 “${escapeHtml(state.query)}” 相关的工具`;

    if (!matched.length) {
      wrap.innerHTML = `<div class="empty-state"><div class="big">🔍</div><p>没有找到相关工具，换个关键词试试？</p></div>`;
      return;
    }
    wrap.innerHTML = `<section class="cat-section">
      <div class="tool-grid">${matched.map(toolCard).join("")}</div>
    </section>`;
  }

  // ===== Scroll spy =====
  function setupScrollSpy() {
    const links = $$(".cat-link");
    const map = {};
    links.forEach(l => (map[l.getAttribute("href").slice(1)] = l));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove("active"));
          const link = map[e.target.id];
          if (link) {
            link.classList.add("active");
            link.scrollIntoView({ block: "nearest" });
          }
        }
      });
    }, { rootMargin: "-70px 0px -75% 0px", threshold: 0 });
    $$(".cat-section[id]").forEach(s => observer.observe(s));
  }

  // ===== Sidebar mobile =====
  function openSidebar() { $("#sidebar").classList.add("open"); $("#overlay").classList.add("show"); }
  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#overlay").classList.remove("show"); }

  // ===== Theme =====
  function initTheme() {
    const saved = localStorage.getItem("ai-nav-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ai-nav-theme", next);
  }

  function debounce(fn, ms) {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  function bindEvents() {
    $("#themeBtn").addEventListener("click", toggleTheme);
    $("#menuBtn").addEventListener("click", openSidebar);
    $("#overlay").addEventListener("click", closeSidebar);

    const input = $("#searchInput");
    input.addEventListener("input", debounce(e => {
      state.query = e.target.value;
      renderSearch();
      if (!state.query.trim()) setupScrollSpy();
    }, 180));

    $("#clearSearch").addEventListener("click", () => {
      input.value = ""; state.query = ""; renderSearch(); setupScrollSpy();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "/" && document.activeElement !== input) {
        e.preventDefault(); input.focus();
      }
      if (e.key === "Escape" && state.query) {
        input.value = ""; state.query = ""; renderSearch(); setupScrollSpy();
      }
    });

    const toTop = $("#toTop");
    window.addEventListener("scroll", () => {
      toTop.hidden = window.scrollY < 400;
    });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  async function init() {
    initTheme();
    bindEvents();
    try {
      const res = await fetch("data/tools.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      state.data = await res.json();
    } catch (err) {
      $("#sections").innerHTML = `<div class="empty-state"><div class="big">⚠️</div><p>数据加载失败：${escapeHtml(err.message)}</p></div>`;
      return;
    }
    renderSidebar();
    renderHero();
    renderSections();
    setupScrollSpy();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
