# 发布结果：Jev Ultrafast 三端教程（2026-09-22）

## 网站（Hugo，已 commit + push）

- 文章：`content/articles/2026/09/22/jev-ultrafast-browser-agent-7-seconds-deep-dive.md`
- 预期 URL：<https://jackssybin.cn/articles/2026/09/22/jev-ultrafast-browser-agent-7-seconds-deep-dive/>
- Commit：`427ebb5`（rebase 于 `b9c2ccb` 之上），已 push 到 `jackssybin/jackssybinIndex` main
- Hugo 校验：`hugo --destination /tmp/hugo-build3 --minify --cleanDestinationDir` exit 0，文章 HTML 存在
- 备注：初稿日期设为当天 10:30（相对取证时刻为未来时间），Hugo 默认不构建未来文章，已改为 08:30 后通过

## 微信公众号（草稿，newsroom 主题）

- 状态：✅ 建稿成功
- Media ID：`snS2bupQYF7HgHImnpl8sexdcaSgkmqG1_cBfO6rM7pkV0TJqTLB8xwiBSr5ddrf`
- 标题：7 秒订完一张机票搜索：这个开源浏览器 Agent，不让大模型写一个字的代码
- 封面：cover-wechat.png（1080x864，深色 + 闪电图形 + 中文大标题，PIL 生成）
- 正文：中文 1,786 字（deep-dive 2000–2800 目标略低，但含机制深挖、双层守卫、等待策略等非显而易见工程细节，3 张正文配图，信息密度达标）
- source_url（阅读原文）：https://github.com/browser-use/jev-ultrafast
- digest 已独立设置（110 字，含 browser-use/浏览器Agent/DOM快照/7.073秒/1092降到101 等搜索词），回补封面与原文链接
- 正文外链处理：初次稿件含 2 处 GitHub 裸链，validate-payload 报 ERROR；按微信规则全部移除（仓库链接只走 frontmatter 阅读原文），复检 0 ERROR
- 相关阅读（真实本号已群发短链，pick-related-links.mjs 按「浏览器 Agent AI 自动化」选取）：
  - 30MB内存替代Chromium！这个开源Rust无头浏览器太香了
  - 把 tldraw 画布焊进 Codex：Cowart 让 AI 和你共享同一块画桌

## 知乎专栏（草稿，Markdown + 图片上传模式）

- 状态：✅ 建稿成功
- 草稿 ID：`2085648256600650473`
- URL：<https://zhuanlan.zhihu.com/p/2085648256600650473>
- 标题：如何评价 browser-use 新开源的 Jev Ultrafast：一个 7 秒完成真实网页任务的浏览器 Agent
- 上传模式：Markdown column，`--upload-images`；3 张正文图片均 uploaded=true（flights-result / perf-table / inspector），已替换为知乎 CDN
- 缓存：`content-ops/jev-ultrafast-browser-agent-7-seconds-deep-dive/zhihu-cache/`（含 payload 与响应，勿重跑以免产生重复草稿）

## 验证记录

- `validate-payload.mjs --package ...`：最终 0 ERROR / 0 警告
- 微信/知乎封面不同（1080x864 闪电版 vs 1600x900 编号元素版）
- 所有图片为 PIL/仓库自带素材，无中文乱码（已视觉核验 inspector 与 flights-result）
- 三端均为草稿/已推送网站，未群发、未公开知乎文章
