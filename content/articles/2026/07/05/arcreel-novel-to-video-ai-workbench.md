---
title: "把一本小说做成短视频：拆开 ArcReel 这个 AGPL 开源 AI 视频工作台"
url: "/articles/2026/07/05/arcreel-novel-to-video-ai-workbench/"
date: "2026-07-05T14:00:00+08:00"
lastmod: "2026-07-05T14:00:00+08:00"
description: "ArcReel 是一个 AGPL-3.0 的开源项目，把「小说 → 短视频」做成了一条 AI Agent 编排的全流水线：Claude Agent SDK 做智能体，接入 Gemini / 火山方舟 / Grok / OpenAI / Vidu / 阿里百炼 / MiniMax / 可灵 八家供应商，Docker 一条命令跑起来。这一篇拆到源码级：三层架构、异步任务队列、编排 Skill + 聚焦 Subagent、多供应商抽象层，以及一条最短跑通路径。"
tags: ["AI 视频", "小说改编", "Claude Agent SDK", "开源项目", "多模态"]
topic: "AI 工具"
topicSlug: "ai-tools"
layout: article
contentType: article
---

![封面](/images/arcreel-novel-to-video-ai-workbench/cover-zhihu.png)

先说一个具体的场景。

你手里有一本 8 万字的小说，觉得改成短视频能火。要做的事按行业惯例大致是这样：先把稿子拆成一集一集，每集再拆成三十来个分镜，然后一个个开 AI 生图工具画角色、画场景、画分镜，再把每一张导进另一个视频生成平台做图生视频，最后所有 4 秒片段丢进剪映拼起来，配音、加字幕、配音乐。

这是一份**工具编排工作**，不是创作工作。真做过的人都知道，八成的时间花在这里：文件在本地和五六个平台之间来回搬，角色在这一场戴帽子下一场又不戴了，某个道具的样子第一集像 Zippo、第五集变成打火机、第八集又变成蜡烛。你没法让这五六家工具「记住上下文」，也没法让它们互相引用彼此生成的图。

