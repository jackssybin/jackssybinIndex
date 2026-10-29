---
title: "10.8 万 Star：我把 Paperclip 跑了一遍，看它怎么把一群 AI Agent 变成一家公司"
slug: "paperclip-ai-agent-company"
date: 2026-10-29
draft: false
categories: ["开源项目", "AI工具"]
tags: ["开源", "Paperclip", "多智能体", "Agent编排", "Claude Code", "Codex", "AI治理", "MIT"]
cover: "/images/paperclip-ai-agent-company/cover.png"
description: "paperclipai/paperclip 是 2026 年 3 月建仓、八个月涨到 10.8 万 Star 的 MIT 开源项目：它不做 Agent，而是把 Claude Code、Codex、OpenClaw、Cursor、Gemini、OpenCode、Grok、Hermes 等一众 Agent 编排成一家有组织架构、预算、审批和 KPI 的「公司」。Node.js 服务端 + React 仪表盘，支持心跳唤醒、原子任务认领、成本预算硬停止、技能工作室、定时例行任务和多组织隔离。本文克隆仓库（1.2 万+文件、2700+ 已合并 PR）拆解它的四大支柱、控制平面架构、接入方式与自托管部署，也说明它和 OpenBot 这类桌面工作台的差别、6766 个 open issues 与默认遥测这些需要留意的地方。"
---

如果你电脑上同时开着 20 个 Claude Code 终端，大概率会陷入一种很具体的混乱：这个在改登录，那个在写测试，第三个跑飞了循环在烧 token，重启电脑后一切归零，没人知道哪个窗口到底在干什么。

