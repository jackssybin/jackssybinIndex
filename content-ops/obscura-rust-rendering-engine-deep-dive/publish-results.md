# Obscura 自研渲染引擎深拆 · 三端发布结果

- 项目：https://github.com/h4ckf0r0day/obscura
- 版本：发行二进制 0.2.2（workspace 包 0.1.0，Apache-2.0）
- slug：`obscura-rust-rendering-engine-deep-dive`
- 日期：2026-09-16

## 与存量文章的差异化

本站 2026-09-04 已发《Obscura：Rust 写的轻量级无头浏览器》（功能速览/参数表）。本篇不重复功能清单，聚焦：**自研渲染引擎的架构正确性与一手实测**——九 crate 分层、7.3 万行渲染层、render-repros 66 个像素级 CSS 对拍夹具、实跑 0.2.2 的真实耗时/内存/SSRF/截图保真。

## 硬证据（本机一手实测，Linux x86_64 发行二进制，无 Chrome/Node 依赖）

- `obscura --version` → 0.2.2。
- HN 执行 JS 数标题（`.titleline>a` 返回 30）：含冷启动墙钟 **0.152s**；example.com 取 title 0.176s。
- `/usr/bin/time -v` 最大驻留内存 **40,052 KB（约 39MB）**（README 标称 30MB，实测略高，文中如实标注）。
- `--dump markdown/links/assets` 正常；`scrape` 3 URL 默认 10 并发 1296ms。
- SSRF：抓 127.0.0.1 默认被拒（需 `--allow-private-network`）。
- 非隐身版 `navigator.webdriver=false`；自研引擎截 HN 全页 PNG 经视觉检查布局正确。
- 维基百科直连被机房限流（Too Many Requests）——判定为数据中心 IP 风控，与引擎无关，文中说明需代理。
- 代码：九 crate 约 15.3 万行 Rust（obscura-render 72,915 / obscura-js 30,101 / obscura-cdp 19,103）；66 个 render-repros HTML 夹具 + checks.json 几何断言；外部 obscura-benchmark 33 关障碍赛道。
- 工程洞察：真 V8（deno_core）+ 自研 HTML/CSS/布局/绘制（html5ever/Taffy/tiny-skia/ab_glyph/cosmic-text）；retained layout；单 V8 isolate + 全局 tokio Mutex，多 worker 进程并行；V8 看门狗独立线程强杀、catch_unwind 防 panic 穿 FFI、DOM 拒绝成环。

## 三端结果

### 网站（Hugo）
- `content/articles/2026/09/16/obscura-rust-rendering-engine-deep-dive.md`
- URL：https://jackssybin.cn/articles/2026/09/16/obscura-rust-rendering-engine-deep-dive/
- `hugo --destination /tmp/hugo-obscura2 --minify --cleanDestinationDir` exit 0。
- commits：`10cd803`（文章+素材包）、后续补 static HN 截图，均已 push origin/main。

### 微信公众号草稿
- Media ID：`snS2bupQYF7HgHImnpl8sWrpgWxEvrIxH-oicUFuJl6Po1blI1G8DX87yRZPJsHp`
- 主题 newsroom；正文中文约 2000 字；正文图 4 张 + 封面（5 图，含真实 HN 截图）。
- source_url=https://github.com/h4ckf0r0day/obscura（阅读原文已落库，set-digest 复核保留）。
- 文末 GitHub 裸链（非 a 标签），未触发 45166。
- 相关阅读 2 条（内链库真链）：9/4 同项目轻量介绍（形成系列互链）、DeepSeek 22 份接入指南。
- digest 已独立设置（含 --cover / --source-url）。
- validate-payload.mjs：通过，0 建议项。

### 知乎专栏草稿
- 草稿 ID：`2083673029209482583`
- URL：https://zhuanlan.zhihu.com/p/2083673029209482583
- 编辑：https://zhuanlan.zhihu.com/p/2083673029209482583/edit
- 模式 column + markdown + `--upload-images`；4 张图全部上传知乎 CDN（uploaded=true ×4）。
- 缓存：/root/.hermes/cache/zhihu_column_draft_20260916_*

## 素材
- 封面：微信 1280×544 暗色 Rust 风、知乎 1600×900 亮色「Blink vs Obscura 轮子」对比，两版不同。
- 正文图：九 crate 架构、66 对拍夹具体系、本机实测终端、Obscura 实截 HN 全页图。
- 生成脚本：content-ops/<slug>/gen_images.py；真实截图来自 0.2.2 二进制实跑（hn-obscura-shot.png / example-obscura-shot.png）。
