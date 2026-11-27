# jackssybin.cn Hugo 静态博客

这是 `jackssybin.cn` 的长期维护版本。项目根目录现在就是 Hugo 站点根目录，后续只使用 Hugo 更新和维护。

## 目录说明

- `content`：文章、教程、专题页、导航页等 Markdown 内容。
- `layouts`：Hugo 模板。
- `static`：图片、样式、导航图标、搜索索引和人工维护的 `llms.txt` 等静态资源。
- `data`：首页、专题和本地图片真实尺寸等模板数据。
- `scripts`：新文章、教程导入、Hugo 数据同步和 SEO/月度可见度脚本。
- `deploy`：服务器部署相关配置示例。
- `seo-state/visibility`：人工搜索/AI 引用观察示例和月度记录规范，不保存原始访问日志。
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

构建后可运行以下回归：

```bash
python scripts/seo-check/check-build.py public
python scripts/seo-check/simulate-nginx.py public
python scripts/seo-check/check-slug-redirects.py
python -m unittest scripts/seo-check/test-monthly-visibility-report.py
```

检查覆盖 canonical、日期、面包屑、FAQ、作者实体、统一标题、RSS、Sitemap、llms 规范链接、图片本地化样本，以及 HowTo/ItemList 与可见内容的一致性。`check-slug-redirects.py` 默认请求生产站；新增映射未部署前应使用 `simulate-nginx.py` 做本地验收，不能把生产尚未发布误判为源码回归。

## 月度可见度

`monthly-visibility-report.py` 只读解析 Nginx combined 访问日志（含 `.gz`），按 URL、状态码和 Bot 类型输出月度聚合，并以 `logCoverage` 记录逐文件覆盖范围；可通过 `--observations` 合并人工搜索平台与真实 AI 引用记录。完整命令和字段说明见 `seo-state/visibility/README.md`，首期双站基线见 `seo-state/visibility/2026-11/README.md`。报表不输出 IP、Cookie、Referer、查询参数或原始日志行，爬虫请求也不等于收录、点击或 AI 引用。

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

当前包含 `mysql`、`springboot4`、`netty`、`linux`。

只有正文确实包含连续操作步骤时，才在教程 frontmatter 添加 `howTo`。`layouts/partials/tutorial-howto.html` 用同一份步骤数据显示可见概览，`layouts/partials/json-ld.html` 输出对应 HowTo；`anchor` 必须指向正文真实标题锚点。普通说明文和目录页不要添加该字段。

## 部署

GitHub Actions 使用 `.github/workflows/deploy-to-server.yml` 构建并部署：

1. 安装 Node、pnpm、Hugo Extended。
2. 执行 `pnpm install --frozen-lockfile`。
3. 执行 `pnpm sync:hugo`。
4. 执行 `hugo --destination public --minify --cleanDestinationDir`。
5. 将 `public/` 同步到服务器站点目录。

服务器 Nginx 配置示例在 `deploy/nginx-jackssybin.conf`。

## 维护原则

- Markdown 原文以 `content` 为准。
- 不直接修改 `public`，它是构建产物。
- 不提交 `node_modules`、`public`、`resources`。
- 新文章优先补充 `description`、`tags`、`topic`、`topicSlug`，并用 `keyPoints` 写 2–4 条真实要点；`keyFacts` 和 `faq` 只在有可核验内容时填写。
- 页面有真实代表图时，在 frontmatter 填写 `images` 并确保图片在正文可见；模板会输出绝对 URL 的 Article、OG 和 Twitter 图片字段，不为消除工具提示编造图片。
- 非首页 title、OG 和 Twitter 标题统一追加 `｜日拱一卒`；`static/llms.txt` 只维护 10–30 个高价值无参数规范入口，新增重要页面时人工复核。
- 外链图片只在授权与来源明确后逐步本地化；真实尺寸登记到 `data/image-dimensions.json`，来源和校验和记录到对应图片目录，不批量下载权利不明素材。
- 修改内容后运行 `pnpm build` 验证。
