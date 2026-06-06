---
title: 老博客静态化迁移实战
description: 这篇文章适合作为本站建设路线的入口，重点看如何把 Solo/Bolo 的数据库、皮肤、旧链接和静态站构建流程拆开处理。
url: /articles/2026/05/28/zhihu-bolo-to-vuepress-migration.html
date: 2026-05-28T00:00:00+08:00
kind: article
---

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
                <a href="/my-github-repos" target="_self" rel="section"><img class="page-icon" src="/images/github-icon.png" alt="">我的开源</a>
<a href="https://blog.csdn.net/jackssybin" target="_self" rel="section">我的scdn</a>
                <a href="/tutorials.html" rel="section"><i class="icon-list"></i> 教程中心</a>
                <a href="/news.html" rel="section"><i class="icon-list"></i> 实时新闻</a>
                <a href="/topics.html" rel="section"><i class="icon-list"></i> 专题</a>
                <a href="/nav.html" rel="section"><i class="icon-link"></i> 网址导航</a>
                <a href="/tags.html" rel="section"><i class="icon-tags"></i> 标签墙</a>
                <a href="/archives.html"><i class="icon-inbox"></i> 存档</a>
                <a href="/about.html" rel="section"><i class="icon-user"></i> 关于本站</a>
                <a rel="archive" href="/links.html"><i class="icon-link"></i> 友情链接</a>
                <a rel="alternate" href="/rss.xml" rel="section"><i class="icon-rss"></i> RSS</a>
            </nav>
            <div class="fn-right">
                <button class="theme-toggle" type="button" aria-label="切换黑夜模式" title="切换黑夜模式" data-theme-toggle>夜</button>
                <form class="form" action="/search.html" method="get">
                    <input placeholder="搜索文章标题" id="search" type="text" name="keyword">
                    <button type="submit"><i class="icon-search"></i></button>
                </form>
            </div>
        </div>
    </div>
</header>
<div class="wrapper">
    <div class="main-wrap">
        <main>
    <article class="post post--detail">
        <header>
            <h2><a rel="bookmark" href="/articles/2026/05/28/zhihu-bolo-to-vuepress-migration.html">老博客静态化迁移实战</a></h2>
            <div class="meta">
                <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                    <i class="icon-date"></i>
                    <time>2026-05-28/2026-05-29</time>
                </span>
            </div>
        </header>
        <section class="article-guide">
      <div><strong>专题</strong><a href="/topics/tools-blog.html">工具、效率与博客建设</a></div>
      <div><strong>导读</strong><span>核心文章：这篇文章适合作为本站建设路线的入口，重点看如何把 Solo/Bolo 的数据库、皮肤、旧链接和静态站构建流程拆开处理。</span></div>
  </section>
        <section class="core-intro">
    <h3>重写导读：老博客静态化迁移实战</h3>
    <p>这篇文章适合作为本站建设路线的入口，重点看如何把 Solo/Bolo 的数据库、皮肤、旧链接和静态站构建流程拆开处理。</p>
    <ul>
      <li>把数据库作为内容源，避免手写 SQL dump 解析。</li>
<li>保留旧 permalink，降低迁移对搜索和外链的影响。</li>
<li>用 VuePress 承接静态发布，用脚本保证迁移可重复执行。</li>
    </ul>
  </section>
        <div id="more" class="vditor-reset post__content"><p>先说背景：我手上有一个运行多年的个人博客 <code>jackssybin.cn</code>，原来是 Solo/Bolo 系统，通过 Tomcat 部署，数据在 MySQL 里。后来我希望把它迁成一个更轻、更容易维护的静态站：文章继续保留，旧链接尽量不失效，样式尽量接近原站，但不再依赖 Tomcat、后台和数据库服务。</p>
