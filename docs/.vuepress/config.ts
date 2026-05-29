import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  dest: "docs/.vuepress/dist",
  lang: "zh-CN",
  title: "jackssybin 的个人博客",
  description: "记录精彩的程序人生",

  head: [
    ["script", {}, "try{var t=localStorage.getItem('solo-theme')||'dark';document.documentElement.dataset.soloTheme=t;document.documentElement.style.colorScheme=t;}catch(e){}"],
    ["meta", { name: "robots", content: "all" }],
    ["meta", { name: "author", content: "jackssybin" }],
    ["meta", { name: "keywords", content: "Solo,Java,博客,开源,jackssybin" }],
    ["meta", { property: "og:site_name", content: "jackssybin 的个人博客" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "jackssybin 的个人博客" }],
    ["meta", { property: "og:description", content: "记录精彩的程序人生" }],
    ["link", { rel: "icon", href: "/images/favicon.svg?v=20260529-4", type: "image/svg+xml" }],
    ["link", { rel: "shortcut icon", href: "/images/favicon.svg?v=20260529-4", type: "image/svg+xml" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    ["link", { rel: "stylesheet", href: "/assets/solo-base.css" }],
    ["link", { rel: "stylesheet", href: "/assets/site.css" }],
    ["link", { rel: "alternate", href: "/rss.xml", title: "RSS", type: "application/rss+xml" }]
  ],

  bundler: viteBundler(),
  theme,
  pagePatterns: ["**/*.md", "!.vuepress", "!node_modules"],
  shouldPrefetch: false,
  shouldPreload: false
});
