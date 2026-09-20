---
title: 87000 Star 的开源项目 World Monitor：给 AI Agent 用的实时世界数据接口长什么样
cover: /root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/cover-zhihu.png
---

本文想认真讨论一个问题：当 AI Agent 需要「实时世界知识」时，它能调用的数据接口应该是什么形态。最近通读了 GitHub 上一个 87.1k Star 的开源项目 World Monitor（AGPL-3.0，TypeScript，7,596 次提交）的架构文档和评分算法，并实测了线上站点、国家风险接口与公开 MCP 端点，记录如下。

## 一、它解决的不是「信息少」，而是「信息不互相解释」

重大事件发生时，研究者通常要在新闻直播、行情、船舶轨迹、地震速报几个页面之间人工建立因果：曼德海峡通行量下降，对应油价波动，再对应某条新闻的重要性。World Monitor 的定位是一块 correlation surface（关联表面），把地缘冲突、军事活动、金融市场、网络威胁、气候、海事、航空数据汇聚到同一块 deck.gl/globe.gl 双引擎地图和一组面板中。

实测线上主站（V2.10.0，2026-09-20），2D 地图默认开启冲突区、军事基地、核设施、制裁、互联网中断等图层，右侧是八个国际电视台的直播流面板；底部状态栏显示本轮聚合 114 个发布方、287 条记录，245 个数据源中 234 个在线，17 个事件分类全覆盖。官方口径为 57 种地图图层、461 个新闻/OSINT 信息流、748 个归属数据源，架构文档中记录的被观测上游主机为 578+。每个面板标注来源，每个数据键带有保鲜合同（maxStaleMin、minRecordCount），过期即显式标记 stale，并按冲突、新闻、网络三个信号族报告覆盖度。

值得一提的是它的变体系统：同一份代码按 hostname 构建出综合、科技、金融、大宗商品、能源、正能量六个站点，Tauri 2 桌面端可在应用内切换。

![World Monitor 实时仪表盘实测](/root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/shot-dashboard.png)

## 二、CII v8：把「国家不稳定」拆成可复现公式

项目最有分析价值的部分是 Country Instability Index（CII v8）。它覆盖 31 个 Tier-1 国家，分数 0–100，服务器端为每国维护 baselineRisk 与 eventMultiplier 系数，结构为 40% 结构性基线 + 60% 事件分；事件分再分 Unrest（25%）、Conflict（30%）、Security（20%）、Information（25%）。

![CII v8 算法分解](/root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/diagram-cii.png)

三个设计体现了情报分析中「结构化分析技术」的思路：

第一，Unrest 分量对民主国家采用 log2 阻尼、对威权国家采用线性计分。依据是民主国家例行性抗议频发但信号弱，威权体制下公共抗议罕见而信号强，用制度差异抑制「民主噪音」。

第二，Conflict 分量以 ACLED 数据加权（交战 ×3、爆炸 ×4、平民暴力 ×5）后通过 min(70, log1p(raw)/log1p(4000)×70) 曲线压顶，既给平民暴力最高单位权重，又防止高烈度战区靠事件数量刷穿分值。

第三，硬性地板优先于微调：UCDP 认定的活跃战争锁定 ≥70，次要冲突 ≥50，「请勿前往」旅行警告 ≥60。考虑到 UCDP GED 是年度滞后数据集，规则明确近期冲突以实时 ACLED 为准，只统计两年窗口内事件，并始终选取「最新有事件返回」的版本。每个分数附带 advisoryProvenance（live/fallback/absent），调用方可知旅行警告来自实时接口还是内置回退表。

实测接口（2026-09-20 09:24 UTC）：乌克兰 85（Critical，+1）、俄罗斯 78（+2）、叙利亚 72、墨西哥/巴基斯坦 70、伊朗 66（+6）、中国 55、美国 28、日本 24。

![CII v8 实测排名节选](/root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/diagram-cii-live.png)

需要客观指出：CII 的基线表和乘数是编辑设定的分析模型，不是经过学术回测的预测器，它的价值在于结构化呈现当前压力而非预测政变；项目另外提供了独立的预测准确率记分卡供核查。

## 三、给 Agent 的接口：75 个工具的 MCP 端点

我在无任何密钥的情况下向 worldmonitor.app/mcp 发送 JSON-RPC tools/list 请求，实际返回 75 个工具，包括 get_country_risk、get_chokepoint_status、get_maritime_activity、get_conflict_events、get_market_data、get_sanctions_data、get_prediction_markets、get_world_brief 等，与 README「tools/list 公开、tools/call 需 Key 或 OAuth」的承诺一致。另有 REST API（OpenAPI 规范）、官方 CLI（npm 包 worldmonitor，别名 wm）与 Python/Go/Ruby 零依赖 SDK，并提供 llms.txt 与 agent-skills 发现文件。

![系统数据流](/root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/diagram-arch.png)

架构层面有四个对数据工程有参考价值的决策：

其一，CII 分数完全服务器权威化，浏览器本地计算路径已删除，保证人类用户与 Agent 客户端看到同一分数；

其二，领域 API 由 Protocol Buffers 契约生成网关，esbuild 逐文件打包并有测试强制部署产物自包含，手写例外端点必须登记并通过契约 lint；

其三，POST→GET 兼容层采用 all-or-nothing 语义，出现嵌套对象或非标量数组即整体 400，数组每键展平上限 200；

其四，缓存按领域时间常数分六档 s-maxage：直播流 300 秒、行情 600 秒、冲突事件 1800 秒、人道摘要 7200 秒、关键矿产 86400 秒、船舶与航迹 no-store。

前端没有使用外部状态库，全局为可变 AppContext 加 250ms 防抖的 URL 双向同步；ml.worker.ts 通过 Transformers.js 在浏览器内运行 MiniLM-L6 嵌入、情感、摘要与 NER，配合 IndexedDB 向量库，接入 Ollama 后可在无 API 密钥条件下运行本地 AI 功能。

## 四、上手成本与边界

本地开发零环境变量即可启动（npm install && npm run dev，公共数据源开箱可用）；但完整自托管是 Docker Compose 多服务栈，必须先生成四个密钥，整体依赖 Vercel Edge、Railway 中继、Upstash Redis 与 Cloudflare 的多段拓扑。仓库为 7,186 个文件、946 个分支、近 20 个专用 Dockerfile 的大型 monorepo，二次开发门槛不低。协议为 AGPL-3.0-only，Fork 修改后对外提供服务须开源，官方品牌与非 AGPL 条款需单独商业许可。

结论分人群：国际时政、大宗商品、航运保险方向的研究者可直接使用其免费层（免注册，仅 Resilience 图层属于 Pro，39.99 美元/月）；Agent 开发者可用零密钥的 tools/list 先完成集成验证，这是目前覆盖最广的公开实时世界数据接口之一；自托管学习者能从中看到契约网关、分层缓存、种子循环的完整生产级实现；而寻求轻量工具、闭源商用或试图将 CII 直接用作自动交易信号的人，建议保持谨慎，所有面板的来源链接仍然是最终事实依据。

我在个人专栏的「开源项目深测」系列中记录这类项目的完整架构拆解与实测过程，对 Agent 数据接口或情报系统设计感兴趣的读者可以关注。
