---
title: "如何让 Claude Code / Cursor 用克隆的声音说话？OmniVoice Studio 的 MCP 方案实测"
date: 2026-07-11T14:30:00+08:00
lastmod: 2026-07-11T14:30:00+08:00
description: "3 秒克隆你的声音，然后通过一段 MCP 配置让 Claude Code / Cursor 用它开口说话。全本地、零 API key、成本 0 元。这篇讲清楚接线全流程和踩坑。"
keywords:
  - OmniVoice Studio
  - Claude Code MCP
  - AI Agent 语音
  - 声音克隆 MCP
  - Cursor MCP TTS
  - 本地 TTS
  - AI Agent 播报
  - MCP server
tags:
  - AI Agent
  - MCP
  - 声音克隆
  - Claude Code
  - Cursor
categories:
  - AI 项目拆解
cover:
  image: /images/omnivoice-studio-give-your-ai-agent-a-voice/cover-zhihu.png
  alt: 给 AI Agent 装嗓子 — OmniVoice Studio MCP 方案
draft: false
---

# 如何让 Claude Code / Cursor 用克隆的声音说话？OmniVoice Studio 的 MCP 方案实测

**TL;DR**：适合正在用 Claude Code、Cursor、Codex 跑长任务、经常需要"任务跑完但我在干别的"的人。核心方案是本地跑一份 [OmniVoice Studio](https://github.com/debpalash/OmniVoice-Studio)（8.2k star / AGPL-3.0），用它挂在 `localhost:3900/mcp` 的 MCP server，让每个 Agent 绑定一个克隆声音，成本 0 元、无 API key、音频不出机器。核心限制是需要一张有点显存的显卡（或 Apple Silicon）——纯 CPU 也能跑但延迟不好。

上周三我让 Claude Code 跑了一个 40 分钟的重构，结束后终端"叮"了一下，我没注意。半小时后回来一看，第二个失败任务已经卡了 20 分钟。当天我做了一个决定：**给它装一副嗓子——用我自己克隆的声音——事情做完了它得开口告诉我**。

这篇讲清楚三件事：为什么 ElevenLabs / 系统 TTS 都不好用；OmniVoice Studio 的 MCP 方案怎么接；我踩过的两个坑和判断适不适合你。

## 一、为什么"给 Agent 一副嗓子"这件事以前没成？

三条常见路径，我都跑过：

- **系统 TTS（macOS say / Windows SAPI）**：免费、离线、能用。缺点是听起来像 2005 年的地铁报站，长句子还会把标点符号读出来。同事路过听见会以为你在调试无障碍功能。
- **ElevenLabs API**：音质确实是天花板。缺点是每一条播报都在按 character 计费，一整天长任务下来一顿早饭钱没了；而且你得把"任务完成了"这种明显含调用上下文的文本发到别人服务器。
- **OpenAI TTS**：便宜一点，但只有 6 个预设音色。你没法让 Cursor 用一个声音、Claude Code 用另一个声音——多 Agent 场景下根本分不清是谁在说话。

真正想要的是：**本地跑 + 音质够用 + 每个 Agent 有自己的声音 + 一次配置永久生效**。

三个月前这件事还得自己接。现在有个更省事的方案，就是 OmniVoice Studio 内建的 MCP server。

## 二、OmniVoice Studio 的 MCP server 是什么

先明确一件事：这个项目本身是一个**桌面语音工作站**——支持克隆、配音、听写、造音色，我之前写过一篇[通用拆解](https://jackssybin.cn/articles/2026/07/10/omnivoice-studio-local-elevenlabs-alternative/)，感兴趣的翻回去看。

但它里面最容易被忽略的一件事，是**后端启动之后自动挂了一个 MCP 服务器**在 `http://localhost:3900/mcp`。你只要打开 App，这个端点就活着。

![OmniVoice Studio Launchpad](https://raw.githubusercontent.com/debpalash/OmniVoice-Studio/main/docs/screenshot-launchpad.png)

MCP server 提供的工具很小一组，恰好对准 Agent 场景：

| 工具 | 干什么 |
|---|---|
| `generate_speech` | 文本 → WAV（base64）。用当前 Agent 绑定的声音，除非显式传 `profile_id`。 |
| `transcribe` | base64 音频 → 文本，646 语言。 |
| `list_voices` / `list_personalities` / `list_languages` | 列出可用资源。 |
| `check_health` | 检查后端状态和当前 GPU 设备。 |

关键设计点是 **per-agent voice binding**。每个 Agent 在调用时带一个 `X-OmniVoice-Client-Id` 请求头（比如 `claude-code`），OmniVoice 就能根据你事先绑定好的关系挑出对应的声音配置。这样多个 Agent 共存时，你一听就知道是谁在说话——不用看屏幕。

## 三、5 分钟完整接线：让 Claude Code 用你的声音说话

假设 OmniVoice Studio 已经装好并且能跑通任何一个 TTS 引擎（我用的是 IndexTTS，Apple Silicon 上跑 MPS）。下面是把它接进 Claude Code 的完整步骤。

### 第 1 步：录一段 3 秒的自己

打开 Studio 页，切到 Voice Clone 面板，上传或直接录制一段 3–10 秒的清晰人声。别念数字或字母表——念一句你平时会说的话，效果更自然。系统会给你一个 `profile_id`，先记下来。

![Voice Cloning — Studio](https://raw.githubusercontent.com/debpalash/OmniVoice-Studio/main/docs/screenshot-studio.png)

**建议**：录音时手机 / 电脑内置麦已经够用，但避开风扇声和键盘声——3 秒的 zero-shot 克隆对底噪比较敏感。

### 第 2 步：把这个声音绑定给 `claude-code` 这个 client id

在终端跑一条 curl，用第 1 步记下来的 `profile_id` 替换 `<voice-profile-id>`：

```bash
curl -X PUT localhost:3900/api/mcp/bindings \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "claude-code",
    "label": "Claude Code",
    "profile_id": "<voice-profile-id>"
  }'
```

顺手也可以给 Cursor 绑另一个声音（用 Voice Gallery 里的一个预设就行）：

```bash
curl -X PUT localhost:3900/api/mcp/bindings \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "cursor",
    "label": "Cursor",
    "profile_id": "scarlett-narrator"
  }'
```

这样以后 Claude Code 说话是"我"的声音，Cursor 说话是另一个声音——你不用看屏幕就能分辨。

### 第 3 步：在 Claude Code 里注册这个 MCP server

Claude Code 支持两种 MCP 传输方式：Streamable HTTP 和 stdio。**推荐 HTTP**——OmniVoice 直接原生支持，不需要额外进程。

在 `~/.config/claude-code/mcp.json`（或你的 Claude Code MCP 配置文件）加一段：

```json
{
  "mcpServers": {
    "omnivoice": {
      "transport": "http",
      "url": "http://localhost:3900/mcp",
      "headers": {
        "X-OmniVoice-Client-Id": "claude-code"
      }
    }
  }
}
```

如果你的客户端只支持 stdio（一些老版本 Cursor / Codex），用仓库自带的 shim（`docs/mcp.json` 里有模板）：

```json
{
  "mcpServers": {
    "omnivoice": {
      "command": "python",
      "args": ["-m", "backend.mcp_shim"],
      "cwd": "/path/to/OmniVoice-Studio",
      "env": {
        "OMNIVOICE_PORT": "3900",
        "OMNIVOICE_CLIENT_ID": "claude-code"
      }
    }
  }
}
```

`mcp_shim` 会把 stdio 转发到 HTTP 端口，同时把 client id 打进请求头——per-agent 绑定的行为一致。

### 第 4 步：验证连通

重启 Claude Code，让它跑：

```
调用 omnivoice 的 check_health 工具，然后调用 generate_speech 让它说：
"重构完成，用时 42 分钟，7 个文件受影响，全绿"
```

如果你听到自己声音说这句话——完事了。

## 四、这套配置在真实场景里怎么用

配完之后我大概摸了半个月，几个用得上的场景：

- **长任务播报**：任何 `Task tool` 或 sub-agent 跑完就让它简短说一句结果。写进你的 CLAUDE.md：

  ```
  在完成一个 >5 分钟的任务后，用 omnivoice.generate_speech
  播报 15 字以内的结论（成功/失败 + 关键数字）。
  ```

- **双 Agent 语音区分**：Cursor 做实现、Claude Code 做 code review 时，两边不同声音会让你在切窗口前就知道谁有话说。

- **语音输入接管**：OmniVoice 本身有 dictation widget（⌘+⇧+Space 从任意 App 弹出转录），配合 `transcribe` 工具可以让 Agent 反过来听你说——不过这个我用得少，长指令我还是打字。

- **可搜索的音频日志**：让 Agent 完成任务后 `generate_speech` 保存成本地 MP3，堆一堆之后按时间线回听，比翻 log 直观得多。

关键在于 MCP 让这些不需要写胶水代码——**Agent 会自己判断什么时候该说话**，只要在 prompt 里给它权限。

## 五、我踩过的两个坑

### 坑一：Claude Code 不知道要说什么

刚接完的时候我期待它主动开口，但它一直沉默。原因是 Agent 不知道你希望它什么时候用 TTS——你必须在 system prompt / CLAUDE.md 里明确说清楚"什么情况下调用 omnivoice"。

我最后写的规则是：

```
Voice output policy (omnivoice MCP):
- 任务运行 >3 分钟：完成时用 generate_speech 说一句 15 字内结论
- 遇到需要用户决策的岔路：说一句 "需要你确认" + 一句问题概要  
- 一次任务中 generate_speech 调用不超过 3 次，避免噪音
- 内容用中文
```

有了这段之后行为就稳定了。

### 坑二：`X-OmniVoice-Client-Id` 忘设的话会 fallback 到全局默认音色

如果你没在 headers 里传 client id，OmniVoice 会走"agent 未绑定 → 全局默认 → 项目默认"的降级。这时候 Claude Code 和 Cursor 会说同一个声音——per-agent 隔离就丢了。用 stdio shim 的话是通过 `OMNIVOICE_CLIENT_ID` 环境变量传，别忘了。

排查办法：在 App 里打开 Settings → MCP Bindings，看列表里对应的 client id 是不是绿色 active。

## 六、判断：谁该装 / 谁不用装

**建议装的**：
- 每天挂着 Claude Code / Cursor / Codex 跑长任务的开发者
- 已经装了 OmniVoice Studio 但只当它做视频配音的（MCP 是白送的）
- 想搞多 Agent workflow、需要"声音区分"的
- 有一张 8G+ 显存的显卡或者 Apple Silicon Mac

**建议再等等的**：
- 只有一台纯 CPU 老机器（TTS 延迟会 >5 秒，播报体验很糟）
- 用的 Agent 客户端连 MCP 都还没支持（那你先把 MCP 装了再说）
- 主要做企业合规产品，AGPL-3.0 可能不适合直接嵌

## 七、如果你决定试，我建议的下一步

按这个顺序做，坑最少：

1. 先把 OmniVoice Studio 装上，跑通一个基础 TTS 生成（哪个引擎都行，IndexTTS 最省事）——这一步不通别急着接 MCP
2. 录一段自己 3–10 秒的清晰语音，克隆出一个 profile
3. 用 curl 把 profile 绑给 `claude-code` 这个 client id
4. 在 Claude Code MCP 配置里加上 `http://localhost:3900/mcp`（记得带 header）
5. 在 CLAUDE.md 里加一段"什么时候用 generate_speech"的规则
6. 让它跑一个真实任务，验证声音正确

配置好之后基本一次到位，剩下的时间就是调 prompt——让 Agent 知道什么时候该开口、说多少。

---

**项目信息**：
- GitHub: [debpalash/OmniVoice-Studio](https://github.com/debpalash/OmniVoice-Studio)（8.2k star / 1.3k fork / AGPL-3.0）
- MCP 文档: [`docs/mcp.md`](https://github.com/debpalash/OmniVoice-Studio/blob/main/docs/mcp.md)
- Discord: [discord.gg/bzQavDfVV9](https://discord.gg/bzQavDfVV9)
- 相关：[《OmniVoice Studio：把 ElevenLabs 焊回你自己的机器》](https://jackssybin.cn/articles/2026/07/10/omnivoice-studio-local-elevenlabs-alternative/)——上一篇通用拆解，这篇专攻 MCP。
