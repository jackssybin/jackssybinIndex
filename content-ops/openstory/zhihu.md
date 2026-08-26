---
title: OpenStory 这个开源AI视频生成项目值得用吗？我的体验结论
description: OpenStory 声称可以把文本脚本一键转换成风格统一的AI视频序列，它真的好用吗？适合哪些人？本文从实际体验和技术架构两方面给你结论。
---

> **TL;DR**：OpenStory 适合内容创作者和想要学习现代云原生全栈开发的工程师，不适合想要直接出成品4K视频且零成本的用户。核心优势是解决了AI视频创作中「逐帧写Prompt」和「风格一致性」两个痛点，全栈开源，本地可运行，Cloudflare原生部署。

## 问题背景

做AI短视频，你是不是也遇到过这些问题：
1.  手动拆场景，逐个写Prompt，重复劳动太多
2.  每个场景生成出来风格不统一，角色脸都变了
3.  团队协作想要共享角色和风格，文件传来传去太麻烦

最近开源的 OpenStory 想要解决这些问题，它号称「只需要输入脚本，AI自动帮你生成全片」。我 clone 下来跑了一遍，给大家整理了我的判断。

## OpenStory 是什么？

OpenStory 是一个开源的AI视频序列生成平台，核心工作流：

1.  **你输入文本脚本**
2.  **AI自动分析**：拆解场景，分配机位、情绪、运镜
3.  **AI自动生成**：批量生成场景图片，保持角色、环境、色调一致性
4.  **一键转视频**：静态帧转动态视频剪辑
5.  **导出成片**：直接输出MP4

整个过程，你只需要做三件事：写脚本 → 调整结果 → 导出。重复劳动全部自动化。

## 核心功能

### 自动脚本分析

OpenRouter 调用LLM自动拆解你的脚本：
- 按段落拆分场景
- 自动识别角色、场景
- 推荐镜头角度、情绪风格、运镜方式
- 提取连续性信息，保证全片风格统一

### AI生成能力

- 图片生成对接 fal.ai，支持多种模型
- 图片转视频，一键生成动态镜头
- 未来支持音频和配乐生成

### 风格连续性自动保证

这是 OpenStory 最核心的价值：

它会自动把每个场景的：
- 角色标签
- 环境标签
- 调色板
- 灯光设置

提取出来，自动注入到每个场景的生成Prompt中。这样从头到尾，角色长得一样，场景色调一致，不用你每次都重复描述。

### 团队协作（开发中）

项目规划了团队工作区，可以共享：
- 角色库：保存你调好的AI角色
- 地点库：固定场景风格
- 风格库：保存常用视觉风格

## 技术架构（开发者看点）

OpenStory 的技术栈非常现代化，全栈用了最新的工具：

**核心依赖：**
- 运行时：Bun
- 前端框架：TanStack Start + TanStack Router + Vite
- 数据库：Drizzle ORM + Cloudflare D1
- AI：TanStack AI + Fal.ai + OpenRouter
- 工作流：Cloudflare Workflows
- 实时：Cloudflare Durable Objects (SSE)
- 存储：Cloudflare R2
- 认证：Better Auth（无密码Passkey）
- 样式：Tailwind v4 + shadcn/ui

### 架构亮点

**1. 本地开发体验极佳**

不需要Docker，不需要Cloudflare账号，不需要外部数据库。只要有Bun，一条命令 `bun dev` 就能启动完整全栈开发环境。Miniflare 在本地模拟了所有Cloudflare服务，开发体验和本地开发完全一致。

**2. Cloudflare Workflows 最佳实践**

项目完整展示了如何在Cloudflare Workers上处理长时异步任务，工作流触发、绑定、错误处理都有清晰的模式，想要学习Cloudflare开发的同学可以直接参考。

**3. 代码质量高**

全套用了oxc生态：oxlint + oxfmt + tsgo，比ESLint+Prettier+TSC快一个数量级，开发体验非常流畅。

## 五分钟本地部署体验

部署非常简单，只需要这几步：

1. 安装 Bun
```bash
curl -fsSL https://bun.sh/install | bash
```

2. 克隆项目安装依赖
```bash
git clone https://github.com/openstory-so/openstory.git
cd openstory
bun install
```

3. 启动开发服务器
```bash
bun dev
```

第一次启动自动生成配置、初始化数据库，完成之后打开 http://localhost:3000 就能用。

4. 配置API密钥
```bash
bun setup
```
依次输入你的 `FAL_KEY` 和 `OPENROUTER_KEY` 就好了。

## 适合谁用？不适合谁用？

### ✅ 适合这些人
- **内容创作者**：经常用AI生成短视频草稿，厌倦了逐帧写Prompt
- **全栈开发者**：想要学习TanStack Start + Cloudflare Workers最新架构
- **团队创作**：多人协作开发AI视频，需要共享资源库
- **隐私敏感**：想要自己部署，完全掌控数据和API密钥

### ❌ 不适合这些人
- **成品需求**：想要AI直接输出剪辑好的4K成品视频（目前还是序列，需要二次剪辑）
- **零成本需求**：API费用需要自己承担，项目本身不收费，但生成还是要找fal.ai花钱
- **非Cloudflare部署**：目前只支持Cloudflare Workers，想要部署到Vercel/Netlify/VPS需要自己改造

## 优缺点总结

### 优点
- 🎯 痛点抓得非常准，真的解决实际问题
- 🚀 本地开发体验一流，一条命令跑完全栈
- ☁️ 云原生设计，部署到Cloudflare之后成本很低
- 🧑‍💻 代码结构清晰，规范到位，适合学习和二次开发
- 🔓 MIT开源，完全免费商用

### 不足
- 团队协作功能还在开发中，尚未上线
- 导出功能比较基础，复杂剪辑还是需要导入PR/Final Cut
- 目前只支持Cloudflare Workers部署，其他平台需要改造

## 最后

如果你正在被AI视频创作中的重复劳动和风格不一致问题困扰，我推荐你去试试 OpenStory。它确实解决了这个领域里一个真实存在的痛点。

对于开发者来说，这个项目的架构和代码质量也非常值得学习，展示了如何在2026年用Bun + TanStack + Cloudflare做一个现代全栈AI应用。

项目地址：https://github.com/openstory-so/openstory

你用过OpenStory吗？欢迎在评论区分享你的体验。
