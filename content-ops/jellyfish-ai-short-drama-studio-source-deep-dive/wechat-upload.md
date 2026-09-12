---
title: "做 AI 短剧别再一个镜头一个镜头抽卡了：这个 6.3k star 开源项目把整条片厂搬上了你的服务器"
cover: /root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/cover-wechat.jpg
source_url: https://github.com/Forget-C/Jellyfish
---

# 做 AI 短剧别再一个镜头一个镜头抽卡了

第 47 个镜头，男主的脸又变了。

这是每个用即梦、可灵做过 AI 短剧的人都会撞上的墙：你翻回第 3 个镜头想找当初那张"长得最对"的关键帧，发现它埋在某条对话记录里，文件名是一串随机 ID；女主第 12 集穿什么衣服，全靠网盘人肉搜索；剧本改了三版，哪些镜头真生成过、哪些只有文字，没人说得清。

**单镜头质量追上来之后，卡住短剧产能的早就不是模型，是几十上百个镜头之间的一致性和流程管理。**这周我读了一个专门干这件事的开源项目——Jellyfish（GitHub 6.3k star，Apache-2.0），并且把它的 FastAPI 后端源码翻了一遍。

![Jellyfish 项目列表：每部短剧按章节、角色、场景、道具统计进度](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/ui-projects.png)

## 它和即梦可灵，根本不是一个物种

即梦、可灵的工作单位是"一条提示词"，Jellyfish 的工作单位是"一部剧"。

项目 → 章节 → 镜头，剧本以章节为单位输入；AI 自动把剧本拆成镜头，抽出里面的角色、场景、道具、服装、对白。但注意，抽出来的东西**不直接生效**，全部先进候选池，你逐条确认：接受、忽略，或者关联到已有资产——你点一句"这把剑就是第 3 集那把青霜剑"，后面所有镜头复用同一个实体。

这套机制直接决定了它的形态：不是生成器，是生产流水线。

![Jellyfish 端到端流水线](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/01-pipeline.png)

我拿它和网页版工具做了个硬碰硬对比：角色一致性，网页版靠每次手传参考图碰运气，它靠四类实体（角色/演员、场景、道具、服装）建模跨镜头引用；AI 产出，网页版直接出成品，它先进候选池等人确认；长任务，网页转圈失败重来，它有统一任务中心看状态、耗时、取消；模型，网页版平台绑定，它后台同时挂着 OpenAI 和火山方舟（豆包 Seedream/Seedance）双通道；数据，全在你自己的 MySQL 和 S3 存储里。

## 11 个专职 Agent，按片厂分工切

源码 `chains/agents/` 目录下躺着 11 个职责单一的 Agent，这是全项目工程含量最高的地方。

拆剧本的 `script_divider`、抽元素的 `element_extractor`、把"阿川"和"川哥"合并成同一人的 `entity_merger`、分别盯角色肖像/场景/道具/服装的四个分析 Agent、专查前后矛盾的 `consistency_checker`、做剧本优化和简化的两个 Agent，还有生成镜头帧提示词的 Agent。

它没有用"一个大模型包打天下"的时髦路线，而是按**真实片厂的分工**切：编剧拆场，美术盯道具服装，场记管一致性。每个 Agent 的输出是结构化数据、落库成业务实体，不是聊完就丢的对话。

举个具体的场景。你把一集剧本贴进去，`script_divider` 先把它切成一个个镜头；`element_extractor` 逐镜扫描，报出"本集出现：女主小雨、陌生男人阿川、便利店、金属框眼镜、米色风衣"；`entity_merger` 负责把前后文里"小雨""她""那个运营女孩"归并到同一个角色实体，避免 AI 把同一个人当成三个角色各画一张脸；`consistency_checker` 反过来挑刺——剧本第 2 场说小雨穿黑衣，第 9 场又写成白裙，它会在生成任何画面之前把矛盾摆到你面前。

这些全是人类片厂里场记和统筹干了一百年的活。区别只是，现在它们跑在 Python 进程里，而且产出的每一项都进数据库，下一集的 Agent 能直接读到"小雨"是谁。

## 最值得抄的设计：一个镜头三套状态

读架构文档时我眼前亮了一下。做过工作流系统的人都知道，状态字段最后都会烂成 `pending/ready/generating/failed/regenerating` 的大杂烩。Jellyfish 硬把一个镜头拆成三个互不相干的状态维度：

