# 如何评价不用 Chromium 的 Rust 无头浏览器 Obscura？我读了 15 万行代码并实测了渲染

「无头浏览器」长期约等于「无头 Chromium」。Puppeteer、Playwright 不管 API 包得多漂亮，底层都是一个完整的浏览器内核，代价是 300MB 以上的二进制、200MB 起步的内存和秒级启动。最近冲上 Trendshift 的开源项目 [Obscura](https://github.com/h4ckf0r0day/obscura)（Apache-2.0，Rust）提出的问题更根本：如果浏览器的主要使用者是 AI Agent 和爬虫而不是人，是否还需要背负整套 Blink？

Cloudflare 在开发其 agent 优先的浏览器 Kitesurf 时，第一个原型就是把 Obscura 移植到 Workers 上（Cloudflare 官方工程博客有记载），这让它不只是又一个「轻量爬虫」。我下载了官方 0.2.2 的 Linux 发行二进制做了一手实测，并通读了九个 crate 约 15.3 万行 Rust（其中渲染层 7.3 万行）。下面不谈营销参数，只分析它的技术路线、我验证到的证据，以及明确的边界。

## 一、技术路线：真 V8，自研排版与绘制

Obscura 不是套壳。它的关键取舍是**把 JavaScript 和渲染分开处理**：JS 直接通过 deno_core 嵌入真正的 V8，`bootstrap.js` 在 JS 世界垫片出 document、window、navigator、fetch、indexedDB 等浏览器对象，Rust 侧通过 ops 把 DOM 操作桥接回去；但 HTML 解析、CSS 级联、布局、绘制全部自研。

![Obscura 九 crate 分层架构](/root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/diagram-architecture.png)

具体技术栈是：html5ever 解析 HTML 为自有 DOM 树；布局以纯 Rust 的 Taffy（flex/grid）为基座，块级排版、浮动、表格、包含块等浏览器行为自己实现；文本用 cosmic-text 与 ab_glyph 塑形；绘制用 CPU-only 的 tiny-skia，输出 PNG 和栅格化 PDF。整条链路里没有任何浏览器二进制依赖。

一个值得注意的内核设计是 **retained layout（保留式布局）**：几何结果在多次截图之间缓存，仅在 DOM、样式、视口、滚动、动画、字体或资源变化时失效，且同一套几何同时驱动 `getBoundingClientRect` 这类 DOM API 和最终绘制。这说明它内部存在统一的布局模型，而不是「测量和截图各算一遍」——后者是很多玩具级渲染器的典型做法。

## 二、它如何证明渲染正确：像素级对拍，而非自测感觉

自研排版引擎最大的风险是「看起来差不多，细节全是错的」。CSS 二十多年积累的边角规则（margin 折叠、BFC 清浮动、表格轨道分配、包含块判定）任何一个实现偏差都会让页面几何失真。

仓库的 `render-repros/` 目录提供了一种相当严格的自证方式：**66 个针对单一排版行为构造的 HTML 夹具，每个配 checks.json，用色块的精确坐标和颜色做断言**。

![render-repros 66 个 CSS 像素级对拍夹具](/root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/diagram-render-repros.png)

例如对绝对定位夹具，它断言「最近定位祖先」色块必须位于 x:85、y:75、80×60，「fixed 视口包含块」必须位于 x:520、y:40。夹具覆盖 flex/grid、float/定位、表格表单、文本字体五大类，外加 Bootstrap 栅栏、轮播裁剪、长页面全截等复杂场景。配套的 run.sh/paired-corpus.py 支持与 Chromium 在**同一视口、滚动位置、动画时刻、网络输入**下做配对截图比对。AGENTS.md 里有两条我认为很关键的工程纪律：像素距离只能作为回归绊线、不能单独作为正确性判决；禁止为任何特定 hostname 写专属布局逻辑。前者承认了视觉回归的度量局限，后者划清了浏览器引擎与站点适配爬虫的界限。外部独立仓库 obscura-benchmark 还有 33 个障碍关卡，作为必须保持 33/33 的行为门槛。

## 三、本机实测数据

我在 Linux x86_64 上直接运行发行二进制（无需 Chrome/Node/任何系统依赖，0.2.2）：

![本机实测命令、耗时、内存与 SSRF 拦截](/root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/diagram-mybench.png)

- Hacker News 执行 JS 统计首页标题（`querySelectorAll('.titleline>a').length` 返回 30），含进程冷启动的墙钟时间 **0.152s**；
- `/usr/bin/time -v` 测得最大驻留内存 **40,052KB（约 39MB）**。这高于 README 标称的 30MB，但属于真实复杂页面的冷启动值，与 headless Chrome 的 200MB+ 仍是数量级差异；
- `--dump markdown` 可直接输出干净 Markdown，`--dump assets` 以 NDJSON 输出子资源清单，`scrape` 多 URL 默认 10 并发、三页实测 1296ms 并给出每条耗时 JSON；
- 默认拦截私网/内网地址（实测访问 127.0.0.1 被拒），SSRF 防护含 DNS 解析期检查，需显式 `--allow-private-network` 才放行。

架构上还有两个对平台方重要的设计。其一，并发靠**多 worker 进程**而非多线程：一个进程内所有页面共享单线程的 V8 isolate，由全局 tokio Mutex 串行化 JS 执行，所以真正并行的方式是像浏览器一样开多进程（发行包内的 obscura-worker）。其二，健壮性围绕「单页不能拖垮进程」展开：因为 `tokio::time::timeout` 无法抢占同步 V8，它在独立线程用 V8 终止看门狗预算执行时间；DOM 操作经 catch_unwind 包裹，panic 退化为 null 而不穿过 FFI 中止进程；DOM 树拒绝成环 reparent；脚本阶段默认 30s 预算、非关键模块单独 3s 预算。

渲染保真度方面，我用它截取 HN 全页 PNG 做人工检查：顶栏、30 条列表、投票箭头、两位数序号缩进、灰色元信息行均与 Chrome 无可见差异，仅有极小字号下个别英文句点抗锯齿偏淡，不影响阅读。

![Obscura 自研引擎截取的 Hacker News 首页](/root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/hn-obscura-shot.png)

## 四、CDP/MCP 兼容性，以及必须承认的边界

它实现了 Chrome DevTools Protocol 的主要域（Target/Page/Runtime/DOM/Network/Fetch/IO/Storage/Input），Puppeteer 的 `connect({browserWSEndpoint})` 与 Playwright 的 `chromium.connectOverCDP()` 可直接接入；同时自带 MCP server，把 browser_screenshot、browser_pdf 等工具暴露给 Claude Desktop、Cursor 一类 agent。隐身构建（编译期 feature）额外提供每会话指纹随机化、Chrome 145 高熵 userAgentData、isTrusted=true、native 函数伪装和 3520 个追踪域名拦截。

边界同样需要讲清楚：

1. 官方明确列出长尾 CSS、部分 Web API、媒体播放、合成器特效、平台字体栅格化可能与 Chromium 有差异；它覆盖主流布局路径，但不是 100% Blink，重交互的现代 SPA、WebRTC、视频场景不应期待等价替换。
2. 我直连维基百科被对方返回机房 IP 限流页（Too Many Requests），这是数据中心 IP 的普遍风控、与引擎无关；规模化采集仍需 HTTP/SOCKS5 代理或住宅 IP。
3. 项目仍是 0.x（二进制 0.2.2、workspace 0.1.0），未发布 crates.io，作为 Rust 库嵌入需 git 依赖并本地编译 V8（首次约 5 分钟、数 GB 磁盘）。

## 结论

Obscura 的价值不在「又一个轻量浏览器」的参数，而在于它验证了一个假设：对「取数据、渲染常规页面、截图/PDF、让 Agent 点按」这一大类任务，保留真实 V8、用自研但有 66 个像素夹具与 33 关障碍赛道守护的排版引擎，足以在约 40MB 内存内完成，且通过标准 CDP 协议接入现有生态。Cloudflare 的原型采用是这条路线可行性的外部佐证。

我的使用建议是分层决策：大规模文字页采集、RAG 数据准备、Agent 的受控浏览层、Serverless 与 CI 的截图/PDF 流水线，现在就值得评估；像素级视觉回归、富交互 Web App、视频与 WebRTC 场景继续使用真实 Chromium。它不会、也无意在今天全面替代 Chrome，但它把「自研浏览器引擎」从巨兽拉回到一个可验证、可嵌入的开源组件，这个方向比单点的性能数字更有意义。

项目地址：https://github.com/h4ckf0r0day/obscura
