# Publish Results — LingtiStudio 三端推广教程

**Slug**: `lingtistudio-ai-video-production-pipeline`
**Published**: 2026-07-12 22:50 CST
**Repo**: `github.com/ruilisi/LingtiStudio` (166★, MIT)

---

## 一、Website (Hugo · jackssybin.cn) ✅

- **File**: `content/articles/2026/07/12/lingtistudio-ai-video-production-pipeline.md`
- **Cover**: `/images/lingtistudio-ai-video-production-pipeline/cover-zhihu.png`
- **Git**: pushed to `main`, commit `601cef8`
- **URL**: https://jackssybin.cn/articles/2026/07/12/lingtistudio-ai-video-production-pipeline/
- **Verify**: HTTP 200 confirmed (curl x3), title contains "试过 Sora 和剪映 AI 之后，我用这个开源项目把「AI 视频」跑成了真流水线"，body contains "LingtiStudio" ×8
- **Build**: `pnpm build` OK, 493 pages, no errors

---

## 二、微信公众号草稿 ✅

- **File**: `content-ops/lingtistudio-ai-video-production-pipeline/wechat-upload.md`
- **Theme**: `newsroom`
- **Code highlight**: `github`
- **Cover**: `media/cover-wechat.jpg` (1200×630, JPG q=92, 97 KB)
- **Body images**: 3 张（01-pipeline.png / 02-review-gate.png / 03-comparison.png）
- **Media ID**: `snS2bupQYF7HgH***` (redacted)
- **Verified**: `manage_draft.js list` 头条草稿标题匹配 "试过 Sora 和剪映 AI 之后..."
- **后台**: https://mp.weixin.qq.com/ → 素材管理 → 图文素材

---

## 三、知乎专栏草稿 ✅（正文图全部走 Mode B 上传）

- **File**: `content-ops/lingtistudio-ai-video-production-pipeline/zhihu-upload.md`
- **Draft ID**: `2059771219407328586`
- **Draft URL**: https://zhuanlan.zhihu.com/p/2059771219407328586
- **Edit URL**: https://zhuanlan.zhihu.com/p/2059771219407328586/edit
- **上传模式**: Mode B (`--markdown-file --upload-images`)
- **正文图片**: 3 张全部上传到 `*.zhimg.com` CDN
  - 01-pipeline.png → `https://pica.zhimg.com/v2-93efbb7314bf9e673c6b9902f2ed8331.png`
  - 02-review-gate.png → `https://picx.zhimg.com/v2-27b82121f94283356957fb15a000a432.png`
  - 03-comparison.png → `https://picx.zhimg.com/v2-82a954658f876342b4160d011d8cc92c.png`
- **验证**: `<img>` × 3 in response body, `zhimg.com` × 3, `raw.githubusercontent|cdn.jsdelivr` × 0（外链剥离检查通过）
- **state**: `draft`（未发布）

### 知乎封面（需手动关联，30 秒）

- 编辑链接：https://zhuanlan.zhihu.com/p/2059771219407328586/edit
- 本地封面：`content-ops/lingtistudio-ai-video-production-pipeline/media/cover-zhihu.png` (1600×900)
- 上传封面到知乎 CDN 的独立 API 已验证返回 422（同 `references/zhihu-image-silent-stripping.md` 记录的限制）
- 操作：打开编辑链接 → 点"添加封面" → 上传本地文件 `media/cover-zhihu.png` → 保存

---

## 四、Content Package

```
content-ops/lingtistudio-ai-video-production-pipeline/
├── titles.md                  # 5+ 候选标题 + 最终选定
├── website.md                 # Hugo 站点文章副本
├── wechat.md                  # 微信原稿
├── wechat-upload.md           # 微信上传格式（YAML frontmatter）
├── zhihu.md                   # 知乎原稿
├── zhihu-upload.md            # 知乎 Mode B 上传源
├── publish-results.md         # 本文件
├── gen_images.py              # PIL 生图脚本
├── media/                     # 8 张图（3 张 diagrams + 3 张 screenshots + 2 张 covers）
│   ├── 01-pipeline.png
│   ├── 02-review-gate.png
│   ├── 03-comparison.png
│   ├── cover-wechat.jpg
│   ├── cover-zhihu.png
│   ├── screenshot-home.png
│   ├── screenshot-workspace.png
│   └── screenshot-output.png
└── .zhihu-cache/              # payload/response JSON
```

Static site images: `static/images/lingtistudio-ai-video-production-pipeline/` (8 files)

---

## 五、Topic Triage 结果

- **Q1 落差**：✅ 是 — vs Sora / 剪映 AI / 手工 ComfyUI 拼装，LingtiStudio 用"8 步 gate + 剪映草稿闭环"做出明确差异化
- **Q2 热度**：⚠️ 弱 — 166 stars，2026-04-07 创建，3 个月不算爆款；有官方 B 站演示视频加分
- **Q3 演示**：✅ 是 — Docker Compose 一键 + `cli/main.py script` 不花钱先看结构，5 分钟走通
- **判定**：三端全发。有中文文档、剪映生态、AI 视频强需求，值得发。

---

## 六、Remaining Manual Steps（用户端 30 秒）

1. 打开 https://zhuanlan.zhihu.com/p/2059771219407328586/edit
2. 点击"添加封面" → 上传本地文件 `content-ops/lingtistudio-ai-video-production-pipeline/media/cover-zhihu.png`
3. 保存
4. 可选：决定微信 / 知乎草稿是否点击"发送 / 发布"（当前均为草稿状态）
