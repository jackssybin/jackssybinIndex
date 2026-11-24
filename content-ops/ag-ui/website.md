---
title: "31 个事件、23 个框架、一份 Schema 生成三语言 SDK：我把 2.1 万 Star 的 AG-UI 协议仓库翻了个底朝天"
slug: "ag-ui-protocol"
date: 2026-11-24
draft: false
categories: ["开源项目", "AI 工程"]
tags: ["开源", "AG-UI", "Agent", "协议", "MCP", "A2A", "事件流", "SDK", "CopilotKit", "MIT"]
cover: "/images/ag-ui-protocol/cover-zhihu.png"
description: "AG-UI（Agent-User Interaction Protocol）是 CopilotKit 发起、GitHub 2.1 万 Star 的开放协议，用一条双向类型化事件流标准化 AI agent 与用户界面应用的连接方式。本文基于本地真实克隆与逐目录核验而非读 README 复述：实测 spec/1.0/schema.json 为 94KB 单一 JSON Schema，TypeScript SDK 中枚举到正好 31 个事件、分 8 大家族；integrations 目录实测 23 个框架/协议集成（LangChain、LangGraph、CrewAI、Google ADK/Antigravity、Microsoft Agent Framework、AWS Strands、Pydantic AI、Mastra、Agno、AG2、LlamaIndex、OpenAI Agents、Claude Agent SDK、watsonx 等），middlewares 6 个含 MCP/A2A/A2UI 桥接；代码规模 TypeScript 242 文件 75624 行、.NET 362 文件 57343 行、Python 38 文件 11225 行，另有 8 个社区 SDK。文章重点讲清四件事：第一，AG-UI 与 MCP、A2A 不是竞争而是同一 agent 栈的三层，MCP 向下接工具、A2A 横向连 agent、AG-UI 向上接用户；第二，一次 Run 的机制——客户端发 RunAgentInput，agent 回 31 个事件的类型化流，传输无关（HTTP+SSE 或 HTTP+Protobuf），状态用 snapshot 加 JSON Patch delta 同步、人在环靠 interrupt 加 resume；第三，也是最反直觉的工程亮点——它用 schema-first 加代码生成（spec/generator 生成 TS/Python/.NET，Python 模型在 _generated 目录）加 68 个 conformance 流测试和 303 个 fixtures 的三级判定，从机制上防止协议实现碎片化；第四，适用边界与对发起方中立性、617 个 open issue 的客观提醒，以及 npx create-ag-ui-app 与 30 行 SSE server 两条最小上手路径。"
---

过去一年 Agent 框架爆发式增长，但有一个问题始终没被很好地解决：怎么把一个会思考、会调工具、会中途停下来等人确认、还会派生子 agent 的智能体，稳定地接到用户界面上？每个框架都有自己的流式格式和消息约定，前端团队每换一个后端框架，就得重写一遍胶水代码。

