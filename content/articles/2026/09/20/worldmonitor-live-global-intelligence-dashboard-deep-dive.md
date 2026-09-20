---
title: "87000 Star 的开源「全球态势感知中心」：我通读架构文档、实测了它的实时地图和 75 个 MCP 工具"
date: 2026-09-20T16:30:00+08:00
lastmod: 2026-09-20T16:30:00+08:00
slug: worldmonitor-live-global-intelligence-dashboard-deep-dive
draft: false
description: "World Monitor 是 AGPL-3.0 协议的实时全球情报仪表盘：把 461 个新闻/OSINT 信息流、57 种地图图层、748 个归属数据源收进 deck.gl/globe.gl 双引擎地图，并对外提供 MCP Server、REST API、CLI 和四种语言 SDK。本文基于 GitHub 仓库（87.1k Star、7596 次提交）、ARCHITECTURE.md 与 docs/algorithms.mdx 源码级文档，加上对线上仪表盘、CII v8 国家不稳定指数实时接口和公开 MCP tools/list 的实际取证，讲清三件事：它和普通新闻聚合墙的本质区别、CII 评分算法里反直觉的工程设计、以及把它接进 AI Agent 的最小路径。最后给出谁现在该用、谁该等的明确判断。"
tags: ["开源", "MCP", "AI Agent", "数据可视化", "地缘政治", "自托管", "OSINT", "TypeScript"]
topic: "开源项目"
topicSlug: "open-source"
layout: article
contentType: article
type: article
cover: "/images/worldmonitor-live-global-intelligence-dashboard-deep-dive/cover-zhihu.png"
---

# 87000 Star 的开源「全球态势感知中心」：我通读架构文档、实测了它的实时地图和 75 个 MCP 工具

> **项目地址：** <https://github.com/koala73/worldmonitor>
> **仓库全名：** `koala73/worldmonitor` ｜ **协议：** AGPL-3.0-only ｜ **语言：** TypeScript
> **写作时取证数据：** 87.1k Star / 13.2k Fork / 7,596 commits / 946 分支 / 60 tags / 250 open issues
> **线上版本：** worldmonitor.app V2.10.0（2026-09-20 实测）

重大国际事件发生的那个晚上，你的浏览器通常是这样的：BBC 和半岛电视台的直播标签页、一个油价行情页、一个船舶轨迹网站、一个地震速报页，再加一个翻译软件。五个页面各自刷新，你靠人脑在它们之间做「关联分析」：红海的船在减速——所以油价跳了——所以那条新闻重要。而当你转头问 AI 助手「现在曼德海峡什么情况」，它只能凭训练数据回忆，礼貌地提醒你信息可能过时。

