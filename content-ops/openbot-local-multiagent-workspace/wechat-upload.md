---
title: "我在一台电脑上开了 7 个 AI 程序员，还让它们学会了互相派活"
cover: /root/jackssybinIndex/content-ops/openbot-local-multiagent-workspace/media/cover-ip.jpg
source_url: https://github.com/nightly-labs/openbot
---

说个真实的日常。

我机器上装了 Claude Code、Codex CLI、Grok CLI、OpenCode，还试过 Cursor 和 Cline。每一个都要单开终端、各自登录、各自记着自己聊到哪。

想让它们搭把手？只能我手动复制粘贴。开三个终端窗口假装是「AI 团队」，其实是三个互不通气的外包，连个共享文件夹都没有。

直到我翻到一个新项目：**OpenBot**。

今年 8 月 12 日才建仓，两个多月，**1837 个 Star**。它干的事一句话讲得清：把 7 个 Coding Agent 收进同一张办公桌，每个都有独立工位，还能互相发消息、传文件、排队干活。

我把整个仓库（6000 多个文件）拉下来通读了一遍，这篇讲讲它到底怎么做到的，以及为什么我用的时候后背有点发凉。

![裸开多个 CLI 终端 vs OpenBot 一张办公桌](/root/jackssybinIndex/content-ops/openbot-local-multiagent-workspace/media/pain.png)

## 它不是又一个 AI，是给 AI 发工位的

最反直觉的一点：**OpenBot 自己一个模型都没有。**

它不跟 Claude、GPT 抢饭碗，它做的是编排层——把各家官方 CLI 接进同一个桌面应用：

![OpenBot 统一编排的 7 个 Agent 及接入认证方式](/root/jackssybinIndex/content-ops/openbot-local-multiagent-workspace/media/providers.png)

Codex、Claude Code、Grok、OpenCode、Gemini、Cursor CLI、Cline CLI，七个。认证全部复用各家 CLI 自己的登录态，它不截留你的密码和 Key。Grok 的 token 甚至用完就扔，不落盘、不写日志。

想白嫖试用也有路：OpenCode 那一行**免费模型连账号都不用注册**，点一下 Connect 就能跑。

技术上是 Electron + SolidJS + Bun 的桌面应用，本地优先——数据在你自己硬盘上，但联网该连还得连（Claude 终归要访问 Anthropic）。

## 关键差别：Agent 是「常驻同事」，不是一次性脚本

以前用多 Agent 工具，更像点外卖：提需求、开个容器、跑完、容器删掉，什么都不剩。

OpenBot 的思路完全不同，它管这个叫**持久化 Agent**：

![持久化 Agent 的四个核心设计](/root/jackssybinIndex/content-ops/openbot-local-multiagent-workspace/media/architecture.png)

- **独立工作区**：每个 Agent 有自己的文件夹、自己的对话历史，重启软件还在；
- **任务排队**：活可以排队跑，能暂停、恢复、取消，软件崩了队列也不丢；
- **自动压缩上下文**：它盯着每个 Agent 的对话长度，快撑爆窗口时自动压缩，不用你管；
- **互相协作**：Agent 之间能直接发消息、发表情、传图片、传文件。

创建一个 Agent 也不用写配置文件。直接用大白话说「给我一个专审依赖安全的工程师」，它帮你生成指令和头像，保存前还能一段段改。

## 最打动我的：一个任务只有一个负责人

它的协作设计照着真实团队来。

你可以开一个共享频道，拉多个 Agent 进来。但重点是——**一个任务只能有一个 task owner（负责人）**。上下文全员可见，负责人只有一个，随时能改派、暂停、归档。

这比那些「一群 AI 七嘴八舌」的 demo 成熟多了。干活的都懂：一件事两个人负责，等于没人负责。

Agent 还能把干熟的流程存成技能（一个标准格式的文件），共享给别的 Agent 用，版本号、回滚都有。甚至支持从 Grok Bot 一键导入你调教好的 Agent，连记忆一起打包。

手和眼也给配了：一个**持久化内置浏览器**能被 Agent 打开和操控；可选的 Computer Use 能力随安装包自带驱动，Mac、Windows、Linux 都能让 Agent 直接操作屏幕。

## 真正的杀手锏：把「AI 团队」丢在服务器上 7×24 跑

这是我觉得它最有想象力的部分。

在一台没屏幕的 VPS 上，两行命令装完登录：

```bash
curl -fsSL https://raw.githubusercontent.com/nightly-labs/openbot/main/scripts/install-server.sh | sudo bash
sudo openbot login
```

然后你用桌面端、**iPhone app 或者网页**，随时给这台服务器上的 Agent 派活。Docker 也有官方镜像，安全沙箱默认开着。

相当于你在云上养了一支不下班的 AI 工程队，出门吃饭用手机就能加需求。

![把 AI 团队丢在 VPS 上 7×24，手机随时派活](/root/jackssybinIndex/content-ops/openbot-local-multiagent-workspace/media/deploy.png)

## 但是，两盆冷水必须泼

用之前有两件事，官方 README 用警告标红了，我也必须说清楚。

![许可证与运行权限的两个安全边界](/root/jackssybinIndex/content-ops/openbot-local-multiagent-workspace/media/safety-v2.png)

**第一，它不是标准意义的开源。**

许可证是 PolyForm Noncommercial——源码随便看、自己用、学着玩都行，但**禁止商用**。公司想拿它跑生产流程，先找法务。

**第二，现在 Agent 拥有完整权限且不二次确认。**

文档原话模式叫 `danger-full-access` + `approvalPolicy: never`：你首次授权之后，Agent 能不打招呼地删改文件、跑命令、联网、操控浏览器。

所以官方的建议也是我的建议：**只让它碰你信得过的任务，勤备份，最好放虚拟机或容器里跑。**

另外它现在还是开发预览版（v0.51.1，214 个未关闭的 issue），Windows 早期安装包甚至没有代码签名。别在存着重要东西的主力机器上裸奔。

## 谁现在就该装？

我的判断很直接：

**多 Agent 重度用户，现在就试。** 反正能用 OpenCode 免费模型零成本跑通，持久队列和 Agent 间传文件解决的是真痛点。

**想养一支「常开 AI 团队」的人，值得专门开台 VPS 部署。** 手机派活这个形态，目前市面上没几个对手。

**公司和商用场景，再等等。** 非商用许可 + 完全权限 + 0.x 版本，三个因素叠在一起，别急。

两个多月从 0 做到 1.8K Star，靠的不是再做一个聊天框，而是把一件事想透了：**AI Agent 不该是用完即弃的脚本，该是有工位、能协作、有排班的常驻同事。**

多智能体竞争的下半场，也许真不是谁的模型更聪明，而是谁给模型准备的办公室更好。

项目地址放这了，建议去 README 的 Security 章节读完再决定要不要上车：

**github.com/nightly-labs/openbot**

官网：openbot.run ｜ 当前版本 v0.51.1

---

我是 jk，一个只信「自己跑过」的开源/AI 工具实测派。
每次帮你筛一个能真正省钱、省时间的开源项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目地址和完整安装命令我放在了「**阅读原文**」。

相关阅读：
- [DeepSeek 官方出了 22 份接入指南，覆盖 Claude Code 到 Copilot，配置只要 3 分钟](https://mp.weixin.qq.com/s/4lZbySSLYj2aj-y-DIV7ZA)
- [用了三个月 Claude Code，我终于装上了 ADHD 输出模式](https://mp.weixin.qq.com/s/pvpTovUEWocgSWsRlcXHbA)
