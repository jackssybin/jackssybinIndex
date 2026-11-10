---
title: "1747 Star、58 万行代码的开源 AI 影视工作台：影策怎么把一本小说自动做成短剧"
slug: "yingce-ai-film-canvas"
date: 2026-11-10
draft: false
categories: ["开源项目", "AI创作"]
tags: ["开源", "影策", "AI影视", "短剧", "无限画布", "Go", "React", "插件系统", "3D", "MIT"]
cover: "/images/yingce-ai-film-canvas/cover-zhihu.png"
description: "ddcat-ai/open-ai-canvas（影策）是一个 MIT 协议的开源 AI 影视与短剧创作工作台，上传小说即可走改编拆集、角色三视图、结构化分镜、逐段视频生成到时间线合成的完整流水线，并提供无限画布、3D 世界引擎（React Three Fiber）与可在画布上动手的 Agent。本文基于仓库源码实测：后端 Go 1.25 + Gin + GORM（1436 个 Go 文件、约 30 万行），前端 Bun + React 19 + Vite（1389 个 TS/TSX 文件、约 28 万行），数据层本地 SQLite 或 PostgreSQL+Redis，媒体支持本地/阿里云 OSS/腾讯云 COS；重点拆解 112 个模型协议插件如何用统一 Manifest 合同（apiVersion、permissions、contributes.provider、请求/响应字段映射、validations）把文本 23/图片 17/视频 22/音频及工作流插件的模型差异关进适配器，以及插件沙箱不触 Cookie/数据库、错误不静默降级的安全设计。同时如实说清它体量巨大、依赖 Bun+Go+Docker 运维、模型 API 费用自理、3D 世界引擎仍在内测、默认只适合个人/本地/可信环境而非裸奔公网等边界。"
---

AI 视频创作工具这两年不少，但多数是"给一句话、出一段片"的单点产品，链路是断的：剧本、分镜、角色设定、素材、剪辑散落在七八个软件里。今天这个项目想做的是把整条链收进一个工作台——上传一本小说，系统自动改编、拆集、建角色、出分镜、逐段生视频，最后合成成片，全程还能在一块无限画布上人工接管。

