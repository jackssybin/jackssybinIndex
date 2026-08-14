---
title: "DeepSeek Harness：深度读评 — 一切皆插件的开源 AI Agent 框架"
permalink: "/articles/2026/08/14/deepseek-harness-intro.html"
description: "DeepSeek 官方开源的 AI Agent 框架 Harness，采用“一切皆插件”的架构设计，从模型适配器到 Agent 循环本身都是可替换的插件。本文深入解读其架构思想、核心设计，并给出上手体验和适用场景判断。"
tags: ["AI", "开源", "Agent框架", "DeepSeek", "插件化"]
pageClass: solo-page
sidebar: false
breadcrumb: false
pageInfo: false
contributors: false
lastUpdated: false
comment: false
---

# DeepSeek Harness：深度读评 — 一切皆插件的开源 AI Agent 框架

![DeepSeek Harness 封面](/images/deepseek-harness-intro/cover-wechat.jpg)

上周 DeepSeek AI 开源了自己的内部 Agent 框架 **DeepSeek Harness**，我第一时间clone下来读了源码。这不是那种"又一个Agent脚手架"，它提出了一套非常彻底的插件化思想——**everything is a plugin**，从 LLM 适配器、工具注册表到 Agent 循环本身，全都是插件。

这篇文章讲清楚三个问题：
1. 它解决了什么现有框架解决不好的痛点？
2. "一切皆插件"到底是什么意思，架构上是怎么做的？
3. 什么人应该用它，什么场景下不适合？

---

## 痛点：为什么我们需要另一个 AI Agent 框架？

你肯定见过这样的场景：

- 想用 OpenAI 之外的模型，发现框架把模型调用写死在核心里，改起来要动三处
- 想加个自定义沙箱规则，发现入口被私有API包着，只能fork改源码
- 想换个持久化存储，翻了半天文档才找到哪里改配置
- 项目跑了半年，想加个新能力，结果牵一发动全身，核心逻辑改完一堆测试炸了

现有的不少 Agent 框架，说是"可扩展"，但本质还是"框架核心 + 第三方插件"——核心是特权的，插件只能在预留的沙盒里玩。DeepSeek Harness 走了另一个极端：**没有特权核心**。

