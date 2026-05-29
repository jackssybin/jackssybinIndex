# 我把一个老 Solo/Bolo 博客迁成了 VuePress 静态站：完整迁移手册

先说背景：我手上有一个运行多年的个人博客 `jackssybin.cn`，原来是 Solo/Bolo 系统，通过 Tomcat 部署，数据在 MySQL 里。后来我希望把它迁成一个更轻、更容易维护的静态站：文章继续保留，旧链接尽量不失效，样式尽量接近原站，但不再依赖 Tomcat、后台和数据库服务。

这篇文章记录的是一次完整迁移过程。不是泛泛而谈“把博客迁到静态站”，而是把一个真实的 Solo/Bolo 项目拆开，迁移到 VuePress 2 + vuepress-theme-hope，并保留原站文章、标签、归档、友情链接、RSS 和旧评论归档。

最后得到的效果大概是这样：

1. 原数据库备份 `bolo_260527.sql` 作为内容来源；
2. 原 Tomcat 项目 `ROOT/` 作为样式和静态资源来源；
3. 新项目用 VuePress 构建；
4. 构建产物是纯静态文件，可部署到 Vercel、Render、Netlify、Cloudflare Pages 等平台；
5. 原文章链接，例如 `/articles/2019/07/31/1564568923421.html`，尽量保持可访问。

下面按实际迁移顺序展开。

---

## 一、为什么不继续部署 Solo/Bolo？

Solo/Bolo 本身是一个完整博客系统，有后台、评论、皮肤、插件和动态渲染能力。问题是，对于一个长期沉淀型的个人技术博客来说，它的运行成本有点高：

- 需要维护 Tomcat 或 Java Web 容器；
- 需要维护 MySQL；
- 需要关心后台安全、登录、评论提交和运行时依赖；
- 迁移部署时不仅要搬代码，还要搬数据库和运行环境；
- 长期只读内容越来越多，动态能力反而没那么重要。

而静态站的优势很直接：

- 构建一次，发布一批 HTML/CSS/JS 文件；
- 部署平台选择多；
- 没有后台攻击面；
- 内容可以版本化；
- 后续写文章只需要维护 Markdown 或迁移脚本。

所以这次迁移的目标不是“重装 Solo”，而是把老博客内容迁到一个静态站里。

---

## 二、迁移前要准备什么？

我手上有两类文件：

```text
blog_change/
├─ bolo_260527.sql
├─ zeroStep.md
└─ ROOT/
```

它们分别承担不同角色。

### 1. `bolo_260527.sql`

这是 Solo/Bolo 的 MySQL 数据库备份，是文章、评论、标签、配置、友情链接的主要来源。

核心表包括：

```text
b3_solo_article          文章
b3_solo_comment          评论
b3_solo_tag              标签
b3_solo_tag_article      标签与文章关系
b3_solo_link             友情链接
b3_solo_page             自定义页面导航
b3_solo_option           站点配置
b3_solo_user             用户信息
```

实际导入后，我检查到的数据量是：

```text
124 篇文章
103 篇已发布文章
12 条评论
157 个标签
2 个自定义页面
3 个友情链接
```

迁移时只导出 `articleStatus = 0` 的已发布文章。

### 2. `ROOT/`

这是原 Tomcat 部署项目。它里面有后台、JAR、FreeMarker 模板、皮肤和静态资源。

这次并不迁移整个 Tomcat 项目，只取里面的皮肤和资源：

```text
ROOT/skins/bolo-9IPHP/
├─ css/base.css
├─ css/fonts/
├─ header.ftl
├─ article.ftl
├─ article-list.ftl
├─ side.ftl
├─ archives.ftl
├─ tags.ftl
└─ footer.ftl
```

这些文件的价值是：它们能告诉我们原站的 HTML 结构和视觉风格。

比如原站首页是典型的：

- 顶部深灰横幅；
- 博客名 + 副标题；
- 横向导航；
- 主内容文章列表；
- 右侧标签、统计、评论最多、访问最多模块；
- 文章卡片有标题、时间、标签和“阅读全文”。

### 3. `zeroStep.md`

这是新站搭建说明，目标技术栈是：

```text
VuePress 2
vuepress-theme-hope
Markdown 内容
静态部署
```

也就是说，新站不是继续跑 Java Web，而是改成 VuePress 静态站。

---

## 三、初始化 VuePress 项目

项目根目录新建 `package.json`：

