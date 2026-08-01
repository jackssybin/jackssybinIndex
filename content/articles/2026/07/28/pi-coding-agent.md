---
title: "Pi: 一个极简可扩展的终端编码 Agent 框架"
url: "/articles/2026/07/28/"pi-coding-agent".html"
date: "2026-07-28T00:00:00+08:00"
lastmod: "2026-07-28T00:00:00+08:00"
description: ""用了 Claude Code 半年后，我换成了这个完全开源的终端编码 Agent。它不强迫你接受它的工作流，核心保持极简，你想要什么功能自己加。""
tags: ["AI", "开源", "工具"]
topic: "AI、Agent 与本地模型"
topicSlug: "ai-agent"
layout: article
contentType: article
---


# Pi: 一个极简可扩展的终端编码 Agent 框架

用了 Claude Code 半年后，我换成了这个完全开源的终端编码 Agent。它不强迫你接受它的工作流，核心保持极简，你想要什么功能自己加——这可能是开源世界对闭源编码工具最有力的回应。

## 什么是 Pi？

Pi 是由 badlogicgames（Mario Zechner，libGDX 作者）发起的一个开源项目，它是一个**可扩展的终端编码 Agent 框架**。核心设计哲学非常直接：

> Pi 不告诉你该怎么工作。你适配 Pi，Pi 也适配你。

对比市面上那些大而全的闭源编码 Agent：
- Claude Code：功能全但闭源，你不能改核心逻辑，定价按 token 算长期用不便宜
- Cursor：编辑器绑定，想要完全控制权就得接受它的编辑器
- 其他开源项目：要么功能残缺，要么架构笨重难以扩展

Pi 的思路不一样：
- **核心极简**：只提供基础的工具调用（read/write/bash）、会话管理、多 LLM 提供商支持
- **完全可扩展**：通过扩展、技能、提示词模板、Pi 包来满足不同工作流
- **不绑定编辑器**：就是个终端程序，你用什么编辑器都能搭着用
- **支持几乎所有 LLM**：OpenAI、Anthropic、Google、DeepSeek、Groq、xAI、OpenRouter...30+ 提供商一键切换，连本地 llama.cpp 都支持

## 5 分钟快速上手

安装非常简单，一条命令搞定：

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

如果你不想用 npm，也可以用官方安装脚本：

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

认证方式两种：环境变量或者交互式登录。我习惯用环境变量：

```bash
export ANTHROPIC_API_KEY=sk-ant-...
pi
```

或者直接运行 `pi` 然后 `/login` 交互式选择提供商，支持 Anthropic/OpenAI/GitHub Copilot 等订阅账号登录。

启动后你会看到这样的界面：

![Pi 交互式模式](/images/pi-coding-agent/interactive-mode.png)

默认就给了四个工具：
- `read`：读取文件
- `write`：写入文件
- `edit`：编辑文件片段
- `bash`：运行 shell 命令

你直接和它聊就好了，比如"帮我看看这个项目的结构，给README提几个改进建议"，它会自己调用工具完成任务。

## 核心功能亮点

### 1. 会话树：随时分支，不用重来

这是我觉得 Pi 最惊艳的设计之一。所有会话存在一个 JSONL 文件里，本身就是一棵树：

![Pi 会话树视图](/images/pi-coding-agent/tree-view.png)

你可以：
- 随时用 `/fork` 从历史某一点分支开新会话
- 用 `/tree` 可视化浏览整个会话树，任意点跳转继续
- 自动保存，支持压缩，上下文满了自动总结不丢历史

换句话说，你不用因为试错走错方向就重头再来。在当前分支试错，试完回到分叉点换个思路继续就行，这才是正确的工作流。

### 2. 极致可扩展性：从极简到全功能

Pi 核心很小，但你可以把它堆成你想要的样子：

**提示词模板**：把常用提示存成 Markdown，敲个名字就展开。比如代码评审模板：

```markdown
<!-- ~/.pi/agent/prompts/review.md -->
Review this code for bugs, security issues, and performance problems.
Focus on: {{focus}}
```

用的时候直接打 `/review` 就展开了。

**技能**：遵循 Agent Skills 标准，放对目录就能用，想加什么能力就加什么。比如果项目有 AGENTS.md 规则，Pi 会自动加载。Hermes Agent 本身就支持把工作流存成技能，直接能用。

**扩展**：TypeScript 模块，你可以加自定义工具、命令、快捷键，甚至能把 Doom 跑进去：

![Doom 扩展](/images/pi-coding-agent/doom-extension.png)

