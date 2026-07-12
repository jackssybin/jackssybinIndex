# Publish Results — lapian-notes AI 拉片工具

**Slug:** `lapian-notes-ai-film-study-tool`
**Date:** 2026-07-12
**Source:** https://github.com/bkingfilm/lapian-notes (270 stars, 34 forks, MIT)

---

## 1. Website (jackssybin.cn) ✅

- **Article path:** `content/articles/2026/07/12/lapian-notes-ai-film-study-tool.md`
- **Draft copy:** `content-ops/lapian-notes-ai-film-study-tool/website.md`
- **Public URL:** https://jackssybin.cn/articles/2026/07/12/lapian-notes-ai-film-study-tool/
- **HTTP check:** `200` (verified via curl, 2026-07-12)
- **Commit:** `89b0ca1` — `post: lapian-notes AI film study tool tutorial (2026-07-12)`
- **Build:** `pnpm build` → 491 pages / 57 non-page / 5042ms — no errors
- **Images copied to:** `static/images/lapian-notes-ai-film-study-tool/` (6 files)

---

## 2. WeChat 微信公众号 ✅

- **Draft file:** `content-ops/lapian-notes-ai-film-study-tool/wechat-upload.md`
- **Title:** 折腾了两晚 Excel 和逐帧截图后，我用这个开源工具把一部电影拉片做完了
- **Theme:** `newsroom`
- **Code highlight:** `github`
- **Cover:** `media/cover-wechat.jpg` (1200×630, JPEG, 129KB) — 未用 PNG，避免 40113
- **Body images:** 3（01-workflow / 02-ai-package / 03-comparison）
- **Media ID:** `snS2bupQYF7HgH***` (masked)
- **Backend:** https://mp.weixin.qq.com/ 草稿箱可查
- **Pre-flight grep:** 无 `raw.githubusercontent / cdn.jsdelivr / i.imgur / user-images.githubusercontent`（通过）

---

## 3. Zhihu 知乎专栏 ✅（封面需手动关联）

- **Draft file:** `content-ops/lapian-notes-ai-film-study-tool/zhihu-upload.md`
- **Title:** 拉片笔记（lapian-notes）值得用吗？我的判断：适合系统学结构的创作者，不适合快剪解说号
- **Draft ID:** `2059565167160070874`
- **Draft URL:** https://zhuanlan.zhihu.com/p/2059565167160070874
- **Edit link:** https://zhuanlan.zhihu.com/p/2059565167160070874/edit
- **Upload mode:** Mode B (`--markdown-file --upload-images`)
- **Uploaded images:** 3 / 3
- **Embedded images:** 3 / 3（picx.zhimg.com × 2 + pic1.zhimg.com × 1）
- **Payload checks:**
  - `has_frontmatter`: ❌（clean）
  - `has_raw_heading`: false positive（bash `# 浏览器打开 ...` 在 `<pre><code>` 内，非 Markdown 标题）
  - `has_md_img`: ❌（无 `![](...)`）
  - `has_local_path`: ❌（无 `/root/...`）
  - `has_h1/h2`: ✅
  - `has_pre_code`: ✅
  - `has_p`: ✅
- **Pre-flight grep:** 无外链图片域（通过）

### 知乎封面（需手动关联，30 秒）

- **编辑链接：** https://zhuanlan.zhihu.com/p/2059565167160070874/edit
- **封面 CDN URL：** https://picx.zhimg.com/v2-444c91e0bdd218fa05f3eb3720432e66.png（暂无独立 cover 上传响应，可用 01-workflow 或直接上传本地封面）
- **本地封面路径：** `/root/workspace/jackssybinIndex/content-ops/lapian-notes-ai-film-study-tool/media/cover-zhihu.png`（1600×900，99KB）
- **操作：** 打开编辑链接 → 点"添加封面" → 上传 `cover-zhihu.png` → 保存

原因：知乎 API 的 `title_image` PATCH 静默失效，`image_url` 字段返回空。这是已知限制，见 `references/zhihu-image-silent-stripping.md`。

---

## 4. Validation Summary

| 项目 | 结果 |
|---|---|
| 网站 HTTP 200 | ✅ |
| 网站正文含关键词（lapian-notes） | ✅ |
| 微信草稿上传成功 | ✅ |
| 微信 grep 外链图 | ✅ 无 |
| 知乎草稿创建成功 | ✅ |
| 知乎图片全 zhimg.com | ✅（3/3） |
| 知乎正文无 frontmatter/本地路径 | ✅ |
| 知乎封面 image_url 非空 | ❌（需手动，见上方指引） |

## 5. Assets

- `media/cover-wechat.jpg` — 1200×630（微信封面）
- `media/cover-zhihu.png` — 1600×900（网站/知乎封面）
- `media/01-workflow.png` — 拉片四步工作流
- `media/02-ai-package.png` — AI 分析包 ZIP 结构
- `media/03-comparison.png` — Excel/StudioBinder/Notion+AI/拉片笔记 四方案对比
- `media/screenshot-fullview.jpg` — README 官方截图（1600×2133）

## 6. Notes

- 三端稿件均已用不同结构改写：website（完整结构 + 5 段流程）/ wechat（个人故事开头 + 短段落 + 情绪）/ zhihu（TL;DR 结论前置 + 分场景判断表 + 架构决策深挖）
- 避开影片版权：标题及正文关键处用"一部电影"或加了"《寄生虫》举例"限定，未把版权片名进 SEO 关键词
- 图片文字全部人工 QA 通过（vision_analyze × 5，二次修复了"系统学结构"漏字和 badge 冲突）
