import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputFile = path.join(root, "content", "hot-news.json");
const apiBase = "https://orz.ai/api/v1/dailynews/";

const defaultPlatforms = [
  ["baidu", "百度热搜"],
  ["weibo", "微博热搜"],
  ["zhihu", "知乎热榜"],
  ["juejin", "掘金"],
  ["github", "GitHub Trending"],
  ["hackernews", "Hacker News"],
  ["sspai", "少数派"],
  ["sina_finance", "新浪财经"]
];

const platformNameMap = new Map(defaultPlatforms);
const configuredPlatforms = (process.env.HOT_NEWS_PLATFORMS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const platforms = configuredPlatforms.length > 0
  ? configuredPlatforms.map((code) => [code, platformNameMap.get(code) || code])
  : defaultPlatforms;

function normalizeItem(item, platform, platformName, index) {
  return {
    title: String(item.title || "").trim(),
    url: String(item.url || "").trim(),
    content: String(item.content || item.desc || "").trim(),
    source: item.source || platform,
    platform,
    platformName,
    publishTime: item.publish_time || item.publishTime || "",
    rank: index + 1
  };
}

async function fetchPlatform(platform, platformName) {
  const url = `${apiBase}?platform=${encodeURIComponent(platform)}`;
  const response = await fetch(url, {
    headers: {
      "accept": "application/json",
      "user-agent": "jackssybin-static-blog/1.0"
    }
  });
  if (!response.ok) throw new Error(`${platform} returned ${response.status}`);

  const payload = await response.json();
  const rows = Array.isArray(payload.data) ? payload.data : [];
  return rows
    .map((item, index) => normalizeItem(item, platform, platformName, index))
    .filter((item) => item.title && item.url)
    .slice(0, 20);
}

async function main() {
  const groups = [];
  const errors = [];

  for (const [platform, platformName] of platforms) {
    try {
      const items = await fetchPlatform(platform, platformName);
      groups.push({ platform, platformName, items });
      console.log(`Fetched ${items.length} items from ${platform}`);
    } catch (error) {
      errors.push({ platform, message: error.message });
      console.warn(`Failed to fetch ${platform}: ${error.message}`);
    }
  }

  if (groups.length === 0) {
    const previous = await fs.readFile(outputFile, "utf8").catch(() => "");
    if (previous) {
      console.warn("All hot news requests failed, keeping existing content/hot-news.json");
      return;
    }
    throw new Error("All hot news requests failed and no previous hot-news.json exists");
  }

  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: "https://github.com/orz-ai/hot_news",
    api: apiBase,
    groups,
    errors
  }, null, 2), "utf8");
  console.log(`Hot news written to ${path.relative(root, outputFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