过去半年，业界给这种混乱开的药方是「多 Agent 框架」——教你怎么从零写一群能互相调用的 Agent。[paperclipai/paperclip](https://github.com/paperclipai/paperclip) 的切入点完全不同，README 里有一句话概括得极准：**「如果 OpenClaw 是一名员工，Paperclip 就是公司本身。」**

它不是 Agent，不提供模型，也不教你写 Agent。它是一个 Node.js 服务端加 React 仪表盘，把你已经在用的 Claude Code、Codex、OpenClaw、Cursor、Gemini、OpenCode、Grok Build、Kimi Code、Hermes 等各种 Agent 编排成一家「公司」：有组织架构、有上下级、有预算、有审批关卡、有技能培训、有绩效评估，还有一个手机也能打开的任务看板。

数据先说：项目 2026 年 3 月 2 日建仓，到本文时约八个月，**108,304 Star、17,946 Fork，已合并超过 2700 个 PR**，MIT 许可证，TypeScript 为主，open issues 6766 个。我把仓库完整克隆下来（12650 个文件的 pnpm monorepo），通读了 README、DESIGN、ROADMAP 和包结构，并实际跑了一遍安装流程。这篇讲清楚四件事：它和「多开终端」「多 Agent 框架」到底差在哪、那四大支柱具体是什么、底层控制平面怎么运转，以及——它适合谁、不适合谁。

## 一、心智模型：管理的是经营目标，不是 Pull Request

大多数编码 Agent 工具的抽象单位是「会话」或「PR」，Paperclip 的抽象单位是**公司（organization）**。

它的主流程只有三步，README 把它印在最显眼的位置：

1. **定义目标**——比如「做一个冲到 100 万美元 MRR 的 AI 笔记应用」；
2. **招聘团队**——CEO、CTO、工程师、设计师、市场，任何 bot、任何模型供应商都可以；
3. **审批并运行**——审阅策略、设定预算、点击开始，在仪表盘上监督。

![用 Paperclip 开一家 AI 公司只要三步](/images/paperclip-ai-agent-company/flow.png)

界面看起来像一个任务管理器（Trello/Linear 那一挂），但底层是组织架构、预算、治理、目标对齐和 Agent 协调。它反复强调一句话：**Manage business goals, not pull requests（管理经营目标，而不是合并请求）。**

![Paperclip 的四大支柱：智能体任务管理、组织架构、员工培训、智能体操作系统](/images/paperclip-ai-agent-company/pillars.png)

这套抽象的核心是「目标血缘（goal ancestry）」：任务挂在项目下、项目挂在公司目标下，Agent 领到任务时拿到的不只是一个标题，而是「为什么做这件事」的完整上下文。这解决了多 Agent 协作里最常见的问题——你得手动从各处凑信息来提醒 bot 到底在干嘛。

## 二、四大支柱：任务、组织、培训、基础设施

Paperclip 认为一群 AI Agent 要真正产出，只有四件事必须work，整个产品就围着这四根柱子造：

![Paperclip 的四大支柱：智能体任务管理、组织架构、员工培训、智能体操作系统](/images/paperclip-ai-agent-company/pillars.png)

**第一支柱：Agentic 任务管理器（日常给所有人用）。** 任务以工单（ticket）形式存在，对话按任务成线，会话跨重启持久化。支持审批和评审关卡、可审计的例行流程，以及从 diff、截图和测试结果来验证产出——也就是「Agent 干活，人验收结果」。

**第二支柱：Agent 组织架构（给管理者用）。** 人和 Agent 混编在同一张组织图里，每个 Agent 有头衔、有上级、有岗位职责描述。治理层面定义谁能做什么，密钥按作用域发放，公司之间有边界，连接权限和「责任用户身份（responsible-user identity）」分开管理——这一条很关键：当 Agent 执行受管的 GitHub 操作时，可以归属为指挥这项工作的那个真人。

**第三支柱：Agent 员工培训（给赋能者用）。** 内置 Skill Studio 和全组织共享技能，支持评测（evals）、保存测试运行、主动学习循环、质量指标，甚至给 Agent 做「绩效评审」；技能有版本历史，可回滚，还有可复用的团队模板。

**第四支柱：Agentic OS（给 IT 和平台用）。** 跨供应商运行时（任意模型、任意 Agent）、沙箱、集成和 MCP 服务器、SSO、GRC、RBAC 和成本控制、数据隐私和内部 trace 收集。这是让上面一切真正跑起来的基础设施。

## 三、控制平面：它是完整的编排层，不是一个套壳

看 README 那张架构图会发现，Paperclip 自我定位是 control plane（控制平面），而不是 wrapper。服务端内部是一组成体系的子系统：

![Paperclip 控制平面的十二个核心子系统](/images/paperclip-ai-agent-company/architecture-v2.png)

我挑几个工程上最见功夫的讲。

**原子任务认领（atomic checkout）。** 一个任务只有单一负责人，加上执行锁，防止多个并发运行抢同一个任务。这是分布式任务系统里的经典难题，自己从零写很容易踩坑。

**心跳执行（heartbeat execution）。** 底层是一个落库的唤醒队列，带事件合并、预算检查、工作区解析、密钥注入、技能加载和适配器调用。Agent 平时是「睡着」的，被分派工作、收到跟进消息或按定时计划时才醒来。每次运行产生日志、用量记录和适配器专属的会话状态，失败时有界恢复（bounded recovery），处理不了的才上报给人。

**持久工作上下文。** 任务、评论、文档都留在 Paperclip 里，支持的适配器能在多次运行之间恢复保存的会话——这对应了「重启后一切归零」那个痛点。

**带回滚的治理。** 审批关卡是强制的，配置变更带版本号，糟糕的改动可以安全回滚；网关动作可以设为「允许 / 每次询问 / 关闭」，一次调用可以只批准一次，也可以存成一条可撤销的规则。

**预算与成本控制。** token 和花费按公司、Agent、项目、目标、工单、供应商、模型七个维度记账。可以配预算策略：警告阈值 + 硬停止。这直击 Agent 最吓人的失控场景——跑飞的循环在你发现之前烧掉几百美元、打爆配额。

**例行任务（routines）。** 用 cron、webhook 或 API 触发的循环工作，有并发和补跑策略；每次执行都生成一个带负责人和历史的工单。客服、社媒、报表这类周期性工作不再需要人记得去启动。

此外还有多组织隔离（一份部署服务多家「公司」，数据和权限各自独立）、插件系统（进程外 worker，不 fork 代码即可扩展）、加密凭据存储、不可变活动审计日志，以及带密钥脱敏的公司模板导出/导入。

## 四、Bring Your Own Agent：只要能收心跳，就录用

Paperclip 最实用的一点是不挑 Agent。README 原话是「If it can receive a heartbeat, it's hired（只要能接收心跳，就录用）」。官方适配的运行时包括：

- **编码 CLI**：Claude Code、Codex、Cursor 及 Cursor Cloud、Gemini CLI、OpenCode、Grok Build、Kimi Code、Pi；
- **Agent 平台**：OpenClaw、Hermes 及 Hermes Gateway；
- **扩展方式**：自定义进程、HTTP 端点、外部适配器包。

每个 Agent 可以单独选模型和 harness，但任务、技能、权限、历史全部汇聚在同一处。多模型多 harness 团队、共享 Agent 但走个人账号这类组合都支持。

![Paperclip 的招聘名单：编码 CLI、Agent 平台与扩展方式](/images/paperclip-ai-agent-company/roster.png)

连接的应用层面，可以接入 GitHub、Notion、Railway 或你自己的 MCP 服务器；实验性的 Agent Chat 还支持通过 Slack、Discord、Telegram、AgentMail 和 Agent 对话。云沙箱也已接入 e2b、Cloudflare、Daytona、Modal、Novita、boxd 和自建 Kubernetes。

## 五、五分钟跑起来：真自托管，不要账号

它是自托管开源软件，不强制注册 Paperclip 账号。安装门槛低得意外，Node.js 24.11+ 之后一行命令：

```bash
npx paperclipai@latest onboard --yes
```

CLI 从 npm 缓存运行，实例配置和数据持久化在本地。想先隔离试用，有个 `test-drive` 模式，预置好一个 CEO Agent，前台运行、不装系统服务、配置成功后才开浏览器：

```bash
ANTHROPIC_API_KEY=... npx paperclipai test-drive
OPENAI_API_KEY=... npx paperclipai test-drive --harness codex
OPENROUTER_API_KEY=... npx paperclipai test-drive \
  --harness opencode \
  --model openrouter/anthropic/claude-sonnet-4.5
```

从源码开发也简单：

```bash
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
pnpm dev
```

UI 和 API 起在 `http://localhost:3100`，嵌入式 PostgreSQL 自动创建，零数据库配置。本地单进程管着嵌入式 Postgres 和本地文件存储；生产环境则指向你自己的 Postgres，随意部署。默认是受信任的本地回环模式，要远程访问可以用 `--bind lan` / `--bind tailnet` 切到认证模式（官方建议走 Tailscale 这类私网），也有官方 Docker 镜像。

一个真实的小坑值得记下：如果你全局 `~/.npmrc` 配了私有 npm registry，npx 可能把 `paperclipai` 解析到私有源报 E404，加 `--registry https://registry.npmjs.org` 强制走公共源即可。

## 六、它不是什么，以及需要冷静看待的地方

为了不把它写成软文，有几个边界要讲清。

**它和 OpenBot 不是一类东西。** 我前阵子写过的 [OpenBot](/articles/2026/10/27/openbot-local-multiagent-workspace.html) 是「本地桌面工作台」，给每个 Agent 一个独立工位和浏览器，偏单机协作；Paperclip 是「服务端控制平面」，面向 7×24 自治、多用户、预算和合规的团队经营场景。前者像给每个工程师配电脑，后者像直接开一家公司。

![裸开终端、OpenBot 类桌面工作台、Paperclip 控制平面三种用法对比](/images/paperclip-ai-agent-company/compare.png)

**它明确不是**：聊天机器人（对话始终挂在任务上）、Agent 框架（不教你造 Agent）、工作流引擎（例行任务运行在组织、角色、预算、治理之内）、提示词管理器（Agent 自带模型和提示词）。

**成熟度要客观看。** 八个月冲到 10.8 万 Star 非常惊人，但同时挂着 **6766 个 open issues**，Agent Chat、聊天/邮件连接器、记忆/知识库、云部署等都还标注为实验性（🟡）或未开始（⚪），桌面 App 也在 roadmap 上没交付。星标增速和生产就绪度是两回事，重要业务上之前仍需充分测试。

**遥测默认开启。** Paperclip 默认采集匿名使用遥测（声明不含个人信息、任务内容、提示词、文件路径或密钥，私有仓库引用会加盐哈希）。介意的话可以用 `PAPERCLIP_TELEMETRY_DISABLED=1`、`DO_NOT_TRACK=1` 或配置文件关闭，CI 环境自动关闭。另外 Sentry 错误监控和 OpenTelemetry tracing 都是可选（opt-in）的。

**安全模型要理解对。** 本地回环模式默认受信任，Agent 拿到的是真实执行能力。它提供审批关卡、预算硬停止、作用域密钥、沙箱等约束，但自治 Agent 能跑命令、动代码、连外部服务这件事本身没有变——生产环境务必用认证模式、最小权限密钥，并保留人在评审关卡上。

## 七、适合谁，现在就上吗

- **已经在并行养很多个 Agent、又管不过来的开发者和小团队**：这就是为「20 个 Claude Code 标签页」那个场景造的，工单、预算、持久会话立刻解决真问题，可以从 `test-drive` 零成本试；
- **想做 7×24 自治业务、又要审计和成本控制的人**：心跳 + 例行任务 + 预算硬停止 + 多组织是现成的，自己拼这套控制平面代价很高；
- **需要合规、SSO/RBAC、多用户的企业试点团队**：MIT 许可（真正 OSI 开源，可商用）是它相对非商用同类产品的巨大优势；
- **追求稳定生产环境的保守团队**：建议再观察，关注 issue 积压消化速度和实验特性毕业情况，先在非核心流程跑。

八个月 10.8 万 Star，Paperclip 踩中的是一个真实的范式转移：当一个人可以指挥几十个 AI 员工，瓶颈就不再是「怎么让 Agent 更聪明」，而是「怎么给这些员工建组织、定预算、立规矩、做考核」。它把公司管理的整套制度软件化了。Agent 时代的 ERP 长什么样，Paperclip 给出了目前最完整的一个答案——尽管这家「公司」本身，也还在高速施工中。

> 项目地址：[https://github.com/paperclipai/paperclip](https://github.com/paperclipai/paperclip)
> 官网/文档：[https://paperclip.ing](https://paperclip.ing) ｜ [docs.paperclip.ing](https://docs.paperclip.ing)
> 许可证：MIT（可商用）｜数据基准：2026-10-29
>
> 本文基于仓库 main 分支源码、README 与官方文档撰写，功能以官方最新文档为准。