<p>这篇文章记录的是一次完整迁移过程。不是泛泛而谈“把博客迁到静态站”，而是把一个真实的 Solo/Bolo 项目拆开，迁移到 VuePress 2 + vuepress-theme-hope，并保留原站文章、标签、归档、友情链接、RSS 和旧评论归档。</p>
<p>最后得到的效果大概是这样：</p>
<ol>
<li>原数据库备份 <code>bolo_260527.sql</code> 作为内容来源；</li>
<li>原 Tomcat 项目 <code>ROOT/</code> 作为样式和静态资源来源；</li>
<li>新项目用 VuePress 构建；</li>
<li>构建产物是纯静态文件，可部署到 Vercel、Render、Netlify、Cloudflare Pages 等平台；</li>
<li>原文章链接，例如 <code>/articles/2019/07/31/1564568923421.html</code>，尽量保持可访问。</li>
</ol>
<p>下面按实际迁移顺序展开。</p>
<hr>
<h2>一、为什么不继续部署 Solo/Bolo？</h2>
<p>Solo/Bolo 本身是一个完整博客系统，有后台、评论、皮肤、插件和动态渲染能力。问题是，对于一个长期沉淀型的个人技术博客来说，它的运行成本有点高：</p>
<ul>
<li>需要维护 Tomcat 或 Java Web 容器；</li>
<li>需要维护 MySQL；</li>
<li>需要关心后台安全、登录、评论提交和运行时依赖；</li>
<li>迁移部署时不仅要搬代码，还要搬数据库和运行环境；</li>
<li>长期只读内容越来越多，动态能力反而没那么重要。</li>
</ul>
<p>而静态站的优势很直接：</p>
<ul>
<li>构建一次，发布一批 HTML/CSS/JS 文件；</li>
<li>部署平台选择多；</li>
<li>没有后台攻击面；</li>
<li>内容可以版本化；</li>
<li>后续写文章只需要维护 Markdown 或迁移脚本。</li>
</ul>
<p>所以这次迁移的目标不是“重装 Solo”，而是把老博客内容迁到一个静态站里。</p>
<hr>
<h2>二、迁移前要准备什么？</h2>
<p>我手上有两类文件：</p>
<pre><code class="language-text">blog_change/
├─ bolo_260527.sql
├─ zeroStep.md
└─ ROOT/
</code></pre>
<p>它们分别承担不同角色。</p>
<h3>1. <code>bolo_260527.sql</code></h3>
<p>这是 Solo/Bolo 的 MySQL 数据库备份，是文章、评论、标签、配置、友情链接的主要来源。</p>
<p>核心表包括：</p>
<pre><code class="language-text">b3_solo_article          文章
b3_solo_comment          评论
b3_solo_tag              标签
b3_solo_tag_article      标签与文章关系
b3_solo_link             友情链接
b3_solo_page             自定义页面导航
b3_solo_option           站点配置
b3_solo_user             用户信息
</code></pre>
<p>实际导入后，我检查到的数据量是：</p>
<pre><code class="language-text">124 篇文章
103 篇已发布文章
12 条评论
157 个标签
2 个自定义页面
3 个友情链接
</code></pre>
<p>迁移时只导出 <code>articleStatus = 0</code> 的已发布文章。</p>
<h3>2. <code>ROOT/</code></h3>
<p>这是原 Tomcat 部署项目。它里面有后台、JAR、FreeMarker 模板、皮肤和静态资源。</p>
<p>这次并不迁移整个 Tomcat 项目，只取里面的皮肤和资源：</p>
<pre><code class="language-text">ROOT/skins/bolo-9IPHP/
├─ css/base.css
├─ css/fonts/
├─ header.ftl
├─ article.ftl
├─ article-list.ftl
├─ side.ftl
├─ archives.ftl
├─ tags.ftl
└─ footer.ftl
</code></pre>
<p>这些文件的价值是：它们能告诉我们原站的 HTML 结构和视觉风格。</p>
<p>比如原站首页是典型的：</p>
<ul>
<li>顶部深灰横幅；</li>
<li>博客名 + 副标题；</li>
<li>横向导航；</li>
<li>主内容文章列表；</li>
<li>右侧标签、统计、评论最多、访问最多模块；</li>
<li>文章卡片有标题、时间、标签和“阅读全文”。</li>
</ul>
<h3>3. <code>zeroStep.md</code></h3>
<p>这是新站搭建说明，目标技术栈是：</p>
<pre><code class="language-text">VuePress 2
vuepress-theme-hope
Markdown 内容
静态部署
</code></pre>
<p>也就是说，新站不是继续跑 Java Web，而是改成 VuePress 静态站。</p>
<hr>
<h2>三、初始化 VuePress 项目</h2>
<p>项目根目录新建 <code>package.json</code>：</p>
<pre><code class="language-json">{
  &quot;name&quot;: &quot;jackssybin-static-blog&quot;,
  &quot;version&quot;: &quot;0.1.0&quot;,
  &quot;private&quot;: true,
  &quot;type&quot;: &quot;module&quot;,
  &quot;engines&quot;: {
    &quot;node&quot;: &quot;&gt;=22 &lt;25&quot;
  },
  &quot;scripts&quot;: {
    &quot;migrate&quot;: &quot;node scripts/migrate-from-bolo.mjs&quot;,
    &quot;dev&quot;: &quot;vuepress dev docs --host 0.0.0.0&quot;,
    &quot;build&quot;: &quot;vuepress build docs&quot;,
    &quot;preview&quot;: &quot;vuepress dev docs --host 0.0.0.0&quot;
  },
  &quot;dependencies&quot;: {
    &quot;@vuepress/bundler-vite&quot;: &quot;2.0.0-rc.30&quot;,
    &quot;markdown-it&quot;: &quot;^14.1.0&quot;,
    &quot;mysql2&quot;: &quot;^3.15.3&quot;,
    &quot;vue&quot;: &quot;^3.5.24&quot;,
    &quot;vuepress&quot;: &quot;2.0.0-rc.30&quot;,
    &quot;vuepress-theme-hope&quot;: &quot;2.0.0-rc.107&quot;
  },
  &quot;devDependencies&quot;: {
    &quot;sass-embedded&quot;: &quot;^1.93.3&quot;
  },
  &quot;packageManager&quot;: &quot;pnpm@10.33.0&quot;
}
</code></pre>
<p>安装依赖：</p>
<pre><code class="language-powershell">pnpm install
</code></pre>
<p>VuePress 配置放在：</p>
<pre><code class="language-text">docs/.vuepress/config.ts
docs/.vuepress/theme.ts
docs/.vuepress/client.ts
docs/.vuepress/styles/index.scss
</code></pre>
<p>这里有一个关键选择：<strong>禁用 VuePress 默认文档站样式，把页面主体交给迁移后的 Solo 风格 HTML。</strong></p>
<p><code>theme.ts</code> 中关闭默认 navbar/sidebar/pageInfo：</p>
<pre><code class="language-ts">import { hopeTheme } from &quot;vuepress-theme-hope&quot;;

