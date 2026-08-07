---
title: "Buzz：Block 开源的人和 AI 平等协作工作区，一键自托管部署"
url: "/articles/2026/08/08/buzz-ai-workspace.html"
date: "2026-08-08T00:00:00+08:00"
lastmod: "2026-08-08T00:00:00+08:00"
description: "Buzz 是 Block（原 Square）开源的一个自托管团队协作工作区，核心创新是让 AI 代理和人类成为平等的工作区成员，统一基于 Nostr 事件日志进行协作，解决了多工具分散和 AI 审计难题。本文带你快速部署体验。"
tags: ["开源", "AI 协作", "AI Agent", "Nostr", "自托管", "团队协作"]
topic: "AI、Agent 与本地模型"
topicSlug: "ai-agent"
layout: article
contentType: article
---

# Buzz：Block 开源的人和 AI 平等协作工作区，5 分钟一键自托管

上周我把测试环境的 AI 协作工作流从「Slack + Claude Code + GitHub 分散联动」换成了 Buzz，整个团队开发和代理协作都收敛到一个事件日志里，不用再在七八个标签页之间跳来跳去找上下文了。这篇讲清楚三件事：

1. Buzz 解决了什么痛点，为什么 Block 要重新做一个协作工具
2. 怎么一键部署到 Railway 或者本地 Docker 运行
3. 哪些团队适合用，哪些场景不适合着急上

## 为什么需要 Buzz？AI 协作的痛点你中了几个

如果你团队已经开始用 AI 代理帮忙做 code review、整理 issue、生成测试用例，你大概率遇到过这些问题：

- **分散在七个工具**：聊天在 Slack/企微，代码在 GitHub，CI 在 GitHub Actions，代理在 Claude Code，复盘的时候要在四五个标签页跳着找上下文
- **AI 代理没有身份**：大多用你的密钥跑，出了问题分不清哪步是人改的哪步是代理跑的，审计等于空谈
- **权限不好控制**：给代理全权限不安全，不给权限干不了活，找不到一个刚刚好的粒度
- **搜索割裂**：聊天记录搜不到代码提交，代码提交找不到讨论上下文，信息像碎片一样散在各处

Buzz 的解法非常干净：**把人和 AI 代理都当成工作区的平等成员，所有消息、反应、代码补丁、CI 结果、审核意见全都是一条 Nostr 签名事件，存在同一个 Relay 里，所有人都能搜，所有操作都可审计**。

![Buzz 项目频道界面，人和代理一起协作制定发布计划](/images/buzz-ai-workspace/channel-thread.png)

*人和 AI 代理在同一个频道协作，每一条消息都是可追溯的签名事件*

## Buzz 核心设计：为什么说它不一样？

### 1. 所有人都是一等公民：人类 · AI · 工作流 · Git

在 Buzz 里，没有「人类发消息，AI 打辅助」这套区别对待：

- 人类用户用 Nostr 密钥签名消息进频道
- **AI 代理也用自己的密钥进频道**，加入、发言、运行工具都是独立身份
- Git 补丁、CI 结果、工作流触发也是签名事件
- 所有东西存在同一个日志，全站全文检索

比如你开了一个功能分支，Buzz 自动给你开一个频道：

1. 开发提交补丁 → 一条 NIP-34 事件
2. CI 跑测试 → CI 机器人发结果事件
3. AI 代理自动做第一遍 review → 代理发评论事件
4. 人类 teammate 看了之后点👍 → 反应事件
5.  approve 合并 → 合并结果事件

所有过程都在这个频道里，不会像原来那样：PR 在 GitHub，讨论在 Slack，CI 状态在邮箱，找起来要疯。

![AI 代理作为频道成员和人类一起协作](/images/buzz-ai-workspace/channel-agents.png)

*AI 代理就是频道里正常一员，和人类没区别*

### 2. 架构极简：一个 Relay 就是一切，没有繁杂微服务

Buzz 的架构哲学是「Single Source of Truth」：

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Clients (人类 + AI 代理)                        │
└───────────┬─────────────────────────────────────────────────────────────┘
            │ WebSocket / REST
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          buzz-relay 主节点                               │
│  NIP-01 协议 · NIP-42 认证 · 频道/DM/媒体/工作流/Git 全部走这个入口       │
└───────────┬──────────────────────┬──────────────────────────────────────┘
            │                      │
      ┌─────▼──────┐         ┌─────▼──────┐
      │  Postgres  │         │   Redis    │
      │ (事件+搜索) │         │ (发布订阅)  │
      └─────────────┘         └─────────────┘
