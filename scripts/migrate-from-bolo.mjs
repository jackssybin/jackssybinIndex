import fs from "node:fs/promises";
import path from "node:path";
import iconv from "iconv-lite";
import MarkdownIt from "markdown-it";
import mysql from "mysql2/promise";
import YAML from "yaml";

const root = process.cwd();
const docsDir = path.join(root, "docs");
const publicDir = path.join(docsDir, ".vuepress", "public");
const contentDir = path.join(root, "content");
const navSourceDir = path.join(root, "content", "navigation");
const navDataFile = path.join(navSourceDir, "webstack.yml");
const navLogoSourceDir = path.join(navSourceDir, "logos");
const navLogoPublicDir = path.join(publicDir, "nav-logos");

const dbConfig = {
  host: process.env.BOLO_DB_HOST || "127.0.0.1",
  port: Number(process.env.BOLO_DB_PORT || 3306),
  user: process.env.BOLO_DB_USER || "root",
  password: process.env.BOLO_DB_PASSWORD || "root-1234",
  database: process.env.BOLO_DB_NAME || "bolo_migration",
  charset: "utf8mb4"
};

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: false
});

const pageData = [];

const topicDefinitions = [
  {
    title: "Java 与 JVM",
    slug: "java-jvm",
    description: "Java 基础、集合、反射、并发、JVM、GC 与排障相关内容。",
    keywords: ["java", "jvm", "gc", "反射", "内省", "线程", "锁", "javap", "dump", "内存", "对象"]
  },
  {
    title: "Spring Boot 与后端框架",
    slug: "spring-backend",
    description: "Spring Boot、Spring Batch、MyBatis、Swagger、WebFlux、自动装配和扩展点实践。",
    keywords: ["spring", "springboot", "spring boot", "springbatch", "mybatis", "swagger", "knife4j", "webflux", "bean", "conditional"]
  },
  {
    title: "MySQL 与数据架构",
    slug: "mysql-data",
    description: "MySQL 索引、事务、锁、分库分表、冷热分离、数据一致性与大表优化。",
    keywords: ["mysql", "数据库", "索引", "事务", "锁", "分库", "分表", "大表", "limit", "order by", "缓存一致性"]
  },
  {
    title: "Linux 运维与部署",
    slug: "linux-ops",
    description: "Linux、CentOS、Ubuntu、Nginx、Redis、JDK、Maven、Git、服务器排障和部署记录。",
    keywords: ["linux", "centos", "ubuntu", "nginx", "redis", "ssh", "yum", "jdk", "maven", "git", "服务器", "病毒", "cpu", "内存"]
  },
  {
    title: "Python 爬虫与自动化",
    slug: "python-crawler",
    description: "Python 环境、requests、urllib、Scrapy、Selenium、ChromeDriver 和爬虫实战。",
    keywords: ["python", "爬虫", "scrapy", "requests", "urllib", "selenium", "chromedriver", "headless", "cookie"]
  },
  {
    title: "中间件与分布式",
    slug: "middleware-distributed",
    description: "Redis、Zookeeper、网关、HAProxy、SOFA、Prometheus、Grafana、分布式锁和服务治理。",
    keywords: ["redis", "zookeeper", "zk", "gateway", "网关", "haproxy", "prometheus", "grafana", "zabbix", "sofa", "分布式", "服务", "锁"]
  },
  {
    title: "工具、效率与博客建设",
    slug: "tools-blog",
    description: "开发工具、网络分析、Rust 学习、博客迁移、静态站建设和零散效率笔记。",
    keywords: ["vuepress", "bolo", "solo", "博客", "迁移", "rust", "wireshark", "drools", "工具", "github", "api", "区块链"]
  }
];

const tagAliases = new Map([
  ["springboot", "Spring Boot"],
  ["springboot2", "Spring Boot"],
  ["springBoot", "Spring Boot"],
  ["springBoot2", "Spring Boot"],
  ["springbatch", "Spring Batch"],
  ["springBatch", "Spring Batch"],
  ["mybatis-plus", "MyBatis Plus"],
  ["mybaits-plus", "MyBatis Plus"],
  ["mysql", "MySQL"],
  ["jvm", "JVM"],
  ["java", "Java"],
  ["python3", "Python"],
  ["python学习", "Python"],
  ["python实战", "Python 爬虫"],
  ["scrapy", "Scrapy"],
  ["requests", "Requests"],
  ["linux", "Linux"],
  ["centos", "CentOS"],
  ["centos7", "CentOS"],
  ["nginx", "Nginx"],
  ["redis", "Redis"],
  ["zookeeper", "Zookeeper"],
  ["zk", "Zookeeper"],
  ["swagger", "Swagger"],
  ["swagger2", "Swagger"],
  ["webflux", "WebFlux"],
  ["VuePress", "VuePress"],
  ["Bolo", "Bolo"],
  ["Solo", "Solo"]
]);

