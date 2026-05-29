<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { searchIndex } from "../search-index.js";

const keyword = ref("");

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  keyword.value = params.get("keyword")?.trim() || "";
});

const results = computed(() => {
  const query = keyword.value.trim().toLowerCase();
  if (!query) return [];

  return searchIndex
    .map((item) => {
      const title = item.title.toLowerCase();
      const tags = item.tags.join(",").toLowerCase();
      const excerpt = (item.excerpt || "").toLowerCase();
      const content = (item.content || "").toLowerCase();
      let score = 0;
      if (title.includes(query)) score += 100;
      if (tags.includes(query)) score += 60;
      if (excerpt.includes(query)) score += 30;
      if (content.includes(query)) score += 10;
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, 50);
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
            <a href="https://blog.csdn.net/jackssybin">我的scdn</a>
            <a href="/tags.html"><i class="icon-tags"></i> 标签墙</a>
            <a href="/archives.html"><i class="icon-inbox"></i> 存档</a>
            <a href="/links.html"><i class="icon-link"></i> 友情链接</a>
            <a href="/rss.xml"><i class="icon-rss"></i> RSS</a>
          </nav>
          <div class="fn-right">
            <form class="form" action="/search.html" method="get">
              <input v-model="keyword" placeholder="搜索文章标题" id="search" type="text" name="keyword">
              <button type="submit"><i class="icon-search"></i></button>
            </form>
          </div>
        </div>
      </div>
    </header>

    <div class="wrapper">
      <main class="other search-page">
        <div class="title">
          <h2><i class="icon-search"></i>&nbsp;文章搜索</h2>
        </div>

        <form class="form search-form" action="/search.html" method="get">
          <input v-model="keyword" placeholder="输入文章名称或标签" type="text" name="keyword">
          <button type="submit">搜索</button>
        </form>

        <p v-if="!keyword" class="ft-gray">请输入关键词搜索文章标题。</p>
        <p v-else class="ft-gray">关键词：{{ keyword }}，找到 {{ results.length }} 条结果。</p>

        <ul v-if="results.length" class="list search-results">
          <li v-for="item in results" :key="item.url">
            <a :href="item.url">
              <strong>{{ item.title }}</strong>
              <span class="ft-gray">{{ item.date }} · {{ item.tags.join(', ') }}</span>
              <span v-if="item.excerpt" class="search-excerpt">{{ item.excerpt }}</span>
            </a>
          </li>
        </ul>
      </main>
    </div>
  </div>
</template>