是的，你没看错，等 LLM 思考的时候能在 Pi 里玩 Doom。这就是可扩展性的威力——作者做了个示例，告诉你什么都能加。

**Pi 包**：把扩展、技能、提示词、主题打包成 npm 或 git 包，别人一条命令就能装：

```bash
pi install npm:@foo/pi-tools
pi install git:github.com/user/repo
```

### 3. 所有 LLM 通吃，随时切换

Pi 维护了统一的多提供商 API，支持 30+ LLM 提供商，包括：

- 订阅制：Anthropic Claude Pro/Max、OpenAI ChatGPT Plus、GitHub Copilot
- API Key：Anthropic、OpenAI、Azure OpenAI、DeepSeek、Groq、Google Gemini、Mistral、xAI、OpenRouter...
- 本地：llama.cpp，自己下载模型跑本地私域

想切换模型？按 `Ctrl+L` 弹出选择器，点一下就切了，不用重启。

### 4. 安全设计：信任你自己控制

Pi 默认不带权限系统，它用你的用户权限跑，这点好坏看你怎么用。但它给了你隔离方案：

- Gondolin：API Key 放主机，工具调用跑在微 VM 里隔离
- Plain Docker：整个 Pi 跑在容器里
- OpenShell：策略控制的沙箱

怕危险？自己容器化跑就好了，Pi 不拦着你。

## 设计哲学：为什么说"不 MCP"？

作者写了篇博客[What if you don't need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)，观点很有意思：

MCP 把简单问题复杂化了。如果一个工具需要给 LLM 用，直接写个 CLI 带 README 说明怎么用就行了，LLM 自己会看会用。搞一层复杂的协议标准，最后还是要有人实现所有工具，收益在哪？

Pi 坚持：**简单就是最好的**。

- 不需要复杂的协议层
- 不需要标准化所有工具
- 你要什么，写个脚本就行，LLM 看得懂 README

这个观点我挺认同——很多时候，我们不是缺标准，是把简单问题搞复杂了。

## 谁该用 Pi？

### ✅ 适合用 Pi 的人：
- 你讨厌闭源工具强迫你按它的方式工作
- 你喜欢折腾，想要定制自己的编码 Agent 工作流
- 你需要同时切换多个 LLM 提供商
- 你相信开源，想要完全控制权
- 你是 Terminal 用户，不想被绑定到特定编辑器

### ❌ 可能不适合：
- 你想要开箱即用的全功能体验，不想自己折腾
- 你完全依赖 GUI/编辑器集成，接受不了纯终端
- 你团队需要企业级权限管理，Pi 需要自己搭隔离

## 实用配置推荐

我用了一段时间，总结几个顺手的配置：

### 1. 开启自动压缩
默认已经开了，上下文快满的时候自动压缩，不用手动管。可以在 `/settings` 里调阈值。

### 2. 项目信任
第一次在新项目跑 Pi 会问你信不信任这个目录。选信任它才会加载项目本地配置，安全考虑，没问题。常用的目录可以 `/trust` 存下来，下次不用再问。

### 3. AGENTS.md 项目规则
如果你项目有自己的开发规范，放个 `AGENTS.md` 在根目录，Pi 启动自动加载，LLM 每次都会遵守。Hermes 的工作流就是这么干的，非常好用。

### 4. 键盘快捷键
常用的几个记住，效率提升很多：

| 快捷键 | 作用 |
|--------|------|
| `Ctrl+C` | 清空编辑器 |
| `Ctrl+C` 两次 | 退出 |
| `Esc` | 取消当前操作 |
| `Esc` 两次 | 打开会话树 |
| `Ctrl+L` | 切换模型 |
| `Ctrl+O` | 折叠/展开工具输出 |
| `@` | 输入 @ 开始模糊搜索项目文件 |

## 总结

Pi 不是那种要颠覆一切的大杀器，它是一个**给喜欢控制的人准备的极简框架**。

闭源工具给你开箱即用，但你得接受它的一切。Pi 给你一个最小核心，你把它拼成你想要的样子。如果你厌倦了"大而全就是好"，想要一个能跟着你工作流变的编码 Agent，Pi 值得试试。

## 相关链接

- GitHub: https://github.com/earendil-works/pi
- 官网: https://pi.dev
- 文档: https://pi.dev/docs/latest
- Discord 社区: https://discord.com/invite/3cU7Bz4UPx
- 作者博客: https://mariozechner.at/

---

*如果你也在用 Pi，欢迎分享你的配置和扩展包。*