它叫 [影策（open-ai-canvas）](https://github.com/ddcat-ai/open-ai-canvas)，目前 1747 Star、584 Fork，MIT 协议，2026 年 7 月才建仓，昨天还在提交。我把整个仓库（5938 个文件、约 50 万 KB）克隆下来通读，这篇基于真实源码讲清楚三件事：它的小说到成片流水线怎么转、112 个模型插件是怎么用一套合同管理起来的、以及把它跑起来到底有什么门槛。

## 一、先看体量：这不是小工具，是一个全栈平台

很多"AI 创作"开源项目其实只是个前端 Demo 加几个 API 调用，影策不是。我统计了一下代码规模：

- **后端**：Go 1.25 写的，1436 个 `.go` 文件、约 30.2 万行，基于 Gin + GORM，`internal/` 下有 40 多个模块（agent、canvas、generation、payment、provider、skills、workbench 等）。
- **前端**：Bun + React 19 + Vite，1389 个 TS/TSX 文件、约 27.9 万行，用 Zustand + localForage 做状态和本地降级缓存。
- **插件**：`plugin-packages/` 下 112 个模型协议插件（另有对应的 `.yingce-plugin` 构建产物）。
- **部署**：自带 6 套 docker-compose（dev/local/deploy/server/build）、Dockerfile、nginx.conf，还有完整的管理后台和支付插件。

58 万行的体量意味着它的定位是"可自托管的影视生产平台骨架"，而不是一个下载即用的轻量脚本——这个预期要先建立。

## 二、小说到成片：一条每一步都能人工接管的流水线

影策最核心的产品形态是短剧制作流水线。根据 README 和功能文档，流程分四段。

![影策从小说到成片的短剧制作流水线](/images/yingce-ai-film-canvas/pipeline.png)

**第一段上传与拆集**：上传小说或粘贴正文，系统按集拆分剧本，自动提取角色、道具、场景。**第二段结构化分镜**：每个镜头标注景别、运镜、时长，右侧对照小说原文；角色生成三视图、别名、外貌和声线，**锁定形象后整部剧沿用同一张脸**，解决 AI 视频最头疼的人设漂移问题。**第三段逐段生视频**：按剧情段驱动生成，从第 2 段起自动把上一段最后一帧作为下一段首帧，保证镜头连贯。**第四段时间线成片**：片段编排、拆分、修剪、字幕转写，服务端合成导出。

关键设计是它不做"黑盒一键出片"。每一步都能人工介入：改写台词、锁定角色、单段重新生成。AI 负责执行，人把控关键质量节点——这比承诺"全自动"要务实得多。

## 三、全栈架构：React 画布在前，Go 引擎在后

![影策的五层全栈技术架构](/images/yingce-ai-film-canvas/architecture.png)

整个系统是清晰的分层结构。**前端工作区**承载无限画布、任务中心和素材库，通过 SSE 接收流式生成进度，本地用 Zustand/localForage 做降级缓存。值得单独说的是 **3D 世界引擎**：它用 React Three Fiber + three.js（package.json 里 three 版本 0.185）实现，可以在 3D 场景里摆布景、排机位、在地面标记 A/B 点，用一句话指挥 Agent 让角色移动并生成关键帧，再导出白模视频和深度图作为视频生成的参考。目前这个能力还在内测。

**后端**走经典的 `handler → service → repository/model` 分层，异步任务用 worker 队列处理（带进度、日志、取消、重试），还包含权限、模型中转和资源存储。**数据层**本地用 SQLite、生产部署用 PostgreSQL + Redis；媒体文件可以放后端数据目录、阿里云 OSS 或腾讯云 COS，删除素材前会检查业务引用。生产环境由 Nginx 托管前端并代理后端，公网只暴露 web 入口，后端 8080 端口留在容器网络内。

## 四、112 个插件：用一份 Manifest 合同收编模型差异

这是我认为整个项目工程上最有价值的部分。影策不把任何一家模型商写死，而是把文本、图片、视频、音频供应商全部做成插件。我清点了 `plugin-packages/`：**文本类 23 个、图片类 17 个、视频类 22 个，其余 50 个是音频、TTS、ComfyUI/RunningHub 工作流以及支付应用插件，合计 112 个**。

![影策的 112 个模型协议插件分类与 Manifest 合同机制](/images/yingce-ai-film-canvas/plugins.png)

我打开一个真实的视频插件（火山方舟 Seedance）的 `manifest.json` 看了它的合同结构，设计得相当严谨：

- **身份与版本**：`apiVersion: yingce.plugin/v2`、插件 id、版本号，宿主靠 apiVersion 控制兼容性。
- **权限声明**：比如 `generation.run`、`media.read`，插件能做什么必须先声明。
- **统一字段映射**：用一套 `$ref`、`$map`、`$coalesce`、`$concatArrays` 的声明式表达式，把影策的统一参数（prompt、images、aspectRatio、duration…）映射成厂商各自的 API body，比如 Seedance 的 `content[type=image_url]` 结构。
- **校验规则 validations**：直接写死"最多 9 张参考图、3 个参考视频""不支持纯音频"这类厂商约束，在宿主侧就拦住非法请求。
- **响应归一**：把不同厂商五花八门的返回（id/task_id/data.id）统一收敛成 `taskId/status/videos/usage`，临时媒体 URL 标记为 ephemeral 由宿主立即下载持久化，HTTP 错误和业务 code 保留失败语义、不包装成成功。

配套的安全边界也明确：插件**不能直接访问 React 组件、Cookie、API Key 或数据库**，不能自己注册 Gin 路由/GORM model，远程 Web 插件必须走沙箱运行时和宿主 RPC；错误、超时、权限拒绝、版本不兼容必须显式可见，**不允许静默降级**。第三方包统一用 `.yingce-plugin` 后缀，按系统/官方/自定义三类分级管理。

## 五、Agent 与自部署：把创作和算力都握在自己手里

影策的 Agent 不是单纯聊天框。后端 `internal/agent/` 下分了 architecture、memory、runtime、tool、yingceagent 等子模块，工具注册走 registry + policy + schema。画布 Agent 能结合素材、技能和画布上下文直接在画布上生成和修改节点，但**生成操作仍需经过审批和额度检查**，不是放任它随便动你的作品。技能库还能从 GitHub 安装社区技能（如 judian-skills 的 34 个场景域包），在对话里用 `@技能` 调用。

自部署是它区别于云端 SaaS 的核心卖点：模型渠道、API Key、技能、插件、素材、计费全部自己管理，密钥不经过影策官方。管理后台甚至提供运行总览（P95 耗时、成本收入）、渠道模型管理、用户管理、积分运营、兑换码和支付充值——这套东西让它既能个人用，也能搭成一个对内/对小团队的服务。

## 六、祛魅：MIT 很友好，但这些门槛和边界要先知道

![影策的真实成色与上手门槛、安全边界](/images/yingce-ai-film-canvas/limits.png)

把话说全，才不会让你踩坑。

**门槛方面**：第一，58 万行的全栈项目，本地跑起来需要 Bun、Go 1.25 和 Docker Compose，有一定运维要求，不是双击即用。第二，**软件开源免费，但生成视频/图片的模型 API 费用完全自理**，量一大成本不低，它只是帮你管理渠道，不替你付账。第三，项目仍在快速迭代，README 自己也提示数据结构和外部接口可能调整，3D 世界引擎尚在内测。

**安全方面**这点尤其重要：官方明确说默认适合个人、本地或可信环境，**未经安全配置不要直接当公网多人服务**。具体包括——首次管理员注册要在受控网络完成、公网部署关闭开放注册、CORS 不能用 `*`、后端默认拦截私网/链路本地模型地址（防止 SSRF，需用白名单精确放行）、API Key 不能进 URL/日志/明文长期存储、后端 8080 不暴露公网。官网那个 `test/test123456` 的演示账号仅供体验，别在上面放敏感内容。

许可上 MIT 对商用和二次开发非常友好，远宽松于 AGPL 系项目，但要注意它依赖的第三方组件各有自己的许可证，NOTICE 文件里有说明。

## 我的判断

影策真正的价值，是把过去散落在十几个工具里的 AI 影视生产环节，收敛成一个**数据互通、可人工接管、可完全自托管**的工作台；而 112 个插件背后的 Manifest 合同设计，让它不至于被某一家模型商绑死，这是它工程成熟度的体现。

但要理性看待：它是给有一定技术能力的创作者和小团队的"平台骨架"，不是零门槛的免费成片魔法——你需要能驾驭 Docker 和 Go 环境、愿意自己承担模型 API 成本、并接受它还在高速演化。如果你正好在找一个能私有化部署、数据自己说了算的短剧/视频生产底座，这个项目非常值得拉下来，先用官方在线演示摸一遍流程，再决定要不要本地搭建。

项目地址：[https://github.com/ddcat-ai/open-ai-canvas](https://github.com/ddcat-ai/open-ai-canvas)

在线演示：[https://yingce.tv](https://yingce.tv)（体验账号 test / test123456）
