---
title: "OpenChatCut：免费开源的 AI 对话式视频编辑器，支持 Claude Code/MCP 集成"
date: 2026-09-03T00:00:00+08:00
lastmod: 2026-09-03
description: OpenChatCut 是商业 ChatCut 的开源免费替代方案，把对话式 AI Agent 和专业时间线编辑放在同一工作区，支持 Claude Code/Codex 通过 MCP 直接操作视频工程，编辑结果可继续手动修改，真正让 AI 参与剪辑流程。
topic: 开源项目
topicSlug: open-source-ai-video-editor
layout: article
contentType: article
draft: false
categories: ["开源项目", "AI工具"]
url: /articles/2026/09/03/openchatcut-jianying-subtitle-export.html
---

# OpenChatCut：免费开源的 AI 对话式视频编辑器，支持 Claude Code/MCP 集成

## TL;DR

OpenChatCut 适合 **想让 AI 参与剪辑但又不想放弃手动编辑控制权** 的创作者和开发者，不适合追求开箱即用一键成片的纯小白用户。核心优势：开源免费，本地优先，支持外部 AI Agent (Claude Code/Codex) 直接操作，编辑结果始终落在可继续修改的真实时间线上。核心限制：目前处于活跃开发阶段，部分高级功能还在完善，对纯小白用户门槛稍高。

## 痛点：AI 剪辑现在到底缺什么？

你有没有发现，现在很多 AI 视频剪辑工具都有同一个问题：

- 要么是一键生成不可修改的成片，想改一个字的字幕都得重新生成
- 要么是传统编辑器靠手动操作，AI 只能帮忙加个字幕，没法理解你的剪辑需求
- 商业软件 ChatCut 虽然好用，但按月收费，对于普通创作者来说长期成本不低
- AI 生成完结果，没法交给另一个 AI 接着改，整个流程断了

OpenChatCut 解决的就是这些痛点。它是一个**开源免费的 ChatCut 替代方案**，把对话式 AI Agent 和专业多轨时间线编辑结合在一起，让 AI 真正参与到剪辑流程中，同时始终保留手动编辑的控制权。

## OpenChatCut 是什么？

OpenChatCut = 本地视频工程 + 多轨时间线 + AI Agent + MCP 集成 + 可交付导出

它不是一个只靠 AI 一键生成成片的工具，而是一个**让 AI 和人协作剪辑**的工作台：

1. AI 读取你的工程上下文，理解你的剪辑需求
2. AI 生成编辑操作，写入真实时间线轨道
3. 你可以预览、检查、手动调整、撤销重做
4. 整个工程可以保存，交给另一个 AI 接着做
5. 最后导出视频、字幕、甚至 FCPXML 工程文件

![OpenChatCut 编辑器总览](/images/openchatcut-jianying-subtitle-export/01-editor-overview.png)

*OpenChatCut 编辑器总览：Agent 工作台、素材池、预览窗口与多轨时间线*

和传统方案对比如下：

| 能力 | 传统时间线编辑器 | 一次性 AI 视频生成 | OpenChatCut |
|---|:---:|:---:|:---:|
| 精确到轨道和片段 | ✅ | ❌ | **✅** |
| 自然语言修改工程 | ❌ | ✅ | **✅** |
| 修改可检查、可撤销 | ✅ | 通常不可 | **✅** |
| 文字稿与画面联动 | 部分支持 | ❌ | **✅** |
| Codex / Claude Code 直接操作 | ❌ | ❌ | **✅ MCP** |
| 内置 Agent 与外部 Agent 协作 | ❌ | ❌ | **✅ 同一工具面** |
| 本地工程与 BYOK | 视产品而定 | 通常云端 | **✅** |

## 核心能力一览

### 1. Agent-native 原生设计

- **内置对话 Agent**：直接在编辑器里和 AI 对话，描述你的剪辑需求
- **支持 MCP 外部集成**：Claude Code、Codex 等外部 AI Agent 可以通过 MCP 协议直接操作你的视频工程
- **技能系统**：支持自定义 Agent 技能，实现自动化剪辑工作流

### 2. 专业真实时间线

- 多视频轨、多音频轨
- 支持转场、特效、LUT、缩放和关键帧
- 所有修改都落在真实轨道和片段上，随时可以手动调整
- 支持撤销、重做、版本保存

### 3. 文字稿驱动剪辑

- 词级转写，精准对应时间轴
- 删词剪辑，删除文字片段自动对应删除视频片段
- 自动处理停顿，说话人和字幕联动
- 支持 SRT 字幕导出

### 4. 视觉智能处理

- 浏览器内人像分割与人脸安全区，字幕自动避开说话人
- 竖屏转换自动跟随主体，保证主体不被裁剪
- 叠加图形自动放入安全空白区域

### 5. 素材与生成

- 支持图片、视频、语音、音乐、音效在线素材检索
- 支持 AI 生成图片、语音、音乐等素材
- 本地素材管理，分类清晰

### 6. 可交付导出

- 支持 MP4 视频导出
- 支持单独音频导出
- 支持 SRT 字幕导出
- 支持 FCPXML 工程导出，可以导入 Final Cut Pro 继续编辑
- 支持工程文件导入导出

![OpenChatCut 本地工程管理](/images/openchatcut-jianying-subtitle-export/02-project-dashboard.png)

*本地工程管理：创建、导入、复制、导出并继续编辑多个真实工程*

## 典型使用场景

### 场景一：口播与访谈精剪

导入访谈视频后，OpenChatCut 会自动转写文字稿，你只需要删掉文字稿里的口误、停顿和冗余内容，软件会自动帮你剪辑视频，最后自动生成字幕。整个过程比手动剪辑快好几倍。

