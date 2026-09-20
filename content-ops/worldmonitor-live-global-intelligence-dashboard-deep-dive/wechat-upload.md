---
title: 87000 Star 的开源世界地图：新闻、航线、油价全叠在一张图上，还白送 AI 75 个工具
cover: /root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/cover-wechat.png
source_url: https://github.com/koala73/worldmonitor
---

晚上出大事的时候，你的浏览器是不是也这样：一个 BBC 直播标签、一个油价页、一个查船的网站、一个地震速报页，你靠自己的脑子在四个页面之间做「关联分析」。转头问 AI 助手现在红海什么情况，它只会拿去年的训练数据跟你客气。

这周我翻完了一个 87000 Star 的开源项目，它想把这些全部塞进同一张地图。

![World Monitor 实时仪表盘：左侧地图近二十个图层开关，右侧挂着八个电视台直播流](/root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/shot-dashboard.png)

它叫 **World Monitor**，GitHub 上 87.1k Star、7596 次提交，AGPL 协议开源，被 WIRED 这些媒体报道过。我没只看 README——通读了它 496 行的架构文档和评分算法文档，实测了线上仪表盘和它给 AI 开放的接口。这篇只讲三件事：它跟普通新闻墙差在哪、它给国家打分的算法有多鸡贼、怎么把它接进你的 AI Agent。

## 一、它不是新闻聚合，是一块「关联表面」

我在 worldmonitor.app 实测了主站：一张世界地图上默认铺着冲突区、军事基地、核设施、制裁、互联网中断等图层，红橙绿三色热力点标风险等级，左边近二十个图层开关，右边是 Bloomberg、半岛电视台等八个直播流。

页面底部有个细节我很喜欢——状态栏直接摊牌：本轮聚合了 **114 个发布方、287 条记录，245 个数据源里 234 个在线**。它连「自己今天有多少数据没抓到」都敢给你看。

![CII v8 评分算法分解：40% 基线加 60% 事件分，另有硬地板和实时加成](/root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/diagram-cii.png)

官方口径是 57 种地图图层、461 个新闻信息流、748 个有归属的数据源，每个面板都标来源。同一个代码库还构建出六个站点：综合、科技、金融、大宗商品、能源，甚至还有一个只推好消息的 Happy Monitor，靠域名自动切换。下载一个 Tauri 桌面客户端，还能在应用内部直接切换变体，Windows、macOS、Linux 都有安装包。

我特意验证过它的「新鲜度」不是装样子：每个数据键都带自己的保鲜合同，超过约定时间没更新就被标记为 stale（陈旧），面板会明确告诉你这块数据是实时的还是拿旧数据顶着的；健康检查还会按冲突、新闻、网络三个信号族分别统计覆盖度，任何一族在重点国家没有信号，状态就降级成「部分覆盖」。对一个情报产品来说，敢把「我不知道」显式标出来，比永远在转圈加载高级得多。

## 二、给国家打分：对法国抗议「装瞎」是故意的

最有含金量的是它的国家不稳定指数 CII v8：31 个重点国家，0 到 100 分，公式全部公开。总分 = 40% 结构性基线 + 60% 实时事件分，事件分再拆骚动、冲突、安全、信息四块。

三个设计我看完拍了桌子：

**第一，民主国家的抗议要打对数折扣，威权国家按线性算。** 逻辑很硬：法国美国天天游行，单次抗议不代表要乱；威权国家街头出现一次抗议，信号完全不同。用制度差异防止「民主国家的噪音淹没威权国家的真信号」。

**第二，冲突事件加权后过对数压顶曲线。** 交战 ×3、爆炸 ×4、针对平民的暴力 ×5——屠杀平民在单位事件里最贵；但再惨烈的战区，分数也被压在 70 分以内，不能靠堆事件数刷爆。

**第三，硬地板优先于一切微调。** 数据库认定在打仗的国家直接锁死 70 分以上，外交部「请勿前往」警告锁 60 分。每个分数还注明这条旅行警告是实时接口取的还是内置回退表——调用方自己判断可信度。

![2026 年 9 月 20 日实测 CII v8 排名：乌克兰 85、俄罗斯 78、伊朗 24 小时涨 6 分](/root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/diagram-cii-live.png)

