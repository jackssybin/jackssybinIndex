import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const root = process.cwd();
const contentTutorialsDir = path.join(root, "content", "tutorials");
const hugoTutorialsDir = path.join(root, "hugo-site", "content", "tutorials");

const seriesList = [
  {
    id: "mysql",
    title: "MySQL教程",
    sourceDir: path.join(root, "bak", "mysql_project_all", "111101"),
    oldDir: path.join(contentTutorialsDir, "mysql"),
    tags: ["MySQL", "SQL", "数据库", "教程"],
    rootUrls: new Map([
      ["README.md", "/mysql.html"],
      ["MySQL学习路线图.md", "/mysql/mysql.html"],
      ["快速开始指南.md", "/mysql/quick-start.html"],
      ["学习进度检查清单.md", "/mysql/progress-checklist.html"]
    ]),
    include(relativePath) {
      return relativePath.endsWith(".md");
    }
  },
  {
    id: "springboot4",
    title: "Spring Boot 4教程",
    sourceDir: path.join(root, "bak", "springboot4_project_all", "1223"),
    oldDir: path.join(contentTutorialsDir, "springboot4"),
    tags: ["Spring Boot", "Spring Framework", "Java", "教程"],
    rootUrls: new Map([
      ["README.md", "/springboot4.html"],
      ["快速导航.md", "/springboot4/quick-navigation.html"]
    ]),
    include(relativePath) {
      const skip = ["完成报告", "完成情况", "编写进度"];
      return relativePath.endsWith(".md") && !skip.some((keyword) => relativePath.includes(keyword));
    }
  },
  {
    id: "netty",
    title: "Netty教程",
    sourceDir: path.join(root, "bak", "netty_project_all", "1226"),
    oldDir: path.join(contentTutorialsDir, "netty"),
    tags: ["Netty", "Java NIO", "网络编程", "教程"],
    rootUrls: new Map([
      ["Netty教程目录.md", "/netty.html"],
      ["README.md", "/netty/readme.html"]
    ]),
    include(relativePath) {
      const skip = ["完成总结", "项目进度", "项目完成总结", "项目代码"];
      return relativePath.endsWith(".md") && !skip.some((keyword) => relativePath.includes(keyword));
    }
  }
];

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function walkMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

function parseFrontmatter(source = "") {
  if (!source.startsWith("---")) return { data: {}, body: source };
  const end = source.indexOf("\n---", 3);
  if (end < 0) return { data: {}, body: source };
  const raw = source.slice(3, end).trim();
  const body = source.slice(end + 4).replace(/^\r?\n/u, "");
  return { data: YAML.parse(raw) || {}, body };
}

function stringifyFrontmatter(data) {
  return `---\n${YAML.stringify(data).trim()}\n---\n\n`;
}