```json
{
  "name": "jackssybin-static-blog",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22 <25"
  },
  "scripts": {
    "migrate": "node scripts/migrate-from-bolo.mjs",
    "dev": "vuepress dev docs --host 0.0.0.0",
    "build": "vuepress build docs",
    "preview": "vuepress dev docs --host 0.0.0.0"
  },
  "dependencies": {
    "@vuepress/bundler-vite": "2.0.0-rc.30",
    "markdown-it": "^14.1.0",
    "mysql2": "^3.15.3",
    "vue": "^3.5.24",
    "vuepress": "2.0.0-rc.30",
    "vuepress-theme-hope": "2.0.0-rc.107"
  },
  "devDependencies": {
    "sass-embedded": "^1.93.3"
  },
  "packageManager": "pnpm@10.33.0"
}
```

安装依赖：

```powershell
pnpm install
```

VuePress 配置放在：

```text
docs/.vuepress/config.ts
docs/.vuepress/theme.ts
docs/.vuepress/client.ts
docs/.vuepress/styles/index.scss
```

这里有一个关键选择：**禁用 VuePress 默认文档站样式，把页面主体交给迁移后的 Solo 风格 HTML。**

`theme.ts` 中关闭默认 navbar/sidebar/pageInfo：

```ts
import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
  hostname: "https://jackssybin.cn/",
  logo: "/images/logo.png",
  favicon: "/images/favicon.png",
  navbar: false,
  sidebar: false,
  breadcrumb: false,
  pageInfo: false,
  contributors: false,
  editLink: false,
  lastUpdated: false,
  print: false,
  pure: true,
  displayFooter: false,
  plugins: {
    copyCode: true,
    slimsearch: false
  }
});
```

这样 VuePress 负责构建、路由和静态输出，页面视觉由我们自己控制。

---

## 四、导入原博客数据库

我的本地 MySQL 连接是：

```text
host: localhost
port: 3306
user: root
password: root-1234
database: bolo_migration
```

建议不要直接覆盖已有的 `bolo` 库，而是新建一个迁移专用库：

```powershell
mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 -e "DROP DATABASE IF EXISTS bolo_migration; CREATE DATABASE bolo_migration DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"
```

导入备份：

```powershell
mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 bolo_migration -e "source D:/code/ai_codex_project/blog_change/bolo_260527.sql"
```

检查数据：

```powershell
mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 -D bolo_migration -e "SELECT COUNT(*) articles, SUM(articleStatus=0) published FROM b3_solo_article; SELECT COUNT(*) comments FROM b3_solo_comment;"
```

输出应类似：

```text
articles  published
124       103

comments
12
```

> 一个小坑：我一开始尝试直接从 SQL dump 手写解析 INSERT 语句，但历史文章里有大量代码块、反斜杠、引号和 HTML，解析很容易误判字段边界。更稳的方式是先导入 MySQL，再用 SQL 查询导出结构化数据。

---

## 五、迁移脚本怎么设计？

核心脚本是：

```text
scripts/migrate-from-bolo.mjs
```

它做几件事：

1. 连接 MySQL；
2. 查询文章、评论、标签、页面、友链、站点配置；
3. 用 `markdown-it` 把文章 Markdown 转成 HTML；
4. 按原 Solo 模板结构生成首页、文章页、标签页、归档页、友链页；
5. 保留原文章 permalink；
6. 生成 RSS；
7. 写出迁移摘要。

数据库连接默认值：

```js
const dbConfig = {
  host: process.env.BOLO_DB_HOST || "127.0.0.1",
  port: Number(process.env.BOLO_DB_PORT || 3306),
  user: process.env.BOLO_DB_USER || "root",
  password: process.env.BOLO_DB_PASSWORD || "root-1234",
  database: process.env.BOLO_DB_NAME || "bolo_migration",
  charset: "utf8mb4"
};
```

这样如果换环境，不需要改代码，直接用环境变量覆盖：

```powershell
$env:BOLO_DB_NAME="your_database"
pnpm migrate
```

---

## 六、为什么不用“纯 Markdown 页面”？

这是迁移过程中最容易踩坑的地方。

理论上，可以把每篇文章转成 `.md`，交给 VuePress 渲染。但实际老博客内容里经常有：

- 原始 HTML；
- `<kbd>`、`<span style="">` 等内联标签；
- 不规范的代码块；
- 旧编辑器产生的特殊字符；
- 评论中的图片和表情语法；
- 文章摘要中的 HTML 片段。

