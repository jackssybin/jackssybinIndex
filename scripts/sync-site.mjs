import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const root = process.cwd();
const hugoDir = root;
const contentDir = path.join(hugoDir, "content");
const dataDir = path.join(hugoDir, "data");
const staticDir = path.join(hugoDir, "static");

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function write(file, content) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, "utf8");
}

async function listFiles(dir, predicate = () => true) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(full, predicate));
    } else if (entry.isFile() && predicate(full)) {
      files.push(full);
    }
  }
  return files;
}

function parseFrontmatter(source) {
  source = source.replace(/^\uFEFF/u, "");
  if (!source.startsWith("---")) return { data: {}, body: source };
  const end = source.indexOf("\n---", 3);
  if (end < 0) return { data: {}, body: source };
  const raw = source.slice(3, end).trim();
  const body = source.slice(source.indexOf("\n", end + 4) + 1);
  return { data: YAML.parse(raw) || {}, body };
}

function stripMarkdown(source = "") {
  return String(source)
    .replace(/^---[\s\S]*?\n---\s*/u, "")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/gu, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/<script[\s\S]*?<\/script>/giu, " ")
    .replace(/<style[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/[#>*_`~|-]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function excerpt(body, length = 180) {
  const text = stripMarkdown(body);
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

function normalizeDate(value = "") {
  if (!value) return "";
  const raw = String(value);
  const localDate = raw.match(/^(\d{4}-\d{2}-\d{2})/u);
  if (localDate) return localDate[1];
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? raw : date.toISOString().slice(0, 10);
}

function inferType(file, params) {
  if (params.contentType === "article") return "blog";
  if (file.includes(`${path.sep}tutorials${path.sep}`)) return "tutorial";
  if (file.includes(`${path.sep}generated${path.sep}nav${path.sep}`)) return "nav";
  if (file.includes(`${path.sep}generated${path.sep}topics${path.sep}`)) return "topic";
  return params.contentType || "page";
}

async function copyHotNews() {
  const hotNews = path.join(staticDir, "hot-news.json");
  if (!await exists(hotNews)) return;
  await fs.copyFile(hotNews, path.join(dataDir, "hot-news.json"));
}

async function readContentEntries() {
  const markdownFiles = await listFiles(contentDir, (file) => file.endsWith(".md"));
  const entries = [];
  for (const file of markdownFiles) {
    const source = await fs.readFile(file, "utf8");
    const { data, body } = parseFrontmatter(source);
    const url = data.url || data.permalink;
    const title = data.title;
    if (!url || !title) continue;
    const type = inferType(file, data);
    entries.push({
      title: String(title),
      url: String(url),
      type,
      date: normalizeDate(data.date || data.lastmod),
      description: String(data.description || excerpt(body)),
      excerpt: String(data.description || excerpt(body)),
      topic: data.topic || "",
      topicSlug: data.topicSlug || "",
      series: data.series || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      priority: Number(data.priority || 0),
      content: excerpt(body, 2200)
    });
  }
  return entries;
}

function sortByDate(items) {
  return [...items].sort((a, b) => {
    const dateOrder = String(b.date || "").localeCompare(String(a.date || ""));
    if (dateOrder) return dateOrder;
    return String(a.title).localeCompare(String(b.title), "zh-CN");
  });
}

async function syncData() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(staticDir, { recursive: true });

  const entries = await readContentEntries();
  const existingHomePath = path.join(dataDir, "home.json");
  const existingTopicsPath = path.join(dataDir, "topics.json");
  const existingHome = await exists(existingHomePath)
    ? JSON.parse(await fs.readFile(existingHomePath, "utf8"))
    : {};
  const topics = await exists(existingTopicsPath)
    ? JSON.parse(await fs.readFile(existingTopicsPath, "utf8"))
    : [];

  const articles = sortByDate(entries.filter((item) => item.type === "blog"));
  const tutorials = sortByDate(entries.filter((item) => item.type === "tutorial")).slice(0, 12);
  const articleByUrl = new Map(articles.map((article) => [article.url, article]));
  const deprecatedTerms = new Set(["bolo"]);
  const refreshedTopics = topics.map((topic) => {
    const existingUrls = Array.isArray(topic.articles) ? topic.articles.map((article) => article.url).filter(Boolean) : [];
    const matched = [
      ...existingUrls.map((url) => articleByUrl.get(url)).filter(Boolean),
      ...articles.filter((article) => article.topicSlug && article.topicSlug === topic.slug)
    ];
    const unique = [...new Map(matched.map((article) => [article.url, article])).values()];
    return {
      ...topic,
      keywords: Array.isArray(topic.keywords)
        ? topic.keywords.filter((keyword) => !deprecatedTerms.has(String(keyword).toLowerCase()))
        : [],
      articles: unique,
      articleTitles: unique.map((article) => article.title),
      count: unique.length || topic.count || 0
    };
  });
  const existingLearningPath = Array.isArray(existingHome.learningPath) ? existingHome.learningPath : [];
  const learningPath = existingLearningPath.filter((item) => item.url && articleByUrl.has(item.url));

  const recentUpdates = [
    ...articles.slice(0, 5).map((item) => ({ ...item, type: "文章" })),
    ...tutorials.slice(0, 3).map((item) => ({ ...item, type: item.series || "教程" }))
  ];

  await write(path.join(dataDir, "home.json"), JSON.stringify({
    ...existingHome,
    allArticles: articles,
    articles: articles.slice(0, 20),
    latestArticles: articles.slice(0, 5),
    tutorials,
    topics: refreshedTopics.slice(0, 8),
    learningPath: learningPath.length ? learningPath : articles.filter((item) => item.topic).slice(0, 6),
    recentUpdates
  }, null, 2));
  await write(path.join(dataDir, "topics.json"), JSON.stringify(refreshedTopics, null, 2));
  await write(path.join(staticDir, "search-index.json"), JSON.stringify(entries, null, 2));
  await copyHotNews();
  console.log(`Synced Hugo data: ${articles.length} articles, ${tutorials.length} tutorials, ${entries.length} searchable entries.`);
}

await syncData();
