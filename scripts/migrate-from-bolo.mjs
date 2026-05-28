import fs from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";
import mysql from "mysql2/promise";

const root = process.cwd();
const docsDir = path.join(root, "docs");
const publicDir = path.join(docsDir, ".vuepress", "public");
const contentDir = path.join(root, "content");

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

function frontmatter(title, permalink) {
  return `---\ntitle: ${JSON.stringify(title)}\npermalink: ${JSON.stringify(permalink)}\npageClass: solo-page\nsidebar: false\nbreadcrumb: false\npageInfo: false\ncontributors: false\nlastUpdated: false\ncomment: false\n---\n\n`;
}

function pageDocument(title, permalink, pageId) {
  return `${frontmatter(title, permalink)}<SoloPage id="${pageId}" />\n`;
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
  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);
  return splitTags(value || "");
}

function splitTags(tags = "") {
  return String(tags).split(",").map((tag) => tag.trim()).filter(Boolean);
}

function tagSlug(tag) {
  return encodeURIComponent(tag).replaceAll("%", "_").replace(/^_+/, "");
}

function tagHref(tag) {
  return `/tags/${tagSlug(tag)}.html`;
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
    const title = data.title || path.basename(file, ".md");
    const stats = await fs.stat(file);
    const created = dateFromPermalink(permalink, stats.birthtimeMs || stats.mtimeMs);
    const tags = normalizeTags(data.tags || data.tag || "");
    const bodyWithoutTitle = body.replace(new RegExp(`^#\\s+${title.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\s*`, "u"), "");
    const abstractText = stripMarkdown(bodyWithoutTitle).slice(0, 220);

    manualArticles.push({
      oId: `manual:${relativePath.replace(/\\/gu, "/")}`,
      articleTitle: title,
      articlePermalink: permalink,
      articleCreated: created,
      articleUpdated: stats.mtimeMs,
      articleAbstract: "",
      articleAbstractText: abstractText,
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

async function writePage(permalink, title, html) {
  const pageId = `p${pageData.length}`;
  pageData.push({ id: pageId, html });
  const file = localPathForPermalink(permalink);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, pageDocument(title, permalink, pageId), "utf8");
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
                <a href="/tags.html" rel="section"><i class="icon-tags"></i> 标签墙</a>
                <a href="/archives.html"><i class="icon-inbox"></i> 存档</a>
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
  return `<article class="post">
    <header>
        <h2>
            <a rel="bookmark" href="${escapeAttr(article.articlePermalink)}">${escapeHtml(article.articleTitle)}</a>
            ${article.hasUpdated ? `<sup><a href="${escapeAttr(article.articlePermalink)}">有更新！</a></sup>` : ""}
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="${article.hasUpdated ? "更新日期" : "创建日期"}">
                <i class="icon-date"></i> <time>${formatDate(article.articleCreated)}</time>
            </span>
            &nbsp; | &nbsp;
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="评论数">
                <i class="icon-comments"></i>
                <a href="${escapeAttr(article.articlePermalink)}#comments">${Number(article.articleCommentCount || 0)} 评论</a>
            </span>
            &nbsp; | &nbsp;
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="浏览数">
                <i class="icon-views"></i> ${Number(article.articleViewCount || 0)} 浏览
            </span>
        </div>
    </header>
    <div class="vditor-reset">${abstract}</div>
    <footer class="fn-clear tags">
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
  const mostCommentArticles = [...articles]
    .sort((a, b) => Number(b.articleCommentCount) - Number(a.articleCommentCount))
    .filter((article) => Number(article.articleCommentCount) > 0)
    .slice(0, Number(options.mostCommentArticleDisplayCount || 5));
  const mostViewArticles = [...articles]
    .sort((a, b) => Number(b.articleViewCount) - Number(a.articleViewCount))
    .slice(0, Number(options.mostViewArticleDisplayCount || 5));

  return `<aside>
    <section>
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
                    ${comments.length} <span class="ft-gray">评论</span><br>
                    ${Number(options.statisticBlogViewCount || 0)} <span class="ft-gray">浏览</span><br>
                    ${links.length} <span class="ft-gray">友链</span>
                </div>
            </main>
        </div>
        <div class="module">
            <header><h2>评论最多的文章</h2></header>
            <main class="list"><ul>
                ${mostCommentArticles.map((article) => `<li><a rel="nofollow" aria-label="${Number(article.articleCommentCount)} 评论" class="vditor-tooltipped vditor-tooltipped__e" href="${escapeAttr(article.articlePermalink)}">${escapeHtml(article.articleTitle)}</a></li>`).join("\n")}
            </ul></main>
        </div>
        <div class="module">
            <header><h2>访问最多的文章</h2></header>
            <main class="list"><ul>
                ${mostViewArticles.map((article) => `<li><a rel="nofollow" aria-label="${Number(article.articleViewCount)} 浏览" class="vditor-tooltipped vditor-tooltipped__e" href="${escapeAttr(article.articlePermalink)}">${escapeHtml(article.articleTitle)}</a></li>`).join("\n")}
            </ul></main>
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
    <h3>${articleComments.length} 条旧评论</h3>
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

function makeArticlePage(article, site, prev, next, commentsByArticle) {
  const tags = splitTags(article.articleTags);
  const articleComments = commentsByArticle.get(article.oId) || [];
  const rel = `<div class="rel fn-clear ft__center">
      ${prev ? `<a href="${escapeAttr(prev.articlePermalink)}" rel="prev" class="fn-left vditor-tooltipped vditor-tooltipped__n" aria-label="${escapeAttr(prev.articleTitle)}">上一篇</a>` : ""}
      ${next ? `<a href="${escapeAttr(next.articlePermalink)}" rel="next" class="fn-right vditor-tooltipped vditor-tooltipped__n" aria-label="${escapeAttr(next.articleTitle)}">下一篇</a>` : ""}
  </div>`;

  const inner = `<main>
    <article class="post">
        <header>
            <h2><a rel="bookmark" href="${escapeAttr(article.articlePermalink)}">${escapeHtml(article.articleTitle)}</a></h2>
            <div class="meta">
                <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="${article.hasUpdated ? "更新日期" : "创建日期"}">
                    <i class="icon-date"></i>
                    <time>${formatDate(article.articleCreated)}/${formatDate(article.articleUpdated)}</time>
                </span>
                &nbsp; | &nbsp;
                <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="评论数">
                    <i class="icon-comments"></i>
                    <a href="${escapeAttr(article.articlePermalink)}#comments">${articleComments.length} 评论</a>
                </span>
                &nbsp; | &nbsp;
                <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="浏览数">
                    <i class="icon-views"></i> ${Number(article.articleViewCount || 0)} 浏览
                </span>
            </div>
        </header>
        <div id="more" class="vditor-reset post__content">${markdownToHtml(article.articleContent)}</div>
        <footer class="tags">
            ${makeTagLinks(tags)}
            ${rel}
        </footer>
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
    <description><![CDATA[${article.articleAbstract || article.articleAbstractText || ""}]]></description>
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
  const [articleRows] = await connection.query("SELECT * FROM b3_solo_article WHERE articleStatus = 0 ORDER BY articlePutTop DESC, articleCreated DESC");
  const [pageRows] = await connection.query("SELECT * FROM b3_solo_page ORDER BY pageOrder ASC");
  const [commentRows] = await connection.query("SELECT * FROM b3_solo_comment ORDER BY commentCreated ASC");
  const [tagRows] = await connection.query("SELECT * FROM b3_solo_tag ORDER BY tagTitle ASC");
  const [linkRows] = await connection.query("SELECT * FROM b3_solo_link ORDER BY linkOrder ASC");
  const [optionRows] = await connection.query("SELECT * FROM b3_solo_option");
  const [userRows] = await connection.query("SELECT * FROM b3_solo_user ORDER BY oId ASC LIMIT 1");
  await connection.end();

  const options = Object.fromEntries(optionRows.map((row) => [row.oId, row.optionValue]));
  const commentsByArticle = new Map();
  for (const comment of commentRows) {
    if (!commentsByArticle.has(comment.commentOnId)) commentsByArticle.set(comment.commentOnId, []);
    commentsByArticle.get(comment.commentOnId).push(comment);
  }

  const migratedArticles = articleRows.map((article) => ({
    ...article,
    articleCommentCount: (commentsByArticle.get(article.oId) || []).length,
    hasUpdated: Number(article.articleUpdated) !== Number(article.articleCreated)
  }));
  const manualArticles = await readManualArticles();
  const articles = [...migratedArticles, ...manualArticles]
    .sort((a, b) => Number(b.articlePutTop || 0) - Number(a.articlePutTop || 0) || Number(b.articleCreated) - Number(a.articleCreated));

  const tagCounts = new Map();
  for (const article of articles) {
    for (const tag of splitTags(article.articleTags)) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }
  const knownTagTitles = new Set(tagRows.map((tag) => tag.tagTitle));
  const tags = [
    ...tagRows.map((tag) => ({ ...tag, count: tagCounts.get(tag.tagTitle) || 0 })),
    ...[...tagCounts.keys()]
      .filter((tagTitle) => !knownTagTitles.has(tagTitle))
      .map((tagTitle) => ({ oId: `manual:${tagTitle}`, tagTitle, count: tagCounts.get(tagTitle) || 0 }))
  ];

  const site = {
    blogTitle: options.blogTitle || "jackssybin 的个人博客",
    blogSubtitle: options.blogSubtitle || "记录精彩的程序人生",
    pages: pageRows,
    tags,
    articles,
    comments: commentRows,
    links: linkRows,
    options,
    user: userRows[0]
  };

  await resetGeneratedDocs();

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
    await writePage(article.articlePermalink, `${article.articleTitle} - ${site.blogTitle}`, makeArticlePage(article, site, prev, next, commentsByArticle));
  }

  const tagWall = `<div class="tags">
      ${tags.filter((tag) => tag.count > 0).sort((a, b) => b.count - a.count).map((tag) => `<a rel="tag" class="tag" href="${tagHref(tag.tagTitle)}"><span>${escapeHtml(tag.tagTitle)}</span> (<b>${tag.count}</b>)</a>`).join("\n")}
  </div>`;
  await writePage("/tags.html", `标签墙 - ${site.blogTitle}`, makeOtherPage(`总计 ${tags.filter((tag) => tag.count > 0).length} 个标签`, "icon-tags", tagWall, site));

  for (const tag of tags.filter((tag) => tag.count > 0)) {
    const taggedArticles = articles.filter((article) => splitTags(article.articleTags).includes(tag.tagTitle));
    const body = `<div>${taggedArticles.map(makeArticleCard).join("\n")}</div>`;
    await writePage(tagHref(tag.tagTitle), `${tag.tagTitle} - ${site.blogTitle}`, makeOtherPage(`${tag.tagTitle} (${taggedArticles.length})`, "icon-tags", body, site));
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
      tags: splitTags(article.articleTags)
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
    pages: pageRows.length,
    links: linkRows.length,
    generatedAt: new Date().toISOString()
  }, null, 2), "utf8");

  console.log(`Generated ${articles.length} articles (${manualArticles.length} manual), ${commentRows.length} comments, ${tags.filter((tag) => tag.count > 0).length} used tags, ${linkRows.length} links.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