VuePress 会把 Markdown 里的原始 HTML 当 Vue 模板编译。这样一来，只要历史文章里出现 Vue 不认可的 HTML，就会构建失败。

我遇到过类似错误：

```text
Duplicate attribute.
SyntaxError: Duplicate attribute.
```

解决方案是：**不要让历史 HTML 直接进入 Vue 模板编译链路。**

最终设计是：

1. 迁移脚本把每个页面完整 HTML 放到 `page-data.ts`；
2. Markdown 页面只挂一个组件；
3. 组件通过 `v-html` 渲染迁移后的 HTML。

组件大概是这样：

```vue
<script setup lang="ts">
import { computed } from "vue";
import { pages } from "../page-data.js";

const props = defineProps<{
  id: string;
}>();

const html = computed(() => pages[props.id] || "");
</script>

<template>
  <div class="solo-static" v-html="html" />
</template>
```

生成出来的 Markdown 页面非常薄：

```md
---
title: "文章标题"
permalink: "/articles/2019/07/31/1564568923421.html"
---

<SoloPage id="p42" />
```

这个方案的好处是：

- VuePress 仍然负责构建和路由；
- 老文章 HTML 不会被 Vue 模板编译器误伤；
- 原 Solo/Bolo 的页面结构更容易保留；
- 构建稳定性更好。

---

## 七、保留原站样式

原皮肤资源来自：

```text
ROOT/skins/bolo-9IPHP/css/base.css
ROOT/skins/bolo-9IPHP/css/fonts/*
ROOT/images/*
```

迁移到：

```text
docs/.vuepress/public/assets/solo-base.css
docs/.vuepress/public/assets/fonts/
docs/.vuepress/public/images/
```

在 VuePress 配置里引入：

```ts
head: [
  ["link", { rel: "stylesheet", href: "/assets/solo-base.css" }],
  ["link", { rel: "stylesheet", href: "/assets/site.css" }]
]
```

不过只引入原 CSS 还不够，因为 VuePress Hope 主题有自己的容器、暗色模式和页面样式。需要额外写一层覆盖：

```scss
html,
html[data-theme="dark"],
body,
#app,
.theme-container {
  color: #333 !important;
  background: #fff !important;
  color-scheme: light !important;
}

.vp-page-title,
.vp-breadcrumb,
.vp-page-meta,
.vp-toc,
.vp-sidebar,
.vp-navbar,
.vp-footer-wrapper {
  display: none !important;
}
```

同时补充移动端样式：

```scss
@media (max-width: 760px) {
  .solo-static .wrapper {
    min-width: 0;
    width: 94%;
  }

  .solo-static .main-wrap {
    display: block;
  }

  .solo-static aside {
    margin-top: 18px;
    min-width: 0;
    width: auto;
  }
}
```

迁移老站时，不要只在桌面端看首页。技术博客里代码块很多，移动端最容易出问题的是：

- 代码块横向溢出；
- 导航挤在一起；
- 右侧栏没有下沉；
- 标题和 meta 信息换行不自然。

---

## 八、生成哪些页面？

最终生成的页面包括：

```text
/                                  首页
/page/2.html                       首页分页
/articles/yyyy/mm/dd/id.html       文章页
/my-github-repos                   自定义页面
/tags.html                         标签墙
/tags/<tag>                        标签文章列表
/archives.html                     归档页
/archives/yyyy/mm                  月份归档
/links.html                        友情链接
/rss.xml                           RSS
```

首页分页大小来自 Solo 配置：

```text
articleListDisplayCount = 20
```

文章页保留：

- 标题；
- 创建时间；
- 更新时间；
- 正文；
- 标签；
- 上一篇/下一篇；
- 旧评论归档。

评论迁移为只读归档展示，不提供新评论提交，也不继续展示评论数或浏览数。这一点很重要，因为静态站没有后端，不能直接复刻 Solo 的动态统计和评论能力。

---

## 九、执行迁移

生成内容：

```powershell
pnpm migrate
```

成功后会看到：

```text
Generated 103 articles, 12 comments, 150 used tags, 3 links.
```

迁移摘要写入：

```text
docs/.vuepress/public/migration-summary.json
```

内容类似：

```json
{
  "articles": 103,
  "publishedArticles": 103,
  "comments": 12,
  "tags": 157,
  "usedTags": 150,
  "pages": 2,
  "links": 3
}
```

---

## 十、本地预览和构建

本地启动：

```powershell
pnpm dev --port 8080
```

