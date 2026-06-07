# jackssybin.cn Hugo 静态博客

这是 `jackssybin.cn` 的长期维护版本。项目根目录现在就是 Hugo 站点根目录，后续只使用 Hugo 更新和维护。

## 目录说明

- `content`：文章、教程、专题页、导航页等 Markdown 内容。
- `layouts`：Hugo 模板。
- `static`：图片、样式、导航图标、搜索索引、实时新闻 JSON 等静态资源。
- `data`：首页、专题、实时新闻等模板数据。
- `scripts`：新文章、实时新闻、教程导入、Hugo 数据同步脚本。
- `deploy`：服务器部署相关配置示例。
- `public`：Hugo 构建产物，本地生成，不提交仓库。
- `node_modules`：本地依赖目录，可随时删除，通过 `pnpm install` 恢复。

## 本地使用

```bash
pnpm install
pnpm dev
```

默认访问：

```text
http://127.0.0.1:1313/
```

构建静态站：

```bash
pnpm build
```

构建产物位于 `public/`。

## 发布新文章

```bash
pnpm new-post "文章标题"
```

文章会生成到：

```text
content/articles/yyyy/mm/dd/slug.md
```

写完后执行：

```bash
pnpm sync:hugo
pnpm build
```

新文章会进入首页、归档、标签、专题、搜索索引和 RSS。

## 教程维护

教程统一放在：

```text
content/tutorials/
```

当前包含 `mysql`、`springboot4`、`netty`。

## 实时新闻

抓取实时新闻：

```bash
pnpm fetch-hot-news
```

生成位置：

```text
static/hot-news.json
data/hot-news.json
```

完整更新流程：

```bash
pnpm update-content
```

## 部署

GitHub Actions 使用 `.github/workflows/deploy-to-server.yml` 构建并部署：

1. 安装 Node、pnpm、Hugo Extended。
2. 执行 `pnpm install --frozen-lockfile`。
3. 抓取实时新闻。
4. 执行 `pnpm sync:hugo`。
5. 执行 `hugo --destination public --minify --cleanDestinationDir`。
6. 将 `public/` 同步到服务器站点目录。

服务器 Nginx 配置示例在 `deploy/nginx-jackssybin.conf`。

## 维护原则

- Markdown 原文以 `content` 为准。
- 不直接修改 `public`，它是构建产物。
- 不提交 `node_modules`、`public`、`resources`。
- 新文章优先补充 `description`、`tags`、`topic`、`topicSlug`。
- 修改内容后运行 `pnpm build` 验证。