export default hopeTheme({
  hostname: &quot;https://jackssybin.cn/&quot;,
  logo: &quot;/images/logo.png&quot;,
  favicon: &quot;/images/favicon.png&quot;,
  navbar: false,
  sidebar: false,
  breadcrumb: false,
  pageInfo: false,
  contributors: false,
  editLink: false,
  lastUpdated: false,
  print: false,
  pure: true,
  displayFooter: false,
  plugins: {
    copyCode: true,
    slimsearch: false
  }
});
</code></pre>
<p>这样 VuePress 负责构建、路由和静态输出，页面视觉由我们自己控制。</p>
<hr>
<h2>四、导入原博客数据库</h2>
<p>我的本地 MySQL 连接是：</p>
<pre><code class="language-text">host: localhost
port: 3306
user: root
password: root-1234
database: bolo_migration
</code></pre>
<p>建议不要直接覆盖已有的 <code>bolo</code> 库，而是新建一个迁移专用库：</p>
<pre><code class="language-powershell">mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 -e &quot;DROP DATABASE IF EXISTS bolo_migration; CREATE DATABASE bolo_migration DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;&quot;
</code></pre>
<p>导入备份：</p>
<pre><code class="language-powershell">mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 bolo_migration -e &quot;source D:/code/ai_codex_project/blog_change/bolo_260527.sql&quot;
</code></pre>
<p>检查数据：</p>
<pre><code class="language-powershell">mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 -D bolo_migration -e &quot;SELECT COUNT(*) articles, SUM(articleStatus=0) published FROM b3_solo_article; SELECT COUNT(*) comments FROM b3_solo_comment;&quot;
</code></pre>
<p>输出应类似：</p>
<pre><code class="language-text">articles  published
124       103

