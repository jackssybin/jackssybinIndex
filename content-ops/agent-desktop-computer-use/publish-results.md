# agent-desktop 三端推广 — 发布结果

项目：https://github.com/vercel-labs/agent-desktop
数据基准：2026-11-05（GitHub API：15,585 Star / 1,083 Fork / 166 open issues）
Vercel Labs 出品，2026-02-19 建仓（约 8.5 个月），Apache-2.0，Rust 约 35.1 万行/2628 个 .rs；定位 Computer Use CLI：读系统无障碍树（macOS AX / Windows UIA / Linux AT-SPI）输出带 ref 的 JSON，内部无模型
npm 月下载约 3.15 万（api.npmjs.org 实测 2026-10-05~11-03）；最新 1.2.0（2026-11-05，新增 mcp 子命令）；envelope v2.6、C ABI v7；60 命令名/56 操作命令

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/11/05/agent-desktop-computer-use.md`
- URL：https://jackssybin.cn/articles/2026/11/05/agent-desktop-computer-use/
- 正文图 3：loop / usage / arch；本地 hugo exit 0；已推送（commit a0faead）

## 2. 微信公众号草稿

- 标题：《Vercel 开源 1.5 万 Star：AI 不用截图、不看像素，也能操作你的电脑》
- newsroom；draft media_id：`snS2bupQYF7HgHImnpl8sRAzNdm3DmiBJulnVFmnG4FHvhIDeEk9vOAMEzPHeCpN`
- 封面：**cover-ip.jpg（1280×544 IP 双翼，米黄渐变 cream-grad + 大笑表情 + 暖橙，verify_wings rc=0 + vision）**；random 在 c1/c2/c3 中自动选 c1（上一篇 charles 是纯黑 c3，自动错开），已记 combo-history
- 三必查：正文图 3、文末 jk 引流+阅读原文(→GitHub)+相关阅读 2（开源终端编码 Agent、Rust 无头浏览器）
- digest 112 字 errcode 0（首版 134 字超限，精简后 OK）
- 状态：草稿未群发

## 3. 知乎专栏草稿

- 标题：《读了Vercel的1.5万Star新项目：不靠截图的Computer Use，工程设计比概念更值得看》
- **正式稿 URL：https://zhuanlan.zhihu.com/p/2101675203713679501 （+/edit）**
- compact HTML：图 3（content_image=3）+ pre 1（bash 最小循环），ul/ol 配平，无 `<table>`
- CDN：loop pic1…3d11 / usage pic1…e4db / arch pic1…ba50
- ⚠️ **作废草稿**：https://zhuanlan.zhihu.com/p/2101674949194925890 —— 首版 zhihu.md 只插了 USAGE 一张图（LOOP/ARCH 漏插），已补图重发正式稿；**请在知乎后台删除该 1 图旧稿**
- 另有 zhihu-cache 临时图片上传草稿需后台清理
- 标题封面需编辑器手动选 cover-zhihu.png（平台限制）
- 状态：草稿未发布

## 4. 配图

- 黑白极简 Vercel 调性（近黑底+白/蓝+三平台色 mac绿/win蓝/linux琥珀），4 图全部 vision 一次通过，无返工
- gen_images.py 在 content-ops/agent-desktop-computer-use/

## 5. 事实/合规

- Apache-2.0；数据全部来自 GitHub/npm API 与仓库 README/CONCEPTS/CHANGELOG
- 核心机制均有据：ref 快照限定、STALE_REF/AMBIGUOUS_TARGET、句柄+进程代际身份、证据三态 Known/Absent/Unknown、Web wrapper 透明折叠（Windows 验 Chromium 来源）、key-down 等 4 命令默认拒绝、--stdin 密钥管道、retry=safe 纪律
- 局限如实写：能力上限取决于 App 无障碍实现（游戏/Canvas/自绘 UI 读不到，与截图派互补）、无模型需自配 Agent、1.1 有 ABI breaking change、166 issues
- 隐私警告（快照/剪贴板/截图可能含敏感数据、勿入公开日志）按 README 原文强调
