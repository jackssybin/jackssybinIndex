# DSH-Creator（Jacky Creator）三端推广发布结果

- 项目：https://github.com/Jackywxsz/DSH-Creator
- 版本：v0.1.0-beta.8（MIT，品牌资产另有授权边界）
- slug：`dsh-creator-local-content-cockpit-deep-dive`
- 日期：2026-09-16

## 标题候选（3 选 1）

1. 人群点名（选用·网站/微信）：别再让 AI 待在聊天框里：这个开源插件把文件夹变成了创作工作台
2. 结果量化（网站长标题）：AI 内容创作的另一条路：我跑了 DSH-Creator 的 351 个测试，看它怎么把整条视频流水线装进本地文件夹
3. 悬念提问（知乎选用）：AI 内容工具都在做云平台，这个开源插件为什么坚持把内容留在本地文件夹？

## 硬证据（源码实测）

- Linux 环境 clone + `pnpm install --frozen-lockfile`（39.2s）+ `pnpm test`：**56 个测试文件 / 351 个用例全部通过（Vitest 4.1.10，31.71s）**。
- src 约 17,318 行 TS/TSX；14 个 `jacky_creator_*` 工具；运行时依赖仅 zod。
- 工程洞察：文件系统为唯一真相源（docs/files.md）；写操作一律先预览后确认；`capabilities.ts` ready/missing/unsupported 三态不伪造安装入口；`collectCache.ts` 90s 缓存（90_000ms）；长任务异步、以文件落盘为准。
- 未验证项（已在文中标注）：macOS + DSH Desktop 2.0.2 GUI 内的 Screen Studio/Ego Browser/字幕烧录链路未实机跑（本机为 Linux）。

## 网站（Hugo）

- 文章：`content/articles/2026/09/16/dsh-creator-local-content-cockpit-deep-dive.md`
- URL：https://jackssybin.cn/articles/2026/09/16/dsh-creator-local-content-cockpit-deep-dive/
- 构建：`hugo --destination /tmp/hugo-test-dsh2 --minify --cleanDestinationDir` exit 0，index.html 存在（注意：date 最初写成未来时间 17:30 被静默跳过，已改 17:00）。
- commit `15e34ce`，已 push origin/main（含 static/images 6 张、content-ops 素材包）。

## 微信公众号草稿

- Media ID：`snS2bupQYF7HgHImnpl8sVhGmyuNfw01Zl5qqx_qp2z6LQ7sfuhyACDHzJ-IeMic`
- 主题：newsroom；正文中文约 2000 字；正文图 4 张 + 封面（共 5 图）。
- frontmatter：title / cover（绝对路径）/ source_url=https://github.com/Jackywxsz/DSH-Creator（阅读原文已落库并经 set-digest 复核保留）。
- 文末 GitHub 裸链 1 条（正文超链接，非 `<a>` 标签）；建稿未触发 45166。
- 相关阅读 2 条（脚本从内链库挑选，均为已群发真链）：
  - DeepSeek 官方 22 份接入指南
  - Claude Code 换成开源终端编码 Agent
- digest 已独立设置（set-digest.js，附 --cover 与 --source-url 防回写清空）。
- 校验：validate-payload.mjs 通过，0 建议项。

## 知乎专栏草稿

- 草稿 ID：`2083604391215510257`
- URL：https://zhuanlan.zhihu.com/p/2083604391215510257
- 编辑：https://zhuanlan.zhihu.com/p/2083604391215510257/edit
- 模式：column + `--markdown-file` + `--upload-images`；正文 4 张图全部上传知乎 CDN（uploaded=true ×4）。
- 缓存记录：`/root/.hermes/cache/zhihu_column_draft_20260916_171315_*`。

## 素材

- 封面：微信 1280×544（亮色·文件夹契约）、知乎 1600×900（暗色·云 vs 本地对比），两版不同。
- 正文图：文件夹契约、14 工具人机边界、351 测试终端实测、内容生命周期闭环。
- 生成脚本：`content-ops/<slug>/gen_images.py`（Pillow，Noto CJK）。
