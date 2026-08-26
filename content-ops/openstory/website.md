---
date: 2026-08-26
slug: openstory-ai-video-script-to-production
title: OpenStory - 用AI把脚本一键转换成风格统一的视频作品
draft: false
categories: ["开源项目", "AI工具", "视频生成"]
contenttype: article
description: OpenStory 是一个开源AI视频生成平台，可以把文本脚本自动拆解为场景，生成风格一致的序列帧、图片、动效和音频，支持团队协作和云端部署。本文带你快速上手，分析核心架构，并分享实践体验。
---

# OpenStory: 用AI把脚本一键转换成风格统一的视频作品

做AI短视频，最麻烦的事情是什么？

我想很多创作者都会同意：逐帧写Prompt，保持风格一致性，场景连续性，还有团队协作共享资源。

传统方案里，你得自己一个一个生成场景，手动调整风格，导出后再剪辑，重复劳动多，容易出错，团队协作更是麻烦。

今天给大家介绍一个刚刚开源的项目 **OpenStory**，它解决的就是这个痛点：**你只需要输入一段文本脚本，AI自动帮你拆解场景，生成风格一致的序列帧，支持图片转视频，还能团队共享角色、场景、风格库，全程在浏览器里完成协作。**

## TL;DR

OpenStory 适合这些人用：
- ✅ 内容创作者，想要快速把脚本转换成AI视频草稿
- ✅ 团队协作开发AI视频，需要共享资源库
- ✅ 开发者想要学习最新的AI+云原生全栈架构
- ✅ 想要本地部署，完全掌控数据和API密钥

不适合这些人：
- ❌ 需要直接输出成品4K视频（目前还是序列帧导出，需要二次剪辑）
- ❌ 想要零成本免费生成（依赖fal.ai等API，需要自行付费）

核心优势：全栈开源、本地可运行、风格一致性自动处理、Cloudflare原生部署、团队协作支持。

## 项目解决了什么痛点？

我们来梳理一下传统AI视频创作的流程：

1. 写好脚本，手动把脚本拆分成一个个场景
2. 每个场景写一遍AI绘画Prompt，还要重复提示保持风格一致
3. 逐个生成图片，然后逐个转成视频
4. 最后下载导入剪辑软件拼接
5. 如果团队协作，还要到处发文件，共享角色参数太麻烦

这个流程里，重复劳动多，风格一致性全靠运气，效率很低。

OpenStory 的思路是：**把这些重复性工作全部自动化**：

- 脚本分析：LLM自动把你的文本脚本拆解为场景，自动推荐机位、情绪、运镜
- 风格一致性：自动把角色、场景、色调、灯光信息传递给每一代生成，保持全片统一
- 序列管理：在浏览器里管理所有场景，支持多版本对比
- 团队协作：支持团队工作区，共享角色、风格、特效库
- 一键导出：支持浏览器端直接导出MP4，服务端也能导出

整个过程，你只需要做三件事：写脚本 → 调整AI生成的结果 → 导出。其他事情全部交给AI处理。

## 核心功能一览

### 1. 自动脚本分析

粘贴脚本进去，LLM自动帮你：
- 拆分场景段落
- 给每个场景分配镜头角度、情绪风格、运镜方式
- 提取连续性信息（角色、场景、色调），保证全片风格统一

### 2. AI多模态生成

- **图片生成**：通过fal.ai支持多种模型
- **图片转视频**：一键把静态帧转换成动态视频
- 未来会支持直接生成音频和配乐

### 3. 风格连续性保证

OpenStory 会自动提取每个场景的连续性信息：
- 角色标签
- 环境标签
- 调色板
- 灯光设置

这些信息会自动注入到每个场景的生成Prompt里，保证从头到尾视觉语言一致。

### 4. 团队资源库

即将推出团队工作区功能，可以共享：
- 角色库：重复使用你调好的AI角色
- 地点库：固定场景风格
- 风格库：保存常用的视觉风格
- VFX和音频素材

### 5. 完全云原生架构

- 部署在Cloudflare Workers上，全球CDN加速
- 数据库用Cloudflare D1（SQLite）
- 存储用Cloudflare R2（S3兼容，免出站费）
- 工作流用Cloudflare Workflows，支持长时异步任务
- 本地开发不需要Docker，Miniflare模拟全部云服务

## 技术架构解析

OpenStory 的技术栈选择非常现代化，值得开发者学习：

| 分类 | 技术选型 |
|------|----------|
| 运行时 | Bun |
| 框架 | TanStack Start + TanStack Router + Vite |
| 数据库 | Drizzle ORM + Cloudflare D1 |
| AI | TanStack AI + Fal.ai + OpenRouter |
| 工作流 | Cloudflare Workflows |
| 实时更新 | Cloudflare Durable Objects (SSE) |
| 存储 | Cloudflare R2 |
| 认证 | Better Auth (无密码Passkey) |
| 样式 | Tailwind v4 + shadcn/ui |
| 代码质量 | oxlint + oxfmt + tsgo + Lefthook + Knip |

### 架构亮点

值得一提的是几个设计决策：

1. **本地开发零依赖**：不需要Docker，不需要外部数据库，不需要Cloudflare账号，`bun dev` 一条命令启动完整全栈开发环境，Miniflare在本地模拟了所有Cloudflare服务。

