---
title: "Skill Zoo：统一管理所有 AI 编程工具的技能库"
url: "/articles/2026/06/25/skill-zoo-ai-skills-manager/"
date: "2026-06-25T16:43:00+08:00"
lastmod: "2026-06-25T16:43:00+08:00"
description: "你是否也在 Claude Code、Cursor、Codex 等多个 AI 编程工具之间切换，每个工具都有自己的技能目录，技能分散在各处难以管理？Skill Zoo 是一个开源本地工具，让你在一个图形界面中发现、安装、更新和管理所有 AI 编程技能。"
tags: ["AI Agent", "技能管理", "开源项目"]
topic: "AI Agent"
topicSlug: "ai-agent"
layout: article
contentType: article
---

![封面](/images/skill-zoo-ai-skills-manager/header-image.webp)

你是否也遇到过这个问题：同时使用 Claude Code、Cursor、Codex、Gemini、OpenCode、Hermes 等多个 AI 编程工具，每个工具都把技能存在不同的目录里。想要安装一个新技能，需要手动复制粘贴到对应的路径；同一个技能安装到多个工具后，各自修改慢慢产生差异；想看看社区里有什么好用的技能，得挨个仓库去翻找。

如果你也被这些问题困扰，今天介绍的这个开源项目 **Skill Zoo** 就是你的解药。

## 问题：技能为什么会混乱？

AI 编程工具越来越流行，"技能"（Skill / GPTs / Agent）的生态也越来越丰富。一个技能就是一份预设好的提示词、工作流或者指令集，能让 AI 更好地帮你完成特定任务。

但现状是：

- 每个 AI 编程工具技能的存储位置都不一样
- 没有统一的社区发现渠道，好技能容易被埋
- 多工具重复安装，难以同步更新
- 手动管理容易出错，出现冲突找不到问题所在

**以前你需要这样做：**

1. 在 GitHub 找到一个感兴趣的技能
2. 打开自己电脑上 Claude Code 的技能目录
3. 手动克隆/复制进去
4. 再打开 Cursor 的技能目录，重复一遍
5. 过了半个月，忘记这个技能装到哪里了
6. 更新的时候，不知道哪个是最新版本

**现在有了 Skill Zoo，你只需要：**

1. 打开 Skill Zoo 搜索技能
2. 点击安装，选择要安装到哪些 AI 编程工具
3. 完成 — 就是这么简单

## 什么是 Skill Zoo？

