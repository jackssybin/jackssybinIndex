# 新文章发布与内容维护流程

本文记录本站后续新增文章、调整专题、维护教程和发布上线的固定流程。项目根目录就是 Hugo 站点根目录。

## 1. 新增普通文章

```bash
pnpm new-post "文章标题"
```

生成位置：

```text
content/articles/yyyy/mm/dd/slug.md
```

文章访问地址由 frontmatter 的 `url` 决定：

```yaml
---
title: "文章标题"
url: "/articles/2026/06/07/my-new-post.html"
date: "2026-06-07"
description: "一句话说明本文解决什么问题。"
tags: ["AI", "Java"]
topic: "AI、Agent 与本地模型"
topicSlug: "ai-agent"
layout: article
contentType: article
---
```

写完后执行：

```bash
pnpm sync:hugo
pnpm build
```

新文章会展示在首页、归档、标签、专题、搜索结果和 RSS。

## 2. 专题归类

文章通过 `topic` 和 `topicSlug` 进入专题。

常用专题：

- `java-jvm`：Java 与 JVM
- `spring-backend`：Spring Boot 与后端框架
- `ai-agent`：AI、Agent 与本地模型
- `mysql-data`：MySQL 与数据架构
- `linux-ops`：Linux 运维与部署
- `python-crawler`：Python 爬虫与自动化
- `middleware-distributed`：中间件与分布式
- `tools-blog`：工具、效率与博客建设

新增专题时：

1. 在 `data/topics.json` 增加专题元数据。
2. 在 `content/generated/topics/<slug>.md` 增加专题入口页面。
3. 新文章 frontmatter 填写对应 `topic` 和 `topicSlug`。
4. 执行 `pnpm sync:hugo && pnpm build`。

## 3. 教程系列维护

教程统一放在：

```text
content/tutorials/
```

新增教程系列建议结构：

```text
content/tutorials/<series>/
  README.md
  quick-start.md
  01-intro.md
  02-basic.md
```

教程文章建议补充 `title`、`url`、`date`、`description`、`series`、`tags`、`weight`、`layout: tutorial`、`contentType: tutorial`。

## 4. 图片与附件

文章图片建议放在：

```text
static/images/
```

Markdown 中引用：

```markdown
![说明](/images/example.png)
```

不要把图片放入 `public`，因为 `public` 是构建产物。

## 5. 搜索与首页数据

```bash
pnpm sync:hugo
```

该命令会扫描 `content/**/*.md`，生成首页数据、专题数据和 `static/search-index.json`。

## 6. 实时新闻

```bash
pnpm fetch-hot-news
pnpm update-content
```

`update-content` 会抓取新闻、同步数据并构建站点。

## 7. 本地验证

```bash
pnpm dev
pnpm build
```

重点检查：首页、教程中心、专题页、标签墙、归档页、实时新闻页和新文章 URL。

## 8. 提交与部署

```bash
git status
git add .
git commit -m "publish new article"
git push
```

推送后 GitHub Actions 会构建 Hugo，并将 `public/` 同步到服务器。

## 9. 常见问题

新文章没有出现在首页：

- 确认 frontmatter 有 `layout: article` 和 `contentType: article`。
- 执行 `pnpm sync:hugo`。
- 执行 `pnpm build`。

专题页没有文章：

- 检查文章 `topicSlug` 是否与 `data/topics.json` 中的 `slug` 一致。

搜索不到文章：

- 检查 `static/search-index.json` 是否包含文章标题。
- 重新执行 `pnpm sync:hugo`。
