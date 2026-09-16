---
title: "不用Chromium网页怎么渲染？我把这个Rust无头浏览器真跑了一遍"
cover: /root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/cover-wechat.jpg
source_url: https://github.com/h4ckf0r0day/obscura
---

做爬虫和 AI Agent 的人都知道一个隐痛：你只是想让程序读个网页，却不得不拖着一个几百兆的 Chromium 到处跑——内存两百兆起步，启动要两秒，服务器上还得装一整套图形依赖。

但你有没有想过一个更根本的问题：**浏览器为什么一定要是 Chromium？** 把 Blink 排版引擎、Skia 绘制、合成器全拿掉，一个网页还能不能被正确地画成像素？

这周我盯上了冲上 Trendshift 的开源项目 **Obscura**，一个用 Rust 写的无头浏览器，主打「No Chromium」。更狠的是，Cloudflare 在做它的 agent 浏览器 Kitesurf 时，第一个原型就是把 Obscura 移植到 Workers 上。这个号 9 月初介绍过它的轻量参数，但那篇是功能速览；这次我没看宣传，直接把官方 0.2.2 二进制拉下来真跑，又啃了它 7 万多行渲染代码——我想搞清楚一件事：**自研渲染，到底靠不靠谱。**

![Obscura 封面](/root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/cover-wechat.jpg)

## 一、它的「不装 Chrome」，是真的自研，不是套壳

市面上不少「轻量浏览器」其实还是套个 Chromium 内核，只是帮你打包好。Obscura 不是。我翻了它的九个 crate，网页从 HTML 到像素的完整路径是这样：

![九个 crate 的分层架构](/root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/diagram-architecture.png)

JavaScript 它不自己造轮子——直接用 V8（通过 deno_core 嵌入），所以你页面里的 JS 是真跑的。但排版和绘制这块 Chromium 最吃人力、最复杂的部分，它全自己写：HTML 用 html5ever 解析成自己的 DOM 树；CSS 级联后，flex/grid 排版基于纯 Rust 的 Taffy；块级、浮动、表格这些浏览器排版行为自己补；文字用 cosmic-text、ab_glyph 塑形；最后用纯 CPU 的 tiny-skia 一笔一笔画成 PNG 或 PDF。

你可以把它和「套壳 Chromium」的差别理解成造车和改装车的区别：Puppeteer、Playwright 是给一辆完整的车装个自动驾驶方向盘，车本身（Blink + V8 + Skia + 合成器）一点没少；Obscura 是只保留发动机（V8），底盘、传动、喷漆全部按自己的图纸重造，所以整车轻一个数量级，代价是某些冷门路况还得慢慢调。

换句话说，它是「**真 V8 + 自研排版绘制**」，而不是「阉割版 Chrome」。文档里有个细节特别打动我：布局几何在多次截图之间是保留的，只有 DOM、样式、视口、滚动、字体变化时才重算，而且同一套几何同时喂给 `getBoundingClientRect` 这类 JS API 和最终绘制。这说明它内核里有个真正的渲染引擎，不是「截图时临时算一遍」的玩具。

## 二、它怎么证明自己没瞎画？66 个像素级对拍

自研引擎最大的信任问题不是能不能画，而是画得对不对。CSS 攒了二十多年的边角行为——margin 折叠、BFC 清浮动、表格轨道、包含块判定——错一个，截图就是歪的。

我在仓库里翻到一个很硬核的目录 `render-repros/`：**66 个专门构造的 HTML 测试页，每个配一份 JSON 断言，精确到色块的坐标和颜色。**

![66 个像素级对拍夹具](/root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/diagram-render-repros.png)

我看了那份断言文件，细到什么程度？「绝对定位元素的最近定位祖先」色块，必须出现在 x:85 y:75、宽 80 高 60；「fixed 视口包含块」必须在 x:520 y:40。它覆盖 flex/grid、float/定位、表格表单、文字字体五大类，连 Bootstrap 栅栏、轮播裁剪、长页面全截都有。

更关键的是它的验证方法：**同一个页面、同一个视口、同一个滚动和动画时刻，让 Obscura 和真 Chromium 各截一张图，做配对像素对拍**；还特别强调像素距离只能当回归警报、不能单独判对错，并且绝不允许为某个具体网站写专属适配 hack——这正是「浏览器引擎」和「适配型爬虫」的本质区别。外部还有个独立测试仓库，33 个障碍关卡 CI 必须保持 33/33 全过。一个 0.x 项目能这么较真渲染正确性，我是有点意外的。

## 三、我自己跑的数字：152 毫秒、40 MB

光读代码不算数，我把官方 Linux 二进制下下来真跑了（不用装 Chrome、Node 或任何依赖，解压即用，当前版本 0.2.2）：

![本机实测命令与数据](/root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/diagram-mybench.png)