const coreArticleEnhancements = new Map(Object.entries({
  "/articles/2026/05/28/zhihu-bolo-to-vuepress-migration.html": {
    topicSlug: "tools-blog",
    order: 10,
    title: "老博客静态化迁移实战",
    summary: "这篇文章适合作为本站建设路线的入口，重点看如何把 Solo/Bolo 的数据库、皮肤、旧链接和静态站构建流程拆开处理。",
    takeaways: ["把数据库作为内容源，避免手写 SQL dump 解析。", "保留旧 permalink，降低迁移对搜索和外链的影响。", "用 VuePress 承接静态发布，用脚本保证迁移可重复执行。"]
  },
  "/articles/2021/06/08/1623116860957.html": {
    topicSlug: "mysql-data",
    order: 10,
    title: "MySQL RR 隔离级别锁测试",
    summary: "这篇文章是 MySQL 事务与锁专题的核心实验记录，适合用来理解 RR 隔离级别下非索引更新、删除操作为什么会扩大锁范围。",
    takeaways: ["先看测试表和事务步骤，再看 InnoDB 锁等待信息。", "重点关注非索引条件带来的锁范围变化。", "适合和索引优化、大表优化、分库分表文章一起阅读。"]
  },
  "/articles/2019/09/18/1568819118263.html": {
    topicSlug: "mysql-data",
    order: 20,
    title: "分库分表方案总览",
    summary: "这篇文章适合作为数据架构专题的路线文章，帮助判断什么时候需要拆库拆表、怎么选择拆分维度，以及拆分后要面对哪些工程问题。",
    takeaways: ["不要把分库分表当成第一选择，先完成索引和 SQL 优化。", "拆分规则要围绕业务查询路径设计。", "拆分后要同步考虑 ID、事务、分页、扩容和运维成本。"]
  },
  "/articles/2021/05/14/1620960509044.html": {
    topicSlug: "spring-backend",
    order: 10,
    title: "Spring Boot 启动扩展点",
    summary: "这篇文章是 Spring Boot 专题的核心长文，适合系统梳理 Bean 生命周期、容器刷新过程和自动装配前后的扩展点。",
    takeaways: ["先建立 Spring 容器刷新和 Bean 生命周期的整体顺序。", "把扩展点按执行阶段理解，而不是孤立记接口名。", "适合中间件、基础组件和框架封装场景反复查阅。"]
  },
  "/articles/2021/03/16/1615897840354.html": {
    topicSlug: "spring-backend",
    order: 20,
    title: "Spring Integration 中文手册",
    summary: "这篇文章适合作为 Spring 生态集成能力的参考资料，用来理解消息通道、端点、适配器和企业集成模式。",
    takeaways: ["先理解消息、通道和端点三类基础概念。", "再按实际集成场景选择适配器和网关。", "适合和 Spring Batch、监控、消息队列相关文章联读。"]
  },
  "/articles/2019/09/17/1568731586414.html": {
    topicSlug: "java-jvm",
    order: 10,
    title: "JVM 基础总览",
    summary: "这篇文章适合作为 Java 与 JVM 专题的第一站，用来建立运行时数据区、类加载、对象创建和 GC 的基础框架。",
    takeaways: ["先把 JVM 运行时内存结构梳理清楚。", "再理解对象生命周期和 GC 触发路径。", "后续可继续阅读垃圾回收器、GC 条件、Dump 分析等文章。"]
  },
  "/articles/2019/09/17/1568733889287.html": {
    topicSlug: "java-jvm",
    order: 20,
    title: "JVM 垃圾回收器",
    summary: "这篇文章承接 JVM 基础，重点放在不同垃圾回收器的设计思路、适用场景和调优取舍。",
    takeaways: ["先区分收集算法和具体收集器。", "关注吞吐、停顿时间和内存规模之间的权衡。", "适合和 CMS、G1、堆溢出、Dump 分析文章一起阅读。"]
  },
  "/articles/2020/04/20/1587389853090.html": {
    topicSlug: "linux-ops",
    order: 30,
    title: "Linux Dump 文件分析",
    summary: "这篇文章是线上排障类内容的核心入口，适合在 Java 进程内存异常、CPU 异常或服务不稳定时作为排查流程参考。",
    takeaways: ["先保留现场，再分析 Dump、线程和系统资源。", "排障时要把 JVM 工具和 Linux 命令结合使用。", "适合与 jstack、CPU/内存占用、GC 相关文章联读。"]
  },
  "/articles/2020/05/28/1590656168798.html": {
    topicSlug: "middleware-distributed",
    order: 10,
    title: "Redis 缓存穿透、击穿、雪崩",
    summary: "这篇文章适合作为缓存稳定性专题的入口，覆盖高并发系统里最常见的缓存失效风险和防护思路。",
    takeaways: ["区分穿透、击穿、雪崩三个问题的触发条件。", "用布隆过滤器、互斥锁、随机过期时间等方案分别处理。", "适合与缓存一致性、分布式锁文章一起阅读。"]
  },
  "/articles/2019/09/16/1568641811471.html": {
    topicSlug: "python-crawler",
    order: 10,
    title: "Scrapy 框架入门",
    summary: "这篇文章适合作为 Python 爬虫专题的路线入口，先建立 Scrapy 项目结构、Spider、Item 和 Pipeline 的基础认识。",
    takeaways: ["先跑通 Scrapy 项目，再逐步理解各个目录职责。", "解析、清洗、存储要分层处理。", "后续可以继续阅读 requests、Selenium 和爬虫实战文章。"]
  }
}));

const topicsBySlug = new Map(topicDefinitions.map((topic) => [topic.slug, topic]));

function maybeRepairMojibake(value = "") {
  const text = String(value);
  if (!/[ÃÂ�鎿嶄綔鐨勫崥瀹㈡枃绔犳暟鎹]/u.test(text)) return text;
  try {
    const repaired = iconv.decode(iconv.encode(text, "gbk"), "utf8");
    const badScore = (text.match(/[ÃÂ�鎿嶄綔鐨勫崥瀹㈡枃绔犳暟鎹]/gu) || []).length;
    const repairedBadScore = (repaired.match(/[ÃÂ�鎿嶄綔鐨勫崥瀹㈡枃绔犳暟鎹]/gu) || []).length;
    return repairedBadScore < badScore ? repaired : text;
  } catch {
    return text;
  }
}

function cleanText(value = "") {
  return maybeRepairMojibake(value)
    .replace(/\u00a0/gu, " ")
    .replace(/Â\s*/gu, " ")
    .replace(/[ \t]+\n/gu, "\n")
    .trim();
}

function cleanRecord(record) {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [
    key,
    typeof value === "string" ? cleanText(value) : value
  ]));
}

function canonicalTag(tag) {
  const clean = cleanText(tag).trim();
  if (!clean) return "";
  return tagAliases.get(clean) || tagAliases.get(clean.toLowerCase()) || clean;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("\n", " ");
}

function formatDate(ms) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(Number(ms))).replaceAll("/", "-");
}

function formatDateTime(ms) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(Number(ms))).replaceAll("/", "-");
}

function frontmatter(title, permalink, seo = {}) {
  const description = seo.description ? `description: ${JSON.stringify(seo.description)}\n` : "";
  const keywords = Array.isArray(seo.keywords) && seo.keywords.length > 0
    ? `head:\n  - - meta\n    - name: keywords\n      content: ${JSON.stringify(seo.keywords.join(","))}\n  - - meta\n    - property: og:description\n      content: ${JSON.stringify(seo.description || "")}\n  - - meta\n    - property: og:url\n      content: ${JSON.stringify(`https://jackssybin.cn${permalink}`)}\n`
    : "";
  return `---\ntitle: ${JSON.stringify(title)}\npermalink: ${JSON.stringify(permalink)}\n${description}${keywords}pageClass: solo-page\nsidebar: false\nbreadcrumb: false\npageInfo: false\ncontributors: false\nlastUpdated: false\ncomment: false\n---\n\n`;
}