这是我 9 月 20 日拉到的真实排名：乌克兰 85、俄罗斯 78、叙利亚 72、伊朗 66（24 小时内涨了 6 分）、中国 55、美国 28、日本 24，每国带更新时间戳和涨跌箭头。

当然得说句实话：这套系数是编辑团队设定的分析模型，不是经过回测的政变预测器，拿它做决策还是要回到原始信源。

## 三、给 AI Agent 的 75 个免费工具

最让我兴奋的是这个：它给 AI 开放了一个 MCP 端点。我没要任何密钥，直接往 worldmonitor.app/mcp 发了一个 tools/list 请求，返回 **75 个工具**：国家风险、海峡通行状态、海事活动、冲突事件、市场行情、制裁数据、预测市场……全在里面。

意思是以后你的 Claude 不用再「根据我的训练数据」，而是能直接问：现在曼德海峡有多少条船？伊朗风险这周涨了多少？查国家简报、查商品流向，都是实时的。工具的描述里还藏着不少惊喜：多伦多警情、欧盟房价周期、WTO 贸易流向、采购机会，连「正面事件」都单独有一个工具——想做个只推好消息的 Agent 都有现成数据源。此外还有 REST API、一条 npx 命令调起的 CLI，和 Python/Go/Ruby 三个官方 SDK。

对不想付费的个人玩家，README 还写明支持本地 AI：浏览器端用 Transformers.js 跑 MiniLM 小模型做摘要和情感分析，桌面端接 Ollama 可以跑全功能，不需要任何 API 密钥。

![World Monitor 数据流：客户端、边缘网关、实时中继、分层缓存到 748 个数据源](/root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media/diagram-arch.png)

工程上也值得抄作业：评分只在服务器算，所有客户端和 Agent 拿到同一个分数，杜绝本地各算各的；API 全用 Protobuf 契约生成，CI 强制校验；缓存 TTL 按领域分六档——船位航迹完全不缓存，关键矿产缓存一天，因为两者真实变化速度就差这么多。浏览器里还能用 Transformers.js 本地跑模型，接 Ollama 可以一分钱 API 费不花。

## 四、五分钟跑起来，以及谁该等等

白嫖最省事，直接打开 worldmonitor.app，免费免注册，除了一个高级图层外全开。想本地跑：

```bash
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor && npm install && npm run dev
```

本地开发连环境变量都不用配。但想要完整自托管要掂量：这是个 7000 多文件、900 多个分支的 monorepo 巨兽，250 个开放 issue、近 20 个专用 Dockerfile（中继、种子、价格爬虫、统计留存各自独立），完整栈是 Vercel + Railway + Redis + Cloudflare 多段拓扑，启动前必须先生成四个密钥，高级数据源还得自己逐个申请。把它当学习范本很好，把它当「一键 docker run」的小工具会失望。

**我的判断：**

研究国际时政、大宗商品、航运保险的，直接收藏；做 AI Agent 的，这是我目前见过覆盖最广的免费实时世界数据接口，先用无密钥的工具清单验证集成，再决定买不买 Pro（39.99 美元/月）；想闭源商用的注意 AGPL 协议，Fork 对外服务必须开源；只想要轻量小工具、或者想拿指数做自动交易信号的，先等等。

它最大的意义其实是证明了一件事：公共世界数据、严格的接口契约、面向 AI 的协议，这三样能同时成立。下次你想给自己的 Agent 接实时世界知识，先花一条命令看看它的 75 个工具，再决定要不要从零爬数据。

---

我是 Jack，一个只信「自己跑过」的开源/AI 工具实测派。每篇帮你筛一个真能省钱省时间的项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。项目地址、完整命令和 75 个 MCP 工具清单我放在了「**阅读原文**」。

相关阅读：
- [用了三个月 Claude Code，我终于装上了 ADHD 输出模式](https://mp.weixin.qq.com/s/pvpTovUEWocgSWsRlcXHbA)
- [剪映逼我开会员后，我找到了这个免费工具](https://mp.weixin.qq.com/s/bkYGzCKGOoT9AEtq1fnqMQ)

这个号在持续做「开源/AI 工具实测」系列，下一篇继续拆值得自己跑一遍的热门仓库。