![架构对比：传统框架 vs Harness 一切皆插件](https://i.imgur.com/placeholder.png)

> 传统框架：不可变的核心 + 可扩展的插件边界 → 加新能力经常要改核心  
> Harness：启动空上下文，所有能力都是一层一层插件堆上去 → 任何一层都能换

举个例子：如果你想把默认的 Agent 循环从"单步思考 → 工具调用 → 结果返回"改成"多智能体辩论 → 投票决议"，不需要改框架源码——只需要写个新的 Agent Loop 插件替换掉原来的就行。整个过程不影响其他插件的工作。

## 核心设计："一切皆插件"到底是什么？

Harness 基于 Cordis 框架开发，Cordis 本身就是一个"一切皆插件"的应用框架。Harness 在这个基础上，定义了 AI Agent 领域的能力分层：

### 核心插件包概览

看一眼 packages 目录结构你就能感受到这个设计的彻底性：

**核心能力层**：
- `core/session`：会话事件日志和内存存储（**所有对模型可见的内容都必须来自日志**）
- `core/system-prompt`：System Prompt 片段组装机制（插件可以贡献自己的片段）
- `core/tools`：带守卫执行管道的作用域工具注册表
- `core/agent`：Agent 接口定义和 live 注册
- `core/agent-loop`：默认的 Agent 驱动实现
- `llm/llm`：LLM 能力适配层（定义接口，各个模型提供商做实现）

**能力插件层**（各种开箱即用的能力）：
- `shell`：Bash 命令执行能力
- `fs`：文件系统访问 + 策略控制
- `lsp`：语言服务器协议能力
- `skill`：技能/插件注册表
- `web`：Web 搜索和获取能力
- `subagent`：子代理能力委托
- `e2b`：E2B 沙箱支持
- `compaction`：上下文压缩能力

每一个能力都是标准的 Cordis 插件，遵循同样的注册和生命周期规则。**没有哪个比哪个更核心**。

### 组合方式：Profile 和 Bundle

Harness 把启动配置抽象成两个概念：

- **Bundle**：是一组 Cordis 配置行和代码的分发格式——它插入的任何内容都可以被上层补丁修改
- **Profile**：是存储在用户目录的命名组合，列出它堆叠的 bundles、用户安装的第三方插件、以及自定义补丁

比如说，`web` profile 默认就是：
```
dsh-base （基础层：模型适配器、工具、持久化...）
→ dsh-web-app （加上浏览器应用）
→ 用户自定义补丁
```

你想换个默认模型？只需要打个补丁替换掉模型提供商配置就行，不需要改任何代码。想加个自定义工具？把它作为第三方插件安装到 profile 里，下次启动就生效了。

想看你机器实际启动的插件树？运行这个命令：

```bash
dsh --profile web --dump-config
```

输出里每一行都能被你自己的补丁替换掉——这才是真·可定制。

### 事件驱动：扩展点无处不在

Harness 把执行流程拆成了一系列事件，你的插件可以在任何点拦截、修改、甚至拒绝执行：

```
turn/start
  claim next-step input
  assemble prompt sections + tool schemas
  -> agent/pre-step    在这里你可以修改请求，甚至直接拒绝
     拒绝 → close turn
     通过 → step/start
     append messages
     derive model history
     agent/request -> llm/stream -> assistant/chunk* -> assistant/message
     tool/call* -> tools/pre-execute -> tools/execute -> tools/post-execute -> tool/result*
     step/end
     tools have more requests -> repeat
  -> agent/turn-stopping
turn/end
```

每个扩展点都是标准的 Cordis 事件监听，你想加什么行为就加什么——比如想加个计费统计，只需要监听 `llm/stream` 事件统计 token 就行。想加风险控制，就在 `tools/pre-execute` 检查命令，危险的直接拒绝。

这种设计带来一个好处：**生态可以生长，不需要框架升级**。社区出了新的安全沙箱，直接替换掉原来的安全插件就行，不需要等 Harness 合并 PR。

## 五分钟上手体验

DeepSeek Harness 提供了非常友好的上手方式——不需要 clone 源码，一行命令就能启动 Web UI：

```bash
npx @deepseek-ai/dsh web
```

默认监听 `http://127.0.0.1:3080`，打开就能用。前提是你要有 `DEEPSEEK_API_KEY` 环境变量。

如果你想从源码运行：

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

项目目前处于开发者预览阶段，**未来会有不兼容的变更**，但核心架构已经清晰可见。

## 适用场景判断：谁该用，谁不该用？

读完源码我给一个直白的判断：

> **TL;DR**：DeepSeek Harness 适合需要深度定制化二次开发的场景，不适合追求开箱即用快速搭应用。

| 适合 | 不适合 |
|---|---|
| 你正在搭建自己的 Agent 开发底座 | 你想找个"一键运行 DeepSeek RAG" |
| 你需要频繁替换组件（模型、沙箱、存储） | 你只需要简单调用 API 做个聊天机器人 |
| 你的团队有多人协作开发不同的 Agent 能力 | 你是初学者只想跑个 Demo 体验 |
| 你需要按场景灵活组合不同能力集合 | 你不需要定制化，只想快速出产品 |

### 为什么说这是 DeepSeek 给社区的一份厚礼？

DeepSeek 自己做 Agent 肯定需要一个灵活的底座，现在开源出来，相当于把他们内部的工程设计开放给社区。对于那些想自己折腾 Agent 架构、尝试不同设计思路的人来说，这真的是宝藏。

它不是为普通终端用户准备的开箱产品，它是**给框架作者和二次开发者准备的地基**。如果你满足：
1. 对现有 Agent 框架的耦合程度不满意
2. 需要高度定制化你的 Agent 工作流
3. 相信"组合优于继承"、"开放优于封闭"的设计思想

那这个项目值得你花一个下午读读源码。

## 可收藏清单：核心扩展点速查

如果你准备基于 Harness 做二次开发，这些是你最可能需要修改或扩展的地方：

| 目标 | 机制 | 位置 |
|---|---|---|
| 添加一个新的 LLM 提供商 | 在 `ctx.llm` 注册适配器 | `packages/llm/` |
| 添加一个新的工具 | 在 `ctx.tools` 注册 | 遵循 `cookbook/adding-a-tool.md` |
| 修改 Agent 循环逻辑 | 替换默认的 Agent 驱动 | `packages/core/agent-loop/` |
| 添加自定义能力 | 实现 Service Definition + Provider | 遵循 `capability-seams.md` |
| 拦截请求做检查 | 监听对应的扩展事件 | 看 `Turn flow` 事件列表 |

## 总结

DeepSeek Harness 的核心贡献不是"又写了一个 Agent 框架"，而是**把"一切皆插件"这个设计思想在 AI Agent 领域贯彻到底**——没有特权核心，所有能力都是可替换的，扩展点无处不在。

这种设计的优点是灵活性拉满，缺点是门槛也高——你需要理解插件化思想，愿意花时间理解这套架构，才能用好它。但对于那些真正需要深度定制的场景，这种彻底的插件化反而能减少很多痛苦。

项目地址：https://github.com/deepseek-ai/deepseek-harness  
欢迎感兴趣的朋友去试玩，有什么发现欢迎留言讨论。

---

*如果你觉得这篇解读有帮助，欢迎转发给正在折腾 Agent 框架的朋友*

#AI #开源 #DeepSeek #Agent框架 #插件化