function normalizeTitle(value = "") {
  return String(value)
    .replace(/\s+-\s+jackssybin.*$/u, "")
    .replace(/[：:：\s《》「」"'`#*_-]/gu, "")
    .trim()
    .toLowerCase();
}

function titleFromMarkdown(source = "", fallback = "") {
  const { data, body } = parseFrontmatter(source.replace(/^\uFEFF/u, ""));
  if (data.title) return String(data.title).trim();
  const heading = body.match(/^#\s+(.+)$/mu)?.[1]?.trim();
  return heading || path.basename(fallback, ".md");
}

function plainText(source = "") {
  return source
    .replace(/^---[\s\S]*?\n---\s*/u, "")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/gu, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/gu, (match) => match.match(/\[([^\]]+)\]/u)?.[1] || " ")
    .replace(/[#>*_\-|]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function descriptionFromMarkdown(source = "") {
  const text = plainText(source);
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

function chapterNumber(value = "") {
  return String(value).match(/(?:第)?0?(\d+)(?:[-章]|$)/u)?.[1]
    || String(value).match(/^0?(\d+)/u)?.[1]
    || "";
}

async function readOldUrlMaps(oldDir) {
  const byTitle = new Map();
  const byChapter = new Map();
  if (!await exists(oldDir)) return { byTitle, byChapter };
  for (const file of await walkMarkdownFiles(oldDir)) {
    const source = await fs.readFile(file, "utf8");
    const { data } = parseFrontmatter(source);
    if (!data.title || !data.permalink) continue;
    byTitle.set(normalizeTitle(data.title), data.permalink);
    const titleChapter = chapterNumber(data.title);
    const fileChapter = chapterNumber(path.basename(file, ".md"));
    if (titleChapter) byChapter.set(titleChapter, data.permalink);
    if (fileChapter) byChapter.set(fileChapter, data.permalink);
  }
  return { byTitle, byChapter };
}

function chapterWeight(relativePath) {
  const normalized = relativePath.replace(/\\/gu, "/");
  const basename = path.posix.basename(normalized, ".md");
  const chapter = basename.match(/(?:第)?(\d+)(?:[-章]|$)/u)?.[1]
    || basename.match(/^(\d+)/u)?.[1];
  if (chapter) return Number(chapter) * 10;
  if (/README|教程目录|路线图/u.test(basename)) return 0;
  if (/快速/u.test(basename)) return 1;
  if (/进度|清单/u.test(basename)) return 2;
  if (/附录/u.test(normalized)) return 900 + normalized.localeCompare("附录", "zh-CN");
  return 500;
}

function defaultUrl(series, relativePath) {
  const clean = relativePath
    .replace(/\\/gu, "/")
    .replace(/\.md$/iu, "")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/${series.id}/${clean}.html`;
}

function destinationPath(series, relativePath) {
  return path.join(hugoTutorialsDir, series.id, relativePath);
}

function rewriteMarkdownLinks(source, currentRelativePath, byRelativePath) {
  return source.replace(/\]\((?!https?:\/\/|mailto:|#|\/)([^)\s]+\.md)(#[^)]+)?\)/giu, (match, href, hash = "") => {
    const decoded = decodeURIComponent(href);
    const normalized = path.posix
      .normalize(path.posix.join(path.posix.dirname(currentRelativePath.replace(/\\/gu, "/")), decoded))
      .replace(/^\.\//u, "");
    const target = byRelativePath.get(normalized) || byRelativePath.get(path.posix.basename(normalized));
    return target ? `](${target.url}${hash})` : match;
  });
}

async function importSeries(series) {
  if (!await exists(series.sourceDir)) {
    throw new Error(`Missing tutorial source: ${series.sourceDir}`);
  }

  const oldUrls = await readOldUrlMaps(series.oldDir);
  const sourceFiles = (await walkMarkdownFiles(series.sourceDir))
    .map((file) => ({
      file,
      relativePath: path.relative(series.sourceDir, file).replace(/\\/gu, "/")
    }))
    .filter((item) => series.include(item.relativePath))
    .sort((a, b) => chapterWeight(a.relativePath) - chapterWeight(b.relativePath)
      || a.relativePath.localeCompare(b.relativePath, "zh-CN", { numeric: true }));

  const items = [];
  for (const item of sourceFiles) {
    const raw = (await fs.readFile(item.file, "utf8")).replace(/^\uFEFF/u, "");
    const title = titleFromMarkdown(raw, item.file);
    const url = series.rootUrls.get(item.relativePath)
      || oldUrls.byTitle.get(normalizeTitle(title))
      || oldUrls.byChapter.get(chapterNumber(title))
      || oldUrls.byChapter.get(chapterNumber(path.basename(item.relativePath, ".md")))
      || defaultUrl(series, item.relativePath);
    items.push({
      ...item,
      raw,
      title,
      url,
      weight: chapterWeight(item.relativePath)
    });
  }

  const byRelativePath = new Map();
  for (const item of items) {
    byRelativePath.set(item.relativePath, item);
    byRelativePath.set(path.posix.basename(item.relativePath), item);
  }

  await fs.rm(path.join(hugoTutorialsDir, series.id), { recursive: true, force: true });
  for (const item of items) {
    const { body } = parseFrontmatter(item.raw);
    const rewritten = rewriteMarkdownLinks(body.trim(), item.relativePath, byRelativePath);
    const frontmatter = {
      title: item.title,
      description: descriptionFromMarkdown(rewritten),
      url: item.url,
      layout: "tutorial",
      kind: "tutorial",
      series: series.id,
      seriesTitle: series.title,
      weight: item.weight,
      tags: series.tags,
      draft: false
    };
    const out = destinationPath(series, item.relativePath);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, `${stringifyFrontmatter(frontmatter)}${rewritten}\n`, "utf8");
  }

  const unmatched = items.filter((item) => !series.rootUrls.has(item.relativePath)
    && !oldUrls.byTitle.has(normalizeTitle(item.title))
    && !oldUrls.byChapter.has(chapterNumber(item.title))
    && !oldUrls.byChapter.has(chapterNumber(path.basename(item.relativePath, ".md"))));
  return {
    id: series.id,
    count: items.length,
    unmatched: unmatched.map((item) => ({ title: item.title, url: item.url }))
  };
}

async function main() {
  await fs.mkdir(hugoTutorialsDir, { recursive: true });
  const results = [];
  for (const series of seriesList) results.push(await importSeries(series));
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
