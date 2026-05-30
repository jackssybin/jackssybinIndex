<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { navIndex, searchIndex, topicIndex, tutorialIndex } from "../search-index.js";

type FilterType = "all" | "tutorial" | "blog" | "topic" | "nav";

const keyword = ref("");
const activeType = ref<FilterType>("all");

const filterValues: FilterType[] = ["all", "tutorial", "blog", "topic", "nav"];

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  keyword.value = params.get("keyword")?.trim() || "";
  const type = params.get("type") as FilterType | null;
  if (type && filterValues.includes(type)) activeType.value = type;
});

const terms = computed(() => keyword.value.trim().toLowerCase().split(/\s+/u).filter(Boolean));

function scoreText(value = "", weight: number) {
  const text = value.toLowerCase();
  return terms.value.reduce((score, query) => score + (text.includes(query) ? weight : 0), 0);
}

function highlight(value = "") {
  if (terms.value.length === 0) return value;
  const escaped = terms.value.map((term) => term.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "giu");
  return value.replace(pattern, "<mark>$1</mark>");
}

function snippet(value = "", fallback = "") {
  const text = String(value || fallback || "").replace(/\s+/gu, " ").trim();
  if (!text) return "";
  if (terms.value.length === 0) return text.slice(0, 180);
  const lower = text.toLowerCase();
  const firstHit = terms.value
    .map((term) => lower.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  if (firstHit === undefined) return text.slice(0, 180);
  const start = Math.max(0, firstHit - 70);
  const end = Math.min(text.length, firstHit + 150);
  return `${start > 0 ? "..." : ""}${text.slice(start, end)}${end < text.length ? "..." : ""}`;
}

const mergedResults = computed(() => {
  if (terms.value.length === 0) return [];

  const tutorialResults = tutorialIndex.map((item) => {
    const score = (item.priority || 0)
      + scoreText(item.title, 150)
      + scoreText(item.series, 90)
      + scoreText(item.group, 70)
      + scoreText(item.excerpt, 40)
      + scoreText(item.content, 12);
    return {
      ...item,
      type: "tutorial" as const,
      badge: "教程",
      meta: [item.series, item.group].filter(Boolean).join(" / "),
      excerpt: snippet(item.content, item.excerpt),
      score
    };
  });

  const blogResults = searchIndex.map((item) => {
    const score = (item.priority || 0)
      + scoreText(item.title, 140)
      + scoreText(item.tags?.join(","), 90)
      + scoreText(item.topic, 80)
      + scoreText(item.excerpt, 45)
      + scoreText(item.guide, 35)
      + scoreText(item.content, 10);
    return {
      ...item,
      type: "blog" as const,
      badge: item.core ? "核心文章" : "博客文章",
      meta: [item.date, item.topic, ...(item.tags || []).slice(0, 3)].filter(Boolean).join(" / "),
      excerpt: snippet(item.content, item.guide || item.excerpt),
      score
    };
  });

  const topicResults = topicIndex.map((item) => {
    const articleText = (item.articles || []).join(" ");
    const score = (item.priority || 0)
      + scoreText(item.title, 135)
      + scoreText(item.description, 70)
      + scoreText(item.keywords?.join(","), 60)
      + scoreText(articleText, 25);
    return {
      ...item,
      type: "topic" as const,
      badge: "专题",
      meta: `${item.count} 篇文章`,
      excerpt: snippet(articleText, item.description),
      score
    };
  });

  const navResults = navIndex.map((item) => {
    const score = (item.priority || 0)
      + scoreText(item.title, 110)
      + scoreText(item.taxonomy, 70)
      + scoreText(item.term, 45)
      + scoreText(item.description, 25);
    return {
      ...item,
      type: "nav" as const,
      badge: "导航",
      meta: [item.taxonomy, item.term].filter(Boolean).join(" / "),
      excerpt: snippet(item.description),
      score
    };
  });

  return [...tutorialResults, ...blogResults, ...topicResults, ...navResults]
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "zh-CN"))
    .slice(0, 120);
});

const filteredResults = computed(() => {
  if (activeType.value === "all") return mergedResults.value;
  return mergedResults.value.filter((item) => item.type === activeType.value);
});

const counts = computed(() => ({
  all: mergedResults.value.length,
  tutorial: mergedResults.value.filter((item) => item.type === "tutorial").length,
  blog: mergedResults.value.filter((item) => item.type === "blog").length,
  topic: mergedResults.value.filter((item) => item.type === "topic").length,
  nav: mergedResults.value.filter((item) => item.type === "nav").length
}));

