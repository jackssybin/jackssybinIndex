(function () {
  var params = new URLSearchParams(location.search);
  var keywordInput = document.querySelector("[data-hugo-search-input]");
  var typeSelect = document.querySelector("[data-hugo-search-type]");
  var results = document.querySelector("[data-hugo-search-results]");
  if (!keywordInput || !results) return;
  keywordInput.value = params.get("keyword") || "";
  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char];
    });
  }
  function escapeRegExp(value) {
    return String(value || "").replace(/[.*+?^$(){}|[\]\\]/g, "\\$&");
  }
  function highlight(text, keyword) {
    var safe = escapeHtml(text);
    if (!keyword) return safe;
    return safe.replace(new RegExp(escapeRegExp(keyword), "ig"), function (match) {
      return "<mark>" + match + "</mark>";
    });
  }
  function render(items, keyword) {
    if (!keyword) {
      results.innerHTML = "<p>请输入关键词搜索文章、教程、专题或导航。</p>";
      return;
    }
    if (!items.length) {
      results.innerHTML = "<p>没有找到相关内容。</p>";
      return;
    }
    results.innerHTML = items.slice(0, 80).map(function (item) {
      return '<article class="hugo-search-result"><h3><a href="' + escapeHtml(item.url) + '">' + highlight(item.title, keyword) + '</a></h3><p>' + highlight(item.excerpt || item.description || "", keyword) + '</p><div class="meta">' + escapeHtml([item.type, item.topic, item.series].filter(Boolean).join(" / ")) + '</div></article>';
    }).join("");
  }
  fetch("/search-index.json").then(function (res) { return res.json(); }).then(function (index) {
    function run() {
      var keyword = keywordInput.value.trim().toLowerCase();
      var type = typeSelect ? typeSelect.value : "";
      var matched = index.filter(function (item) {
        if (type && item.type !== type) return false;
        var text = [item.title, item.excerpt, item.description, item.topic, item.series, (item.tags || []).join(" "), item.content].join(" ").toLowerCase();
        return text.indexOf(keyword) >= 0;
      }).sort(function (a, b) { return (b.priority || 0) - (a.priority || 0); });
      render(matched, keyword);
    }
    keywordInput.addEventListener("input", run);
    if (typeSelect) typeSelect.addEventListener("change", run);
    run();
  });
})();