![一个镜头的三套状态](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/02-status.png)

`shots.status` 只有 pending/ready，只回答"信息确认做完没"，只准后端写；`video-readiness` 单独判定"能不能开生成"——ready 了但缺关键帧，照样拦你；运行时状态全在独立的任务表里，"生成中"三个字**永远不写回镜头状态**。文档里有句原话："generating 不再作为正式 shot.status 使用。"

说白了：状态机只管"准备好了没"，任务系统管"跑到哪了"。任何一边失败重试都不污染另一边，这是真做过异步生产系统的人才会下的判断。

## 生视频要几分钟，它把长任务全交给 Celery

![任务执行分层](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/03-task-arch.png)

早期版本用 asyncio 后台任务硬扛，现在整体切到了 Redis + Celery：FastAPI 只负责接单返回 task_id，Worker 干活；任务的状态、结果、错误、取消请求、开始结束时间和耗时全落 MySQL，前端只轮询 HTTP 接口、从不直连 Celery——执行层随时可换。任务还挂着业务关联，任务中心里每条任务都能一键跳回对应的剧、章节、镜头，不是孤立进度条。

## 一条命令拉起整套片厂

部署不是一个裸容器，是六个服务的正经编排：MySQL 9.0、Redis 7、RustFS（S3 兼容存储，存素材成片）、后端 FastAPI（8000 端口，自带 Swagger）、独立 Celery Worker、React 前端（7788 端口），首次启动自动建表、导入提示词模板：

```bash
cp deploy/compose/.env.example deploy/compose/.env
docker compose --env-file deploy/compose/.env \
  -f deploy/compose/docker-compose.yml up --build
```

国内用户填火山方舟的 key 就能跑通图生视频。两个提醒：`.env` 里的默认密码和 RustFS 默认密钥**公网部署必须改**；前端接口类型全部由后端 OpenAPI 规范生成，项目组明令不许手写请求封装，契约一致性很罕见地严格。

顺带说一个默认模型策略上的细节：系统把文本、图片、视频三类默认模型分开设置，存一张单例配置表里；如果某一类你压根没配模型，对应接口直接返回 503，**绝不偷偷 fallback 到一个你没选过的模型**替你烧钱。这种"宁可报错也不替用户做主"的分寸感，在开源项目里不多见。

![资产管理：演员、场景、道具、服装四类实体跨镜头复用](/root/jackssybinIndex/content-ops/jellyfish-ai-short-drama-studio-source-deep-dive/media/ui-assets.png)

## 谁现在就该用，谁再等等

一集要拆 20 个以上镜头的短剧团队，别再用表格和网盘硬扛了，管理成本随集数指数涨；需要素材自持的工作室，换模型供应商不丢资产；想学习"AI 能力怎么工程化"的开发者，chains/services/tasks 三层切分和状态机拆法可以直接搬进自己项目。

但只想出一两条单镜头爽片的，没必要为它养一套 MySQL+Redis+S3+Celery；期待一键全自动出成片的也会失望——每个关键节点它都故意留了人工确认闸门，这是生产线思维，不是抽卡思维。另外项目今年 3 月才诞生，还在 v0.3.x，生产用请锁版本、勤备份。

最后说一句我读源码时最强烈的感受。很多 AI 项目的本质是"给某个模型套个聊天框"，模型一换代，项目就归零；Jellyfish 把价值沉淀在了模型之外——剧本实体、候选确认记录、镜头状态机、任务历史，这些资产不会因为你从 A 模型换成 B 模型而消失。对认真做内容的人来说，这层东西才是护城河。

当模型能力趋同，决定 AI 内容产能的迟早是生产线。这个 6.3k star 的项目，给了片厂一个能自托管、能审计、能二次开发的开源底座。

---

我是 jk，一个只信"自己跑过、读过源码"的开源/AI 工具实测派，每次帮你筛一个真正省钱省时间的开源项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。项目地址和完整部署命令我放在了「**阅读原文**」。

相关阅读：

- [找了半年终于找到：全平台媒体下载神器开源了](https://mp.weixin.qq.com/s/QNmVOYyRHlwX94PDQZmlnw)
- [用了三个月 Claude Code，我终于装上了 ADHD 输出模式](https://mp.weixin.qq.com/s/pvpTovUEWocgSWsRlcXHbA)