[AG-UI](https://github.com/ag-ui-protocol/ag-ui) 想做的就是这件事的标准化。它的全称是 Agent-User Interaction Protocol，由 CopilotKit 发起、社区共建，目前在 GitHub 上有 2.1 万 Star。我把整个 monorepo 克隆下来逐层翻了一遍，这篇文章不讲概念口号，只讲我实测到的结构和数字，以及它最值得学的工程设计。

## 一、先定位：AG-UI、MCP、A2A 到底是什么关系

很多人第一次看到 AG-UI 会下意识把它当成 MCP 的竞争对手，这是第一个需要澄清的误解。它们其实是同一个 agent 技术栈里、不同层级的三个协议。

![Agent 栈的三层协议](/images/ag-ui-protocol/01-protocol-layers.png)

**MCP（Model Context Protocol）管的是 agent 向下怎么接工具和数据**——文件、数据库、外部 API，让 agent 有统一的方式调用能力。**A2A（Agent-to-Agent）管的是横向的 agent 之间怎么协作**，不同框架构建的 agent 如何互相发现、委托任务。**AG-UI 管的则是向上这一段：agent 怎么把自己的行为实时、结构化地送到用户面前。**

一个真实的 agent 产品往往三层同时用：通过 MCP 拿工具、通过 A2A 与其他 agent 分工、通过 AG-UI 把过程渲染给用户。README 里有一句话说得很准确——AG-UI 可以给讲 MCP 或 A2A 的 agent 做前端。另外它和 A2UI、MCP Apps 这类"生成式 UI 规范"也不冲突：后者描述 agent 想展示什么 UI，而 AG-UI 是承载这些载荷以及其他一切信息的运行时协议。

## 二、一次 Run 的本质：一个输入，一条 31 个事件的类型化流

为什么传统的 HTTP 请求/响应模型不适合 agent？因为 agent 不是一问一答、立即返回的：它会逐 token 流式输出、在回答中途调用工具、更新共享状态、暂停下来等人类审批、还可能派生 subagent。AG-UI 用一条双向事件流把这些行为全部标准化。

![一次 Run 的 31 个事件、8 大家族](/images/ag-ui-protocol/02-event-stream.png)

流程是这样的：客户端发起一次 run，发送一个 `RunAgentInput`，里面包含对话消息（messages）、前端能提供的工具（tools）、共享状态（state）和上下文（context）。agent 随后回吐一条类型化事件流。我在 TypeScript SDK 源码里实测枚举到**正好 31 个事件类型，分属 8 大家族**，和文档口径完全一致：

- **运行生命周期**（5 个）：`RUN_STARTED/FINISHED/ERROR`、`STEP_STARTED/FINISHED`，这是唯一必选的家族；
- **文本消息**（4 个）：`TEXT_MESSAGE_START/CONTENT/END/CHUNK`，负责逐字流式；
- **工具调用**（5 个）：`TOOL_CALL_START/ARGS/END/RESULT/CHUNK`；
- **状态同步**（3 个）：`STATE_SNAPSHOT`、`STATE_DELTA`（JSON Patch 增量）、`MESSAGES_SNAPSHOT`；
- **推理过程**（5 个）：含加密推理值 `REASONING_ENCRYPTED_VALUE`；
- **活动进度**（2 个）、**子 agent**（3 个）、**透传**（`RAW`/`CUSTOM` 2 个）。

这里有几个设计很讲究。状态同步不是每次全量推送，而是先给快照、再用 JSON Patch 传增量，省带宽且天然支持协同。人在环（human in the loop）通过 run 以 `interrupt` 结局、用户审批/编辑/拒绝后下一次 run resume 来实现，而不是另起一套机制。更关键的是它**传输无关**：规范定义了 HTTP+SSE 和 HTTP+Protobuf 二进制两种绑定，中间件还能适配任意事件源。而且只有运行生命周期是必选的，意味着一个最小 agent 发几个事件就能接入，再按需逐步实现完整能力。

再展开几个容易被忽略的事件设计。工具调用被拆成 START、ARGS、END、RESULT、CHUNK 五个事件，参数可以分块流式传输，这让前端能像展示文字 token 一样实时展示"agent 正在拼什么工具参数"，而不是等整个调用结束才看到。推理家族里专门有 `REASONING_ENCRYPTED_VALUE`，意味着思维链可以加密往返——在既要展示推理过程、又不想让敏感推理内容被明文记录的生产场景里，这是个很实际的考量。子 agent 家族则要求每个事件都归属到产生它的那个 subagent run，嵌套委托时前端能清楚区分哪段输出来自哪个子任务。它还支持多模态：图像、音频、视频、文档都能出现在用户输入和工具结果里，配合活动进度、token 用量、自定义事件，覆盖了一个真实 agent 运行时几乎所有可观测的状态。这些能力在 Dojo 里每个都对应一个可点击的 live demo，不是停留在规范纸面。

## 三、最反直觉的亮点：它怎么防止协议碎片化

这是我读完整个仓库后认为最有价值的部分。开源协议最常见的死法是什么？规范写一份 markdown，各语言社区照着各自手写实现，然后悄无声息地分叉——同一个事件在不同 SDK 里行为不一致，协议名存实亡。AG-UI 用一套 schema-first 加代码生成加一致性测试的组合拳，从机制上规避了这个问题。

![schema-first：一份 Schema 生成三语言 SDK 加一致性测试](/images/ag-ui-protocol/03-schema-first.png)

**第一步，把 JSON Schema 做成唯一事实来源。** 我实测 `spec/1.0/schema.json` 有 94KB，整个 1.0 规范被冻结在这份文件里。

**第二步，所有官方 SDK 从这份 Schema 代码生成，而不是手写。** `spec/generator/` 目录下有 `typescript.ts`、`python.ts`、`dotnet.ts`、`protobuf.ts` 等生成器。证据很直接：Python SDK 的数据模型放在 `ag_ui/_generated/models.py`，版本常量在 `_generated/version.py`（实测 `PROTOCOL_VERSION = "1.0"`），目录名就叫 `_generated`。我统计了三个官方 SDK 的规模：TypeScript 242 个文件约 7.56 万行、.NET 362 个文件约 5.73 万行、Python 38 个文件约 1.12 万行。这么大体量的三语言实现，如果靠人手同步必然分叉，代码生成是唯一可靠解。另外还有 Go、Rust、Java、Kotlin、Dart、Swift、Ruby、C++ 共 8 个社区 SDK。

**第三步，用一致性测试（conformance）卡死行为。** 我实测 `spec/1.0/conformance/streams` 下有 **68 个流测试用例**，`fixtures` 下有 **303 个 JSON 测试固件**。光看文件名就能感受到规则的细致程度：`first-event-not-run-started-fatal`（第一个事件不是 RUN_STARTED 就是致命错误）、`unknown-event-dropped`（未知事件直接丢弃）、`state-delta-unknown-op-dropped`（状态补丁里的未知操作被丢弃）、`producer-declares-uninterpretable-version-warns`（版本无法识别时告警但继续）。它们用 **fatal / tolerated / warns 三级判定**，把"收到异常输入到底该崩、该忍还是该警告"这种最容易产生实现分歧的边界，全部写成了可执行的测试。

我认为这套"单一 Schema → 代码生成多语言 SDK → 一致性测试约束行为"的工程范式，比那 31 个事件本身更值得开发者学习——它解释了为什么 Google、微软、亚马逊、Oracle 这些大厂愿意接入，而不用担心协议四分五裂。

仓库的工程治理也印证了它是冲着"长期维护的基础设施"去的，而不是一次性 demo。它用 nx 加 pnpm workspace 管理这个庞大的 monorepo，TypeScript 拆成 core、client、encoder、proto、cli、a2ui-toolkit 六个职责清晰的包；配了 lefthook 做 git 钩子、eslint 统一代码规范、CodeRabbit 做 AI 代码审查，还有 CODEOWNERS、18KB 的 CONTRIBUTING、SECURITY 政策、DEPRECATIONS 文档来管理演进和废弃。对 AI 编程助手也很友好：根目录同时放了 AGENTS.md、CLAUDE.md、.mcp.json 和 .claude-plugin 的 marketplace 配置。1.0 版本强调双向向后兼容，0.x 的 agent 能配 1.0 的 client、反过来也行，这种对兼容性的郑重其事，本身就是协议类项目能不能被企业采用的前提。

## 四、生态版图：23 个集成和一个需要清醒认识的事实

我实测 `integrations/` 目录有 **23 个条目**，覆盖了当下主流的 agent 框架：LangChain、LangGraph、CrewAI、Google ADK 与 Antigravity、Microsoft Agent Framework、AWS Strands、Pydantic AI、Mastra、Agno、AG2、LlamaIndex、OpenAI Agents、Claude Agent SDK、IBM watsonx、Langroid、Vercel AI SDK、Spring AI 等，还包含 a2a、agent-spec、adk-middleware 和两个 starter 模板。`middlewares/` 有 6 个，其中就包括 MCP、A2A、MCP Apps、A2UI 的协议桥接中间件。每个集成都在官方的 Dojo（dojo.ag-ui.com）里有可交互的 live demo，Amazon Bedrock AgentCore 也已原生支持运行 AG-UI。

![生态版图与适用判断](/images/ag-ui-protocol/04-ecosystem-verdict.png)

但有几个需要清醒认识的点，我不想只唱赞歌。

第一，**它是协议加 SDK 加集成的 monorepo，不是一个能直接跑起来的产品**，价值在标准化，落地还需要你自己接框架和前端。第二，仓库当前有 **617 个 open issue**，对一个 2.1 万 Star 的项目来说偏高，反映出生态快速扩张期的集成兼容问题，而且 draft spec 仍在演进——虽然 1.0 已冻结且双向向后兼容（0.x 的 agent 能配 1.0 的 client，反之亦然），但生产环境前务必在 Dojo 里实测你要用的那个具体框架集成。第三，也是最容易被忽略的：**AG-UI 由 CopilotKit 发起，而 CopilotKit 本身又是它最主要的客户端实现**。这里存在协议发起方商业利益与协议中立性之间的天然张力，需要客观看待——开源治理上它用了 CODEOWNERS、CONTRIBUTING、SECURITY、AGENTS.md 等一整套机制来缓解，但你在做技术选型时应该知道这层关系。

## 五、两条最小上手路径

第一条路用脚手架，最省事：`npx create-ag-ui-app@latest`，它会生成一个接好 agent 框架的前端（CopilotKit 加 Next.js，或者终端客户端），设好 `OPENAI_API_KEY` 后 `npm run dev` 即可。

第二条路直接讲协议，更能理解本质。Python 端 `pip install ag-ui-protocol fastapi uvicorn`，写一个约 30 行的 FastAPI 服务：接收 `RunAgentInput`，用 `EventEncoder` 依次 yield `RunStartedEvent`、`TextMessageStart/Content/EndEvent`、`RunFinishedEvent`，通过 `StreamingResponse` 以 SSE 返回。TypeScript 端 `npm install @ag-ui/client tsx`，用 `HttpAgent` 连上去，监听 `onTextMessageContentEvent` 把 delta 打到控制台，就能看到 "Hello from AG-UI!" 逐字流出来。这个例子最能体现协议的核心承诺：**之后你把服务端换成任何一个受支持的框架，客户端代码一行都不用改。**

## 结语

AG-UI 的野心不是再做一个 agent 框架，而是成为所有 agent 框架面对用户时的"通用插座"。判断它值不值得你投入，关键看你的场景：如果你在把 LLM/agent 接入真实产品 UI，需要流式、工具调用、人在环、共享状态、生成式 UI 这些能力，或者你在多个框架之间需要同一套前端，那它几乎是当前生态里最成体系的选择；但如果你只是写无界面的后端脚本，或者已深度绑定某厂商专有协议且没有跨框架需求，那确实不必为了概念硬上。

而抛开用不用，单从工程角度，这个仓库都值得一读——它示范了一个开放协议如何用 schema-first、代码生成和一致性测试，在高速扩张的同时守住"实现不分裂"这条生命线。

项目地址（MIT 协议，欢迎贡献集成与 SDK）：[https://github.com/ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)
