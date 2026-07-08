# Publish Results — agency-agents-238-specialist-installer

**Slug**: `agency-agents-238-specialist-installer`
**Date**: 2026-07-08
**Topic**: msitarzewski/agency-agents — 238 个 AI 专家、17 个 division、双脚本一次装完，Hermes 走懒加载 router
**Source repo**: https://github.com/msitarzewski/agency-agents

---

## 1. Website / Blog ✅

- **Site repo**: `/root/workspace/jackssybinIndex` (Hugo)
- **Article path**: `content/articles/2026/07/08/agency-agents-238-specialist-installer.md`
- **Public URL**: https://jackssybin.cn/articles/2026/07/08/agency-agents-238-specialist-installer/
- **Commits**:
  - `e4478ed` — post: agency-agents 238 specialist installer tutorial (2026-07-08)
  - `b8caec3` — fix: set article date to 10:00 to avoid Hugo future-date filter
- **HEAD SHA on origin/main**: `b8caec3`
- **Verification**: HTTP 200, 37 KB, body contains `NEXUS` / `238 个` / project keywords. 站点的 `<title>` 是模板级站点标题（Hugo 主题行为），文章 H1 与正文正常渲染。
- **Static assets pushed**: `static/images/agency-agents-238-specialist-installer/*.{jpg,png}` × 5

## 2. WeChat 公众号草稿 ✅

- **Upload script**: `wechat-toolkit/scripts/publisher/publish.js`
- **Source**: `content-ops/agency-agents-238-specialist-installer/wechat-upload.md`
- **Title**: `238 个 AI 专家、15 个工具，一个仓库一次装完`
- **Author**: jk
- **Theme**: newsroom
- **Code highlight**: github
- **Cover**: `media/cover-wechat.jpg` (1080×864 JPG, 77 KB)
- **Body images**: 3 (01-divisions-map / 02-two-scripts-flow / 03-hermes-router)
- **Draft status**: 发布成功
- **Media ID (masked)**: `snS2buXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXvQEu`
- **Check draft at**: https://mp.weixin.qq.com/ → 草稿箱

## 3. Zhihu 专栏草稿 ✅

- **Upload script**: `zhihu-answer-workflow/scripts/zhihu_draft.py column`
- **Source HTML**: `content-ops/agency-agents-238-specialist-installer/zhihu-compact.html` (11,136 chars)
- **Title**: `Agency Agents 教程：一个仓库把 238 个 AI 专家装进 Claude Code / Cursor / Codex / Hermes`
- **Draft ID**: `2058171433407230557`
- **Draft URL**: https://zhuanlan.zhihu.com/p/2058171433407230557
- **Edit URL**: https://zhuanlan.zhihu.com/p/2058171433407230557/edit
- **State**: draft
- **Uploaded images**: 0 (使用公网 URL 直接嵌入，`https://jackssybin.cn/images/agency-agents-238-specialist-installer/*.png`)
- **Embedded images**: 3

### Zhihu payload / source-leak checkpoint

| 检查项 | 结果 |
| --- | --- |
| No YAML frontmatter (`--- title/cover ---`) | ✅ has_frontmatter: False |
| No raw Markdown heading (`# 标题`) | ✅ has_md_heading: False |
| No Markdown image syntax `![](...)` | ✅ has_md_img: False |
| No local filesystem paths (`/root/...`) | ✅ has_local_path: False |
| `<h1>` present | ✅ True |
| `<p>` present | ✅ True |
| `<pre>` present (代码块保留) | ✅ True |
| `<img>` count | 3 |
| Total content length | 11,136 chars |

## 4. 图片资源

5 张图，双写策略（`content-ops/<slug>/media/` + `static/images/<slug>/`），全部 CJK 渲染 QA 通过：

| 文件 | 规格 | 大小 | 用途 |
| --- | --- | --- | --- |
| cover-wechat.jpg | 1080×864 JPG | 77 KB | 微信封面 |
| cover-zhihu.png | 1600×900 PNG | 53 KB | 知乎封面（此稿未上传，仅 Website 使用） |
| 01-divisions-map.png | 1400×880 PNG | 82 KB | 17 division / 238 agent 分布 |
| 02-two-scripts-flow.png | 1400×780 PNG | 96 KB | convert.sh + install.sh 双段流水 |
| 03-hermes-router.png | 1400×760 PNG | 100 KB | Hermes 懒加载 router 四工具 |

### QA 记录

- 首轮 03-hermes-router.png 检测出英文断词（`div/ision`、`del/egate_task`）。
- Patch `gen_images.py`：把 tool 描述改成显式两行元组（`(name, line1, line2, color)`），关闭自动 wrap。
- 重新生成 + vision_analyze：四个 tool box 干净两行，`query/division/metadata/body/prompt/Hermes/delegate_task` 全部完整。

## 5. Skipped / Failed Steps

无。三端全部完成。

## 6. 内容口径

- **Website**: 长版本，完整脚本示例、frontmatter 展示、五段激活 prompt、Hermes 懒加载 router 对比 skill 直塞的取舍分析。
- **WeChat（238 个 AI 专家、15 个工具，一个仓库一次装完）**: 移动阅读节奏，短段落 + 强开头 + 明确"能拿走什么"清单。
- **Zhihu（Agency Agents 教程：一个仓库把 238 个 AI 专家装进 Claude Code / Cursor / Codex / Hermes）**: 论证优先，旧认知（每个工具单独写 prompt）→ 新认知（源 agent + 双脚本 + Hermes router），克制不 CTA。

## 7. Follow-ups（可选）

- 微信后台预览 draft 后决定推送时间和分组。
- 知乎草稿在编辑器里做一次视觉预览，如果封面图需要显式设置，去 `zhuanlan.zhihu.com/p/2058171433407230557/edit` 手动加。
- 站点搜索 / 首页数据（若由 `scripts/sync-site.mjs` 生成）已随 push 一起触发 CI 部署。
