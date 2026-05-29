<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { navIndex, searchIndex } from "../search-index.js";

const keyword = ref("");

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  keyword.value = params.get("keyword")?.trim() || "";
});

const terms = computed(() => keyword.value.trim().toLowerCase().split(/\s+/u).filter(Boolean));

const results = computed(() => {
  if (terms.value.length === 0) return [];

  return searchIndex
    .map((item) => {
      const title = item.title.toLowerCase();
      const tags = item.tags.join(",").toLowerCase();
      const topic = (item.topic || "").toLowerCase();
      const excerpt = (item.excerpt || "").toLowerCase();
      const guide = (item.guide || "").toLowerCase();
      const content = (item.content || "").toLowerCase();
      let score = 0;
      for (const query of terms.value) {
        if (title.includes(query)) score += 100;
        if (tags.includes(query)) score += 70;
        if (topic.includes(query)) score += 50;
        if (excerpt.includes(query)) score += 30;
        if (guide.includes(query)) score += 20;
        if (content.includes(query)) score += 10;
      }
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, 50);
});

const navResults = computed(() => {
  if (terms.value.length === 0) return [];

  return navIndex
    .map((item) => {
      const title = item.title.toLowerCase();
      const taxonomy = (item.taxonomy || "").toLowerCase();
      const term = (item.term || "").toLowerCase();
      const description = (item.description || "").toLowerCase();
      let score = 0;
      for (const query of terms.value) {
        if (title.includes(query)) score += 100;
        if (taxonomy.includes(query)) score += 60;
        if (term.includes(query)) score += 40;
        if (description.includes(query)) score += 20;
      }
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "zh-CN"))
    .slice(0, 30);
});

const hotTags = computed(() => {
  const counts = new Map<string, number>();
  for (const item of searchIndex) {
    for (const tag of item.tags || []) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, 18);
});
</script>

<template>
  <div class="solo-static">
    <header>
      <div class="banner">
        <div class="fn-clear wrapper">
          <h1 class="fn-inline">
            <a href="/" rel="start">jackssybin 的个人博客</a>
          </h1>
          <small> &nbsp; 记录精彩的程序人生</small>
        </div>
      </div>
      <div class="navbar">
        <div class="fn-clear wrapper">
          <nav class="fn-left">
            <a href="/"><i class="icon-home"></i> 首页</a>
            <a href="/my-github-repos"><img class="page-icon" src="/images/github-icon.png" alt="">我的开源</a>
            <a href="https://blog.csdn.net/jackssybin">我的 CSDN</a>
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
              <input v-model="keyword" placeholder="搜索标题、标签、专题、正文或导航" id="search" type="text" name="keyword">
              <button type="submit"><i class="icon-search"></i></button>
            </form>
          </div>
        </div>
      </div>
    </header>

    <div class="wrapper">
      <main class="other search-page">
        <div class="title">
          <h2><i class="icon-search"></i>&nbsp;全站搜索</h2>
        </div>

        <form class="form search-form" action="/search.html" method="get">
          <input v-model="keyword" placeholder="输入 Java、MySQL、Spring Boot、AI 工具、导航站点等关键词" type="text" name="keyword">
          <button type="submit">搜索</button>
        </form>

        <div v-if="!keyword" class="search-tags tags">
          <a v-for="[tag, count] in hotTags" :key="tag" class="tag" :href="`/search.html?keyword=${encodeURIComponent(tag)}`">
            {{ tag }} <b>{{ count }}</b>
          </a>
        </div>
        <p v-if="!keyword" class="ft-gray">可搜索文章标题、专题、标签、摘要、正文和网址导航。</p>
        <p v-else class="ft-gray">关键词：{{ keyword }}，找到 {{ results.length }} 篇文章、{{ navResults.length }} 个导航资源。</p>

        <h3 v-if="results.length" class="search-section-title">文章</h3>
        <ul v-if="results.length" class="list search-results">
          <li v-for="item in results" :key="item.url">
            <a :href="item.url">
              <strong>{{ item.title }}</strong>
              <span class="ft-gray">{{ item.date }} · {{ item.topic }} · {{ item.tags.join(', ') }}</span>
              <span v-if="item.excerpt" class="search-excerpt">{{ item.excerpt }}</span>
            </a>
          </li>
        </ul>

        <h3 v-if="navResults.length" class="search-section-title">导航资源</h3>
        <ul v-if="navResults.length" class="list search-results">
          <li v-for="item in navResults" :key="item.url">
            <a :href="item.url" target="_blank" rel="noopener">
              <strong>{{ item.title }}</strong>
              <span class="ft-gray">{{ item.taxonomy }} · {{ item.term }}</span>
              <span v-if="item.description" class="search-excerpt">{{ item.description }}</span>
            </a>
          </li>
        </ul>
      </main>
    </div>
  </div>
</template>