### 场景二：多素材快速成片

把需要的视频、图片、音频都导入工程，告诉 AI 你想要什么样的成片结构，AI 会帮你完成粗剪、添加转场、配乐和调整节奏，你只需要做最后的微调。

### 场景三：短视频与社交内容

OpenChatCut 可以自动重构画幅，生成标题、字幕、旁白、音乐和视觉包装，帮你快速产出适合社交媒体的短视频。

### 场景四：开发者自动化

开发者可以通过 MCP 让 Claude Code/Codex 读取并修改你的视频工程，实现自动化剪辑工作流。

![Agent 驱动的完整剪辑](/images/openchatcut-jianying-subtitle-export/03-agent-transitions.png)

*Agent 生成音乐并编辑海风日记工程的转场和多轨时间线*

## 如何快速开始？

### 方法一：下载桌面安装包（推荐大多数用户）

直接去 [GitHub Releases](https://github.com/0xsline/OpenChatCut/releases/latest) 下载最新版本，支持 macOS、Windows、Linux：

- macOS：提供 Apple Silicon 和 Intel 的 DMG 安装包
- Windows：提供 x64 安装包
- Linux：提供 AppImage

> 注意：目前 macOS 安装包还没签名，首次启动需要在系统设置里手动允许。

### 方法二：从源码运行（适合开发者）

需要 Node.js 24.x 和 npm：

```bash
git clone https://github.com/0xsline/OpenChatCut.git
cd OpenChatCut
npm install
cp .env.example .env.local
npm run dev
```

启动后打开 `http://localhost:5199` 即可使用。

### 内置 Agent 登录

- **API Key 方式**：打开设置 → Agent 模型，选择厂商填入 API Key 即可使用，支持 Anthropic、OpenAI、Gemini、Kimi、Qwen、GLM、DeepSeek 等主流模型
- **ChatGPT 订阅**：安装官方 Codex CLI 0.146.0+，然后在设置里选择 OpenAI · Codex 登录即可
- **Claude 订阅**：建议通过下文的 MCP 方式连接 Claude Code 使用，内置 Agent 可通过 Anthropic API Key 使用 Claude

## 在 Claude Code / Codex 中使用

OpenChatCut 一大特色就是支持外部 AI Agent 通过 MCP 协议直接操作，你可以在 Claude Code 里直接让 AI 帮你剪辑视频。

### 一键安装 Skill

```bash
npx skills add 0xsline/OpenChatCut
```

安装完成后对 Agent 说「设置 OpenChatCut」，就会自动注册本地 MCP 连接。

### 手动配置 MCP

如果手动配置，Claude Code 只需要执行这一条命令：

```bash
claude mcp add --transport http openchatcut \
  http://localhost:5199/api/external-mcp/mcp
```

然后就可以直接给 Claude Code 发指令了，比如：

```
启动一个 OpenChatCut 编辑会话，读取草稿，在第二条音频轨的 8 秒处添加划盘音效，并给相邻视频添加故障转场。提交草稿供审阅，等我在 OpenChatCut 内应用后，再报告修改已经生效。
```

![Motion Graphics 与 Agent](/images/openchatcut-jianying-subtitle-export/04-motion-graphics.png)

*Motion Graphics 与 Agent：浏览动态图形模板，也可以让 Agent 生成并组合可继续编辑的 MG 片段*

## 核心优势总结

1. **完全开源免费**：AGPL 许可证，没有订阅费用，商业项目遵守协议即可免费使用
2. **本地优先**：工程和素材都保存在你的电脑上，隐私有保障
3. **AI + 人工协作**：AI 负责批量处理和创意生成，人负责最终调整，效率和可控性兼得
4. **MCP 生态集成**：完美适配 Claude Code/Codex 等现代 AI 开发工具，开发者可以自动化剪辑流程
5. **结果可继续编辑**：所有修改都落在真实时间线上，随时可以调整，不会像一次性 AI 生成那样改一点就要重跑

## 谁适合用 OpenChatCut？

✅ **适合**：
- 经常需要剪辑视频，想让 AI 帮忙提升效率但又不想完全交给 AI 的创作者
- 开发者，想用 Claude Code/Codex 自动化剪辑工作流
- 觉得商业 ChatCut 订阅太贵，想找免费替代的用户
- 相信开源，看重隐私和本地存储的用户

❌ **不适合**：
- 完全不会剪辑，想靠 AI 一键生成所有内容的纯小白
- 追求极致稳定，不想接受活跃开发中可能存在的 bug 的用户

![WebGL 视觉特效](/images/openchatcut-jianying-subtitle-export/05-effects.png)

*WebGL 视觉特效：像素化、双色调、鱼眼、万花筒、柔化与漏光等效果可直接应用到片段*

## 结语

OpenChatCut 是一个非常有意思的开源项目，它找到了 AI 剪辑的新方向：**不是让 AI 完全替代人，而是让 AI 成为剪辑流程中的得力助手，始终给人留着手动调整的后门**。

对于创作者来说，这应该是最舒服的状态：AI 帮你处理重复劳动，你把精力放在创意和审美上，最终结果随时可调，不用看 AI 脸色。

项目目前星标 1.5k+，更新很活跃，作者也在积极迭代功能，感兴趣的不妨去 GitHub 点个 star，下载下来试试。

项目地址：[https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

官网：[https://openchatcut.com](https://openchatcut.com)

> 如果你觉得这个项目不错，欢迎去 GitHub 点个 star 支持作者！

---

*本文配图均来自 OpenChatCut 官方 README，版权归原项目所有。*