comments
12
</code></pre>
<blockquote>
<p>一个小坑：我一开始尝试直接从 SQL dump 手写解析 INSERT 语句，但历史文章里有大量代码块、反斜杠、引号和 HTML，解析很容易误判字段边界。更稳的方式是先导入 MySQL，再用 SQL 查询导出结构化数据。</p>
</blockquote>
<hr>
<h2>五、迁移脚本怎么设计？</h2>
<p>核心脚本是：</p>
<pre><code class="language-text">scripts/migrate-from-bolo.mjs
</code></pre>
<p>它做几件事：</p>
<ol>
<li>连接 MySQL；</li>
<li>查询文章、评论、标签、页面、友链、站点配置；</li>
<li>用 <code>markdown-it</code> 把文章 Markdown 转成 HTML；</li>
<li>按原 Solo 模板结构生成首页、文章页、标签页、归档页、友链页；</li>
<li>保留原文章 permalink；</li>
<li>生成 RSS；</li>
<li>写出迁移摘要。</li>
</ol>
<p>数据库连接默认值：</p>
<pre><code class="language-js">const dbConfig = {
  host: process.env.BOLO_DB_HOST || &quot;127.0.0.1&quot;,
  port: Number(process.env.BOLO_DB_PORT || 3306),
  user: process.env.BOLO_DB_USER || &quot;root&quot;,
  password: process.env.BOLO_DB_PASSWORD || &quot;root-1234&quot;,
  database: process.env.BOLO_DB_NAME || &quot;bolo_migration&quot;,
  charset: &quot;utf8mb4&quot;
};
</code></pre>
<p>这样如果换环境，不需要改代码，直接用环境变量覆盖：</p>
<pre><code class="language-powershell">$env:BOLO_DB_NAME=&quot;your_database&quot;
pnpm migrate
</code></pre>
<hr>
<h2>六、为什么不用“纯 Markdown 页面”？</h2>
<p>这是迁移过程中最容易踩坑的地方。</p>
<p>理论上，可以把每篇文章转成 <code>.md</code>，交给 VuePress 渲染。但实际老博客内容里经常有：</p>
<ul>
<li>原始 HTML；</li>
<li><code>&lt;kbd&gt;</code>、<code>&lt;span style=&quot;&quot;&gt;</code> 等内联标签；</li>
<li>不规范的代码块；</li>
<li>旧编辑器产生的特殊字符；</li>
<li>评论中的图片和表情语法；</li>
<li>文章摘要中的 HTML 片段。</li>
</ul>
<p>VuePress 会把 Markdown 里的原始 HTML 当 Vue 模板编译。这样一来，只要历史文章里出现 Vue 不认可的 HTML，就会构建失败。</p>
<p>我遇到过类似错误：</p>
<pre><code class="language-text">Duplicate attribute.
SyntaxError: Duplicate attribute.
</code></pre>
<p>解决方案是：<strong>不要让历史 HTML 直接进入 Vue 模板编译链路。</strong></p>
<p>最终设计是：</p>
<ol>
<li>迁移脚本把每个页面完整 HTML 放到 <code>page-data.ts</code>；</li>
<li>Markdown 页面只挂一个组件；</li>
<li>组件通过 <code>v-html</code> 渲染迁移后的 HTML。</li>
</ol>
<p>组件大概是这样：</p>
<pre><code class="language-vue">&lt;script setup lang=&quot;ts&quot;&gt;
import { computed } from &quot;vue&quot;;
import { pages } from &quot;../page-data.js&quot;;

const props = defineProps&lt;{
  id: string;
}&gt;();

const html = computed(() =&gt; pages[props.id] || &quot;&quot;);
&lt;/script&gt;

&lt;template&gt;
  &lt;div class=&quot;solo-static&quot; v-html=&quot;html&quot; /&gt;
&lt;/template&gt;
</code></pre>
<p>生成出来的 Markdown 页面非常薄：</p>
<pre><code class="language-md">---
title: &quot;文章标题&quot;
permalink: &quot;/articles/2019/07/31/1564568923421.html&quot;
---

