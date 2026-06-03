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

## 4. 生成站点内容

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

## 5. 本地预览

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

## 6. 构建验证

上线前执行：

```bash
pnpm build
```

构建成功后，静态产物会生成到：

```text
docs/.vuepress/dist/
```

如果构建失败，先处理 Markdown 语法、frontmatter、链接或图片路径问题。

## 7. 提交到 Git

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

## 8. 上线后展示位置

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

## 9. 常见问题

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
