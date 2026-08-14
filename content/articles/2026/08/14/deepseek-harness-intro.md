---
date: 2026-08-14
slug: deepseek-harness-intro
title: 用了各种 AI Agent 框架后，我等到了这个「一切皆插件」的开源项目
description: DeepSeek 开源的 Harness 框架采用彻底的「一切皆插件」架构，任何组件都可以替换。适合需要深度定制 AI Agent 底座的二次开发者，不适合追求开箱即用快速搭 Demo 的初学者。本文拆解核心设计，分析适用场景，给出一键运行命令。
categories: ["开源项目", "AI 智能体"]
contenttype: article
draft: false
cover: "/images/deepseek-harness-intro/cover-wechat.jpg"
---

# 用了各种 AI Agent 框架后，我等到了这个「一切皆插件」的开源项目

最近 AI Agent 框架一个接一个出来，我试用了大半年，总觉得差点意思：

- Claude Code 好用，但闭源，你想改个核心逻辑根本动不了
- OpenAI Agents SDK 概念太多，写个简单Demo要看好几篇文档，门槛太高
- 其他开源框架多多少少都有点耦合 —— 你想换个模型后端，要改好几个地方

直到 DeepSeek 开源了 [**Harness**](https://github.com/deepseek-ai/deepseek-harness)，我才觉得：哦，原来 AI Agent 框架就该这么设计。

## 核心设计：「一切皆插件」到底是什么意思？

DeepSeek Harness 的核心一句话就能说清楚：**Everything is a plugin.**

翻译成人话就是：

- 模型调用是插件 → 你想换 DeepSeek / OpenAI / Claude，随便换
- 工具调用是插件 → 自带文件系统、shell、subprocess、LSP，你再加个浏览器也没问题
- 授权策略是插件 → 本地用全放开，给别人用可以加审批
- 会话持久化是插件 → SQLite 存在本地，你想迁去 PostgreSQL 也可以
- 甚至连 Agent 循环本身，也是插件 → 你对思考流程不满意，整个换掉都没问题

这种设计带来的好处太实在了：

**不存在「不可扩展的核心」。** 你不需要去改框架源码，只要写个新插件，挂载上去就能用。框架只负责把插件拼起来，运行流程给你串好。

## 架构拆解：插件到底怎么拼起来？

理解 Harness 架构，记住三个关键词就够了：

### 1. Cordis 内核

Harness 基于 Cordis 框架开发， Cordis 的设计就是「插件都贡献服务、事件、可回收副作用到共享上下文」。

简单说：每个插件注册自己能提供什么能力，别人用的时候直接从上下文拿就行。插件卸载，整个副作用自动回收。

所以你加新能力，不会动到别人的奶酪；换组件，也不用牵一发动全身。

### 2. 分层配置：Profile + Bundle + Patch

启动一个 Harness 实例，其实是按层拼配置：

1. **Bundle**：打包好的一组配置和代码，比如 `dsh-base` 就是基础层，包含所有默认工具和模型适配
2. **Profile**：一个命名的组合，比如 `web` 带 UI，`headless` 命令行跑任务
3. **Patch**：你的个人定制，覆盖掉默认配置就行

比如你想把默认模型从 DeepSeek 改成 OpenAI，不用重新编译，写个 patch 替换模型提供商那一行配置就行。

### 3. 能力 seam 设计

Harness 把每个能力都做成「接口-实现-使用者」三层：

- **Service Definition**：定义好接口长什么样
- **Service Provider**：具体实现（本地/远程/沙箱）
- **Consumer**：Agent 或工具用这个能力

所以你换个实现，接口不变，上层代码不用改。比如把本地 shell 换成 E2B 沙箱，对上层 Agent 来说完全无感。

## 谁适合用？谁不适合用？

用一句话总结：

> **适合二次开发定制自己 Agent 底座的开发者，不适合想要开箱即用跑 Demo 的初学者。**

我帮你分的更清楚点：

### ✅ 你应该用 Harness，如果：

1. **你想做自己的 AI Agent 产品** —— 需要一个稳定灵活的底座，各个组件都能替换，不想被框架锁死
2. **你对现有 Agent 框架某部分不满意** —— 比如不想用默认的模型，想换个工具调用实现，Harness 让你无痛替换
3. **你需要集成特定工具** —— 比如内部系统、私有API，插件机制让你干净集成进去

### ❌ 你不该用 Harness，如果：

1. **你就是想跑个 Demo 玩玩** —— 安装 pnpm 依赖、build 都要时间，npx 一键启动虽然有，但定制起来还是要写配置
2. **你想要完整的聊天客户端** —— Harness 是框架，不是成品 App，UI 只有基础的 Web UI
3. **你不懂 Node.js/TypeScript** —— 二次开发需要懂点 TS，不然看不懂插件怎么写

## 五分钟上手：怎么跑起来？

Harness 提供了 npx 一键启动，你本地只要装了 Node.js 22+，直接跑：

```bash
npx @deepseek-ai/dsh web
```

这条命令会：

1. 拉取最新版本
2. 启动 Web UI，默认地址 `http://127.0.0.1:3080`
3. 用你环境变量里的 `DEEPSEEK_API_KEY` 调用模型

打开浏览器就能用，自带 Web 界面可以聊天、看会话历史。

如果想从源码运行改点东西：

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

## MCP 集成：直接能用

如果你在用 Claude Code 或者 Hermes Agent，Harness 本身就支持 MCP 协议，自带 ACP 服务器：

```json
{
  "mcpServers": {
    "deepseek-harness": {
      "command": "pnpm",
      "args": ["dsh", "--profile", "headless", "start-mcp"]
    }
  }
}
```

把这段加到你的 MCP 配置里，就能在 Claude Code 里用 Harness 调度任务了。

## 总结

DeepSeek Harness 是我最近看到最对我胃口的开源 AI Agent 框架：

- **理念清晰**：一切皆插件，彻底解耦，谁用谁知道
- **工程干净**：全 TypeScript，模块化清晰，100% 测试覆盖率要求，代码读着舒服
- **灵活够了**：想换什么换什么，不需要你去改框架核心

如果你也折腾过好几个 Agent 框架，总觉得「怎么都不顺手」，可以去试试 Harness。说不定你也会有「终于等到了」的感觉。

项目地址：[https://github.com/deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)

**一句话行动：** 如果你最近在攒自己的 Agent 底座，不妨 clone 下来跑一遍，十分钟就能感觉到这个设计到底好在哪。

---

*关注我的专栏，持续拆解好用的开源 AI 工具，告诉你谁适合用、怎么上手最快。*

#开源 #AI #智能体 #DeepSeek #开源项目 #AI编程 #Agent