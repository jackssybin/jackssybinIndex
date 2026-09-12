---
title: "AI 短剧的瓶颈不在模型：拆解 6.3k star 的 Jellyfish 如何管理 100 个镜头的一致性"
---

# AI 短剧的瓶颈不在模型：拆解 6.3k star 的 Jellyfish

一个不太被承认的事实：用即梦、可灵这类工具做到第 20 个镜头以后，决定你能不能把剧做完的，已经不是生成质量，而是管理能力。

第 47 个镜头男主的脸变了，你想找回第 3 个镜头那张"最对的脸"，它在某个对话记录里；女主第 12 集穿什么衣服，靠网盘搜索；剧本改到第三版，哪些镜头生成过、哪些只有文字，没有任何一个地方能回答。最近读到一个专门解决这个问题的开源项目 Jellyfish（Apache-2.0，GitHub 6.3k star），我把仓库克隆下来读了后端源码，以下是拆解。

![](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/cover-zhihu.png)

## 一、它不是生成器，是生产工作台

Jellyfish 的数据组织是「项目 → 章节 → 镜头」三级。剧本以章节为单位输入，AI 拆成镜头，再抽取角色、场景、道具、服装、对白。关键在于：所有 AI 抽取出的东西都不直接生效，而是进入候选表，由人逐条接受、忽略或关联到已有资产。

![](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/01-pipeline.png)

这个「候选—确认」闸门是它与网页版工具最本质的差别。网页版工具的工作单位是一条提示词；它的工作单位是一部剧。资产（角色/演员、场景、道具、服装）是独立实体，被镜头引用而不是被镜头复制，所以"同一把剑出现在 30 个镜头里"在数据层是一条实体记录加 30 条引用，而不是 30 张需要人工比对的图。

## 二、11 个 Agent 按片厂分工，而不是一个大模型包打全场

后端 `chains/agents/` 下有 11 个职责单一的 Agent：剧本拆分、元素抽取、实体合并（把"阿川"和"川哥"归一）、角色肖像/场景/道具/服装四个定向分析、一致性检查、剧本优化、剧本简化、变体分析、镜头帧提示词生成。

这对应的是真实片厂的分工：编剧拆场、美术盯道具服装、场记管穿帮。每个 Agent 的输出是结构化数据并落库，成为下一集、下一个 Agent 可以直接读取的业务实体。一致性检查 Agent 会在生成画面前就报出"第 2 场黑衣、第 9 场白裙"这类矛盾——纠错发生在文本阶段，成本是一次 LLM 调用，而不是成片之后返工。

## 三、一个镜头三套状态，是源码里最值得借鉴的设计

做过工作流系统的人都熟悉状态字段如何腐烂成 `pending/ready/generating/failed/regenerering` 的大杂烩。Jellyfish 在 AGENTS.md 里用硬约定把一个镜头拆成三个维度：

![](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/02-status.png)

**1.** `shots.status` 只有 pending/ready，表达信息确认状态，只由后端更新；

**2.** video-readiness 独立判定生成条件，ready 但缺关键帧照样拦截；

**3.** 运行时状态属于 GenerationTask，"生成中"动态聚合，永不写回 shots.status。

文档原话是"`generating` 不再作为正式 shot.status 使用"。这背后是一个很成熟的判断：「这东西准备好没」和「这批活跑到哪了」是两条生命周期，更新主体不同、失败语义不同，混在一个字段里必然互相污染。这个拆法可以直接搬到任何"准备态 + 异步执行"的业务系统。

## 四、长任务架构：FastAPI 只接单，Celery 才干活

![](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/03-task-arch.png)

视频生成单任务以分钟计，项目已从早期的 asyncio.create_task 整体迁移到 Redis + Celery。几个工程决策值得记录：

- GenerationTask 是状态唯一真相源，状态、结果、错误、取消请求、started_at/finished_at/elapsed_ms 全落 MySQL；
- 前端只轮询 HTTP 接口（/api/v1/film/tasks），从不直连 Celery，执行层可替换；
- task_kind 配合 TaskExecutorRegistry 做执行器分发，文本、图片、视频统一入口；
- Web 侧 async SQLAlchemy，Worker 侧 sync SQLAlchemy，两套 runtime 明确隔离；
- 任务通过 GenerationTaskLink 关联业务实体，任务中心每条任务可跳回对应项目/章节/镜头。

## 五、供应商中立与部署

生成能力按契约放在 core/contracts，集成实现放在 core/integrations，内置 OpenAI 兼容通道和火山方舟通道（默认 ark.cn-beijing.volces.com，对应豆包 Seedream/Seedance）。默认模型按 text/image/video 三类分设，未配置时返回 503 而不是静默 fallback——不替用户决定烧哪个模型的钱。

部署是 docker compose 六服务编排：MySQL 9.0、Redis 7、RustFS（S3 兼容对象存储）、后端 FastAPI（8000，自带 Swagger）、Celery Worker、React 前端（7788），首启自动建表并导入提示词模板。需要注意 .env 默认密码与 RustFS 默认密钥必须改，项目本身今年 3 月才创建，版本仍在 v0.3.x。

![](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/ui-assets.png)

## 六、适用边界

适合：每集镜头量大、需要跨集一致性管理的短剧团队；要求素材自持、不愿被单一平台锁定的工作室；以及想研究"AI 能力工程化"分层（chains 负责思考编排、services 负责业务串联、tasks 负责执行）的开发者。

不适合：只做单镜头短片的轻度用户（养一整套 MySQL/Redis/S3/Celery 不划算）；期待一键全自动出片的人（人工确认是它刻意保留的闸门，不是没做完）。

我的总体判断：当各家视频模型的单镜头质量趋同，竞争会前移到生产组织能力。Jellyfish 真正沉淀的资产在模型之外——实体、确认记录、状态机、任务历史——换模型不丢资产。这比"又接了一个新模型"有价值得多。项目地址 GitHub 搜 Forget-C/Jellyfish。

（这个专栏持续做开源项目与工程架构的一手拆解，感兴趣可以关注。）
