# 新文章发布完整流程

本文档用于记录本站后续新增 Markdown 文章的标准流程。目标是保证新文章能稳定出现在首页、归档、标签、专题、搜索索引和线上网站中。

## 1. 推荐目录

新文章源文件统一放在：

```text
content/articles/YYYY/MM/DD/文章-slug.md
```

例如：

```text
content/articles/2026/06/03/odysseus-zhihu.md
```

不要直接把新文章长期维护在 `docs/articles` 下。`docs/articles` 是迁移脚本生成后的 VuePress 页面目录，后续执行 `pnpm migrate` 或 `pnpm update-content` 时可能被重新生成。

## 2. 新建文章

方式一：使用脚本生成模板。

```bash
pnpm new-post "文章标题"
```

如果希望指定英文 URL slug：

```bash
POST_SLUG=odysseus-zhihu pnpm new-post "Odysseus：一个值得关注的本地 AI 工作台"
```

Windows PowerShell 可以使用：

```powershell
$env:POST_SLUG="odysseus-zhihu"
pnpm.cmd new-post "Odysseus：一个值得关注的本地 AI 工作台"
```

方式二：手动创建 Markdown 文件。

文件头必须包含 frontmatter：

```markdown
---
title: "文章标题"
permalink: "/articles/2026/06/03/文章-slug.html"
description: "文章摘要，用于 SEO、首页摘要和搜索结果。"
tags: ["标签1", "标签2"]
pageClass: solo-page
sidebar: false
breadcrumb: false
pageInfo: false
contributors: false
lastUpdated: false
comment: false
---

# 文章标题

正文内容。
```

## 3. 编写规范