访问：

```text
http://localhost:8080/
```

重点检查这些路径：

```text
/
/articles/2025/07/16/1752652246705.html
/articles/2019/07/31/1564568923421.html
/my-github-repos
/tags.html
/archives.html
/links.html
/rss.xml
```

构建：

```powershell
pnpm build
```

输出目录：

```text
docs/.vuepress/dist
```

构建时可能会看到类似 warning：

```text
INVALID_ANNOTATION
Some chunks are larger than 1024 kB
```

这类 warning 来自依赖打包过程，不影响最终构建成功。

---

## 十一、部署方式

如果部署平台支持 Node 22 和 pnpm，配置很简单：

```text
Build Command: pnpm build
Publish Directory: docs/.vuepress/dist
Node.js Version: 22
```

如果部署环境没有提前生成内容，可以改成：

```text
pnpm install --frozen-lockfile && pnpm migrate && pnpm build
```

不过这里要注意：如果部署平台要执行 `pnpm migrate`，它必须能访问 MySQL。多数静态托管平台并不适合在构建时连你的本地数据库。

更稳的做法是：

1. 本地执行 `pnpm migrate`；
2. 提交生成后的 `docs` 内容；
3. 线上只执行 `pnpm build`。

或者把 SQL 备份和导入过程也放进 CI，但这就属于另一个工程化问题了。

---

## 十二、这次迁移踩过的坑

### 1. 不要直接相信手写 SQL dump 解析

MySQL dump 里文章正文可能有大量代码：

```text
反斜杠
单引号
双引号
HTML 标签
多行字符串
特殊 Unicode 字符
```

手写解析很容易把正文里的逗号或括号误判成字段分隔符。

我的建议是：**能导入 MySQL，就先导入 MySQL。**

### 2. 注意数据库编码

导入时加：

```text
--default-character-set=utf8mb4
```

数据库也用：

```sql
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
```

否则中文、表情、特殊符号很容易出问题。

### 3. VuePress 不适合直接编译所有历史 HTML

老博客内容不是干净的 Vue 模板。把历史 HTML 放到 `v-html` 渲染，是这次迁移稳定构建的关键。

### 4. 样式不要只搬 CSS

原 CSS 是给 Solo 模板写的，VuePress 外面还有一层主题容器。要补覆盖样式，否则会出现：

- 背景色不对；
- 默认标题露出来；
- 页面左右边距不对；
- 暗色模式影响原皮肤；
- 移动端布局不符合预期。

### 5. 旧链接优先级很高

个人博客迁移最容易损失的是搜索引擎和外链。

所以文章页尽量保持原来的：

```text
/articles/yyyy/mm/dd/id.html
```

像 `/my-github-repos` 这种自定义页面，也应该保留。

---

## 十三、最终项目结构

迁移后的项目结构大致是：

```text
.
├─ bolo_260527.sql
├─ ROOT/
├─ README.md
├─ package.json
├─ scripts/
│  └─ migrate-from-bolo.mjs
└─ docs/
   ├─ .vuepress/
   │  ├─ config.ts
   │  ├─ theme.ts
   │  ├─ client.ts
   │  ├─ components/
   │  │  └─ SoloPage.vue
   │  ├─ styles/
   │  │  └─ index.scss
   │  ├─ page-data.ts
   │  └─ public/
   ├─ index.md
   ├─ articles/
   ├─ tags/
   └─ archives/
```

日常维护主要用三个命令：

```powershell
pnpm migrate
pnpm dev --port 8080
pnpm build
```

---

## 总结一下

这次迁移的核心不是“换一个前端框架”，而是把一个动态博客系统拆成三部分：

1. **内容层**：从 MySQL 读取文章、评论、标签、友链；
2. **展示层**：复刻 Solo/Bolo 的页面结构和皮肤样式；
3. **发布层**：交给 VuePress 构建成静态站。

我觉得老博客迁移最值得坚持的几个原则是：

- 内容不要丢；
- 旧链接尽量不变；
- 不要把历史 HTML 强行洗成完美 Markdown；
- 不迁移不需要的动态能力；
- 构建流程要能重复执行。

如果你的博客也是 Solo、Bolo、WordPress、Typecho 这类老系统，迁移到静态站时可以参考这个思路：先把数据库当作唯一真实来源，再把旧主题当作视觉参考，最后用静态站生成器承接发布。

这比“重写一个博客”更稳，也更适合保存多年积累下来的内容。

---