function pageDocument(title, permalink, pageId, seo = {}) {
  return `${frontmatter(title, permalink, seo)}<SoloPage id="${pageId}" />\n`;
}

function markdownToHtml(source = "") {
  return md.render(String(source));
}

function stripMarkdown(source = "") {
  return String(source)
    .replace(/^---[\s\S]*?---\s*/u, "")
    .replace(/```[\s\S]*?```/gu, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, "$1")
    .replace(/[#>*_`~-]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function excerptText(value = "", length = 160) {
  const text = stripMarkdown(value)
    .replace(/\s+/gu, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

function parseFrontmatter(source = "") {
  const match = String(source).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
  if (!match) return { data: {}, body: String(source) };

  const data = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/u);
    if (!pair) continue;
    const [, key, rawValue] = pair;
    let value = rawValue.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1).split(",").map((item) => item.trim().replace(/^['"]|['"]$/gu, "")).filter(Boolean);
    }
    data[key] = value;
  }

  return { data, body: String(source).slice(match[0].length) };
}

function normalizeTags(value) {
  if (Array.isArray(value)) return [...new Set(value.map(canonicalTag).filter(Boolean))];
  return splitTags(value || "");
}

function splitTags(tags = "") {
  return [...new Set(String(tags).split(",").map(canonicalTag).filter(Boolean))];
}

function tagSlug(tag) {
  return encodeURIComponent(tag).replaceAll("%", "_").replace(/^_+/, "");
}

function tagHref(tag) {
  return `/tags/${tagSlug(tag)}.html`;
}

function slugifyNav(value = "") {
  const ascii = String(value)
    .toLowerCase()
    .replace(/['"]/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  return ascii || tagSlug(value);
}

function logoPath(logo = "") {
  if (!logo) return "/images/favicon.png";
  if (/^https?:\/\//u.test(logo)) return logo;
  return `/nav-logos/${encodeURIComponent(logo)}`;
}

function localPathForPermalink(permalink) {
  let clean = permalink.replace(/^\/+/, "");
  if (!clean) clean = "index";
  if (clean.endsWith(".html")) clean = clean.slice(0, -5);
  return path.join(docsDir, `${clean}.md`);
}

function permalinkForManualArticle(relativePath) {
  const clean = relativePath.replace(/\\/gu, "/").replace(/\.md$/u, ".html");
  return `/${clean}`;
}

function dateFromPermalink(permalink, fallbackMs) {
  const match = permalink.match(/\/articles\/(\d{4})\/(\d{2})\/(\d{2})\//u);
  if (!match) return fallbackMs;
  const [, year, month, day] = match;
  return new Date(`${year}-${month}-${day}T00:00:00+08:00`).getTime();
}

async function listMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function readManualArticles() {
  const sourceDirs = [
    path.join(contentDir, "articles"),
    path.join(docsDir, "articles")
  ];
  const manualArticles = [];
  const seenPermalinks = new Set();

  for (const articlesDir of sourceDirs) {
    const files = await listMarkdownFiles(articlesDir);
    for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    const { data, body } = parseFrontmatter(source);
    if (/^<SoloPage\s+id="[^"]+"\s*\/>\s*$/u.test(body.trim())) continue;
    const relativePath = path.join("articles", path.relative(articlesDir, file)).replace(/\\/gu, "/");
    const permalink = data.permalink || permalinkForManualArticle(relativePath);
    if (seenPermalinks.has(permalink)) continue;
    seenPermalinks.add(permalink);
    const title = cleanText(data.title || path.basename(file, ".md")).replace(/ - jackssybin 的个人博客$/u, "");
    const stats = await fs.stat(file);
    const created = dateFromPermalink(permalink, stats.birthtimeMs || stats.mtimeMs);
    const tags = normalizeTags(data.tags || data.tag || "");
    const bodyWithoutTitle = body.replace(new RegExp(`^\\s*#\\s+${title.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\s*`, "u"), "");
    const abstractText = excerptText(bodyWithoutTitle, 220);

    manualArticles.push({
      oId: `manual:${relativePath.replace(/\\/gu, "/")}`,
      articleTitle: title,
      articlePermalink: permalink,
      articleCreated: created,
      articleUpdated: stats.mtimeMs,
      articleAbstract: "",
      articleAbstractText: abstractText,
      articleSeoDescription: data.description || excerptText(bodyWithoutTitle, 160),
      articleSearchText: stripMarkdown(bodyWithoutTitle).slice(0, 4000),
      articleContent: bodyWithoutTitle,
      articleTags: tags.join(","),
      articleCommentCount: 0,
      articleViewCount: 0,
      articlePutTop: 0,
      hasUpdated: false,
      isManual: true
    });
    }
  }

  return manualArticles;
}

async function writePage(permalink, title, html, seo = {}) {
  const pageId = `p${pageData.length}`;
  pageData.push({ id: pageId, html });
  const file = localPathForPermalink(permalink);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, pageDocument(title, permalink, pageId, seo), "utf8");
}

async function resetGeneratedDocs() {
  const entries = await fs.readdir(docsDir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (entry.name === ".vuepress") continue;
    await fs.rm(path.join(docsDir, entry.name), { recursive: true, force: true });
  }
}

function makeHeader({ blogTitle, blogSubtitle, pages }) {
  const navPages = pages
    .map((page) => {
      const icon = page.pageIcon ? `<img class="page-icon" src="${escapeAttr(page.pageIcon)}" alt="">` : "";
      return `<a href="${escapeAttr(page.pagePermalink)}" target="${escapeAttr(page.pageOpenTarget || "_self")}" rel="section">${icon}${escapeHtml(page.pageTitle)}</a>`;
    })
    .join("\n");

  return `<header>
    <div class="banner">
        <div class="fn-clear wrapper">
            <h1 class="fn-inline"><a href="/" rel="start">${escapeHtml(blogTitle)}</a></h1>
            <small> &nbsp; ${escapeHtml(blogSubtitle)}</small>
        </div>
    </div>
    <div class="navbar">
        <div class="fn-clear wrapper">
            <nav class="fn-left">
                <a href="/"><i class="icon-home"></i> 首页</a>
                ${navPages}
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
</header>`;
}

function makeFooter({ blogTitle }) {
  const year = new Date().getFullYear();
  return `<footer class="footer fn-clear">
    &copy; ${year}
    <a href="/">${escapeHtml(blogTitle)}</a>
    <br>
    Powered by <a href="https://github.com/adlered/bolo-solo" target="_blank" rel="noopener">Bolo</a>
    <span class="ft-warn">&heartsuit;</span>
    Theme bolo-9IPHP
    <sup>[<a href="https://github.com/9IPHP/9IPHP" target="_blank" rel="noopener">ref</a>]</sup>
    by <a href="http://vanessa.b3log.org" target="_blank" rel="noopener">Vanessa</a>
</footer>`;
}

function makeTagLinks(tags) {
  return tags.map((tag) => `<a class="tag" rel="tag" href="${tagHref(tag)}">${escapeHtml(tag)}</a>`).join("\n");
}

function makeArticleCard(article) {
  const abstract = article.articleAbstract ? markdownToHtml(article.articleAbstract) : markdownToHtml(article.articleAbstractText || "");
  const tags = splitTags(article.articleTags);
  const topic = article.topic ? `<a class="topic-pill" href="/topics/${article.topic.slug}.html">${escapeHtml(article.topic.title)}</a>` : "";
  const core = article.coreEnhancement ? `<span class="core-badge">核心</span>` : "";
  return `<article class="post post--summary">
    <header>
        <h2>
            ${core}
            <a rel="bookmark" href="${escapeAttr(article.articlePermalink)}">${escapeHtml(article.articleTitle)}</a>
            ${article.hasUpdated ? `<sup><a href="${escapeAttr(article.articlePermalink)}">有更新！</a></sup>` : ""}
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="${article.hasUpdated ? "更新日期" : "创建日期"}">
                <i class="icon-date"></i> <time>${formatDate(article.articleCreated)}</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt">${abstract}</div>
    <footer class="post__actions tags">
        ${topic}
        ${makeTagLinks(tags)}
        <a href="${escapeAttr(article.articlePermalink)}#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>`;
}

function makeSidebar({ tags, articles, comments, options, user, links }) {
  const usedTags = tags
    .filter((tag) => tag.count > 0)
    .sort((a, b) => b.count - a.count || a.tagTitle.localeCompare(b.tagTitle, "zh-CN"))
    .slice(0, Number(options.mostUsedTagDisplayCount || 20));

  return `<aside>
    <section>
        <div class="module">
            <header><h2>专题</h2></header>
            <main class="topic-list">
                ${topicDefinitions.map((topic) => `<a href="/topics/${topic.slug}.html">${escapeHtml(topic.title)}</a>`).join("\n")}
            </main>
        </div>
        <div class="module">
            <header><h2>标签</h2></header>
            <main>
                ${usedTags.map((tag) => `<a rel="tag" href="${tagHref(tag.tagTitle)}" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="${tag.count} 篇文章">${escapeHtml(tag.tagTitle)}</a>`).join("\n")}
            </main>
        </div>
        <div class="module meta">
            <header><h2 class="ft__center"><a href="https://github.com/jackssybin" target="_blank" rel="noopener">GitHub</a></h2></header>
            <main class="fn__clear">
                <img src="${escapeAttr(user?.userAvatar || "/images/default-user-thumbnail.png")}" aria-label="${escapeAttr(user?.userName || "jackssybin")}">
                <div class="fn-right">
                    <a href="/archives.html">${articles.length} <span class="ft-gray">文章</span></a><br>
                    ${links.length} <span class="ft-gray">友链</span>
                </div>
            </main>
        </div>
    </section>
</aside>`;
}

function makeShell(inner, site) {
  return `${makeHeader(site)}
<div class="wrapper">
    <div class="main-wrap">
        ${inner}
        ${makeSidebar(site)}
    </div>
</div>
${makeFooter(site)}`;
}

function makeComments(articleComments) {
  if (articleComments.length === 0) return "";
  return `<section id="comments" class="comments">
    <h3>旧评论归档</h3>
    ${articleComments.map((comment) => `<article class="comment" id="${escapeAttr(comment.oId)}">
        <img src="${escapeAttr(comment.commentThumbnailURL || "/images/default-user-thumbnail.png")}" alt="${escapeAttr(comment.commentName)}">
        <main>
            <div class="meta">
                <a href="${escapeAttr(comment.commentURL || "#")}" target="_blank" rel="nofollow noopener">${escapeHtml(comment.commentName)}</a>
                &nbsp; ${formatDateTime(comment.commentCreated)}
                ${comment.commentOriginalCommentName ? `<span class="reply">回复 ${escapeHtml(comment.commentOriginalCommentName)}</span>` : ""}
            </div>
            <div class="vditor-reset">${markdownToHtml(comment.commentContent)}</div>
        </main>
    </article>`).join("\n")}
</section>`;
}

function makeCoreIntro(article) {
  if (!article.coreEnhancement) return "";
  const item = article.coreEnhancement;
  return `<section class="core-intro">
    <h3>重写导读：${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.summary)}</p>
    <ul>
      ${item.takeaways.map((takeaway) => `<li>${escapeHtml(takeaway)}</li>`).join("\n")}
    </ul>
  </section>`;
}

function makeRelatedArticles(article, site) {
  const related = site.articles
    .filter((item) => item.articlePermalink !== article.articlePermalink && item.topic.slug === article.topic.slug)
    .sort(compareArticlesForTopic)
    .slice(0, 5);
  if (related.length === 0) return "";
  return `<section class="related-posts">
    <h3>同专题推荐</h3>
    <ul>
      ${related.map((item) => `<li>
        <a href="${escapeAttr(item.articlePermalink)}">${item.coreEnhancement ? `<span>核心</span>` : ""}${escapeHtml(item.articleTitle)}</a>
        <em>${formatDate(item.articleCreated)}</em>
      </li>`).join("\n")}
    </ul>
  </section>`;
}

function makeArticlePage(article, site, prev, next, commentsByArticle) {
  const tags = splitTags(article.articleTags);
  const articleComments = commentsByArticle.get(article.oId) || [];
  const guide = `<section class="article-guide">
      <div><strong>专题</strong><a href="/topics/${article.topic.slug}.html">${escapeHtml(article.topic.title)}</a></div>
      <div><strong>导读</strong><span>${escapeHtml(article.articleGuide || article.articleSeoDescription || "这是一篇历史技术笔记，已按静态站格式重新整理。")}</span></div>
  </section>`;
  const rel = `<div class="rel fn-clear ft__center">
      ${prev ? `<a href="${escapeAttr(prev.articlePermalink)}" rel="prev" class="fn-left vditor-tooltipped vditor-tooltipped__n" aria-label="${escapeAttr(prev.articleTitle)}">上一篇</a>` : ""}
      ${next ? `<a href="${escapeAttr(next.articlePermalink)}" rel="next" class="fn-right vditor-tooltipped vditor-tooltipped__n" aria-label="${escapeAttr(next.articleTitle)}">下一篇</a>` : ""}
  </div>`;

  const inner = `<main>
    <article class="post post--detail">
        <header>
            <h2><a rel="bookmark" href="${escapeAttr(article.articlePermalink)}">${escapeHtml(article.articleTitle)}</a></h2>
            <div class="meta">
                <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="${article.hasUpdated ? "更新日期" : "创建日期"}">
                    <i class="icon-date"></i>
                    <time>${formatDate(article.articleCreated)}/${formatDate(article.articleUpdated)}</time>
                </span>
            </div>
        </header>
        ${guide}
        ${makeCoreIntro(article)}
        <div id="more" class="vditor-reset post__content">${markdownToHtml(article.articleContent)}</div>
        <footer class="tags">
            <a class="topic-pill" href="/topics/${article.topic.slug}.html">${escapeHtml(article.topic.title)}</a>
            ${makeTagLinks(tags)}
            ${rel}
        </footer>
        ${makeRelatedArticles(article, site)}
        ${makeComments(articleComments)}
    </article>
</main>`;
  return makeShell(inner, site);
}

function makePagination(currentPage, pageCount, basePath = "/") {
  if (pageCount <= 1) return "";
  const linkFor = (page) => page === 1 ? "/" : `/page/${page}.html`;
  const items = [];
  if (currentPage > 1) items.push(`<a href="${linkFor(currentPage - 1)}" class="page-number">&laquo;</a>`);
  for (let page = 1; page <= pageCount; page += 1) {
    items.push(page === currentPage
      ? `<span class="page-number current">${page}</span>`
      : `<a class="page-number" href="${linkFor(page)}">${page}</a>`);
  }
  if (currentPage < pageCount) items.push(`<a href="${linkFor(currentPage + 1)}" class="page-number">&raquo;</a>`);
  return `<div class="fn-clear"><nav class="pagination fn-right">${items.join("\n")}</nav></div>`;
}

function makeHomePage(pageArticles, site, currentPage, pageCount) {
  const inner = `<main>
    <div>
        ${pageArticles.map(makeArticleCard).join("\n")}
        ${makePagination(currentPage, pageCount)}
    </div>
</main>`;
  return makeShell(inner, site);
}

function makeOtherPage(title, iconClass, body, site) {
  const inner = `<main class="other">
    <div class="title"><h2><i class="${iconClass}"></i>&nbsp;${escapeHtml(title)}</h2></div>
    ${body}
</main>`;
  return makeShell(inner, site);
}

function resolveTopic(article) {
  const haystack = cleanText(`${article.articleTitle} ${article.articleTags} ${article.articleAbstractText || ""} ${article.articleSeoDescription || ""}`).toLowerCase();
  let best = topicDefinitions[topicDefinitions.length - 1];
  let bestScore = -1;
  for (const topic of topicDefinitions) {
    const score = topic.keywords.reduce((total, keyword) => haystack.includes(keyword.toLowerCase()) ? total + 1 : total, 0);
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

function compareArticlesForTopic(a, b) {
  const aOrder = a.coreEnhancement?.order ?? 999;
  const bOrder = b.coreEnhancement?.order ?? 999;
  return aOrder - bOrder || Number(b.articleCreated) - Number(a.articleCreated);
}

function buildArticleGuide(article) {
  if (article.coreEnhancement) {
    return `核心文章：${article.coreEnhancement.summary}`;
  }
  const description = article.articleSeoDescription || article.articleAbstractText || "";
  const topic = article.topic?.title || "技术笔记";
  if (description) return `本文归入「${topic}」专题，主要记录：${description}`;
  return `本文归入「${topic}」专题，是一篇从旧博客迁移保留下来的历史技术笔记。`;
}

function makeTopicOverviewPage(topics, site) {
  const body = `<div class="topic-grid">
      ${topics.map((topic) => `<section class="topic-card">
        <h3><a href="/topics/${topic.slug}.html">${escapeHtml(topic.title)}</a></h3>
        <p>${escapeHtml(topic.description)}</p>
        <ol class="topic-roadmap">
          ${topic.articles.slice(0, 4).map((article) => `<li><a href="${escapeAttr(article.articlePermalink)}">${escapeHtml(article.articleTitle)}</a></li>`).join("\n")}
        </ol>
        <span>${topic.articles.length} 篇文章</span>
      </section>`).join("\n")}
  </div>`;
  return makeOtherPage("专题系列", "icon-list", body, site);
}

function makeTopicRoadmap(topic) {
  const coreArticles = topic.articles.filter((article) => article.coreEnhancement);
  const starter = coreArticles.length > 0 ? coreArticles : topic.articles.slice(0, 5);
  return `<section class="topic-roadmap-panel">
    <h3>推荐阅读顺序</h3>
    <ol>
      ${starter.map((article) => `<li>
        <a href="${escapeAttr(article.articlePermalink)}">${article.coreEnhancement ? `<span>核心</span>` : ""}${escapeHtml(article.articleTitle)}</a>
        <p>${escapeHtml(article.articleGuide || article.articleSeoDescription || "")}</p>
      </li>`).join("\n")}
    </ol>
  </section>`;
}

async function readNavData() {
  const source = await fs.readFile(navDataFile, "utf8").catch(() => "");
  if (!source.trim()) return [];
  const parsed = YAML.parse(source) || [];
  return parsed.filter((section) => section && section.taxonomy);
}

function flattenNavLinks(navSections) {
  const links = [];
  for (const section of navSections) {
    const groups = section.list?.length
      ? section.list
      : [{ term: section.taxonomy, links: section.links || [] }];
    for (const group of groups) {
      for (const link of group.links || []) {
        if (!link?.title || !link?.url) continue;
        links.push({
          ...link,
          taxonomy: section.taxonomy,
          term: group.term || section.taxonomy
        });
      }
    }
  }
  return links;
}

function makeNavCards(links) {
  return links.map((link) => `<a class="nav-card" href="${escapeAttr(link.url)}" target="_blank" rel="noopener nofollow">
    <img src="${escapeAttr(logoPath(link.logo))}" alt="${escapeAttr(link.title)}" loading="lazy">
    <span>
      <strong>${escapeHtml(link.title)}</strong>
      <em>${escapeHtml(link.description || link.url)}</em>
    </span>
  </a>`).join("\n");
}

function makeNavPage(navSections, site) {
  const nav = `<section class="nav-hero">
    <h2>网址导航</h2>
    <p>收集常用工具、AI 服务、开发资源、学习资料和娱乐入口。导航数据来自原 jackssybin.github.io 静态站，现已集成到主站统一维护。</p>
    <form class="form nav-search" action="/search.html" method="get">
      <input type="search" name="keyword" placeholder="搜索工具、网站或说明">
      <button type="submit">搜索</button>
    </form>
  </section>
  <section class="nav-taxonomies">
    ${navSections.map((section) => `<a href="/nav/${slugifyNav(section.taxonomy)}.html">${escapeHtml(section.taxonomy)}</a>`).join("\n")}
  </section>
  <section class="nav-sections">
    ${navSections.map((section) => {
      const links = flattenNavLinks([section]).slice(0, 18);
      return `<div class="nav-section">
        <h3><a href="/nav/${slugifyNav(section.taxonomy)}.html">${escapeHtml(section.taxonomy)}</a></h3>
        <div class="nav-grid">${makeNavCards(links)}</div>
      </div>`;
    }).join("\n")}
  </section>`;
  return makeOtherPage("网址导航", "icon-link", nav, site);
}

function makeNavCategoryPage(section, site) {
  const groups = section.list?.length
    ? section.list
    : [{ term: section.taxonomy, links: section.links || [] }];
  const body = `<section class="nav-category">
    <p>${escapeHtml(section.taxonomy)} 分类下共 ${flattenNavLinks([section]).length} 个站点。</p>
    ${groups.map((group) => `<div class="nav-section">
      <h3>${escapeHtml(group.term || section.taxonomy)}</h3>
      <div class="nav-grid">${makeNavCards(group.links || [])}</div>
    </div>`).join("\n")}
  </section>`;
  return makeOtherPage(section.taxonomy, "icon-link", body, site);
}

function makeAboutPage(site, topics) {
  const yearGroups = buildArchives(site.articles).reduce((acc, archive) => {
    acc.set(archive.year, (acc.get(archive.year) || 0) + archive.articles.length);
    return acc;
  }, new Map());
  const routeMap = topics.map((topic) => `<li><a href="/topics/${topic.slug}.html">${escapeHtml(topic.title)}</a> <span class="ft-gray">${topic.articles.length} 篇</span></li>`).join("\n");
  const years = [...yearGroups.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([year, count]) => `<li>${year} 年：${count} 篇</li>`).join("\n");
  const body = `<section class="about-page">
    <p>这里是 jackssybin 的个人技术博客，目前以静态站方式发布，主要沉淀 Java 后端、Spring Boot、MySQL、Linux 运维、Python 爬虫、中间件和个人博客迁移相关内容。</p>
    <h3>技术栈</h3>
    <ul class="list">
      <li>内容管理：Markdown、历史 Solo/Bolo 数据迁移脚本</li>
      <li>静态站生成：VuePress 2、vuepress-theme-hope</li>
      <li>样式来源：保留 bolo-9IPHP 视觉风格，并补充黑夜/白天模式</li>
      <li>发布方式：GitHub 仓库版本管理，GitHub Actions 构建并部署到自有服务器 Nginx</li>
    </ul>
    <h3>文章路线图</h3>
    <ul class="list">${routeMap}</ul>
    <h3>内容年份</h3>
    <ul class="list">${years}</ul>
    <p class="ft-gray">旧文章会持续整理摘要、标签和格式；新增文章建议先归入专题，再补充清晰的导读与标签。</p>
  </section>`;
  return makeOtherPage("关于本站 / 技术栈 / 文章路线图", "icon-user", body, site);
}

function buildArchives(articles) {
  const months = new Map();
  for (const article of articles) {
    const date = formatDate(article.articleCreated);
    const [year, month] = date.split("-");
    const key = `${year}-${month}`;
    if (!months.has(key)) months.set(key, { year, month, articles: [] });
    months.get(key).articles.push(article);
  }
  return [...months.values()].sort((a, b) => `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`));
}

function makeRss(articles, options) {
  const blogTitle = options.blogTitle || "jackssybin 的个人博客";
  const blogSubtitle = options.blogSubtitle || "记录精彩的程序人生";
  const items = articles.slice(0, Number(options.feedOutputCnt || 10)).map((article) => `<item>
    <title>${escapeHtml(article.articleTitle)}</title>
    <link>https://jackssybin.cn${escapeHtml(article.articlePermalink)}</link>
    <guid>https://jackssybin.cn${escapeHtml(article.articlePermalink)}</guid>
    <pubDate>${new Date(Number(article.articleCreated)).toUTCString()}</pubDate>
    <description><![CDATA[${article.articleSeoDescription || article.articleAbstract || article.articleAbstractText || ""}]]></description>
  </item>`).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeHtml(blogTitle)}</title>
  <link>https://jackssybin.cn/</link>
  <description>${escapeHtml(blogSubtitle)}</description>
  ${items}
</channel>
</rss>
`;
}

async function main() {
  const connection = await mysql.createConnection(dbConfig);
  const [rawArticleRows] = await connection.query("SELECT * FROM b3_solo_article WHERE articleStatus = 0 ORDER BY articlePutTop DESC, articleCreated DESC");
  const [rawPageRows] = await connection.query("SELECT * FROM b3_solo_page ORDER BY pageOrder ASC");
  const [rawCommentRows] = await connection.query("SELECT * FROM b3_solo_comment ORDER BY commentCreated ASC");
  const [rawTagRows] = await connection.query("SELECT * FROM b3_solo_tag ORDER BY tagTitle ASC");
  const [rawLinkRows] = await connection.query("SELECT * FROM b3_solo_link ORDER BY linkOrder ASC");
  const [rawOptionRows] = await connection.query("SELECT * FROM b3_solo_option");
  const [rawUserRows] = await connection.query("SELECT * FROM b3_solo_user ORDER BY oId ASC LIMIT 1");
  await connection.end();

  const articleRows = rawArticleRows.map(cleanRecord);
  const pageRows = rawPageRows.map(cleanRecord);
  const commentRows = rawCommentRows.map(cleanRecord);
  const tagRows = rawTagRows.map((row) => ({ ...cleanRecord(row), tagTitle: canonicalTag(row.tagTitle) }));
  const linkRows = rawLinkRows.map(cleanRecord);
  const optionRows = rawOptionRows.map(cleanRecord);
  const userRows = rawUserRows.map(cleanRecord);

  const options = Object.fromEntries(optionRows.map((row) => [row.oId, row.optionValue]));
  const commentsByArticle = new Map();
  for (const comment of commentRows) {
    if (!commentsByArticle.has(comment.commentOnId)) commentsByArticle.set(comment.commentOnId, []);
    commentsByArticle.get(comment.commentOnId).push(comment);
  }

  const migratedArticles = articleRows.map((article) => ({
    ...article,
    articleTitle: cleanText(article.articleTitle),
    articleAbstract: cleanText(article.articleAbstract || ""),
    articleAbstractText: cleanText(article.articleAbstractText || ""),
    articleContent: cleanText(article.articleContent || ""),
    articleTags: splitTags(article.articleTags).join(","),
    articleCommentCount: (commentsByArticle.get(article.oId) || []).length,
    articleSeoDescription: excerptText(cleanText(article.articleAbstractText || article.articleAbstract || article.articleContent), 160),
    articleSearchText: stripMarkdown(`${cleanText(article.articleAbstractText || "")} ${cleanText(article.articleAbstract || "")} ${cleanText(article.articleContent || "")}`).slice(0, 4000),
    hasUpdated: Number(article.articleUpdated) !== Number(article.articleCreated)
  }));
  const manualArticles = await readManualArticles();
  const articles = [...migratedArticles, ...manualArticles]
    .sort((a, b) => Number(b.articlePutTop || 0) - Number(a.articlePutTop || 0) || Number(b.articleCreated) - Number(a.articleCreated));

  for (const article of articles) {
    article.coreEnhancement = coreArticleEnhancements.get(article.articlePermalink);
    article.topic = article.coreEnhancement?.topicSlug
      ? topicsBySlug.get(article.coreEnhancement.topicSlug) || resolveTopic(article)
      : resolveTopic(article);
    article.articleGuide = buildArticleGuide(article);
  }

  const tagCounts = new Map();
  for (const article of articles) {
    for (const tag of splitTags(article.articleTags)) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }
  const tagRowsByTitle = new Map();
  for (const tag of tagRows) {
    if (!tagRowsByTitle.has(tag.tagTitle)) tagRowsByTitle.set(tag.tagTitle, tag);
  }
  const knownTagTitles = new Set(tagRowsByTitle.keys());
  const tags = [
    ...[...tagRowsByTitle.values()].map((tag) => ({ ...tag, count: tagCounts.get(tag.tagTitle) || 0 })),
    ...[...tagCounts.keys()]
      .filter((tagTitle) => !knownTagTitles.has(tagTitle))
      .map((tagTitle) => ({ oId: `manual:${tagTitle}`, tagTitle, count: tagCounts.get(tagTitle) || 0 }))
  ];

  const topics = topicDefinitions.map((topic) => ({
    ...topic,
    articles: articles.filter((article) => article.topic.slug === topic.slug).sort(compareArticlesForTopic)
  })).filter((topic) => topic.articles.length > 0);

  const site = {
    blogTitle: options.blogTitle || "jackssybin 的个人博客",
    blogSubtitle: options.blogSubtitle || "记录精彩的程序人生",
    pages: pageRows,
    topics,
    tags,
    articles,
    comments: commentRows,
    links: linkRows,
    options,
    user: userRows[0]
  };
  const navSections = await readNavData();
  const navLinks = flattenNavLinks(navSections);

  await resetGeneratedDocs();
  await fs.rm(navLogoPublicDir, { recursive: true, force: true });
  await fs.cp(navLogoSourceDir, navLogoPublicDir, { recursive: true }).catch(() => {});

  const perPage = Number(options.articleListDisplayCount || 20);
  const pageCount = Math.max(1, Math.ceil(articles.length / perPage));
  for (let page = 1; page <= pageCount; page += 1) {
    const pageArticles = articles.slice((page - 1) * perPage, page * perPage);
    const permalink = page === 1 ? "/" : `/page/${page}.html`;
    await writePage(permalink, site.blogTitle, makeHomePage(pageArticles, site, page, pageCount));
  }

  for (let index = 0; index < articles.length; index += 1) {
    const article = articles[index];
    const prev = articles[index + 1];
    const next = articles[index - 1];
    await writePage(
      article.articlePermalink,
      `${article.articleTitle} - ${site.blogTitle}`,
      makeArticlePage(article, site, prev, next, commentsByArticle),
      {
        description: article.articleSeoDescription,
        keywords: splitTags(article.articleTags)
      }
    );
  }

  const tagWall = `<div class="tags">
      ${tags.filter((tag) => tag.count > 0).sort((a, b) => b.count - a.count).map((tag) => `<a rel="tag" class="tag" href="${tagHref(tag.tagTitle)}"><span>${escapeHtml(tag.tagTitle)}</span> (<b>${tag.count}</b>)</a>`).join("\n")}
  </div>`;
  await writePage("/tags.html", `标签墙 - ${site.blogTitle}`, makeOtherPage(`总计 ${tags.filter((tag) => tag.count > 0).length} 个标签`, "icon-tags", tagWall, site));

  await writePage("/topics.html", `专题系列 - ${site.blogTitle}`, makeTopicOverviewPage(topics, site), {
    description: "按 Java、Spring Boot、MySQL、Linux、Python 爬虫、中间件和博客建设重新组织的专题阅读入口。"
  });
  for (const topic of topics) {
    const body = `<section class="topic-detail">
      <p>${escapeHtml(topic.description)}</p>
      ${makeTopicRoadmap(topic)}
      <div>${topic.articles.map(makeArticleCard).join("\n")}</div>
    </section>`;
    await writePage(`/topics/${topic.slug}.html`, `${topic.title} - ${site.blogTitle}`, makeOtherPage(`${topic.title} (${topic.articles.length})`, "icon-list", body, site), {
      description: topic.description,
      keywords: [topic.title]
    });
  }

  for (const tag of tags.filter((tag) => tag.count > 0)) {
    const taggedArticles = articles.filter((article) => splitTags(article.articleTags).includes(tag.tagTitle));
    const body = `<div>${taggedArticles.map(makeArticleCard).join("\n")}</div>`;
    await writePage(tagHref(tag.tagTitle), `${tag.tagTitle} - ${site.blogTitle}`, makeOtherPage(`${tag.tagTitle} (${taggedArticles.length})`, "icon-tags", body, site));
  }

  const aliasPages = new Set();
  for (const [alias, canonical] of tagAliases.entries()) {
    const canonicalArticles = articles.filter((article) => splitTags(article.articleTags).includes(canonical));
    const aliasHref = tagHref(alias);
    if (canonicalArticles.length === 0 || aliasHref === tagHref(canonical) || aliasPages.has(aliasHref)) continue;
    aliasPages.add(aliasHref);
    const body = `<p class="ft-gray" style="padding:0 20px 12px;">该标签已归并到 <a href="${tagHref(canonical)}">${escapeHtml(canonical)}</a>。</p>
    <div>${canonicalArticles.map(makeArticleCard).join("\n")}</div>`;
    await writePage(aliasHref, `${alias} - ${site.blogTitle}`, makeOtherPage(`${alias} / ${canonical} (${canonicalArticles.length})`, "icon-tags", body, site), {
      description: `${alias} 标签已归并到 ${canonical}，这里保留旧标签入口。`,
      keywords: [alias, canonical]
    });
  }

  const archives = buildArchives(articles);
  const archiveBody = `<ul class="list">
      ${archives.map((archive) => `<li><a class="post-title" href="/archives/${archive.year}/${archive.month}">${archive.year} 年 ${archive.month} 月 (${archive.articles.length})</a></li>`).join("\n")}
  </ul>`;
  await writePage("/archives.html", `存档 - ${site.blogTitle}`, makeOtherPage(`${articles.length} 篇文章`, "icon-inbox", archiveBody, site));

  for (const archive of archives) {
    const body = `<div>${archive.articles.map(makeArticleCard).join("\n")}</div>`;
    await writePage(`/archives/${archive.year}/${archive.month}`, `${archive.year} 年 ${archive.month} 月 - ${site.blogTitle}`, makeOtherPage(`${archive.year} 年 ${archive.month} 月 (${archive.articles.length})`, "icon-inbox", body, site));
  }

  const linksBody = `<ul class="list">
      ${linkRows.map((link) => `<li><a href="${escapeAttr(link.linkAddress)}" target="_blank" rel="noopener">${escapeHtml(link.linkTitle)}${link.linkDescription ? ` <span class="ft-gray">${escapeHtml(link.linkDescription)}</span>` : ""}</a></li>`).join("\n")}
  </ul>`;
  await writePage("/links.html", `友情链接 - ${site.blogTitle}`, makeOtherPage("友情链接", "icon-link", linksBody, site));
  await writePage("/about.html", `关于本站 - ${site.blogTitle}`, makeAboutPage(site, topics), {
    description: "jackssybin 个人技术博客的内容方向、技术栈、专题路线图和维护说明。"
  });

  if (navSections.length > 0) {
    await writePage("/nav.html", `网址导航 - ${site.blogTitle}`, makeNavPage(navSections, site), {
      description: "jackssybin 网址导航，收集 AI 工具、开发资源、学习资料、实用工具和常用站点。"
    });
    for (const section of navSections) {
      await writePage(`/nav/${slugifyNav(section.taxonomy)}.html`, `${section.taxonomy} - 网址导航 - ${site.blogTitle}`, makeNavCategoryPage(section, site), {
        description: `${section.taxonomy} 分类网址导航。`,
        keywords: [section.taxonomy]
      });
    }
  }

  await fs.writeFile(
    path.join(docsDir, "search.md"),
    `${frontmatter(`搜索 - ${site.blogTitle}`, "/search.html")}<SearchPage />\n`,
    "utf8"
  );

  await fs.writeFile(path.join(publicDir, "rss.xml"), makeRss(articles, options), "utf8");
  await fs.writeFile(
    path.join(docsDir, ".vuepress", "page-data.ts"),
    `export const pages: Record<string, string> = ${JSON.stringify(Object.fromEntries(pageData.map((page) => [page.id, page.html])), null, 2)};\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(docsDir, ".vuepress", "search-index.ts"),
    `export const searchIndex = ${JSON.stringify(articles.map((article) => ({
      title: article.articleTitle,
      url: article.articlePermalink,
      date: formatDate(article.articleCreated),
      topic: article.topic.title,
      core: Boolean(article.coreEnhancement),
      readingOrder: article.coreEnhancement?.order || 999,
      tags: splitTags(article.articleTags),
      excerpt: article.articleSeoDescription || article.articleAbstractText || "",
      guide: article.articleGuide || "",
      content: article.articleSearchText || ""
    })), null, 2)};

export const navIndex = ${JSON.stringify(navLinks.map((link) => ({
      title: link.title,
      url: link.url,
      taxonomy: link.taxonomy,
      term: link.term,
      description: link.description || ""
    })), null, 2)};\n`,
    "utf8"
  );
  await fs.writeFile(path.join(publicDir, "migration-summary.json"), JSON.stringify({
    articles: articleRows.length,
    publishedArticles: migratedArticles.length,
    manualArticles: manualArticles.length,
    totalArticles: articles.length,
    comments: commentRows.length,
    tags: tagRows.length,
    usedTags: tags.filter((tag) => tag.count > 0).length,
    topics: topics.length,
    navSections: navSections.length,
    navLinks: navLinks.length,
    pages: pageRows.length,
    links: linkRows.length,
    generatedAt: new Date().toISOString()
  }, null, 2), "utf8");

  console.log(`Generated ${articles.length} articles (${manualArticles.length} manual), ${commentRows.length} comments, ${tags.filter((tag) => tag.count > 0).length} used tags, ${linkRows.length} links, ${navLinks.length} nav links.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