const hotTags = computed(() => {
  const countMap = new Map<string, number>();
  for (const item of searchIndex) {
    for (const tag of item.tags || []) countMap.set(tag, (countMap.get(tag) || 0) + 1);
  }
  return [...countMap.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, 18);
});

const filters: Array<{ label: string; value: FilterType }> = [
  { label: "全部", value: "all" },
  { label: "教程", value: "tutorial" },
  { label: "博客", value: "blog" },
  { label: "专题", value: "topic" },
  { label: "导航", value: "nav" }
];
</script>

<template>
  <div class="solo-static">
    <header>
      <div class="banner">
        <div class="fn-clear wrapper">
          <h1 class="fn-inline"><a href="/" rel="start">jackssybin 的个人博客</a></h1>
          <small> &nbsp; 记录精彩的程序人生</small>
        </div>
      </div>
      <div class="navbar">
        <div class="fn-clear wrapper">
          <nav class="fn-left">
            <a href="/"><i class="icon-home"></i> 首页</a>
            <a href="/my-github-repos"><img class="page-icon" src="/images/github-icon.png" alt="">我的开源</a>
            <a href="https://blog.csdn.net/jackssybin">我的 CSDN</a>
            <a href="/tutorials.html"><i class="icon-list"></i> 教程中心</a>
            <a href="/news.html"><i class="icon-list"></i> 实时新闻</a>
            <a href="/topics.html"><i class="icon-list"></i> 专题</a>
            <a href="/nav.html"><i class="icon-link"></i> 网址导航</a>
            <a href="/tags.html"><i class="icon-tags"></i> 标签墙</a>
            <a href="/archives.html"><i class="icon-inbox"></i> 存档</a>
            <a href="/about.html"><i class="icon-user"></i> 关于本站</a>
            <a href="/links.html"><i class="icon-link"></i> 友情链接</a>
            <a href="/rss.xml"><i class="icon-rss"></i> RSS</a>
          </nav>
          <div class="fn-right">
            <button class="theme-toggle" type="button" aria-label="切换黑夜模式" title="切换黑夜模式" data-theme-toggle>夜</button>
            <form class="form" action="/search.html" method="get">
              <input v-model="keyword" placeholder="搜索文章、教程或导航" id="search" type="text" name="keyword">
              <button type="submit"><i class="icon-search"></i></button>
            </form>
          </div>
        </div>
      </div>
    </header>

    <div class="wrapper">
      <main class="other search-page">
        <div class="title"><h2><i class="icon-search"></i>&nbsp;全站搜索</h2></div>

        <form class="form search-form" action="/search.html" method="get">
          <input v-model="keyword" placeholder="输入 Java、MySQL、Spring Boot、Netty、AI 工具等关键词" type="text" name="keyword">
          <button type="submit">搜索</button>
        </form>

        <div v-if="keyword" class="search-filter-tabs">
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            :class="{ active: activeType === filter.value }"
            @click="activeType = filter.value"
          >
            {{ filter.label }} <span>{{ counts[filter.value] }}</span>
          </button>
        </div>

        <div v-if="!keyword" class="search-tags tags">
          <a v-for="[tag, count] in hotTags" :key="tag" class="tag" :href="`/search.html?keyword=${encodeURIComponent(tag)}`">
            {{ tag }} <b>{{ count }}</b>
          </a>
        </div>
        <p v-if="!keyword" class="ft-gray">可搜索文章标题、专题、标签、摘要、正文、教程中心和网址导航。教程与核心文章会优先展示。</p>
        <p v-else class="ft-gray">关键词：{{ keyword }}，当前展示 {{ filteredResults.length }} 条结果。</p>

        <ul v-if="filteredResults.length" class="list search-results search-results--mixed">
          <li v-for="item in filteredResults" :key="`${item.type}-${item.url}`">
            <a :href="item.url" :target="item.type === 'nav' ? '_blank' : undefined" :rel="item.type === 'nav' ? 'noopener' : undefined">
              <span class="search-result-badge" :class="`search-result-badge--${item.type}`">{{ item.badge }}</span>
              <strong v-html="highlight(item.title)"></strong>
              <span class="ft-gray search-result-meta" v-html="highlight(item.meta)"></span>
              <span v-if="item.excerpt" class="search-excerpt" v-html="highlight(item.excerpt)"></span>
            </a>
          </li>
        </ul>

        <p v-else-if="keyword" class="ft-gray">没有找到匹配内容，可以换一个关键词再试。</p>
      </main>
    </div>
  </div>
</template>