`ArcReel/ArcReel`（[GitHub](https://github.com/ArcReel/ArcReel)）是把这件事重新做了一遍——不是又开一个 SaaS 让你去平台上点按钮，而是**把整条流水线做成一个可自托管的 Web 应用**，用 Claude Agent SDK 编排 AI 智能体，前后串接八家图/视频/文本供应商，Docker 一条命令跑起来。

我把仓库拉下来，读完 20K 字的 `AGENTS.md`（也就是它塞给 AI Agent 当项目记忆的那份）、通读 `README.md` / `docs/getting-started.md` / `docs/adr/`，翻了一遍 CHANGELOG（这个项目已经迭到 v0.20.1，光 2026 年就发了 20 个 minor + patch），跑了一遍源码结构。这一篇是我读完之后的完整判断：**它到底解了什么问题，谁应该现在装，谁再等一等，以及它跟 Sora Web 端 / 剪映 / 一众 SaaS 视频工具的真实边界在哪里**。

## 一、痛点：AI 视频真正的瓶颈不在生成，而在编排

先把「AI 生视频」这四个字拆开。

**生成本身**这几年已经不是问题。Veo 3.1、Seedance 2.0、Sora 2、可灵 v3、Vidu Q3——单看每一家的样片，都能把一句话生成 5-10 秒电影级画面。价格从 Fast 档的 $0.15/秒 到旗舰档的 $0.40/秒 不等，一分钟视频 $10-20 就能搞完。

真正卡人的是四件事：

1. **角色一致性。** 同一个角色出现在三十个分镜里，如果不锚定参考图，AI 每一次都会重新想象一遍。第一镜是黑发少年，第五镜变成金发少女，观众立刻出戏。
2. **道具/场景一致性。** 女主的红色项链、男主的黑色皮夹克、村口的老槐树，这些「线索」在剧本里可能出现几十次，需要跨镜头保持视觉稳定。
3. **叙事结构。** 8 万字小说不能直接扔给视频模型。得先做「全局角色/线索提取 → 分集规划 → 单集剧本 → 分镜」四步语言层加工，每一步都需要人机确认。
4. **任务编排。** 一集 30 个分镜，每个分镜要 1 张分镜图 + 1 个 4 秒视频，就是 60 次 API 调用。要处理限速、断点续传、重试、版本回滚、费用追踪——单机脚本堆到最后就是一份意大利面。

ArcReel 没做「更好的生成器」——它接的还是那八家现成的模型。它做的是**上面这四件事的编排层**，让生成器专注生成，让工作台专心处理连贯性、状态机和上下文。

## 二、方案：三层架构 + Claude Agent SDK 编排

架构上 ArcReel 是很干净的三层：

![三层架构](/images/arcreel-novel-to-video-ai-workbench/01-architecture.png)

- **frontend/** — React 19 + TypeScript + Tailwind CSS 4 + wouter 路由 + zustand 状态管理。SPA 通过 Vite 代理把 `/api` 打到 `http://127.0.0.1:1241` 的后端。
- **server/** — FastAPI + Python 3.12+ + Pydantic 2。路由都挂在 `/api/v1` 下（`server/routers/`），认证用 JWT + API Key（`arc-` 前缀，SHA-256 哈希入库）。实时通信是 SSE：助手 `/assistant/sessions/{id}/stream`、项目事件 `/projects/{name}/events/stream`。
- **lib/** — 核心库。多供应商后端抽象（`image_backends/` / `video_backends/` / `text_backends/`）、异步任务队列（`generation_queue.py`）、项目管理器（`project_manager.py`）、用量追踪（`usage_tracker.py`）都在这里。

数据库层是 SQLAlchemy 2.0 async ORM，开发默认 SQLite（`projects/.arcreel.db`），生产走 PostgreSQL（asyncpg）。迁移用 Alembic。这套技术栈的选择很务实——2026 年的默认答案，没花架子。

真正有意思的是**智能体层**。ArcReel 没用自研 Agent 框架，而是直接接了 Anthropic 官方的 [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview)（早年叫 Claude Code SDK），走的是「编排 Skill + 聚焦 Subagent」这套多智能体模式：

![Agent 架构](/images/arcreel-novel-to-video-ai-workbench/02-agent.png)

翻译成人话：

- **编排 Skill（`manga-workflow`）** 是主 agent 加载的一个 skill 文件，它的任务是**读 `project.json` 和文件系统，判断项目卡在哪一阶段**（角色设计还没做完？分集规划完了但剧本没生成？），然后 dispatch 对应的 Subagent。它是有状态检测能力的调度器。
- **聚焦 Subagent** 是干活的。`analyze-characters-clues` 负责从全书提角色和线索、`split-narration-segments` 负责说书模式片段拆分、`normalize-drama-script` 负责剧集动画规范化、`create-episode-script` 负责生成 JSON 剧本……每个 Subagent **只做一件事**，把小说原文、上下文等 heavy context 留在 Subagent 内部消化，向主 agent 只回一份精炼摘要。

这套设计解决了一个 Agent 系统的核心问题：**上下文预算**。8 万字小说一次全丢给主 agent，Claude 的 200K 窗口也会被塞满，后面所有的规划、对话都会退化。把重任务下放到一次性 Subagent，主 agent 只留决策链和摘要，就能撑住一整个项目的长会话。

编排 Skill 和 Subagent 的物理分工也很明确：**Skill 负责确定性脚本执行**（API 调用、文件生成、状态判定），**Subagent 负责需要推理的任务**（角色提取、剧本规范化）。这是一条我在其他 Agent 项目里也总结过的经验——把 LLM 该干的事和不该干的事分开，别让模型去做 for 循环。

## 三、供应商矩阵：8 家图片 + 8 家视频 + 6 家文本 + 自定义

ArcReel 最能打的一点是**多供应商抽象**。它有三条独立的后端协议：`ImageBackend` / `VideoBackend` / `TextBackend`，八家供应商全部按同一份接口接入，用 Registry + Factory 模式统一注册（`lib/image_backends/` / `lib/video_backends/` / `lib/text_backends/`）。

![供应商矩阵](/images/arcreel-novel-to-video-ai-workbench/03-providers.png)

**图片供应商（8 家）：**

| 供应商 | 代表模型 | 计费 |
|--------|----------|------|
| Gemini | Nano Banana 2 / Pro | 按分辨率查表 (USD) |
| 火山方舟 | Seedream 5.0 / 4.5 / 4.0 | 按张 (CNY) |
| Grok (xAI) | Grok Imagine Image (Pro) | 按张 (USD) |
| OpenAI | GPT Image 2 | 按 token (USD) |
| Vidu | Vidu Q2 / Q1 Image | 积分折算 (CNY) |
| 阿里百炼 | Qwen Image 2.0 / 万相 2.7 | — |
| MiniMax | MiniMax Image 01 | — |
| 可灵 Kling | 可灵图像 O1 / v3-Omni | — |

**视频供应商（8 家）：**

| 供应商 | 代表模型 | 时长 |
|--------|----------|------|
| Gemini | Veo 3.1 / 3.1 Fast / 3.1 Lite | 4 / 6 / 8 秒 |
| 火山方舟 | Seedance 2.0 / 2.0 Fast / 1.5 Pro | 4-15 秒 |
| Grok | Grok Imagine Video | 1-15 秒 |
| OpenAI | Sora 2 / Sora 2 Pro | 4 / 8 / 12 秒 |
| Vidu | Vidu Q3 Turbo / Pro / Reference | 1-16 秒 |
| 阿里百炼 | HappyHorse 1.0 / 万相 2.7 | 2-15 秒 |
| MiniMax | Hailuo 2.3 / 2.3 Fast / S2V-01 | 6 / 10 秒 |
| 可灵 Kling | 可灵 2.5 Turbo / v3 / v3 Omni | 5 / 10 秒 |

**文本供应商（6 家）：** Gemini / 火山方舟 / Grok / OpenAI / 阿里百炼 / MiniMax，其中 Gemini / 火山方舟 / Grok / OpenAI 支持结构化输出 + 视觉理解，另两家支持结构化输出。文本这条链上还挂了 Instructor（结构化输出的降级路径），用来兜住那些不原生支持结构化输出的模型。

除了这些预置供应商，还可以在设置页添加**自定义供应商**——任何 OpenAI 兼容 / Google 兼容 API（Ollama、vLLM、第三方中转都算）都能接：填 Base URL + API Key，系统自动调 `/v1/models` 发现可用模型，按名称推断媒体类型（图片/视频/文本），接进来后跟预置供应商享有同等待遇——全局/项目级切换、费用追踪、版本管理都不缺。

**协议归属的单一真相源**：所有供应商的调用协议都登记在 `ENDPOINT_REGISTRY`（`lib/config/registry.py`），一个 endpoint 决定 backend 如何被构造和调用。这套设计让接入新供应商变成一件相当机械的事——写一份 backend 实现、在 registry 注册、补一份 `ModelInfo` 元数据（含计费信息），完事。

供应商选择的优先级：**项目级 > 全局默认**。切换时通用参数（分辨率、宽高比、音频等）沿用，供应商特有参数保留。这个策略很关键——项目做到一半你想把 Veo 3.1 换成 Seedance 2.0 试试，不用全部重来。

## 四、任务队列：Image / Video / Audio 三条并发通道

一集 30 个分镜就是 60+ 次 API 调用（画分镜 + 生视频），全丢队列里跑，能不能不炸？

ArcReel 的答案在 `lib/generation_queue.py` 和 `lib/generation_worker.py` 里：

- **任务模型统一**——分镜/视频/角色/场景/道具/参考视频都是同一张 `Task` 表的记录，状态机 `queued → running → succeeded | failed | cancelling → cancelled`。
- **通道分离**——`GenerationWorker` 开两条独立并发通道，image 和 video 各走各的。这样图片任务不会被慢一档的视频任务阻塞。
- **Lease-based 调度**——每条 worker 拿任务时给一段 lease TTL，超时未续 lease 就被判定「卡死」重新排队。这是分布式任务队列的标准做法，落在单机上也不亏。
- **RPM 限速**——按供应商配额限速，不超 API rate limit。
- **断点续传**——项目状态由 `StatusCalculator` **读时计算**（不存储冗余状态字段），断电后重新触发任务时自动跳过已完成部分。

前端不是轮询单个任务，而是**从头到尾订阅 SSE**：`/projects/{name}/events/stream` 推项目变更、`/tasks` 拿队列状态。所以你在 Web UI 看到的 30 个分镜从灰 → 转圈 → 图 → 转圈 → 视频这个动画，是后端推的，不是前端轮询假装的。

## 五、内容模式 × 生成模式：两条正交维度

ArcReel 把「你要做什么」拆成两条**独立正交**的维度。第一次看会有点绕，但读懂之后你会发现这个设计非常干净。

**内容模式 `content_mode`——决定剧本结构：**

- `narration`（说书）：按朗读节奏拆片段，用 `NarrationSegment` 数据结构。适合把小说做成有声书式的说书短视频。
- `drama`（剧集动画）：按场景/对话组织，用 `DramaScene` 数据结构。适合把小说做成动画剧集。
- `ad`（广告/短片）：按目标总时长生成带货镜头脚本，单集直达单视频。上传产品多图 → 生成标准产品参考图 → 一键生成八段式带货脚本 → 产品镜头全程锚定真品。

**生成模式 `generation_mode`——决定视频来源：**

- 默认（图生视频）：分镜图 → 视频。
- `reference_video`：参考生视频，直接以角色/场景/道具资产图生成视频，**跳过分镜步骤**。速度更快但可控性稍低。
- 宫格生视频：多分镜合成 `grid_4/6/9` 图，拆成首尾帧驱动视频生成。适合快速做过渡镜头。

有意思的一点：这两个字段对 LLM **是隐藏的**（`SkipJsonSchema`），由编排层直接注入。也就是说 Skill / Subagent 不能自己去「推断」应该走哪个模式——这个决策权始终留在人 + 编排层手里，避免 LLM 想歪。

这个「LLM 只做它擅长的事」的思路贯穿整个项目。看多了 Agent 项目喜欢让 LLM 什么都决定，最后卡在幻觉里，ArcReel 这种「拿走这些决策」的做法反倒更工程化。

## 六、最短跑通路径：从 clone 到第一个视频

```bash
# 1. 克隆 + 进部署目录
git clone https://github.com/ArcReel/ArcReel.git
cd ArcReel/deploy

# 2. 环境变量文件
cp .env.example .env
# 可选：在 .env 里设置 AUTH_PASSWORD=<你的密码>，不设就首次启动自动生成回写

# 3. 启动
docker compose up -d

# 4. 打开浏览器
open http://localhost:1241
# 默认账号 admin，密码在 .env 里的 AUTH_PASSWORD
```

生产部署换 `deploy/production/`，用 PostgreSQL：

```bash
cd ArcReel/deploy/production
cp .env.example .env
# 必设 POSTGRES_PASSWORD
docker compose up -d
```

进 UI 之后**必做的两件配置**（`/app/settings`）：

1. **ArcReel 智能体** — 配一份 Anthropic 或兼容网关的凭据（base_url + api_key + routing model）。如果访问不了 Anthropic 官方 API，第三方中转也行——ArcReel 支持自定义 Base URL 和 Haiku/Sonnet/Opus 分级 + Subagent 模型分别配置。
2. **AI 生图/生视频/生文本** — 至少配一家供应商 API Key。第一次玩推荐火山方舟：国内速度快、CNY 计费好算、Seedance 2.0 Mini 已经是 v0.20 的出厂默认视频模型。

配完之后就是常规流程：

1. **新建项目** → 上传小说 .txt / .docx / .epub / .pdf（源加载在 `lib/source_loader/`）
2. **对话生成剧本** → AI 助手面板里跟主 agent 聊，dispatch 分集规划 / 剧本生成 Subagent
3. **审核 → 生成角色设计图** → 每个角色一张，锚定后续所有分镜的角色一致性
4. **审核 → 生成线索设计图** → 关键道具/场景一张，跨镜头保持视觉稳定
5. **生成分镜图** → 每集 20-30 张，AI 自动引用角色 + 线索图
6. **生成视频片段** → 分镜图作为起始帧，8 家视频供应商任选
7. **（可选）旁白配音** → 说书 / 广告模式支持 TTS：阿里百炼 Qwen3 TTS 或任意 OpenAI 兼容 TTS
8. **FFmpeg 合成** → 默认 9:16 竖屏，短视频平台直出
9. **导出剪映草稿** → ZIP 打包，剪映 5.x / 6+ 都支持，drama 模式带对话/旁白字幕轨

每一步都有**审核点**。这个设计非常关键：AI 生成从来不是一次到位，人类反复审 + 局部重生成才是真实工作流。ArcReel 把「审核确认」做成了流水线上的显式节点，不是让你埋头等出成品。

## 七、值得单独讲的几个工程决策

### 1. Agent 沙箱：Linux/macOS 默认 bwrap 隔离

Agent 工具调用外围加了一层 [bwrap](https://github.com/containers/bubblewrap) 沙箱，文件系统、网络、子进程按白名单授权。在 `server/app.py::check_sandbox_available` 里探测和启用。写新 Agent 工具时假设沙箱**默认开启**——路径越界、外发请求会被拒绝，需要时显式声明权限。

Windows 原生没有 bwrap，会自动降级到 `_WINDOWS_BASH_PREFIX_WHITELIST` 代码白名单。粗一点，但生产建议直接上 WSL2 / Docker Desktop 走完整沙箱。

这条设计的意义在于：让 Agent 有权访问项目文件和 API，但不给它越权的能力。市面上很多 Agent 应用连 `rm -rf` 都不拦，ArcReel 是少数把「沙箱是默认能力」写进 spec 的。

### 2. 状态字段不存储，读时计算

`scenes_count` / `status` / `progress` 这些统计字段**从来不落库**。所有状态由 `StatusCalculator` 读时计算注入。

这是一个我在其他数据密集型系统里也一直想推的做法：**冗余状态字段是 bug 的温床**。落库了就要维护一致性、就要写触发器、就要在异常路径回滚。读时算的成本远比看起来低，尤其在 async ORM + SQLite 的组合下——一次 join 而已。

数据分层的整个策略是这样：

| 数据类型 | 存储 | 策略 |
|---------|------|------|
| 角色/场景/道具定义 | `project.json` + `assets` 表 | 单一真相源，剧本中仅引用名称 |
| 剧集元数据 | `project.json` | 剧本保存时写时同步 |
| 统计字段 | **不存储** | 读时计算 |

`lib/asset_types.py` 里的 `ASSET_SPECS` 抽象把角色/场景/道具三类资产的差异折叠成一份 spec——驱动路由工厂（`_asset_router_factory.build_asset_router()`）、bucket key、sheet 字段、PATCH 白名单。**新增资产类型只需在 spec 注册**，不用改路由代码。这种「让配置驱动一切」的做法在 v0.20 的 CHANGELOG 里也看得到：script 骨架从 v0.19 的分派逻辑 v0.20 收敛为「单一真相源 + 消费方穷尽性断言」，明显是在往这个方向持续收敛。

### 3. 多语言全栈：中/英/越三语

后端翻译层在 `lib/i18n/`，`zh/en/vi` 三种语言，按命名空间拆分：`errors`（错误与校验）、`providers`（供应商名称）、`assets`（资产消息）、`emails`（邮件模板）、`system`（系统消息）、`templates`（模板消息）。路由里通过 `_t: Translator` 依赖注入调用 `_t("key", param=value)`。

前端用 i18next + react-i18next，翻译文件在 `frontend/src/i18n/{zh,en,vi}/`，命名空间 `common` / `dashboard` / `auth` / `errors` / `assets` / `templates`。

对开源项目来说，把 i18n 做到全栈（后端错误消息也翻译）是个不小的工作量。这条也侧面反映项目定位——不只是给国内用户的玩具，v0.20 前后开始服务东南亚市场。

### 4. OpenClaw 集成：把 ArcReel 变成外部 Agent 平台的工具

ArcReel 支持通过 [OpenClaw](https://openclaw.ai) 等外部 AI Agent 平台调用：

1. 在 ArcReel 设置页生成 API Key（`arc-` 前缀）
2. 在 OpenClaw 中加载 ArcReel 的 Skill 定义（访问 `http://your-domain/skill.md` 自动获取）
3. 通过 OpenClaw 对话即可创建项目、生成剧本、制作视频

技术实现：API Key 认证（Bearer Token）+ 同步 Agent 对话端点（`POST /api/v1/agent/chat`），内部对接 SSE 流式助手并收集完整响应返回。

也就是说 ArcReel 不只是一个「独立 SaaS」，它自己就是**一个可以被更高层 Agent 调用的工具**。这个设计在 2026 年的 Agent 生态里越来越常见——每个应用都提供 skill.md，让外部编排层能像使用工具一样使用它。

## 八、边界：谁应该现在装，谁再等一等

坦白说，ArcReel 不是给所有人的。

**现在就装的：**

- 想把长文本（小说 / 剧本 / 长文）批量做成短视频，且不满足于「一段话生一个视频」的粗放做法的人。
- 内容团队要跑量、要控成本、要有版本管理和费用追踪的场景。ArcReel 的多 API Key 管理 + 费用预估三级下钻（项目/单集/单镜头）是刚需。
- 已经在做 AI 视频业务、想把中间那层「工具编排」拉进自己控制的团队。AGPL-3.0 意味着你可以自托管、可以改代码，但如果你要做 SaaS 分发给别人，得开源你的修改（这是 AGPL 和 GPL 的关键区别）。想商用 AGPL 之外的场景，README 里留了 [support@arc-reel.com](mailto:support@arc-reel.com) 的商用许可入口。
- 折腾 Claude Agent SDK 想找一个完整的、生产级的 reference 实现。ArcReel 是我见过最完整的一个——多 Subagent 编排 + Skill 状态检测 + SSE 流式回复 + Session Actor + Transcript DB 镜像，SDK 的边角能力都用上了。

**再等一等的：**

- 想「一段话生一个 30 秒视频」的、要极致速度的用户。ArcReel 的流水线是**为长内容设计**的，做单个短视频它是过设计（overkill）——直接开 Sora Web 端更快。
- 不想自托管的用户。ArcReel 只发布代码 + Docker 镜像，不提供官方 hosted 服务。如果你要 SaaS 体验，等国内类似的商业化产品或者自己搭一个。
- Windows 原生用户。虽然基础流程能跑，但沙箱降级会限制 Agent 工具能力，生产还是建议 WSL2 / Docker Desktop。
- 完全不懂 API Key、不想开付费 API 账户的用户。ArcReel 只是编排层，真金白银的成本还是在八家供应商那里。8 万字小说改一集短视频，一线模型跑下来 $10-15 是常态，别指望免费。

## 九、和 Sora Web / 剪映 / 一众 SaaS 的边界

写完上面这些还是有人会问：ArcReel 到底跟 Sora / Runway / 剪映有啥区别？简单画一下：

| 工具 | 定位 | 你控制什么 | 局限 |
|------|------|-----------|------|
| **Sora / Runway Web** | 单视频生成 SaaS | prompt + 参考图 | 无项目状态、无长内容编排、无多供应商切换 |
| **剪映 / CapCut** | 视频剪辑器 | 素材拼接、字幕、特效 | 不生成素材、无 AI 编排 |
| **一众 AI 视频 SaaS** | 商业化视频工作台 | prompt + 部分模板 | 单供应商锁定、闭源、成本不透明、无自托管 |
| **ArcReel** | 开源 AI 视频**编排层** | 完整流水线、多供应商、项目状态、Agent 逻辑 | 需要自托管、需要开 API 账户、初次学习曲线 |

一句话：**如果你把 AI 视频当消费品，用 Sora；如果你把 AI 视频当生产工具，用 ArcReel**。它们解的问题根本不在同一个层面。

## 十、我改了哪个认知

读完这个项目，我最大的认知变化是：

**AI 视频行业的下一战，不在模型，在编排。**

模型这一层，Veo / Sora / Seedance / 可灵 / Vidu 在两年内会拉平——单看 5-10 秒画面质量，差距已经小到普通观众看不出来了。真正拉开差距的是：谁能把一个复杂业务（比如「一本 8 万字小说 → 30 集短视频」）用 AI 编排完，还保持角色一致、道具一致、成本可控、断点可续、版本可回滚。

ArcReel 的技术栈选择也印证这一点：**它自己不做任何模型，只做编排**。八家供应商全是外部 API，核心价值是「怎么让这八家一起打配合」。这种「重编排、轻生成」的架构，我猜会成为下一阶段 AI 应用的标配。

Claude Agent SDK 是 Anthropic 押的注：**LLM 不该只是 chat，应该是 agent runtime**。ArcReel 是这条路上少数把 SDK 的多智能体能力真正吃透的应用。

## 命令清单（可收藏）

```bash
# 快速跑通
git clone https://github.com/ArcReel/ArcReel.git
cd ArcReel/deploy && cp .env.example .env && docker compose up -d
# → http://localhost:1241 (账号 admin，密码在 .env)

# 生产部署 (PostgreSQL)
cd ArcReel/deploy/production && cp .env.example .env
# 编辑 .env 设置 POSTGRES_PASSWORD
docker compose up -d

# 本地开发
uv sync                                              # 装依赖
uv run alembic upgrade head                          # 数据库迁移
uv run uvicorn server.app:app --reload \
  --reload-dir server --reload-dir lib --port 1241   # 后端（限定 --reload-dir，否则会扫十几万文件）
cd frontend && pnpm install && pnpm dev              # 前端

# 测试
uv run python -m pytest                              # 后端
uv run ruff check . && uv run ruff format .          # lint + format
uv run basedpyright                                  # 类型检查
cd frontend && pnpm lint && pnpm check               # 前端 CI 等价

# pre-commit（本地克隆后必跑一次）
uv run pre-commit install
```

## 参考

- 项目地址：<https://github.com/ArcReel/ArcReel>
- 完整入门教程：<https://github.com/ArcReel/ArcReel/blob/main/docs/getting-started.md>
- 剪映草稿导出：<https://github.com/ArcReel/ArcReel/blob/main/docs/jianying-export-guide.md>
- Claude Agent SDK 官方文档：<https://docs.claude.com/en/api/agent-sdk/overview>
- 许可证：AGPL-3.0（想商用请联系 [support@arc-reel.com](mailto:support@arc-reel.com)）