2. **Cloudflare Workflows 最佳实践**：清晰的工作流触发、绑定、错误处理模式，对于想要学习Cloudflare长时任务开发的同学，这个项目是很好的学习案例。

3. **严格的代码规范**：用了oxc生态全套工具（oxlint + oxfmt + tsgo），比ESLint+Prettier+TSC快很多，开发体验好。

4. **完整的测试体系**：单元测试用Vitest，E2E测试用Playwright，CI自动运行。

## 5分钟快速上手

### 前置要求

只需要：
- Bun >= 1.3.0（安装：`curl -fsSL https://bun.sh/install | bash`）

不需要Docker，不需要Cloudflare账号，本地就能跑完全功能。

### 步骤

```bash
# 克隆项目
git clone https://github.com/openstory-so/openstory.git
cd openstory

# 安装依赖
bun install

# 启动开发服务器
bun dev
```

第一次运行会自动：
1. 生成 `.env.local` 配置文件，自动生成认证密钥
2. 初始化本地D1数据库
3. 执行迁移和种子数据
4. 启动Vite开发服务器

打开 `http://localhost:3000` 就能用了。

### 配置AI密钥

要使用AI生成功能，你需要两个API密钥：

1. `FAL_KEY` - 从 [fal.ai](https://fal.ai/dashboard/keys) 获取，用于图片和视频生成
2. `OPENROUTER_KEY` - 从 [OpenRouter](https://openrouter.ai/settings/keys) 获取，用于LLM脚本分析

你可以交互式配置：
```bash
bun setup
```

或者直接编辑 `.env.local` 填入。

## 一分钟演示

我来演示一下完整使用流程：

1. **输入脚本**：在编辑器里粘贴你的视频脚本，比如：
```
开场：一个程序员坐在电脑前，窗外是城市夜景，他挠头看着屏幕，表情苦恼。
切镜：特写屏幕，上面是一堆AI生成的场景图，风格各异，色调不统一。
转场：程序员打开OpenStory网站，输入同样的脚本。
收尾：生成的序列帧整齐排列，风格统一，程序员露出微笑。
```

2. **点击生成**：OpenStory 调用OpenRouter自动分析脚本，拆解为4个场景，每个场景自动生成Prompt。

3. **生成场景**：一键批量生成所有场景图片，fal.ai负责生成，OpenStory保持每个场景的角色和环境一致性。

4. **转视频**：每个场景图片一键转成动态视频。

5. **导出**：直接在浏览器导出拼接好的MP4。

整个过程不到5分钟，你就得到了一个风格统一的AI视频草稿。

## 部署到云端

OpenStory 官方推荐部署到Cloudflare Workers，一键部署：

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/openstory-so/openstory)

点击上面按钮，授权Cloudflare克隆你的仓库，自动创建D1数据库、R2存储桶，配置工作流，完成部署。

如果要手动部署：

```bash
bun setup --prod
bun run deploy:production
```

全程自动化，不需要手动配置太多东西。

## 谁应该关注这个项目？

### 如果你是内容创作者
- 你经常用AI做短视频草稿
- 你厌倦了逐帧调整Prompt
- 你想要保持风格一致性
- ✅ 强烈建议试试，这个项目就是为你解决这些问题的

### 如果你是全栈开发者
- 你想学习TanStack Start最新应用架构
- 你想学习Cloudflare Workers全栈开发
- 你想学习Cloudflare Workflows最佳实践
- ✅ 这个项目代码质量非常高，架构清晰，值得学习

### 如果你需要团队协作
- 多人一起创作AI视频
- 需要共享角色、风格库
- ✅ 团队功能正在开发中，项目架构已经预留了支持

## 优缺点分析

### 优点
- 🎯 **痛点抓得准**：真的解决了AI视频创作中风格一致性和重复劳动的问题
- 🚀 **开发体验好**：一条命令本地启动全栈，不需要任何外部依赖
- ☁️ **云原生设计**：从开发到部署全流程Cloudflare原生，成本低，扩展性好
- 🧑‍💻 **代码质量高**：现代化工具链，规范清晰，结构干净，容易二次开发
- 🔓 **完全开源**：MIT协议，可以免费商用，自己部署完全掌控

### 不足
- 📝 还在积极开发中，团队协作功能还没完全上线
- 🎬 导出功能目前还是基础版，复杂剪辑还是需要导入传统软件
- 💰 AI生成费用需要你自己承担API费用，项目本身不收费

## 总结

OpenStory 是一个设计非常用心的开源项目，它准确击中了AI短视频创作流程中的一个痛点：**重复性劳动多，风格一致性难保证**。通过自动化脚本拆解和连续性保持，把创作者从重复劳动中解放出来，让你专注于内容创作本身。

如果你正在做AI短视频，或者对现代云原生全栈开发感兴趣，我推荐你去GitHub点个星，亲自跑一遍试试：

**项目地址**: https://github.com/openstory-so/openstory

## 延伸阅读

- [项目README](https://github.com/openstory-so/openstory/blob/main/README.md) - 官方文档
- [CLAUDE.md](https://github.com/openstory-so/openstory/blob/main/CLAUDE.md) - 详细架构说明（对开发者非常友好）
- [Cloudflare Workers](https://workers.cloudflare.com/) - 部署平台
- [fal.ai](https://fal.ai/) - AI生成基础设施