这星期我通读了 [World Monitor](https://github.com/koala73/worldmonitor) 的仓库和架构文档，又实测了它的线上站点、国家风险接口和公开 MCP 端点。这个项目想解决的就是上面那个分裂：**不是再做一个信息列表，而是做一块让地缘、航运、商品、宏观、市场、天气、网络、新闻互相解释的「关联表面」（correlation surface）**。仓库 87.1k Star、提交超过 7,500 次，被 WIRED、The Atlantic 等媒体报道过，却不是一个「漂亮壳子」项目——它的工程复杂度和数据契约设计，比仪表盘本身更值得拆。

![World Monitor 实时仪表盘实测截图：2D 地图、图层开关、实时新闻面板，底部状态栏显示 114 个发布方、287 条记录、245 个数据源中 234 个在线](/images/worldmonitor-live-global-intelligence-dashboard-deep-dive/shot-dashboard.png)

## 一、它到底是什么：一块态势感知地图，而不是新闻聚合墙

先把定位摆正。World Monitor 是一个 TypeScript 单页应用，官方定义是「实时全球情报仪表盘」：把几十个外部数据源——地缘冲突、军事活动、金融市场、网络威胁、气候事件、海上船舶、航空动态——汇聚到一块可交互地图和一组专用面板里。它同时以六种站点形态在线：主站 World Monitor，以及同一代码库构建的 Tech Monitor、Finance Monitor、Commodity Monitor、Happy Monitor、Energy Monitor，靠 hostname 自动切换默认面板、图层、配色和刷新频率。

我实测了线上主站。2D 平面地图（deck.gl + MapLibre）上默认开启了冲突区、情报热点、军事基地、制裁、军事活动、核设施、互联网中断、自然灾害等图层，红/橙/绿三色热力点标注风险等级；左侧近二十个图层开关，右侧是挂着 Bloomberg、Sky News、Al Jazeera 等八个直播源的新闻面板；顶栏还有一个 DEFCON 指示器。页面底部状态栏当时显示：**本轮聚合 114 个发布方、287 条记录，245 个数据源中 234 个连通，17 个事件分类全部覆盖**——这种把数据新鲜度直接摊给用户看的做法，是情报工具的自觉，而不是内容产品的套路。

首页给出的口径是 57 种地图图层、461 个新闻/OSINT 信息流、748 个归属数据提供方，并且每个面板都标注来源。架构文档里的数字是「578+ 个被观测上游主机」。两个口径不矛盾：前者是当前产品页的运营口径，后者是架构文档里抓包统计的主机数。

## 二、最小上手路径：免密钥开发、Docker 自托管、一条命令接 Agent

对只想快速跑起来的人，路径短得意外——应用**不需要任何环境变量即可启动**，公共数据源（地震、天气、冲突等）开箱即用：

```bash
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor
npm install
npm run dev          # 打开 http://localhost:3000
npm run dev:finance  # 或直接以金融变体启动
```

完整自托管则要重得多。`SELF_HOSTING.md` 给的是 Docker Compose 栈，启动前**必须**生成四个密钥（否则栈不启动）：`RELAY_SHARED_SECRET`、`REDIS_PASSWORD`、`REDIS_TOKEN`、`WM_SESSION_SECRET`，然后 `docker compose up -d` 再跑 `./scripts/run-seeders.sh` 往 Redis 灌种子数据。也就是说，「能看」和「拥有一套自己的生产级情报栈」之间隔着 Vercel + Railway + Upstash Redis + Cloudflare 这一整套拓扑——这一点后面在适用人群里还会说。

对开发者，更吸引人的入口是它的可编程层。我实际发了一个不带任何密钥的 JSON-RPC 请求到 `https://worldmonitor.app/mcp`：

```bash
curl -X POST 'https://worldmonitor.app/mcp' \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

返回的 `tools/list` 里有 **75 个工具**，包括 `get_country_risk`、`get_chokepoint_status`、`get_maritime_activity`、`get_conflict_events`、`get_market_data`、`get_prediction_markets`、`get_sanctions_data`、`get_world_brief` 等。README 明确承诺 `tools/list` 公开、`tools/call` 才需要 Key 或 OAuth——实测一致。除此之外还有 REST API（`api.worldmonitor.app`，带 OpenAPI 规范）、官方 CLI（`npx worldmonitor`，别名 `wm`）和 Python / Ruby / Go 三个零依赖 SDK。仓库甚至提供了 `llms.txt`、`.well-known/agent-skills` 发现文件和一个 `/?mode=agent` 的 Agent 视图。**「地图上的一切同时也是 API」是这个项目最锋利的定位**：它不只服务人眼，也把实时世界数据变成了 AI 上下文。

## 三、核心算法拆解：CII v8 为什么对法国抗议「装瞎」

这个项目最值得讲的不是地图，而是它把「不稳定」这种模糊概念拆成可复现公式的方式。文档 `docs/algorithms.mdx` 里公开了国家不稳定指数 CII v8 的完整算法，覆盖 31 个 Tier-1 国家，每国带服务器端 `baselineRisk` 和 `eventMultiplier` 系数，分数 0–100。

![CII v8 算法分解：40% 基线 + 60% 事件分，事件分再拆四个分量，另有硬性地板和实时加成](/images/worldmonitor-live-global-intelligence-dashboard-deep-dive/diagram-cii.png)

总分 = 40% 结构性基线风险 + 60% 事件分；事件分再拆成 Unrest（骚动 25%）、Conflict（冲突 30%）、Security（安全 20%）、Information（信息 25%）。真正有情报分析味道的是三个反直觉设计：

**第一，民主国家的抗议用对数阻尼，威权国家用线性计分。** 民主国家天天有抗议（法国黄背心、美国校园示威），单次抗议不说明国家不稳定；而威权体制下公共抗议极其罕见，每一次都显著。所以 Unrest 对高事件量、低乘数国家套 `log2` 阻尼，对另一些国家走线性——用制度差异防止「民主噪音淹没威权信号」。

**第二，冲突分量用 log1p 曲线压顶，平民暴力权重最高。** ACLED 数据里交战事件 ×3、爆炸 ×4、针对平民的暴力 ×5，再乘国家事件乘数，然后过一道 `min(70, log1p(rawActivity) / log1p(4000) × 70)` 曲线。意思是：一个已经打烂了的地区，再多一百起交火也不该把分数推到 150；但针对平民的暴力在单位事件上最贵。

**第三，地板（Floors）优先于一切微调。** UCDP 认定的活跃战争直接把分数钉在 ≥70，次要冲突 ≥50；外交部「请勿前往」旅行警告钉在 ≥60。而且 UCDP 是年度滞后数据集，所以规则明确：近期冲突由实时的 ACLED 驱动，取数时选「最新有事件返回的版本」而非第一个响应的版本，并只统计两年窗口内的事件。每个分数还带 `advisoryProvenance: live / fallback / absent` 字段，让调用方知道这条旅行警告是实时接口来的还是内置回退表来的。

我在实测页拉到了 2026-09-20 的真实排名：乌克兰 85（Critical，24h +1）、俄罗斯 78（+2）、叙利亚 72、墨西哥与巴基斯坦 70、伊朗 66（+6）、中国 55、以色列 50、美国 28、日本 24。31 个国家全部带更新时间戳和 24 小时有符号变化量。

![2026-09-20 实测 CII v8 排名节选：乌克兰 85、俄罗斯 78、伊朗 24 小时上升 6 分](/images/worldmonitor-live-global-intelligence-dashboard-deep-dive/diagram-cii-live.png)

需要诚实说明的是：CII 是一套**编辑设定系数的分析模型，不是经过学术回测验证的预测器**——基线风险表和乘数由维护方发布，它擅长「结构化呈现当前压力」，不保证预测政变。项目自己也提供了独立的 forecast accuracy scorecard 页面让你核对预测命中率，这个态度先加一分。

## 四、工程侧的四个非显而易见设计

通读 `ARCHITECTURE.md`（496 行）后，有四处设计值得做工程的人借鉴：

![World Monitor 数据流：客户端 → Vercel 边缘网关 → Railway 中继 → Redis 分层缓存 → 748 个数据源，并对 Agent 暴露 MCP/REST/SDK](/images/worldmonitor-live-global-intelligence-dashboard-deep-dive/diagram-arch.png)

**1. 分数计算全部服务器权威化，浏览器本地回退已被删除。** 文档明确记载：曾经存在的 `country-instability.ts` 本地计算路径已经移除，浏览器只消费 `GET /api/intelligence/v1/get-risk-scores` 的缓存结果。好处是所有用户、所有 Agent 看到同一个分数，不会因为本地代码版本不同算出两套乌克兰风险。这是做「数据产品」而不是「数据可视化」的分水岭。

**2. API 契约用 Protocol Buffers 生成。** 领域网关从 proto 契约生成，esbuild 逐文件打包，还有一个 `tests/edge-functions.test.mjs` 强制「部署产物不能在运行时牵连无关模块」；手写的例外端点必须登记在 `api-route-exceptions.json` 里并通过 `lint:api-contract`。一个开源项目对 API 表面做契约强约束，不常见。

**3. POST→GET 兼容层是 all-or-nothing 的。** 网关为旧客户端提供 POST 重试为 GET 的能力，但规则很克制：JSON 对象里只要出现嵌套对象、非标量数组或畸形 JSON，直接 400，绝不应用半截翻译；数组每键最多展平 200 个值。兼容层最容易变成安全和语义黑洞，这段边界定义值得抄作业。

**4. 六档缓存 s-maxage。** 直播流 300 秒、行情 600 秒、冲突事件 1800 秒、人道摘要 7200 秒、关键矿产 86400 秒、船位航迹 no-store。缓存 TTL 不是全局拍脑袋的一个数，而是按每个领域「数据真实变化的时间常数」定的。

前端侧也有两个细节：没有任何外部状态库，全局是一个可变的 `AppContext` 中心对象，URL 状态做 250ms 防抖双向同步；`ml.worker.ts` 用 Transformers.js 在浏览器里跑 MiniLM-L6 嵌入、情感、摘要和 NER，配 IndexedDB 向量库做头条语义搜索——也就是说本地 AI 这条路（接 Ollama）可以完全不花 API 费。

## 五、谁现在该用，谁该等

**该用的人：** 做国际时政、大宗商品、航运保险、供应链方向的研究/交易人员，需要一个「免费、免注册、带出处」的实时态势总览——免费层是完整产品不是试用（仅 Resilience 图层和决策功能留给 Pro，Pro 定价 39.99 美元/月）；做 AI Agent 的开发者，如果你的 Agent 经常需要回答「某国现在什么情况」「哪个海峡堵了」，MCP 端点加 75 个工具是我目前见过覆盖最广的免费实时世界数据接口，`tools/list` 甚至不需要密钥就能先做集成验证；自托管和数据工程爱好者，这里有 protobuf 契约网关、分层缓存、种子循环、变体系统的完整生产级范本。

**该等等的人：** 想要轻量小工具的人——这是一个 monorepo 巨兽，946 个分支、近 20 个 Dockerfile、7186 个文件、250 个 open issues 和 188 个开放 PR，维护强度极高但二次开发门槛也极高，自托管完整版要维护 Vercel+Railway+Redis+Cloudflare 多段拓扑，很多高级数据源需要自己申请密钥；打算闭源商用的团队注意它是 **AGPL-3.0**，Fork 修改后对外提供服务必须开源，官方品牌和非 AGPL 条款需要单独商业授权；最后，把 CII 这类分数当「预测」用的人要克制——它是结构化的当前压力呈现，系数是编辑给定的，重大决策前请顺着每个面板的出处回到原始数据源。

我自己的判断：World Monitor 最大的价值不在「又一个好看的地图」，而在于它证明了「公共世界数据 + 严格契约 + 面向 Agent 的接口」可以同时成立。下一次你想给 Agent 接实时世界知识，先 `npx worldmonitor tools` 看看那 75 个工具，再决定要不要自己从零爬数据。

项目 GitHub 地址：<https://github.com/koala73/worldmonitor>
