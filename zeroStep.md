# 从零搭建一个只需更新 Markdown 的文档网站

下面这套方案适合搭建一个类似 CodexGuide 的文档站：先完成一次项目初始化、导航和部署配置，后续日常维护时只需要新增或修改 `docs` 目录里的 Markdown 文件。

## 目标效果

- 使用 VuePress 2 搭建静态文档网站。
- 使用 vuepress-theme-hope 提供导航、侧边栏、搜索、代码复制、SEO、站点地图等能力。
- 内容全部写在 Markdown 文件中。
- 本地可以实时预览。
- 提交到 GitHub 后可以自动部署到 Vercel、Render、Netlify 或 Cloudflare Pages。

## 1. 准备环境

建议使用 Node.js 22 和 pnpm。

```bash
node -v
pnpm -v
```

如果没有安装 pnpm：

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
```

## 2. 创建项目

新建项目目录：

```bash
mkdir my-doc-site
cd my-doc-site
pnpm init
```

安装 VuePress 和主题依赖：

```bash
pnpm add -D vuepress@2.0.0-rc.28 @vuepress/bundler-vite@2.0.0-rc.28 vue vuepress-theme-hope sass-embedded
pnpm add -D @vuepress/plugin-slimsearch @vuepress/plugin-feed
```

## 3. 配置 package.json

打开 `package.json`，建议整理成下面这种结构：

```json
{
  "name": "my-doc-site",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22 <25"
  },
  "scripts": {
    "dev": "vuepress dev docs --host 0.0.0.0",
    "build": "vuepress build docs",
    "preview": "vuepress dev docs --host 0.0.0.0"
  },
  "packageManager": "pnpm@10.33.0"
}
```

保留你安装依赖后自动生成的 `devDependencies` 即可，不要手动删掉。

## 4. 创建基础目录

推荐目录结构：

```text
my-doc-site
├─ docs
│  ├─ .vuepress
│  │  ├─ config.ts
│  │  ├─ theme.ts
│  │  ├─ navbar.ts
│  │  ├─ sidebar.ts
│  │  └─ public
│  │     ├─ logo.svg
│  │     └─ robots.txt
│  ├─ index.md
│  ├─ guide
│  │  ├─ index.md
│  │  └─ first-page.md
│  └─ notes
│     ├─ index.md
│     └─ example.md
├─ package.json
└─ pnpm-lock.yaml
```

创建目录：

```bash
mkdir -p docs/.vuepress/public docs/guide docs/notes
```

Windows PowerShell 可以用：

```powershell
New-Item -ItemType Directory -Force docs\.vuepress\public, docs\guide, docs\notes
```

## 5. 创建 VuePress 配置

创建 `docs/.vuepress/config.ts`：

```ts
import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  dest: "docs/.vuepress/dist",
  lang: "zh-CN",
  title: "我的文档站",
  description: "一个用 Markdown 维护的知识文档网站。",

  head: [
    ["meta", { name: "robots", content: "all" }],
    ["meta", { name: "author", content: "你的名字" }],
    ["meta", { property: "og:site_name", content: "我的文档站" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "我的文档站" }],
    ["meta", { property: "og:description", content: "一个用 Markdown 维护的知识文档网站。" }],
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }]
  ],

  bundler: viteBundler(),
  theme,

  pagePatterns: ["**/*.md", "!.vuepress", "!node_modules"],
  shouldPrefetch: false,
  shouldPreload: false
});
```

创建 `docs/.vuepress/theme.ts`：

```ts
import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://example.com/",
  logo: "/logo.svg",
  favicon: "/logo.svg",

  author: {
    name: "你的名字",
    url: "https://github.com/your-name"
  },

  navbar,
  sidebar,

  print: false,
  pure: true,
  breadcrumb: true,
  displayFooter: true,
  footer: "Copyright © 2026 你的名字",
  pageInfo: ["Author", "Date", "Word", "ReadingTime"],

  blog: false,

  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    gfm: true,
    mark: true,
    tasklist: true,
    tabs: true
  },

  plugins: {
    copyCode: true,
    feed: {
      atom: true,
      json: true,
      rss: true
    },
    sitemap: {
      hostname: "https://example.com/"
    },
    slimsearch: {
      maxSuggestions: 10,
      locales: {
        "/": {
          placeholder: "搜索文档"
        }
      }
    }
  }
});
```

## 6. 配置导航栏和侧边栏

创建 `docs/.vuepress/navbar.ts`：

```ts
import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "首页", icon: "home", link: "/" },
  { text: "指南", icon: "book", link: "/guide/" },
  { text: "笔记", icon: "note", link: "/notes/" }
]);
```

创建 `docs/.vuepress/sidebar.ts`：

```ts
import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/guide/": [
    {
      text: "指南",
      icon: "book",
      prefix: "/guide/",
      children: ["index.md", "first-page.md"]
    }
  ],

  "/notes/": [
    {
      text: "笔记",
      icon: "note",
      prefix: "/notes/",
      children: ["index.md", "example.md"]
    }
  ],

  "/": [
    {
      text: "首页",
      icon: "home",
      children: ["/guide/", "/notes/"]
    }
  ]
});
```

以后新增 Markdown 页面时，如果希望它出现在侧边栏，就把文件名加入对应 `children` 数组。

## 7. 编写首页和示例文章

创建 `docs/index.md`：

```md
---
home: true
title: 首页
heroText: 我的文档站
tagline: 用 Markdown 持续维护你的知识库、教程和项目文档。
actions:
  - text: 开始阅读
    link: /guide/
    type: primary
  - text: 查看笔记
    link: /notes/
    type: secondary