&lt;SoloPage id=&quot;p42&quot; /&gt;
</code></pre>
<p>这个方案的好处是：</p>
<ul>
<li>VuePress 仍然负责构建和路由；</li>
<li>老文章 HTML 不会被 Vue 模板编译器误伤；</li>
<li>原 Solo/Bolo 的页面结构更容易保留；</li>
<li>构建稳定性更好。</li>
</ul>
<hr>
<h2>七、保留原站样式</h2>
<p>原皮肤资源来自：</p>
<pre><code class="language-text">ROOT/skins/bolo-9IPHP/css/base.css
ROOT/skins/bolo-9IPHP/css/fonts/*
ROOT/images/*
</code></pre>
<p>迁移到：</p>
<pre><code class="language-text">docs/.vuepress/public/assets/solo-base.css
docs/.vuepress/public/assets/fonts/
docs/.vuepress/public/images/
</code></pre>
<p>在 VuePress 配置里引入：</p>
<pre><code class="language-ts">head: [
  [&quot;link&quot;, { rel: &quot;stylesheet&quot;, href: &quot;/assets/solo-base.css&quot; }],
  [&quot;link&quot;, { rel: &quot;stylesheet&quot;, href: &quot;/assets/site.css&quot; }]
]
</code></pre>
<p>不过只引入原 CSS 还不够，因为 VuePress Hope 主题有自己的容器、暗色模式和页面样式。需要额外写一层覆盖：</p>
<pre><code class="language-scss">html,
html[data-theme=&quot;dark&quot;],
body,
#app,
.theme-container {
  color: #333 !important;
  background: #fff !important;
  color-scheme: light !important;
}

.vp-page-title,
.vp-breadcrumb,
.vp-page-meta,
.vp-toc,
.vp-sidebar,
.vp-navbar,
.vp-footer-wrapper {
  display: none !important;
}
</code></pre>
<p>同时补充移动端样式：</p>
<pre><code class="language-scss">@media (max-width: 760px) {
  .solo-static .wrapper {
    min-width: 0;
    width: 94%;
  }

  .solo-static .main-wrap {
    display: block;
  }

  .solo-static aside {
    margin-top: 18px;
    min-width: 0;
    width: auto;
  }
}
</code></pre>
<p>迁移老站时，不要只在桌面端看首页。技术博客里代码块很多，移动端最容易出问题的是：</p>
<ul>
<li>代码块横向溢出；</li>
<li>导航挤在一起；</li>
<li>右侧栏没有下沉；</li>
<li>标题和 meta 信息换行不自然。</li>
</ul>
<hr>
<h2>八、生成哪些页面？</h2>
<p>最终生成的页面包括：</p>
<pre><code class="language-text">/                                  首页
/page/2.html                       首页分页
/articles/yyyy/mm/dd/id.html       文章页
/my-github-repos                   自定义页面
/tags.html                         标签墙
/tags/&lt;tag&gt;                        标签文章列表
/archives.html                     归档页
/archives/yyyy/mm                  月份归档
/links.html                        友情链接
/rss.xml                           RSS
</code></pre>
<p>首页分页大小来自 Solo 配置：</p>
<pre><code class="language-text">articleListDisplayCount = 20
</code></pre>
<p>文章页保留：</p>
<ul>
<li>标题；</li>
<li>创建时间；</li>
<li>更新时间；</li>
<li>正文；</li>
<li>标签；</li>
<li>上一篇/下一篇；</li>
<li>旧评论归档。</li>
</ul>
<p>评论迁移为只读归档展示，不提供新评论提交，也不继续展示评论数或浏览数。这一点很重要，因为静态站没有后端，不能直接复刻 Solo 的动态统计和评论能力。</p>
<hr>
<h2>九、执行迁移</h2>
<p>生成内容：</p>
<pre><code class="language-powershell">pnpm migrate
</code></pre>
<p>成功后会看到：</p>
<pre><code class="language-text">Generated 103 articles, 12 comments, 150 used tags, 3 links.
</code></pre>
<p>迁移摘要写入：</p>
<pre><code class="language-text">docs/.vuepress/public/migration-summary.json
</code></pre>
<p>内容类似：</p>
<pre><code class="language-json">{
  &quot;articles&quot;: 103,
  &quot;publishedArticles&quot;: 103,
  &quot;comments&quot;: 12,
  &quot;tags&quot;: 157,
  &quot;usedTags&quot;: 150,
  &quot;pages&quot;: 2,
  &quot;links&quot;: 3
}
</code></pre>
<hr>
<h2>十、本地预览和构建</h2>
<p>本地启动：</p>
<pre><code class="language-powershell">pnpm dev --port 8080
</code></pre>
<p>访问：</p>
<pre><code class="language-text">http://localhost:8080/
</code></pre>
<p>重点检查这些路径：</p>
<pre><code class="language-text">/
/articles/2025/07/16/1752652246705.html
/articles/2019/07/31/1564568923421.html
/my-github-repos
/tags.html
/archives.html
/links.html
/rss.xml
</code></pre>
<p>构建：</p>
<pre><code class="language-powershell">pnpm build
</code></pre>
<p>输出目录：</p>
<pre><code class="language-text">docs/.vuepress/dist
</code></pre>
<p>构建时可能会看到类似 warning：</p>
<pre><code class="language-text">INVALID_ANNOTATION
Some chunks are larger than 1024 kB
</code></pre>
<p>这类 warning 来自依赖打包过程，不影响最终构建成功。</p>
<hr>
<h2>十一、部署方式</h2>
<p>如果部署平台支持 Node 22 和 pnpm，配置很简单：</p>
<pre><code class="language-text">Build Command: pnpm build
Publish Directory: docs/.vuepress/dist
Node.js Version: 22
</code></pre>
<p>如果部署环境没有提前生成内容，可以改成：</p>
<pre><code class="language-text">pnpm install --frozen-lockfile &amp;&amp; pnpm migrate &amp;&amp; pnpm build
</code></pre>
<p>不过这里要注意：如果部署平台要执行 <code>pnpm migrate</code>，它必须能访问 MySQL。多数静态托管平台并不适合在构建时连你的本地数据库。</p>
<p>更稳的做法是：</p>
<ol>
<li>本地执行 <code>pnpm migrate</code>；</li>
<li>提交生成后的 <code>docs</code> 内容；</li>
<li>线上只执行 <code>pnpm build</code>。</li>
</ol>
<p>或者把 SQL 备份和导入过程也放进 CI，但这就属于另一个工程化问题了。</p>
<hr>
<h2>十二、这次迁移踩过的坑</h2>
<h3>1. 不要直接相信手写 SQL dump 解析</h3>
<p>MySQL dump 里文章正文可能有大量代码：</p>
<pre><code class="language-text">反斜杠
单引号
双引号
HTML 标签
多行字符串
特殊 Unicode 字符
</code></pre>
<p>手写解析很容易把正文里的逗号或括号误判成字段分隔符。</p>
<p>我的建议是：<strong>能导入 MySQL，就先导入 MySQL。</strong></p>
<h3>2. 注意数据库编码</h3>
<p>导入时加：</p>
<pre><code class="language-text">--default-character-set=utf8mb4
</code></pre>
<p>数据库也用：</p>
<pre><code class="language-sql">DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
</code></pre>
<p>否则中文、表情、特殊符号很容易出问题。</p>
<h3>3. VuePress 不适合直接编译所有历史 HTML</h3>
<p>老博客内容不是干净的 Vue 模板。把历史 HTML 放到 <code>v-html</code> 渲染，是这次迁移稳定构建的关键。</p>
<h3>4. 样式不要只搬 CSS</h3>
<p>原 CSS 是给 Solo 模板写的，VuePress 外面还有一层主题容器。要补覆盖样式，否则会出现：</p>
<ul>
<li>背景色不对；</li>
<li>默认标题露出来；</li>
<li>页面左右边距不对；</li>
<li>暗色模式影响原皮肤；</li>
<li>移动端布局不符合预期。</li>
</ul>
<h3>5. 旧链接优先级很高</h3>
<p>个人博客迁移最容易损失的是搜索引擎和外链。</p>
<p>所以文章页尽量保持原来的：</p>
<pre><code class="language-text">/articles/yyyy/mm/dd/id.html
</code></pre>
<p>像 <code>/my-github-repos</code> 这种自定义页面，也应该保留。</p>
<hr>
<h2>十三、最终项目结构</h2>
<p>迁移后的项目结构大致是：</p>
<pre><code class="language-text">.
├─ bolo_260527.sql
├─ ROOT/
├─ README.md
├─ package.json
├─ scripts/
│  └─ migrate-from-bolo.mjs
└─ docs/
   ├─ .vuepress/
   │  ├─ config.ts
   │  ├─ theme.ts
   │  ├─ client.ts
   │  ├─ components/
   │  │  └─ SoloPage.vue
   │  ├─ styles/
   │  │  └─ index.scss
   │  ├─ page-data.ts
   │  └─ public/
   ├─ index.md
   ├─ articles/
   ├─ tags/
   └─ archives/
</code></pre>
<p>日常维护主要用三个命令：</p>
<pre><code class="language-powershell">pnpm migrate
pnpm dev --port 8080
pnpm build
</code></pre>
<hr>
<h2>总结一下</h2>
<p>这次迁移的核心不是“换一个前端框架”，而是把一个动态博客系统拆成三部分：</p>
<ol>
<li><strong>内容层</strong>：从 MySQL 读取文章、评论、标签、友链；</li>
<li><strong>展示层</strong>：复刻 Solo/Bolo 的页面结构和皮肤样式；</li>
<li><strong>发布层</strong>：交给 VuePress 构建成静态站。</li>
</ol>
<p>我觉得老博客迁移最值得坚持的几个原则是：</p>
<ul>
<li>内容不要丢；</li>
<li>旧链接尽量不变；</li>
<li>不要把历史 HTML 强行洗成完美 Markdown；</li>
<li>不迁移不需要的动态能力；</li>
<li>构建流程要能重复执行。</li>
</ul>
<p>如果你的博客也是 Solo、Bolo、WordPress、Typecho 这类老系统，迁移到静态站时可以参考这个思路：先把数据库当作唯一真实来源，再把旧主题当作视觉参考，最后用静态站生成器承接发布。</p>
<p>这比“重写一个博客”更稳，也更适合保存多年积累下来的内容。</p>
<hr>
</div>
        <footer class="tags">
            <a class="topic-pill" href="/topics/tools-blog.html">工具、效率与博客建设</a>
            <a class="tag" rel="tag" href="/tags/VuePress.html">VuePress</a>
<a class="tag" rel="tag" href="/tags/Bolo.html">Bolo</a>
<a class="tag" rel="tag" href="/tags/Solo.html">Solo</a>
<a class="tag" rel="tag" href="/tags/E9_9D_99_E6_80_81_E7_BD_91_E7_AB_99.html">静态网站</a>
<a class="tag" rel="tag" href="/tags/E5_8D_9A_E5_AE_A2_E8_BF_81_E7_A7_BB.html">博客迁移</a>
            <div class="rel fn-clear ft__center">
      <a href="/articles/2025/07/16/1752652246705.html" rel="prev" class="fn-left vditor-tooltipped vditor-tooltipped__n" aria-label="LocalDateTime操作">上一篇</a>
      <a href="/articles/2026/06/03/odysseus-zhihu.html" rel="next" class="fn-right vditor-tooltipped vditor-tooltipped__n" aria-label="Odysseus：一个值得关注的本地 AI 工作台">下一篇</a>
  </div>
        </footer>
        <section class="related-posts">
    <h3>同专题推荐</h3>
    <ul>
      <li>
        <a href="/articles/2020/10/29/1603968711195.html">Drools语法</a>
        <em>2020-10-29</em>
      </li>
<li>
        <a href="/articles/2020/01/04/1578123919824.html">wireshark安装和基本语法</a>
        <em>2020-01-04</em>
      </li>
<li>
        <a href="/articles/2019/09/24/1569312462439.html">Rust学习之二猜字谜</a>
        <em>2019-09-24</em>
      </li>
<li>
        <a href="/articles/2019/09/21/1568996899251.html">Rust 学习一之环境安装</a>
        <em>2019-09-21</em>
      </li>
    </ul>
  </section>
        
    </article>
</main>
        <aside>
    <section>
        <div class="module">
            <header><h2>专题</h2></header>
            <main class="topic-list">
                <a href="/topics/java-jvm.html">Java 与 JVM</a>
<a href="/topics/spring-backend.html">Spring Boot 与后端框架</a>
<a href="/topics/ai-agent.html">AI、Agent 与本地模型</a>
<a href="/topics/mysql-data.html">MySQL 与数据架构</a>
<a href="/topics/linux-ops.html">Linux 运维与部署</a>
<a href="/topics/python-crawler.html">Python 爬虫与自动化</a>
<a href="/topics/middleware-distributed.html">中间件与分布式</a>
<a href="/topics/tools-blog.html">工具、效率与博客建设</a>
            </main>
        </div>
        <div class="module">
            <header><h2>标签</h2></header>
            <main>
                <a rel="tag" href="/tags/Python.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="24 篇文章">Python</a>
<a rel="tag" href="/tags/Java.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="18 篇文章">Java</a>
<a rel="tag" href="/tags/CentOS.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="10 篇文章">CentOS</a>
<a rel="tag" href="/tags/MySQL.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="10 篇文章">MySQL</a>
<a rel="tag" href="/tags/Python_20_E7_88_AC_E8_99_AB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="9 篇文章">Python 爬虫</a>
<a rel="tag" href="/tags/JVM.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="8 篇文章">JVM</a>
<a rel="tag" href="/tags/Linux.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="6 篇文章">Linux</a>
<a rel="tag" href="/tags/Scrapy.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="6 篇文章">Scrapy</a>
<a rel="tag" href="/tags/E5_9E_83_E5_9C_BE_E5_9B_9E_E6_94_B6_E7_AE_97_E6_B3_95.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">垃圾回收算法</a>
<a rel="tag" href="/tags/Spring_20Batch.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">Spring Batch</a>
<a rel="tag" href="/tags/Spring_20Boot.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">Spring Boot</a>
<a rel="tag" href="/tags/E5_A4_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">大表优化</a>
<a rel="tag" href="/tags/E8_B0_83_E4_BC_98.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">调优</a>
<a rel="tag" href="/tags/E9_AB_98_E5_B9_B6_E5_8F_91.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">高并发</a>
<a rel="tag" href="/tags/E5_86_B7_E7_83_AD_E5_88_86_E7_A6_BB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">冷热分离</a>
<a rel="tag" href="/tags/E5_8D_83_E4_B8_87_E7_BA_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">千万级表优化</a>
<a rel="tag" href="/tags/E7_BA_BF_E7_A8_8B.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">线程</a>
<a rel="tag" href="/tags/Nginx.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">Nginx</a>
<a rel="tag" href="/tags/E5_BE_85_E5_88_86_E7_B1_BB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="2 篇文章">待分类</a>
<a rel="tag" href="/tags/E5_BC_80_E6_BA_90.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="2 篇文章">开源</a>
            </main>
        </div>
        <div class="module tutorial-sidebar">
            <header><h2>教程中心</h2></header>
            <main>
                <a class="tutorial-sidebar-card" href="/mysql.html">
        <strong>MySQL</strong>
        <span>34 篇教程</span>
    </a>
<a class="tutorial-sidebar-card" href="/springboot4.html">
        <strong>Spring Boot 4</strong>
        <span>21 篇教程</span>
    </a>
<a class="tutorial-sidebar-card" href="/netty.html">
        <strong>Netty</strong>
        <span>16 篇教程</span>
    </a>
                <a class="tutorial-sidebar-more" href="/tutorials.html">查看全部教程 &raquo;</a>
            </main>
        </div>
        <div class="module meta">
            <header><h2 class="ft__center"><a href="https://github.com/jackssybin" target="_blank" rel="noopener">GitHub</a></h2></header>
            <main class="fn__clear">
                <img src="/images/sidebar-avatar.jpg" aria-label="88250">
                <div class="fn-right">
                    <a href="/archives.html">106 <span class="ft-gray">文章</span></a><br>
                    3 <span class="ft-gray">友链</span>
                </div>
            </main>
        </div>
    </section>
</aside>
    </div>
</div>
<footer class="footer fn-clear">
    &copy; 2026
    <a href="/">jackssybin 的个人博客</a>
    <br>
    Powered by <a href="https://github.com/adlered/bolo-solo" target="_blank" rel="noopener">Bolo</a>
    <span class="ft-warn">&heartsuit;</span>
    Theme bolo-9IPHP
    <sup>[<a href="https://github.com/9IPHP/9IPHP" target="_blank" rel="noopener">ref</a>]</sup>
    by <a href="http://vanessa.b3log.org" target="_blank" rel="noopener">Vanessa</a>
</footer>
