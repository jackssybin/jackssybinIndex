# Publish Results — ai-job-search 三端推广

**发布日期**：2026-07-08
**源仓库**：https://github.com/MadsLorentzen/ai-job-search
**slug**：`ai-job-search-claude-code-career-workbench`
**内容目录**：`content-ops/ai-job-search-claude-code-career-workbench/`

## 三端交付状态

| 渠道 | 状态 | 链接 / 标识 |
|------|------|-------------|
| 🌐 网站（jackssybin.cn） | ✅ Live | https://jackssybin.cn/articles/2026/07/08/ai-job-search-claude-code-career-workbench/ |
| 💬 微信草稿箱 | ✅ 已上传 | Media ID: `snS2bupQYF7HgHImnpl8sTjRi_dJg79N-mPmZ7FLXyO9ZpL2Ji4I3ZLtC7UmCJmX` |
| 📝 知乎专栏草稿 | ✅ 已上传 | https://zhuanlan.zhihu.com/p/2058276663943813028 |

网站发布验证：正文含 24× `ai-job-search`、17× `drafter-reviewer`、11× `MadsLorentzen`、10× `双 agent`、7× `9 个 slash`、5× `pdftotext`。

## 核心叙事

标题定位：**「把 Claude Code 变成 drafter-reviewer 求职工作台」**——不是又一个 AI 简历工具，而是围绕 Claude Code 搭起的多命令 + 单档案求职工作台。

三大叙事支柱：
1. **9 个 slash 命令流水线**：主流程 `/setup /scrape /rank /apply /outcome` + 辅助 `/expand /upskill /add-template /add-portal` + `/reset`
2. **drafter-reviewer 双 agent 分离**：reviewer 从**空 context** 独立起、草稿内联传递、Part A JSON edits + Part B 叙述反馈
3. **PDF 视觉 + ATS 文本层双重验证循环**：lualatex/xelatex 编译 → 读渲染 PDF 检查孤行/字体回退 → pdftotext 抽文本层校对邮箱/关键词

## 5 张配图（QA 通过）

- `cover-wechat.jpg` 1080×864 — 微信封面，headline + 3 张数字卡片
- `cover-zhihu.png` 1600×900 — 知乎封面，5 个技术 pill
- `01-pipeline.png` 1400×780 — 5 步流水线 + 4 个辅助命令
- `02-drafter-reviewer.png` 1400×820 — drafter/reviewer 双列结构 + 两条箭头
- `03-pdf-ats-loop.png` 1400×780 — 5 阶段流水线 + 反馈闭环 + 3 个失败模式

所有图片双写：
- 内容目录：`content-ops/ai-job-search-claude-code-career-workbench/media/`
- 静态目录：`static/images/ai-job-search-claude-code-career-workbench/`

## 已交付文件

```
content-ops/ai-job-search-claude-code-career-workbench/
├── gen_images.py               (14.5 KB) PIL 图片生成脚本
├── build_zhihu_html.py         (5.4 KB)  Markdown → 知乎紧凑 HTML
├── website.md                  (18.6 KB) 网站版正文（带 frontmatter）
├── wechat.md                   (8.2 KB)  微信版正文
├── wechat-upload.md            (8.2 KB)  微信上传副本
├── zhihu.md                    (12.6 KB) 知乎版 Markdown 原稿
├── zhihu-compact.html          (9.1 KB)  知乎草稿实际提交的紧凑 HTML
├── publish-results.md          (本文件)
└── media/                      5 张图片
```

网站发布路径：`content/articles/2026/07/08/ai-job-search-claude-code-career-workbench.md`

## 关键决策与陷阱

1. **`date` 字段用 10:00+08:00**：吸取上次 agency-agents 教训，avoid future-date 过滤器。本次直接设 `13:00+08:00`（当时是 19:40+08:00，早于此），过滤器通过、正文正常渲染。
2. **微信 frontmatter 用绝对本地路径**：`cover: /root/workspace/.../cover-wechat.jpg`，publisher 直接读文件上传。
3. **知乎 HTML 用公网绝对 URL**：`SITE_BASE = https://jackssybin.cn/images/ai-job-search-claude-code-career-workbench`，图片能被知乎渲染。
4. **02-drafter-reviewer.png 首次生成有排版重叠 bug**：tag 与描述文字用 center anchor 导致 Step/Task 编号被吞。改成 `anchor="lm"` 左对齐分列后 QA 通过。
5. **build_zhihu_html.py 复用**：从 agency-agents 版直接 cp，只改 `SITE_BASE` 和 hardcoded H1 标题。

## Git 提交

```
12bd420 post: ai-job-search claude code career workbench tutorial (2026-07-08)
```

推送到 `origin/main`，Hugo 站点约 2 分钟内完成重建。
