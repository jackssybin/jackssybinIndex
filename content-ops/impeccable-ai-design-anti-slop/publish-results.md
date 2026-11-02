# Impeccable 三端推广 — 发布结果

项目：https://github.com/pbakaus/impeccable
数据基准：2026-11-01（GitHub API：99,438 Star / 5,881 Fork / 61 open issues）
建仓 2025-11-16（约 1 年），Apache-2.0，作者 Paul Bakaus（jQuery UI 之父）；脱胎于 Anthropic 官方 frontend-design skill
npm v4.8.0 / 检测引擎 v0.1.18（ENGINE_VERSION），Rust 核心约 25.96 万行、430 个 .rs；24 命令、62 条确定性检测规则；官网 impeccable.style

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/11/01/impeccable-ai-design-anti-slop.md`
- URL：https://jackssybin.cn/articles/2026/11/01/impeccable-ai-design-anti-slop/
- 正文图 3：commands / rules / detector；封面 cover.png；本地 hugo exit 0；已推送（commit 6ae221b）

## 2. 微信公众号草稿

- 标题：《9.9 万人给 AI 程序员配了个「设计总监」：专治一眼假的 AI 味界面》
- newsroom；draft media_id：`snS2bupQYF7HgHImnpl8sd-_Rvotq6oi0wy_-bFdtNZIR8bOT896qcsoDXAM66Rw`
- 封面：**cover-ip.jpg（1280×544 IP 双翼，深墨蓝 ink + 生气表情 + 暖橙，verify_wings rc=0 + vision）**；combo-history 已记录
  - **本次起封面改为自动随机选定，不再询问用户**（用户 2026-11-01 明确："不用我每次都选择，自行随机给一个"）。3 候选 c1冷白喜爱/c2墨蓝生气/c3暖橙得意，random 选到 c2
- 三必查：正文图 3、文末 jk 引流+阅读原文(→GitHub)+相关阅读 2（开源终端编码 Agent、DeepSeek 22 份指南）
- 独立 digest 116 字（143/125 两版仍偏长，第三版 ≤120 errcode 0）
- 状态：草稿未群发

## 3. 知乎专栏草稿

- 标题：《实跑62条规则：这个9.9万Star的项目，想在提交前消灭AI味界面》
- URL：https://zhuanlan.zhihu.com/p/2100544316372533545 （+/edit）
- compact HTML：图 3（content_image=3）+ pre 5，无 `<table>`，ul/ol 配平；源码向深稿（实跑 --list-rules 拿全 62 规则 id）
- CDN：commands pic1…44cc / rules picx…4a45 / detector picx…b456
- 标题封面 title_image 平台限制，需编辑器手动选 cover-zhihu.png（1600×900）
- 临时图片草稿（zhihu-cache，仅3图）需后台删除
- 状态：草稿未发布

## 4. 配图（刻意反 slop）

- 采用项目自身 neo-kinpaku 品牌语言（暖黑漆底+金箔+铜绿+朱，Noto Serif CJK 标题），不用它批评的紫渐变
- rules 图首版左卡第 8 行被卡缝裁（vision 抓出），合并末项+卡片增高 310→330+画布 840→880 修复复检
- 4 图全部 vision 复检通过；npx detect --list-rules 真实执行确认恰好 62 条规则（含 advisory）

## 5. 事实/合规

- Apache-2.0；规则数 62、命令 24（craft 弃用别名）、引擎/包双版本号均来自仓库实跑与 ENGINE_VERSION/package.json
- 检测器无 LLM/Key；遥测边界（方向目录请求照发、只匿名记录所选方向）如实写
- 边界：最擅长改已有界面、规则是强信号非真理(需ignores白名单)、20种工具接入深度不一；99K 是一年积累非一夜爆火，未夸大