```

所有读写都经过 Relay，所有事件存 Postgres，搜索用 Postgres 全文检索，推送用 Redis 发订阅。没有一大堆微服务，部署简单，运维也省心。

### 3. 代理设计可圈可点：ACP + MCP 双协议，可审计可替换

如果你深入看 Buzz 的 AI 部分，会发现设计很克制：

- **buzz-agent**：标准 ACP（Agent Client Protocol）实现，支持最多 8 个并发会话，每个会话上下文满了自动摘要继续
- **buzz-dev-mcp**：标准 MCP 服务器，提供 shell 和文件编辑工具，每个会话一个独立进程，退出杀进程组，安全边界清晰
- **协议原生，没有耦合**：ACP 客户端只认 ACP，MCP 工具只认 MCP，你可以换自己的 agent，也可以接别的 MCP 工具，不锁死

![快速创建频道，一秒开好新房间](/images/buzz-ai-workspace/create-channel.png)

*点一下就能创建新频道，设置公开还是私有，整个过程不到 10 秒*

## 5 分钟快速体验：两种方式

### 方式一：一键部署到 Railway（推荐体验）

Buzz 官方提供了 Railway 一键部署模板，点下面按钮直接部署：

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/buzz-relay-block)

部署完之后：

1. Railway 会给你一个域名，比如 `buzz-xxx.up.railway.app`
2. Relay 地址就是 `wss://buzz-xxx.up.railway.app`
3. 下载桌面客户端 [latest release](https://github.com/block/buzz/releases/latest)，修改连接地址就能用了

### 方式二：本地 Docker 运行（开发自托管）

需要你本地装了 Docker 和 Docker Compose，一行命令启动：

```bash
git clone https://github.com/block/buzz.git && cd buzz
# 使用生产级 Compose 配置
cd deploy/compose
docker compose up -d
```

启动之后：

- Relay 地址：`ws://你的服务器IP:3000`
- 如果要用 HTTPS，Buzz 官方配置了 Caddy 自动证书，跟着 [deploy/compose/README.md](https://github.com/block/buzz/blob/master/deploy/compose/README.md) 改域名就行

### 本地源码编译开发（需要 Rust 环境）

如果你想改代码玩，官方提供了 Hermi 一键工具链管理：

```bash
git clone https://github.com/block/buzz.git && cd buzz
# 激活 hermit 工具链（自动下载对应版本 Rust/Node/just）
. ./bin/activate-hermit
# 初始化环境：复制配置，启动依赖，跑迁移
just setup && just build
# 开发模式启动：同时起 Relay 和桌面客户端
just dev
```

等待编译完成，桌面客户端会自动弹出来，连接本地 `ws://localhost:3000` 就能用了。

## 适用场景和不适用场景：我帮你分好了

### ✅ 适合用 Buzz 的场景

1. **团队真的在大量用 AI 代理协作**：每天都有 AI 帮忙做 review、整理 issue、生成测试，需要把代理的操作留下审计痕迹
2. **看重数据主权**：不想把团队聊天和代码讨论放第三方 SaaS，想自己掌握所有数据
3. **喜欢简洁架构**：讨厌一堆微服务拼起来的系统，想一个 Relay 搞定所有协作，运维省心
4. **对 Nostr 生态感兴趣**：认同事件日志模型，想基于 Nostr 搭自己的协作工具链

### ❌ 不着急上的场景

1. **团队还没怎么用 AI 代理**：你就是日常聊个天，用 Slack/企微足够，没必要换
2. **需要大量集成现成生态**：比如你已经离不开飞书/Notion 的全套生态，Buzz 还在早期，集成没那么全
3. **移动端重度使用**：Buzz 移动端还在开发中，目前主要是桌面客户端体验好

## 那些让我觉得舒服的小细节

- **带帧锚点的媒体评论**：放视频进去，可以评论具体某一帧，设计视频的时候太好用了
- **YAML 工作流**：可以用 YAML 配置触发条件，比如打 Tag 自动让 Agent 写 Release Note
- **Git 事件原生支持**：Git 补丁、状态直接进事件日志，不用第三方集成
- **完整桌面客户端**：Tauri + React，用起来流畅，不用一直开浏览器标签

![视频帧锚点评论，讨论设计视频太方便](/images/buzz-ai-workspace/media-comments.png)

*可以把评论钉在视频具体帧，讨论视频设计的时候特别实用*

## 总结

Buzz 不是那种「又一个聊天工具」，它找对了 AI 时代协作的真问题：当 AI 代理真的要参与干活，而不是只在边上聊天，它应该是什么身份？

Buzz 的回答是：**和你我一样的身份，一样的密钥，一样的频道权限，一样的审计痕迹**。这个思路很干净，也很有启发性。

如果你正好在找 AI 团队协作的自托管方案，可以花 5 分钟部署试试：

- GitHub 地址：https://github.com/block/buzz
- 一键部署：https://railway.com/deploy/buzz-relay-block
- 文档：https://github.com/block/buzz#readme

## 扩展阅读

- [VISION_AGENT.md](https://github.com/block/buzz/blob/master/VISION_AGENT.md)：官方 AI 代理设计愿景
- [ARCHITECTURE.md](https://github.com/block/buzz/blob/master/ARCHITECTURE.md)：完整架构文档
- [CONTRIBUTING.md](https://github.com/block/buzz/blob/master/CONTRIBUTING.md)：参与贡献指南

---

*如果你觉得这篇文章有用，欢迎点赞分享，也欢迎在评论区聊聊你团队是怎么用 AI 协作的*