- 抓 Hacker News，执行 JS 数出首页 30 条标题，**含进程启动墙钟 0.152 秒**；
- `/usr/bin/time -v` 实测最大驻留内存 **40,052 KB，约 39 MB**（比官方宣传的 30MB 略高，但是真实复杂页面，对 Chrome 的 200MB+ 仍是数量级差距）；
- `--dump markdown` 直接把网页转成干净的 Markdown，`--dump assets` 输出页面所有子资源清单，做 RAG 和数据采集能省掉一整层解析；
- 三个 URL 并行 scrape，总耗时 1.3 秒，输出每条的 worker 和耗时 JSON。

我还用它自研引擎截了张 HN 全页图，肉眼检查：橙色顶栏、30 条列表、投票箭头、两位数序号对齐、灰色元信息全都正确，跟 Chrome 几乎看不出差别。

![Obscura 自研引擎截的 Hacker News](/root/jackssybinIndex/content-ops/obscura-rust-rendering-engine-deep-dive/media/hn-obscura-shot.png)

有个安全默认值要单独夸：我顺手抓了本机 127.0.0.1，直接被拒——「Access to private/internal IP address is not allowed」。**SSRF 防护默认开启**，对那种要把用户给的 URL 丢进浏览器的 Agent 平台，这一个默认项就能挡掉一类严重漏洞。架构上它也防崩：V8 有看门狗预算超时强杀、DOM 操作 panic 不会炸穿进程、DOM 树拒绝成环。

顺带说个冷知识：它的并行不是多线程，而是像真浏览器一样开多个 worker 进程——因为一个进程内所有页面共享单线程的 V8 isolate，用全局锁把 JS 串行化。发行包里那个 90 多 MB 的 `obscura-worker` 就是干这个的，两个文件必须放同一目录。

隐身能力也值得一提：加 `--stealth` 编译后，它会对每个会话随机化 GPU、屏幕、canvas、音频、电池指纹，伪装成 Chrome 145 的高熵 userAgentData，连派发事件的 `isTrusted` 都返回 true、`navigator.webdriver` 抹成真实浏览器的样子，还内置 3520 个追踪域名的拦截。我在非隐身版上取 `navigator.webdriver` 得到的也是 false 而不是 true。要接 Puppeteer 或 Playwright 也不用改代码，它实现了 CDP 协议，`connectOverCDP` 一行接上；自带的 MCP server 还能直接把截图、PDF 工具暴露给 Claude Desktop、Cursor 这类 Agent。

## 四、边界：这些场景你还是得用 Chrome

我不吹成神。自研引擎的短板 README 自己也没藏：

- **长尾 CSS、部分 Web API、视频播放、合成器特效、平台字体栅格化**可能和 Chromium 有差异。它覆盖了主流的 block/flex/grid/table/float/定位/动画，但不是 100% Blink。
- 我直连维基百科被对方机房限流挡了（数据中心 IP 的通病，跟引擎无关），真实大规模采集要配 `--proxy` 代理或住宅 IP。
- 复杂拖拽、WebRTC、视频、GPU 合成这类重交互，现在别指望它替代真 Chrome。
- 还在 0.x，作为 Rust 库嵌入要本地编译 V8（首次约 5 分钟）。

安装方式也简单，Linux/Mac 直接从 Releases 下对应二进制，解压就能跑，或者一行 Docker：`docker run -d -p 127.0.0.1:9222:9222 h4ckf0r0day/obscura`，镜像基于 distroless、没有 shell、以非 root 的 65532 用户运行，压缩后约 57MB。发行包还分四档：带不带渲染、带不带隐身传输，可以按场景挑最小的那个。

我的判断很直接：**大规模文字页采集、RAG 数据准备、AI Agent 的受控浏览层、Serverless/CI 里的截图和 PDF 流水线——现在就能上**，40MB 内存加非 root 小镜像，密度和成本优势是实打实的；要做现代复杂 Web App 的像素级视觉回归、依赖视频和重交互的，继续用 Chrome。

AI Agent 正在成为浏览器最大的「用户」之一。当浏览器主要不是给人盯着看、而是给程序取数据和点按钮时，它还需要为 1990 年代那个富交互目标背着整套 Blink 吗？Obscura 用 40MB 和 66 个对拍用例给出了它的回答。不是全面替代，但这条路，被它跑通了。

项目 GitHub 地址：https://github.com/h4ckf0r0day/obscura

---

我是 jackssybin，一个只信「自己跑过」的开源/AI 工具实测派。
每次帮你筛一个能真正省钱、省时间的开源项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目地址和完整命令我放在了「**阅读原文**」。

相关阅读：
- [30MB内存替代Chromium！这个开源Rust无头浏览器太香了](https://mp.weixin.qq.com/s/8CtFLrv-MO_ljIuRA4yJlw)
- [DeepSeek官方出了22份接入指南，覆盖Claude Code到Copilot，配置只要3分钟](https://mp.weixin.qq.com/s/4lZbySSLYj2aj-y-DIV7ZA)
