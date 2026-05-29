import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: pnpm new-post "文章标题"');
  process.exitCode = 1;
  process.exit();
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function slugify(value) {
  const ascii = value
    .toLowerCase()
    .replace(/['"]/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  if (ascii) return ascii;
  return `post-${Date.now()}`;
}

const now = new Date();
const year = now.getFullYear();
const month = pad(now.getMonth() + 1);
const day = pad(now.getDate());
const slug = slugify(process.env.POST_SLUG || title);
const articleDir = path.join(root, "content", "articles", String(year), month, day);
const articlePath = path.join(articleDir, `${slug}.md`);
const permalink = `/articles/${year}/${month}/${day}/${slug}.html`;

const content = `---
title: ${JSON.stringify(title)}
permalink: ${JSON.stringify(permalink)}
description: ""
tags: ["待分类"]
pageClass: solo-page
sidebar: false
breadcrumb: false
pageInfo: false
contributors: false
lastUpdated: false
comment: false
---

# ${title}

这里写文章摘要。建议第一段直接说明本文解决什么问题。

## 背景

这里写背景。

## 正文

这里写正文。

## 总结

这里写总结。
`;

try {
  await fs.mkdir(articleDir, { recursive: true });
  await fs.writeFile(articlePath, content, { encoding: "utf8", flag: "wx" });
  console.log(`Created: ${path.relative(root, articlePath)}`);
  console.log(`Permalink: ${permalink}`);
  console.log("Next: pnpm migrate && pnpm dev --port 8080");
} catch (error) {
  if (error.code === "EEXIST") {
    console.error(`File already exists: ${path.relative(root, articlePath)}`);
    process.exitCode = 1;
  } else {
    throw error;
  }
}
