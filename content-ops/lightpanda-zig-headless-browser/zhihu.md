# 4 万 Star 的 Lightpanda：用 Zig 从零写一个无头浏览器，是工程炫技还是真实需求

聊网页自动化，大多数人的第一选择仍是 Headless Chrome 或 Puppeteer/Playwright 这套生态。它们足够通用，代价是资源开销——一个实例一两 G 内存，并发起来服务器先扛不住。最近认真研究了 [Lightpanda](https://github.com/lightpanda-io/browser)，它给出的答案相当激进：不 fork Chromium、不 patch WebKit，用 Zig 从零写一个专为服务端自动化设计的无头浏览器。

目前它在 GitHub 上有 4.16 万 Star、2070 Fork、累计 1.19 万次提交，主语言 Zig，AGPL-3.0 协议。我把仓库和官方基准都过了一遍，这篇不谈营销口号，只讲它的技术取舍、实测数据和真实边界。

## 一、性能数据先看测试协议，再看数字

"比 Chromium 轻 16 倍、快 9 倍"是它最出圈的说法。这种数字我习惯先查测试方法。官方在基准仓库里把环境完全公开：AWS EC2 m5.xlarge、全新 Ubuntu、对照 Google Chrome 143，用 Go 写的 chromedp 爬虫抓取同一 demo 站的 933 个真实 URL，内存用 smem 统计 PSS，CPU 每 100ms 采样取峰值。

![Lightpanda 与 Headless Chrome 的内存、耗时基准对比](media/benchmark.png)

在这个口径下：

- 100 页并发，Lightpanda 峰值内存 123MB、耗时 5 秒；Headless Chrome 峰值 2GB、耗时 46 秒。
- 单进程抓完 933 页，Lightpanda 用时 51.68 秒、峰值仅 27.2MB；Chrome 单标签 82.83 秒、峰值 1.3GB。
- 极限并发下差距更夸张：Lightpanda 25 进程 4.81 秒、123MB；Chrome 100 标签页 69 分 37 秒、4.2GB。

需要说明，这是官方自建 demo 站的基准，真实业务的页面复杂度、网络条件、JS 框架都会影响结果，它的价值在于公开可复现，而不是给你一个打包票的承诺。

## 二、为什么非要从零造，而不是改 Chromium

Lightpanda 的论证基于两个判断。

其一，现代网页的 JavaScript 执行是硬需求。Ajax、单页应用、无限滚动、React/Vue 框架渲染的内容，不执行 JS 就拿不到，传统的 HTTP 请求加 HTML 解析在很多场景已经失效。

其二，把完整桌面浏览器搬上服务器并不经济。Chrome 为人类浏览场景携带了图形渲染、多媒体、扩展、多进程隔离等大量无头自动化用不到的能力，实例一多，内存和运维成本同时失控。

既要真实的 JS 执行，又要服务端的极致轻量，它的选择是重新选型、重新组装。

![Lightpanda 五层技术栈架构](media/architecture.png)

技术栈分五层：底层用 Zig 0.17 手写，显式内存控制、编译为单二进制，并且刻意不做图形渲染引擎——这正是省内存的关键；解析与网络层复用 Servo 的 html5ever 和 Libcurl；JS 与 DOM 层集成 Google V8 引擎保证真实执行，配合自研 DOM 树与 API；上层是 agent 与 PandaScript；最外通过 CDP/WebDriver BiDi 和原生 MCP 对外提供接入。

## 三、落地方式：老脚本零改动，Agent 能沉淀可回放脚本

![Lightpanda 的四种使用方式](media/usecases.png)

对存量团队最友好的是 CDP 兼容。起一个 `lightpanda serve` 监听 9222 端口，Puppeteer 或 Playwright 只需把连接端点指过去，原有脚本逻辑基本不动，迁移成本很低。

```bash
./lightpanda serve --host 127.0.0.1 --port 9222
```

它还提供 `fetch` 子命令直接 dump html/markdown/png/pdf/结构化数据；而最有想象力的是 agent 模式：用自然语言驱动浏览器完成导航、点击、填表、抽取，产物是一段 PandaScript。这段脚本可以离线、确定性、不消耗 token 地用 `lightpanda run` 回放，相当于用 LLM 做原型、用确定性脚本上生产。MCP server 则支持 stdio 和 HTTP 两种传输，每个连接分配独立会话，多个 Agent 的 cookie 和内存互不串扰。

部署覆盖 Homebrew、AUR、Nix 和官方 Docker 镜像，Linux/macOS 双架构，Windows 通过 WSL2 运行。

## 四、边界比优点更值得讲清楚

![Lightpanda 的适用场景与能力边界](media/limits.png)

如果只看优点就贸然上生产，容易踩坑。几个客观限制：

1. 没有图形渲染引擎，能输出 png/pdf 但不适合像素级视觉回归和截图比对。
2. 网页标准兼容性仍在追赶，官方每天跑 Web Platform Tests 并公开结果，复杂站点或强依赖最新 CSS/Canvas 的页面可能异常。
3. 目前只发布 nightly 构建，API 和行为存在变动空间。
4. Linux 二进制依赖 glibc，Alpine 等 musl 系统会报动态链接器缺失，需换 glibc 基础镜像或源码编译；没有原生 Windows/Android 包。
5. 默认开启遥测，可用环境变量 `LIGHTPANDA_DISABLE_TELEMETRY=true` 关闭。

许可层面，AGPL-3.0 对自用、内部测试、学习都很友好；但如果要基于它构建对外提供网络服务的闭源 SaaS，网络分发条款会触发开源义务，这类场景需要提前评估合规或联系商业授权。

## 五、结论

Lightpanda 真正回应的，是 AI 时代一个结构性变化：当操作网页的主体从人变成大规模并发的 Agent，为人类设计的通用浏览器在成本上不再最优。用 Zig 重写、砍掉图形层、原生兼容 CDP 与 MCP、把 LLM 操作沉淀成可回放脚本，这套组合让它在爬虫降本、Agent 执行环境、结构化数据抽取、CI 无头测试等场景具备明确的性价比。

但它的定位是"规模化自动化的专用利器"，而不是日常浏览器的完整替身。把预期放对，再用自己的页面跑一轮可复现的基准，才是判断它值不值得引入的正确方式。

项目地址：[https://github.com/lightpanda-io/browser](https://github.com/lightpanda-io/browser)
