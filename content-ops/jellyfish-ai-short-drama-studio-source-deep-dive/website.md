---
title: "别再一个镜头一个镜头地抽卡了：我读完 6.3k star 的 AI 短剧工厂 Jellyfish 源码"
date: 2026-09-12T20:50:00+08:00
lastmod: 2026-09-12T20:50:00+08:00
slug: jellyfish-ai-short-drama-studio-source-deep-dive
draft: false
description: "Jellyfish 是一个 Apache-2.0 的 AI 短剧端到端生产工作台（6.3k star）：剧本拆解、分镜候选确认、角色/场景/道具/服装实体一致性、关键帧与视频生成、Celery 异步任务中心。我克隆仓库读了 FastAPI 后端的 chains、状态机与任务执行层，拆清它和即梦/可灵网页版的本质差别、三状态分离设计、Docker Compose 部署路径，并给出谁该用、谁先等的判断。"
tags: ["开源", "AI视频", "AI短剧", "工作流", "FastAPI", "Celery", "自托管"]
topic: "开源项目"
topicSlug: "open-source"
layout: article
contentType: article
type: article
cover: "/images/jellyfish-ai-short-drama-studio-source-deep-dive/cover-wechat.jpg"
---

# 别再一个镜头一个镜头地抽卡了：我读完 6.3k star 的 AI 短剧工厂 Jellyfish 源码

用即梦、可灵这类工具做过 AI 短剧的人，大概都经历过同一个崩溃时刻：第 47 个镜头里，男主的脸又变了。

你回去翻第 3 个镜头的图，想找到当初那张"长得最对"的关键帧，发现它躺在某个对话记录里，文件名是一串随机 ID；女主角在第 12 集穿了什么衣服，全靠你在网盘里人肉搜索；剧本改过三版之后，哪些镜头已经生成、哪些只是分镜文本，没人说得清。**单镜头的生成质量追上来以后，真正卡住短剧生产的早就不是模型，而是"几十上百个镜头之间的一致性和流程管理"。**

