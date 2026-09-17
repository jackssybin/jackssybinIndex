# system-design-notes 三端推广教程 — 发布结果

- 项目：https://github.com/liquidslr/system-design-notes
- 仓库定性：Alex Xu《System Design Interview》卷一+卷二读书笔记；20,056 star / 3,765 fork（GitHub API，2026-09-17 核查）
- slug：`system-design-notes-alex-xu-interview-guide`

## 一手核查证据（本地克隆逐目录统计，非 README 宣传）

- 28 章 = 卷一 Ch1–16 + 卷二 Ch17–28，全部为 README.md，合计 52,492 英文词。
- 392 张 PNG（最多一章消息队列 35 张；S3 23、交易所 24）；0 行可运行代码（无任何源码文件）。
- GitHub API：`license = null`，README 首行注明基于付费书。
- 章节篇幅 527–4254 词（唯一 ID 生成器最短，消息队列最长）。
- Ch2 延迟表标题为 `Latency (2020)`（L1 0.5ns / 内存 100ns / SSD 150µs / HDD 10ms / 机房内 500µs / 跨地域 150ms）；可用性两个九到六个九年停机表。
- 每章统一四步骨架：Step1 理解问题/估算（Ch28：10亿单/6.5h≈4.3万 QPS、峰值21.5万、99.99%）→ Step2 HLD 先对齐 → Step3 深拆（交易所单线程撮合事件循环、事件溯源）→ Step4 总结。
- Ch6 KV 17 图 1676 词：一致性哈希/gossip/向量时钟/Merkle tree/quorum/sloppy quorum。
- 最新提交 2026-08-12；作者另有 pagefy.io 在线版。
- 配图：自绘中文图 6 张（2 封面 + 4 正文）全部经视觉 QA 无乱码/溢出；repo 原始英文证据图 5 张拷入（token-bucket、KV final、MQ HLD、交易所 HLD、hash-ring，正文用 3 张）。

## 三端结果

### 网站（Hugo，已 push）
- `content/articles/2026/09/17/system-design-notes-alex-xu-interview-guide.md`（正文 3068 中文字，8 张正文图）
- URL：https://jackssybin.cn/articles/2026/09/17/system-design-notes-alex-xu-interview-guide/
- Hugo 验证：`hugo --destination /tmp/hugo-build-sdn --minify --cleanDestinationDir` exit 0，HTML 与 8 张图片均正常产出（初版 date 20:30 是未来时间被静默跳过，改为 07:30 后通过）。
- commit ecad40a 已 push origin/main（含 static/images 11 张、gen_images.py、website.md、media/）。

### 微信公众号（草稿）
- media_id：`snS2bupQYF7HgHImnpl8sbwLGH1ARtMxq00F2MTkfjrk1skp-DOleN8F5ARE_ozp`
- 主题：newsroom；正文 2028 中文字（深度稿达标）、8 图；封面 cover-wechat.jpg 1280×544。
- frontmatter source_url 已落为「阅读原文」→ GitHub（set-digest 复核保留）。
- 独立摘要已设置：「Alex Xu系统设计面试开源笔记核查：28章5.2万词392张架构图，四步推演法、三周复习路线与无License/零代码/2020数据三个边界」。
- 相关阅读：1 条真链接（「别再到处找 AI 赚钱项目了…5 个 GitHub 仓库」/s/GrcxJAVwfslAuzkB1Du_sA）；系统设计主题无存量真链，其余用纯文字合集引导（无手写 URL）。
- 文末按 jk 偏好放了裸 GitHub URL（非 Markdown 超链），建稿未触发 45166。
- payload 校验 validate-payload.mjs：0 建议项通过。

### 知乎专栏（草稿）
- draft id：2083834140147855503
- URL：https://zhuanlan.zhihu.com/p/2083834140147855503
- 编辑：https://zhuanlan.zhihu.com/p/2083834140147855503/edit
- 模式：column + --markdown-file + --upload-images；6 张本地图全部转 zhimg CDN，payload 中本地路径残留 0。
- 封面用 cover-zhihu.png 1600×900（与微信封面不同模板）。

## 三标题候选（不同钩子族）

1. （选用·量化核查）2 万 star、392 张图、0 行代码：我逐章核查了 Alex Xu《系统设计面试》最火的开源笔记，告诉你该怎么用
2. （人群点名）准备系统设计面试的后端都该看看：这个 2 万 star 仓库把 28 道题拆成了同一套四步法
3. （反常识）别再背答案了：这个 0 行代码的 GitHub 仓库，才是系统设计面试最该刷的资料

## 待办/说明

- 临时克隆 /root/work/.cache/system-design-notes 可保留作复核，无需清理（在 work 缓存区）。
- 三端均为草稿/网站已发布（jk 偏好：网站直接 push；微信、知乎草稿箱待人工群发）。