features:
  - title: 只写 Markdown
    details: 日常维护时只需要新增或修改 docs 目录里的 Markdown 文件。
  - title: 自动生成网站
    details: VuePress 会把 Markdown 编译成可部署的静态网页。
  - title: 适合长期沉淀
    details: 可以用于教程、知识库、团队手册、产品文档和项目说明。
---
```

创建 `docs/guide/index.md`：

```md
# 指南

这里放系统化教程。

- [第一篇文章](./first-page.md)
```

创建 `docs/guide/first-page.md`：

```md
# 第一篇文章

这是第一篇示例文档。

## 你可以写什么

- 教程
- 操作步骤
- 项目说明
- 常见问题
- 团队规范
```

创建 `docs/notes/index.md`：

```md
# 笔记

这里放碎片化笔记。

- [示例笔记](./example.md)
```

创建 `docs/notes/example.md`：

```md
# 示例笔记

这是一篇普通 Markdown 笔记。
```

## 8. 本地预览

安装依赖：

```bash
pnpm install
```

启动开发服务：

```bash
pnpm dev
```

打开浏览器访问终端提示的地址，通常是：

```text
http://localhost:8080/
```

以后写文档时保持开发服务运行，修改 Markdown 后页面会自动刷新。

## 9. 日常更新流程

后续你只需要做这几件事：

1. 在 `docs` 下新增或修改 Markdown 文件。
2. 如果新增页面需要出现在导航栏，修改 `docs/.vuepress/navbar.ts`。
3. 如果新增页面需要出现在侧边栏，修改 `docs/.vuepress/sidebar.ts`。
4. 本地运行 `pnpm dev` 预览。
5. 确认无误后提交到 GitHub。
6. 线上平台自动重新部署。

推荐每个栏目一个目录，例如：

```text
docs
├─ guide
├─ notes
├─ faq
├─ changelog
└─ reference
```

这样后续维护会比较清晰。

## 10. 构建静态站点

上线前可以本地构建一次：

```bash
pnpm build
```

构建成功后，静态文件会出现在：

```text
docs/.vuepress/dist
```

这个目录就是部署平台需要发布的目录。

## 11. 部署到 Vercel

在项目根目录创建 `vercel.json`：

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build",
  "outputDirectory": "docs/.vuepress/dist",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

部署步骤：

1. 把项目推送到 GitHub。
2. 打开 Vercel，选择 Add New Project。
3. 导入你的 GitHub 仓库。
4. 确认构建配置：

```text
Install Command: pnpm install --frozen-lockfile
Build Command: pnpm build
Output Directory: docs/.vuepress/dist
Node.js Version: 22.x
```

5. 点击 Deploy。
6. 绑定自定义域名时，把 `theme.ts` 里的 `hostname` 和 `config.ts` 里的站点 URL 改成你的域名。

## 12. 部署到 Render

如果你想用 Render，可以创建 Static Site：

```text
Environment: Static Site
Build Command: pnpm install --frozen-lockfile && pnpm build
Publish Directory: docs/.vuepress/dist
Node Version: 22
```

如果 Render 需要指定 Node 版本，可以在项目根目录添加 `.node-version`：

```text
22
```

或添加 `.nvmrc`：

```text
22
```

部署流程：

1. 把项目推送到 GitHub。
2. 打开 Render Dashboard。
3. New > Static Site。
4. 选择你的 GitHub 仓库。
5. 填写构建命令和发布目录。
6. 点击 Create Static Site。

以后每次 push 到 GitHub，Render 会自动构建并发布。

## 13. 部署到 Netlify 或 Cloudflare Pages

通用配置如下：

```text
Build Command: pnpm build
Publish Directory: docs/.vuepress/dist
Node Version: 22
```

如果平台没有自动安装 pnpm，可以把构建命令改为：

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm build
```

## 14. 图片和静态资源怎么放

公共资源放到：

```text
docs/.vuepress/public
```

例如：

```text
docs/.vuepress/public/images/demo.png
```

Markdown 中这样引用：

```md
![示例图片](/images/demo.png)
```

普通文章里的局部图片也可以和 Markdown 放在同一个目录，但长期维护更推荐统一放到 `public/images`。

## 15. Markdown 写作模板

建议每篇文章都采用固定结构：

```md
---
title: 文章标题
date: 2026-05-27
category:
  - 指南
tag:
  - VuePress
  - 文档站
---

# 文章标题

一句话说明这篇文章解决什么问题。

## 适用场景

说明谁适合读、什么时候用。

## 操作步骤

1. 第一步。
2. 第二步。
3. 第三步。

## 常见问题

### 问题一

回答。

## 小结

总结最重要的结论。
```

## 16. 推荐维护习惯

- 文件名使用英文小写和短横线，例如 `first-page.md`。
- 每个栏目保留一个 `index.md` 作为入口页。
- 图片文件名也使用英文小写，避免中文路径导致部署或引用问题。
- 每次新增文章后，记得检查侧边栏是否需要更新。
- 每次上线前运行一次 `pnpm build`。
- 站点域名变更后，记得同步修改 `theme.ts` 的 `hostname`。

## 17. 最小上线清单

上线前确认这些文件已经存在：

```text
package.json
pnpm-lock.yaml
docs/index.md
docs/.vuepress/config.ts
docs/.vuepress/theme.ts
docs/.vuepress/navbar.ts
docs/.vuepress/sidebar.ts
```

确认这些命令可以运行：

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

确认部署平台配置：

```text
Build Command: pnpm build
Publish Directory: docs/.vuepress/dist
Node Version: 22
```

完成这些以后，你就拥有了一个可以长期维护的文档网站。日常更新时，只需要持续编写和调整 `docs` 目录里的 Markdown 文件。