[Skill Zoo](https://github.com/luochang212/skill-zoo) 是一个**本地优先**的 AI 技能管理工具，基于 Tauri v2 构建，提供美观的桌面客户端，同时也支持 CLI 和 Web UI。它支持目前主流的几乎所有 AI 编程工具：

- Claude Code
- Codex
- Gemini CLI
- OpenCode
- Cursor Rules
- Trae
- Hermes Agent
- OpenClaw
- 更多工具持续添加中

![Skill Zoo 主界面](/images/skill-zoo-ai-skills-manager/screenshot-1.webp)

### 核心设计哲学

Skill Zoo 的设计思路非常清晰：

1. **本地优先**：所有数据都存在你自己电脑上，不依赖云端服务
2. **无厂商锁定**：技能仍然以标准格式保存在各个工具原来的位置，Skill Zoo 只是帮你管理它们
3. **安全透明**：所有操作都需要你确认，不会偷偷修改你的文件
4. **开源可审计**：完整代码开源，构建过程公开，任何人都可以审计代码

## 主要功能

### 1. 探索发现：一键安装社区技能

Skill Zoo 内置了技能仓库发现功能，你可以直接在界面中搜索 GitHub 上共享的技能，浏览描述，一键安装到你选中的所有 AI 编程工具中。

![发现页面](/images/skill-zoo-ai-skills-manager/screenshot-2.webp)

不需要再手动 `git clone` 或者复制粘贴，点一下鼠标就搞定。

### 2. 自动更新：保持所有技能最新

安装的技能有更新了怎么办？Skill Zoo 会帮你检测，并一键更新到 GitHub 仓库的最新版本。不用你自己去挨个拉取。

### 3. 批量操作解决重复技能

如果你像我一样，同一个技能不小心装了好几次，分散在多个位置，可以用**批量删除/合并**功能一键整理。

Skill Zoo 会检查内容哈希，只有内容完全一致才允许合并，保证不会出错。

### 4. 安全审计：帮你把关技能质量

Skill Zoo 集成了 [skills.sh](https://skills.sh) 社区的安全评分，会展示每个技能的审计结果，帮你判断是否安全。

### 5. 主动检测不一致问题

Skill Zoo 会主动帮你检测三种常见问题：

- 技能文件损坏
- 链接不一致
- 重复冲突

并且提供一键修复功能。

### 6. 技能创作：内置 Markdown 编辑器

想要写一个自己用的技能？不需要打开外部编辑器，Skill Zoo 内置了基于 CodeMirror 6 的 Markdown 编辑器，你可以直接在里面创作，实时预览。

### 7. 技能归档：让常用列表保持清爽

有些技能不常用但又舍不得删？可以转到归档区，降低主界面的上下文负担，想用的时候再恢复。

### 8. CLI + WUI：编程也能管理

如果你更喜欢在终端里工作，Skill Zoo 也提供了 npm 包的 CLI 版本：

```bash
# 安装 CLI
npm i -g skill-zoo

# 列出已安装技能
skill-zoo list

# 诊断并修复常见问题
skill-zoo doctor --fix

# 启动 Web 管理界面
skill-zoo wui
```

![CLI 使用](/images/skill-zoo-ai-skills-manager/screenshot-3.webp)

## 支持哪些 AI 编程工具？

目前开箱即用支持这些工具：

| 工具 | 支持状态 |
|------|---------|
| Claude Code | 完整支持 |
| OpenAI Codex | 完整支持 |
| Gemini CLI | 完整支持 |
| OpenCode | 完整支持 |
| Cursor (Rules) | 完整支持 |
| Trae | 完整支持 |
| Hermes Agent | 完整支持 |
| OpenClaw | 完整支持 |
| Qoder CN | 默认隐藏（可开启）|
| WorkBuddy | 默认隐藏（可开启）|

如果你的工具不在列表里，也可以手动添加自定义路径，Skill Zoo 一样可以管理。

## 安装使用

### 桌面客户端安装

最简单的方式是直接从 GitHub Releases 下载安装包：

**macOS**：

1. 下载 `.dmg` 文件
2. 打开后将 `skill-zoo.app` 拖入 `Applications` 文件夹

**Windows**：

1. 下载 `.exe` 安装包
2. 运行安装包，自动创建快捷方式并支持自动更新
3. 如果 SmartScreen 弹出警告，点击"更多信息" → "仍要运行"

**Linux**：

下载与你 CPU 架构匹配的 AppImage 或 `.deb` 包：

```bash
# AppImage 方式
chmod +x Skill-Zoo-*-Linux-*.AppImage
./Skill-Zoo-*-Linux-*.AppImage
```

### 体验流程

安装完成后，第一次打开：

1. **添加编程工具**：Skill Zoo 会自动扫描你系统中已安装的 AI 编程工具，确认即可添加
2. **发现技能**：切换到发现标签页，浏览社区技能仓库
3. **安装技能**：点击感兴趣的技能，选择要安装到哪些工具，确认安装
4. **开始使用**：去你的 AI 编程工具里就能用刚刚安装的技能了

整个过程不超过 5 分钟。

## 技术架构

Skill Zoo 采用了现代的前后端分离架构：

| 层级 | 技术栈 |
|------|--------|
| 前端 | React 19 + TypeScript 6 + Vite 8 |
| 后端 | Rust + Tauri v2 |
| 样式 | Tailwind CSS 4 + shadcn/ui |
| 状态管理 | TanStack React Query |
| 编辑器 | CodeMirror 6 |

项目结构清晰，代码质量很高，如果你想二次开发也很容易上手：

```
skill-zoo/
├── src/                    # React 前端
│   ├── components/         # 各个功能模块组件
│   ├── hooks/              # React Query hooks
│   ├── i18n/               # 中英文翻译
│   ├── lib/                # 工具函数
│   └── types/              # TypeScript 类型定义
├── src-tauri/              # Rust 后端
│   ├── src/commands/       # IPC 命令处理
│   ├── src/services/       # 技能操作服务
│   └── src/persistence/    # 持久化存储
├── packages/cli/           # npm CLI
```

## 适合谁用？

### 推荐使用

- 同时使用两个或以上 AI 编程工具
- 经常尝试社区分享的各种技能
- 喜欢整洁，讨厌技能到处乱放
- 希望有一个图形界面可视化管理

### 可能不需要

- 只使用一个 AI 编程工具，且技能数量很少
- 只写代码从来不使用技能
- 习惯纯手动管理，觉得 GUI 多此一举

## 我的使用感受

作为一个每天都和各种 AI 编程工具打交道的人，我自己最深的感受是：**终于不用记每个工具的技能目录在哪了**。

以前我在 Claude Code、Hermes、OpenCode 都装了差不多一套技能，有时候更新了一个技能，要记得去每个地方都更一遍，很容易漏。现在在 Skill Zoo 里点一下全更完，省了很多脑子。

发现功能也很实用，有时候想看社区最近有什么新点子，直接打开就能浏览，不用自己去 GitHub 搜。

最让我欣赏的是它的**无侵入设计** — 它不会把你的技能挪到什么奇怪的地方，还是存在原来工具要求的位置，只是帮你做了一层统一管理。就算哪天不用 Skill Zoo 了，你的技能还是好好地在原来的地方，完全不影响使用。

## 总结

Skill Zoo 解决了一个非常实际的痛点：**AI 技能分散在多个工具中难以管理**。它做的事情不复杂，但做得非常干净漂亮：

- 图形界面直观，操作简单
- 本地优先，隐私安全
- 不侵入，无锁定
- 开源免费，持续更新

如果你也在多个 AI 编程工具之间切换，被技能管理搞得头疼，非常推荐你试一试。

项目地址：[https://github.com/luochang212/skill-zoo](https://github.com/luochang212/skill-zoo)

# 快速检查清单

| 项目 | 状态 |
|------|------|
| 开源免费 | MIT 协议 |
| 支持三大桌面系统 | macOS/Windows/Linux |
| CLI + GUI 双支持 | 是 |
| 中文界面 | 原生支持国际化 |
| 自动更新 | 支持 |

---

*如果你觉得这个工具有用，欢迎去 GitHub 点个 Star 支持作者。*