这周我翻到的开源项目 [Jellyfish](https://github.com/Forget-C/Jellyfish)（Apache-2.0，GitHub 6367 star / 1101 fork），瞄准的就是这件事。它的自我定位是"AI 短剧生产工作台"：从剧本输入、结构化分镜、一致性资产管理、镜头准备、图片/视频生成到导出，全流程在一个自托管系统里完成。我把仓库克隆下来通读了 FastAPI 后端的 Agent 链、状态机文档和任务执行层，这篇回答三个问题：它和直接用即梦/可灵到底差在哪、源码里哪些设计是真功夫、自己跑一套要付出什么成本。

## 一、它不是"又一个生成入口"，是一条生产流水线

README 里的截图展示了它的产品形态：项目列表里每部短剧是一张卡片，带章节数、角色数、场景数、道具数和完成进度；进入项目后以**章节**为单位组织剧本、镜头和生成任务。

![Jellyfish 项目列表界面：每部短剧按章节/角色/场景/道具统计进度](/images/jellyfish-ai-short-drama-studio-source-deep-dive/ui-projects.png)

它的主流程在 `AGENTS.md` 里写得非常明确，我按源码整理成这张图：

![Jellyfish 端到端流水线：剧本输入、AI 拆解、候选确认、ready、生成工作室、Celery 生成、任务中心、导出](/images/jellyfish-ai-short-drama-studio-source-deep-dive/01-pipeline.png)

关键在于中间那道"**候选确认**"闸门。系统用 AI 把章节剧本拆成镜头，再从文本里抽取角色、场景、道具、服装和对白——但抽出来的东西不直接生效，而是进入两张候选表（`shot_extracted_candidates` / `shot_extracted_dialogue_candidates`），由人逐条接受、忽略，或者关联到已有资产。你确认"这把剑就是第 3 集那把青霜剑"之后，后续所有镜头都复用同一个实体。

这套思路和即梦/可灵的网页版是两种物种：

| 维度 | 即梦/可灵网页版 | Jellyfish |
|---|---|---|
| 工作单位 | 单个提示词、单个镜头 | 项目 → 章节 → 镜头，结构化管理 |
| 角色一致性 | 靠参考图上传 + 手动挑选 | 角色/演员/场景/道具/服装实体建模，跨镜头引用 |
| AI 产出 | 直接出成品 | 先进候选池，人工确认后才成为资产 |
| 长任务 | 网页转圈，失败重来 | Celery 任务中心：状态、耗时、取消、回跳 |
| 模型 | 平台绑定 | 自带 provider 抽象，OpenAI + 火山方舟双通道，模型在管理后台配置 |
| 数据 | 在平台手里 | MySQL + S3 兼容存储，全在自己服务器上 |

## 二、11 个专职 Agent：它把"理解剧本"拆成了一条流水线

后端 `backend/app/chains/agents/` 目录下有 11 个职责单一的 Agent 文件，这是我认为整个项目里工程含量最高的部分：

- `script_divider_agent`：把章节剧本拆成镜头
- `element_extractor_agent`：抽取剧本元素
- `entity_merger_agent`：实体合并（同一个人被叫了两个名字时归一）
- `character_portrait_analysis_agent` / `scene_info_analysis_agent` / `prop_info_analysis_agent` / `costume_info_analysis_agent`：角色肖像、场景、道具、服装的定向分析
- `consistency_checker_agent`：一致性检查
- `script_optimizer_agent` / `script_simplifier_agent`：剧本优化与简化
- `variant_analyzer_agent`：变体分析
- `shot_frame_prompt_agents`：镜头帧/视频提示词生成

注意它没有走"一个大模型 agent 包打天下"的路线，而是按**制片行当里真实存在的分工**切分：编剧做拆分、美术盯道具服装、场记管一致性。每个 Agent 的输出是结构化数据，落库后成为业务实体，而不是一段聊完就丢的对话。

## 三、源码里最值得抄的设计：一个镜头的三套状态

通读文档时最让我眼前一亮的，是它对镜头状态的处理。做过工作流系统的人都知道，状态字段最容易长成 `pending / ready / generating / failed / regenerating...` 的大杂烩，最后谁都不敢改。Jellyfish 把一个镜头的状态**强行拆成三个互不干扰的维度**：

![一个镜头的三套状态：信息确认状态 shots.status、视频准备度 video-readiness、运行时任务状态 GenerationTask](/images/jellyfish-ai-short-drama-studio-source-deep-dive/02-status.png)

这套约定直接写在 `AGENTS.md` 的"状态语义约定"和 `site/docs/architecture/shot-status-flow.md` 里：

1. **信息确认状态** `shots.status` 只有 `pending` / `ready` 两个值，只由后端更新，回答的是"镜头的提取确认做完没有"；
2. **视频准备度** `video-readiness` 是独立判定，`ready` 不等于能生成——缺关键帧、缺参考图照样拦下你；
3. **运行时任务状态**来自 `GenerationTask`，"生成中"动态聚合得到，**永远不写回 shots.status**。

文档里有一句原话很能体现设计者吃过的亏："`generating` 不再作为正式 `shot.status` 使用。"把"这东西准备好没"和"这批活跑到哪了"分开，任何一边失败、取消、重试都不会污染另一边——这是正经做过异步生产系统的人才会下的判断。

## 四、长任务全部 Celery 化，前端不碰 Celery

生成一个视频可能要几分钟，早期版本用 `asyncio.create_task` 扛，现在已经整体切到 Celery。架构文档（`task-execution.md`）把分层写得很干净：

![任务执行分层：前端任务中心、GenerationTask 真相层、task_kind 协议层、Redis+Celery 执行层、MySQL/RustFS/模型供应商基础设施](/images/jellyfish-ai-short-drama-studio-source-deep-dive/03-task-arch.png)

几个值得注意的工程决策：

- **GenerationTask 是状态唯一真相源**：状态、结果、错误、取消请求、`started_at`/`finished_at` 都在业务库里，接口直接返回 `elapsed_ms`；
- **前端只认 HTTP 接口**（`/api/v1/film/tasks`），从不直连 Celery 读状态——Celery 纯粹是执行器，可替换；
- **`task_kind` + `TaskExecutorRegistry`** 做执行器分发，文本处理、图片、视频任务走统一入口；
- Web runtime 用 async SQLAlchemy，Worker runtime 用 sync SQLAlchemy，两套 runtime 明确隔离，避免在 Celery 里硬跑事件循环；
- 任务可以挂业务关联（`GenerationTaskLink`），所以全局任务中心里每一条任务都能跳回对应的项目/章节/镜头，而不是一个孤立的进度条。

目前已切到 Celery 的任务包括：剧本拆分 `divide`、元素抽取 `extract`、一致性检查、剧本优化/简化、角色肖像分析、道具分析以及图片/视频生成。

## 五、模型不绑定：OpenAI 与火山方舟双通道

生成能力按契约放在 `app/core/contracts`，供应商实现放在 `app/core/integrations`，目前内置两套：

- `openai/`：图片与视频，走 OpenAI 兼容接口；
- `volcengine/`：图片与视频，base URL 默认 `https://ark.cn-beijing.volces.com/api/v3`，即火山方舟（豆包 Seedream/Seedance 系列）。

模型在后台"模型管理"里配置供应商、模型名和参数，默认模型按 text / image / video 三类分别设置，存在 `model_settings` 单例表里；没配默认模型时接口直接返回 503，而不是偷偷 fallback 到一个你没选的模型——这个默认值策略也值得加分。国内用户配火山方舟 key 就能跑通图生视频，不用折腾网络。

## 六、十分钟跑起来：Docker Compose 部署实录

项目自带一套完整的 compose（`deploy/compose/docker-compose.yml`），不只是一个 app 容器，而是六个服务编排：

```text
mysql:9.0          业务库（带 healthcheck）
redis:7            Celery broker
rustfs             S3 兼容对象存储（素材/成品）
backend-init-db    一次性初始化表结构
mysql-init-sql     按序导入 backend/sql/*.sql 并灌入提示词模板
backend            FastAPI，端口 8000（/docs 是 Swagger）
celery-worker      独立 worker 进程
front              React 静态站，端口 7788
```

启动命令就是 README 里那两行：

```bash
cp deploy/compose/.env.example deploy/compose/.env
docker compose --env-file deploy/compose/.env \
  -f deploy/compose/docker-compose.yml up --build
```

`.env` 里需要改的其实只有密码和可选的 `OPENAI_API_KEY`；火山方舟的 key 装好后在 Web 后台的模型管理里填。启动完成后：

- 前端工作台：`http://localhost:7788`
- 后端接口文档：`http://localhost:8000/docs`
- RustFS 控制台：`http://localhost:9001`（默认密钥就在 example 里，**公网部署第一件事是改掉**）

本地开发则是标准组合：后端 `uv sync` + `uvicorn app.main:app --reload`，前端 `pnpm install && pnpm dev`。前端的请求层和类型完全由后端 OpenAPI 规范生成（`pnpm run openapi:update`，产物在 `front/src/services/generated/`），AGENTS.md 里明令"不再新增手写 service 封装"——契约优先这条执行得很彻底。

![资产管理界面：演员/场景/道具/服装四类实体，跨镜头复用](/images/jellyfish-ai-short-drama-studio-source-deep-dive/ui-assets.png)

## 七、冷静评估：谁该现在就用，谁再等等

**适合现在上手的：**

- 认真做 AI 竖屏短剧、一集要拆 20 个以上镜头的个人或小团队——它解决的实体一致性、任务追踪、版本沉淀问题，用表格和网盘硬扛的成本会随集数指数上升；
- 需要数据自持的工作室：素材在自己的 S3 存储里，剧本和资产是结构化的 MySQL 数据，换模型供应商不丢资产；
- 想学习"AI 能力工程化"的开发者：chains（怎么思考）/ services（怎么进系统）/ core tasks（怎么执行）的三层切分、契约先行、状态机拆分，都是可以直接搬进自己项目的架构范式。

**建议先观望的：**

- 只想快速出一两条单镜头爽片的人——为它开一套 MySQL+Redis+S3+Celery 不划算，网页版工具更直接；
- 期待"按一个键全自动出成片"的人：它在每个关键节点刻意保留了人工确认闸门，这是生产线思维，不是一键出片思维；
- 介意项目成熟度的团队：项目 2026 年 3 月才创建，版本号还在 v0.3.x，文档里有大量 "plans"（接下来做什么）章节，open issues 虽然只有 6 个但整体仍在 alpha 到 beta 之间快速迭代，生产环境请锁版本、自己备份。

## 结语

Jellyfish 最打动我的不是"又接了几个大模型"，而是它对一个朴素事实的尊重：**短剧是"制"出来的，不是"聊"出来的。** 剧本要拆、资产要认、状态要分离、长任务要可追踪、人工确认要留闸门——这些全是传统影视制片厂里场记和制片干了一百年的活，只不过现在被搬进了数据库和 Celery 队列。

当模型能力趋同，决定 AI 内容产能上限的，迟早是生产线。这个 6.3k star 的项目，给了"AI 短剧工作室"一个可以自己部署、可以审计、可以二次开发的开源底座。地址在 GitHub 搜 `Forget-C/Jellyfish`，Apache-2.0 协议，商用友好。

---

**相关阅读：**

- [Jellyfish：把 AI 短剧从"一键生成"拆成可控生产线（6 月项目初探）](/articles/2026/06/21/jellyfish-ai-short-drama-studio.html)
- [丢个 YouTube 链接，AcFun 和 B 站自动发：Y2A-Auto 的 8 阶段状态机拆解](/articles/2026/09/11/y2a-auto-youtube-to-bilibili-acfun-pipeline/)
- [OpenMontage：Agent 化视频生产的另一种解法](/articles/2026/09/08/openmontage-agentic-video-production/)