- `title`：尽量清晰具体，包含核心关键词。
- `permalink`：固定 URL，不要上线后随意修改。
- `description`：建议 80 到 160 字，说明文章解决什么问题、适合谁读。
- `tags`：建议 3 到 6 个，优先使用已有标签，如 `Java`、`MySQL`、`Spring Boot`、`Netty`、`AI`、`VuePress`。
- 正文第一段：直接交代背景、价值和读者收益。
- 代码块：必须写语言标识，例如 ` ```java `、` ```bash `、` ```powershell `。
- 图片：优先放到 `docs/.vuepress/public/images/`，正文中使用 `/images/xxx.png` 引用。

## 4. 专题归类与调整

本站专题页不是在 `docs/topics` 下手工长期维护的，而是由迁移脚本自动生成：

```text
scripts/migrate-from-bolo.mjs
```

核心配置有两个：

- `topicDefinitions`：定义有哪些专题、专题标题、URL slug、简介和关键词。
- `coreArticleEnhancements`：给核心文章做人工增强，可以强制指定某篇文章属于哪个专题。

### 4.1 当前建议保留的专题

一个技术人博客建议至少覆盖这些内容入口：

- `AI、Agent 与本地模型`：AI 工具、本地大模型、Agent、MCP、自托管 AI、AI 编程。
- `Java 与 JVM`：Java 基础、集合、反射、并发、JVM、GC、线上排障。
- `Spring Boot 与后端框架`：Spring Boot、Spring Framework、MyBatis、WebFlux、微服务实践。
- `MySQL 与数据架构`：索引、事务、锁、SQL 优化、分库分表、数据一致性。
- `中间件与分布式`：Redis、Zookeeper、消息队列、网关、限流、分布式锁、可观测性。
- `Linux 运维与部署`：Linux、Nginx、服务器部署、日志、监控、故障排查。
- `Python 爬虫与自动化`：Python、Scrapy、Selenium、自动化脚本。
- `工具、效率与博客建设`：VuePress、博客迁移、GitHub、效率工具、建站经验。

后续如果内容变多，可以继续拆出这些专题：

- `云原生与容器化`：Docker、Kubernetes、CI/CD、容器部署。
- `架构设计与系统设计`：高并发、可用性、容量规划、系统拆分。
- `性能优化与故障排查`：JVM、数据库、Linux、链路追踪、压测。
- `安全与攻防基础`：认证授权、接口安全、漏洞修复、服务器加固。
- `开源项目与产品实践`：项目复盘、工具评测、源码阅读、产品化经验。

### 4.2 新增一个专题

在 `scripts/migrate-from-bolo.mjs` 的 `topicDefinitions` 数组中新增一项：

```js
{
  title: "AI、Agent 与本地模型",
  slug: "ai-agent",
  description: "AI 工具、本地大模型、Agent、MCP、自托管 AI 工作台和 AI 编程实践。",
  keywords: ["ai", "人工智能", "大模型", "llm", "agent", "mcp", "ollama", "chatgpt", "claude", "deepseek"]
}
```

字段说明：

- `title`：专题显示名称。
- `slug`：专题访问路径，例如 `/topics/ai-agent.html`，上线后不要轻易修改。
- `description`：专题页简介，会展示在专题列表中。
- `keywords`：自动归类关键词，脚本会从文章标题、标签、摘要中匹配。

新增专题后执行：

```bash
pnpm migrate
pnpm build
```

### 4.3 调整某篇文章到指定专题

如果文章被自动分错专题，不要只改生成后的 `docs/topics/*.md`，因为下次迁移会被覆盖。

推荐在 `coreArticleEnhancements` 中给文章固定专题：

```js
"/articles/2026/06/03/odysseus-zhihu.html": {
  topicSlug: "ai-agent",
  order: 10,
  title: "Odysseus 本地 AI 工作台体验",
  summary: "这篇文章适合作为 AI、Agent 与本地模型专题的入口。",
  takeaways: ["理解本地优先 AI 工作台的定位。", "了解 Agent、MCP、自托管等能力。"]
}
```

其中：

- `topicSlug`：必须对应 `topicDefinitions` 中已有的 `slug`。
- `order`：同专题内的推荐阅读顺序，数字越小越靠前。
- `title`：可以给专题页和详情页展示一个更适合阅读路线的标题。
- `summary`：文章导读摘要。
- `takeaways`：读完这篇文章应该掌握的重点。

### 4.4 标签与专题的关系

标签适合表达细粒度关键词，例如 `AI`、`Odysseus`、`本地 AI`、`Agent`。

专题适合表达阅读路线和内容版块，例如 `AI、Agent 与本地模型`。

一篇文章可以有多个标签，但通常只归入一个主专题。新增文章时，先想清楚它属于哪个专题，再补充 3 到 6 个标签。

## 5. 生成站点内容

新增或修改文章后，执行：

```bash
pnpm migrate
```

该命令会重新生成：

- `docs/articles`
- 首页文章列表
- 归档页
- 标签页
- 专题页
- RSS
- 搜索索引

如果还需要同步实时新闻并完整构建，可以执行：

```bash
pnpm update-content
```

Windows PowerShell 如果遇到脚本执行策略限制，使用：

```powershell
pnpm.cmd migrate
pnpm.cmd build
```

## 6. 本地预览

构建前预览：

```bash
pnpm dev
```

默认访问：

```text
http://localhost:8080/
```

如果端口被占用：

```bash
pnpm dev -- --port 8082
```

重点检查：

- 首页是否出现新文章。
- 文章详情页样式是否正常。
- 标签页是否有新标签。
- 归档页是否按日期显示。
- 搜索页是否能搜到标题和关键词。
- RSS 是否包含新文章。

## 7. 构建验证

上线前执行：

```bash
pnpm build
```

构建成功后，静态产物会生成到：

```text
docs/.vuepress/dist/
```

如果构建失败，先处理 Markdown 语法、frontmatter、链接或图片路径问题。

## 8. 提交到 Git

确认变更：

```bash
git status
```

建议至少提交这些文件：

```bash
git add content/articles docs package.json pnpm-lock.yaml
git commit -m "add article title"
git push origin main
```

如果只新增文章，通常会包含：

- `content/articles/.../文章.md`
- 重新生成的 `docs/articles/...`
- 重新生成的首页、标签、归档、专题、RSS、搜索索引等文件

具体以 `git status` 为准。

## 9. 上线后展示位置

新文章上线后会出现在：

- 首页最新文章列表
- 首页博客摘要列表
- `/archives.html` 归档页
- `/tags.html` 标签墙
- 对应标签页
- `/search.html` 全站搜索结果
- `/rss.xml` RSS
- 如果匹配专题规则，也会出现在对应专题页和文章详情页的相关推荐中

本次示例文章的线上地址为：

```text
https://jackssybin.cn/articles/2026/06/03/odysseus-zhihu.html
```

## 10. 常见问题

### 新文章没有出现在首页

先确认文章是否放在 `content/articles` 下，然后重新执行：

```bash
pnpm migrate
pnpm build
```

### 文章详情页显示 frontmatter

说明 Markdown 文件头格式不正确。frontmatter 必须以单独一行 `---` 开始，并以单独一行 `---` 结束。

### 中文乱码

文件必须保存为 UTF-8 编码。Windows 下建议使用 VS Code，并确认右下角编码显示为 `UTF-8`。

### 链接上线后 404

检查 `permalink` 是否和访问地址一致，并确认执行过 `pnpm migrate` 和 `pnpm build`。

### 搜索不到新文章

搜索索引由迁移脚本生成。执行：

```bash
pnpm migrate
pnpm build
```

再访问 `/search.html` 验证。

## 11. Hugo 教程系列原文维护流程

Hugo + Obsidian 迁移分支中，教程系列的长期原文统一维护在：

```text
hugo-site/content/tutorials/
```

当前已有：

```text
hugo-site/content/tutorials/mysql
hugo-site/content/tutorials/springboot4
hugo-site/content/tutorials/netty
```

这些目录里的文件必须保持 Markdown 正文。代码示例中的 HTML 字符串或 HTML 示例可以保留，但不要把整篇正文转换成 `<h1>`、`<p>`、`<pre><code>` 形式。

### 从备份目录重新导入教程

当 `bak` 中有原始教程 Markdown 时，执行：

```bash
pnpm import:hugo-tutorials
pnpm export:hugo
```

导入脚本会：

- 从 `bak/mysql_project_all`、`bak/springboot4_project_all`、`bak/netty_project_all` 读取 UTF-8 Markdown。
- 只发布章节、README、目录、学习路线、快速开始、附录。
- 排除完成报告、项目进度、编写进度和 Netty 项目代码。
- 给每篇教程补充 Hugo frontmatter。
- 保留旧访问地址，例如 `/mysql/01/01-mysql.html`。

### 新增教程系列

新增教程系列时，建议新建：

```text
hugo-site/content/tutorials/<series-id>/
```

每篇教程至少包含：

```yaml
title: "教程标题"
description: "教程摘要"
url: "/series/stable-url.html"
layout: "tutorial"
kind: "tutorial"
series: "series-id"
seriesTitle: "系列名称"
weight: 10
tags: ["Java", "教程"]
draft: false
```

字段说明：

- `url` 是线上稳定访问地址，后续尽量不要修改。
- `series` 用于搜索、教程目录和上一篇/下一篇。
- `weight` 用于章节排序。
- `tags` 用于搜索和标签聚合。

新增或调整教程后，至少检查：

```bash
pnpm export:hugo
pnpm build:hugo
```

并抽查 `/tutorials.html`、对应系列首页、任意章节详情页和 `/search.html`。
