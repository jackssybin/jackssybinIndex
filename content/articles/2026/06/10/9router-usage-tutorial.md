---
title: "9Router 使用教程：从文本到音频、图片、视频的完整实践"
url: "/articles/2026/06/10/9router-usage-tutorial.html"
date: "2026-06-10T00:00:00+08:00"
lastmod: "2026-06-10T00:00:00+08:00"
description: "从本地启动、文本对话、编程工具接入到图片、语音、视频和路由策略，完整掌握 9Router 的多模型网关用法。"
tags: ["AI", "9Router", "AI 网关", "多模型路由", "教程"]
topic: "AI、Agent 与本地模型"
topicSlug: "ai-agent"
layout: article
contentType: article
---
# 9Router 使用教程：从文本到音频、图片、视频的完整实践

> 适合对象：刚安装 9Router 的新用户、想把 Codex / Claude Code / Cline / Cursor 等工具统一接入多个模型的开发者，以及需要同时使用文本、语音、图片、视频能力的创作者。

## 目录

1. [9Router 是什么](#9router-是什么)
2. [准备环境](#准备环境)
3. [第一次启动与界面认识](#第一次启动与界面认识)
4. [场景一：最简单的文本对话](#场景一最简单的文本对话)
5. [场景二：接入 Codex / Cline / Cursor 等编程工具](#场景二接入-codex--cline--cursor-等编程工具)
6. [场景三：用 Combo 做自动降级和多模型路由](#场景三用-combo-做自动降级和多模型路由)
7. [场景四：图片生成](#场景四图片生成)
8. [场景五：文本转语音 TTS](#场景五文本转语音-tts)
9. [场景六：语音转文字 STT](#场景六语音转文字-stt)
10. [场景七：视频生成](#场景七视频生成)
11. [场景八：网页搜索、网页抓取与 Embedding](#场景八网页搜索网页抓取与-embedding)
12. [场景九：用量统计、限额和排障](#场景九用量统计限额和排障)
13. [常见问题](#常见问题)

---

## 9Router 是什么

9Router 可以理解为一个本地 AI 网关。你把各种客户端都连到 9Router，9Router 再根据模型名、账户状态、限额、组合策略，把请求转发到不同的上游模型提供商。

核心价值：

- **统一入口**：大多数工具只需要配置 `http://localhost:20128/v1`。
- **兼容 OpenAI API**：支持 `/v1/chat/completions`、`/v1/audio/speech`、`/v1/audio/transcriptions`、`/v1/images/generations`、`/v1/video/generations` 等接口。
- **多提供商路由**：一个客户端可以使用 Kiro、OpenCode Free、Gemini、OpenRouter、GLM、MiniMax、Ollama、本地 SD WebUI、ComfyUI 等不同来源。
- **自动降级**：上游限流、余额不足或模型不可用时，可以切换到备用模型。
- **RTK Token 节省**：编程工具场景中，9Router 可压缩 tool result，减少 token 消耗。

![9Router 官方仪表盘截图](/images/9router-tutorial/01-dashboard-guide.svg)

---

## 准备环境

### 方式 A：全局安装

```bash
npm install -g 9router
9router
```

启动后访问：

```text
http://localhost:20128/dashboard
```

OpenAI 兼容 API 地址：

```text
http://localhost:20128/v1
```

### 方式 B：从本仓库源码运行

```bash
cp .env.example .env
npm install
PORT=20128 NEXT_PUBLIC_BASE_URL=http://localhost:20128 npm run dev
```

Windows PowerShell：

```powershell
$env:PORT='20128'
$env:NEXT_PUBLIC_BASE_URL='http://localhost:20128'
npm run dev
```

生产模式：

```bash
npm run build
PORT=20128 HOSTNAME=0.0.0.0 NEXT_PUBLIC_BASE_URL=http://localhost:20128 npm run start
```

### 你需要准备什么

| 用途 | 推荐先接入 | 说明 |
| --- | --- | --- |
| 编程文本 | Kiro、OpenCode Free、GLM、OpenRouter、Gemini | 先保证 `/v1/chat/completions` 可用 |
| 图片生成 | Gemini、Cloudflare、SD WebUI、ComfyUI、Fal、Stability、Recraft 等 | 具体可用模型以控制台 Media Providers 为准 |
| 文本转语音 | Gemini TTS、Edge TTS、Google TTS、ElevenLabs、AWS Polly、NVIDIA 等 | 需要在 TTS 媒体提供商里配置 |
| 语音转文字 | Gemini STT、Deepgram、AssemblyAI 等 | 使用 multipart 上传音频文件 |
| 视频生成 | Runway、Fal、部分支持 video 的提供商 | 使用 `/v1/video/generations` |

---

## 第一次启动与界面认识

打开：

```text
http://localhost:20128/dashboard
```

你会主要用到这些页面：

- **Dashboard**：总览当前状态。
- **Providers**：连接文本大模型提供商，例如 Kiro、OpenCode Free、Gemini、OpenRouter、GLM。
- **Media Providers**：连接图片、语音、视频、搜索、Embedding 等媒体能力。
- **CLI Tools**：查看 Codex、Claude Code、Cline、OpenClaw、Cursor 等工具的配置方式。
- **Combos**：创建组合模型，实现 fallback 或轮询。
- **Usage**：查看请求、token、费用和失败记录。
- **Endpoint**：复制本地端点、隧道端点或云端端点。

![首次打开控制台示意图](/images/9router-tutorial/01-dashboard-guide.svg)

首次建议按这个顺序配置：

1. 进入 **Providers**，先添加一个文本模型提供商。
2. 进入 **Basic Chat**，选择模型发一句测试消息。
3. 进入 **Endpoint** 或 **CLI Tools**，复制 API Base URL 和 API Key。
4. 进入 **Media Providers**，按需添加 TTS、STT、Image、Video。
5. 进入 **Usage**，确认请求是否被正确记录。

---

## 场景一：最简单的文本对话

### 目标

用 9Router 的 OpenAI 兼容接口完成一次文本问答。

### 第 1 步：连接一个文本提供商

在控制台进入：

```text
Dashboard → Providers → Add / Connect Provider
```

新手推荐顺序：

1. **Kiro AI**：适合编程模型场景。
2. **OpenCode Free**：简单测试可用性。
3. **Gemini**：用 API Key 接入，覆盖文本、语音、图片等多种能力。
4. **OpenRouter**：模型丰富，适合统一入口。
5. **GLM / MiniMax**：成本低，适合作为备用模型。

连接后点击测试，确保状态为可用。

### 第 2 步：获取 API Key

进入控制台的 API Key / Endpoint 相关页面，复制 9Router 的本地 API Key。如果你在设置里关闭了 `Require API Key`，本地测试可以不传；生产或局域网使用时建议开启。

### 第 3 步：发送文本请求

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [
      {"role": "system", "content": "你是一个简洁的编程助手。"},
      {"role": "user", "content": "用 JavaScript 写一个防抖函数，并解释用途。"}
    ]
  }'
```

Windows PowerShell：

```powershell
$body = @{
  model = "auto"
  messages = @(
    @{ role = "system"; content = "你是一个简洁的编程助手。" },
    @{ role = "user"; content = "用 JavaScript 写一个防抖函数，并解释用途。" }
  )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod "http://localhost:20128/v1/chat/completions" `
  -Method Post `
  -Headers @{ Authorization = "Bearer YOUR_9ROUTER_KEY" } `
  -ContentType "application/json" `
  -Body $body
```

### 模型名怎么填

9Router 支持几类模型名：

| 写法 | 示例 | 适合场景 |
| --- | --- | --- |
| 自动选择 | `auto`、`best`、`fast`、`cheap` | 快速测试，让 9Router 根据已连接模型选择 |
| 指定提供商/模型 | `gemini/gemini-2.5-flash`、`openrouter/deepseek/deepseek-chat-v3.1:free` | 需要明确使用某个模型 |
| 短别名/前缀 | `kr/claude-sonnet-4.5` | 依赖提供商 alias，适合常用模型 |
| Combo 名称 | `coding`、`writing` | 自动降级、多模型轮询 |

> 注意：具体模型名以你控制台里实际显示的模型为准。不同上游会更新模型列表。

![文本调用链路示意图](/images/9router-tutorial/02-text-flow.svg)

---

## 场景二：接入 Codex / Cline / Cursor 等编程工具

### 通用配置

大多数支持 OpenAI Compatible Endpoint 的工具，都可以这样填：

```text
Base URL / Endpoint: http://localhost:20128/v1
API Key: YOUR_9ROUTER_KEY
Model: auto 或你的模型名/Combo 名
```

如果工具要求完整 chat completions URL，填写：

```text
http://localhost:20128/v1/chat/completions
```

### Codex 示例

在 Codex 或支持 OpenAI 兼容配置的客户端里：

```text
Provider: OpenAI Compatible
Base URL: http://localhost:20128/v1
API Key: YOUR_9ROUTER_KEY
Model: coding
```

建议创建一个 `coding` Combo：

```text
coding = kr/claude-sonnet-4.5 → glm/glm-4.6 → openrouter/deepseek/deepseek-chat-v3.1:free
```

这样 Codex 只需要固定使用 `coding`，上游失败或限流时由 9Router 处理。

### Cline / Roo Code 示例

```text
API Provider: OpenAI Compatible
Base URL: http://localhost:20128/v1
API Key: YOUR_9ROUTER_KEY
Model ID: coding
```

### Cursor 注意事项

Cursor 某些功能会经过 Cursor 自己的云端服务，可能无法直接访问你电脑上的 `localhost`。遇到这种情况：

1. 在 9Router 中开启 Tunnel / Cloud Endpoint / Tailscale。
2. 将 Cursor 里的 Base URL 改成公开可访问的端点。
3. 保持 API Key 开启，避免公网裸奔。

---

## 场景三：用 Combo 做自动降级和多模型路由

### 目标

让一个模型名背后绑定多个真实模型，提升稳定性并控制成本。

### 创建 Combo

进入：

```text
Dashboard → Combos → New Combo
```

示例一：编程优先质量，失败后降级：

```text
Name: coding
Strategy: fallback
Models:
  1. kr/claude-sonnet-4.5
  2. glm/glm-4.6
  3. openrouter/deepseek/deepseek-chat-v3.1:free
```

示例二：日常问答优先便宜：

```text
Name: daily
Strategy: fallback
Models:
  1. cheap
  2. gemini/gemini-2.5-flash
  3. openrouter/meta-llama/llama-3.3-70b-instruct:free
```

示例三：多个账号轮询：

```text
Name: batch-writing
Strategy: round-robin
Models:
  1. gemini/gemini-2.5-flash
  2. glm/glm-4.6
  3. minimax/minimax-text-01
```

调用时只写 Combo 名：

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"coding","messages":[{"role":"user","content":"帮我重构这个函数。"}]}'
```

![高级路由示意图](/images/9router-tutorial/04-advanced-routing.svg)

---

## 场景四：图片生成

### 目标

用统一的 `/v1/images/generations` 接口生成图片。

### 第 1 步：添加图片提供商

进入：

```text
Dashboard → Media Providers → Text to Image
```

根据你已有资源选择：

- **Gemini / Nano Banana**：适合快速使用 Google 图像能力。
- **Cloudflare AI**：适合 Workers AI 场景。
- **Fal / Stability AI / Recraft / Black Forest Labs**：适合商业图片模型。
- **SD WebUI / ComfyUI**：适合本地绘图，不一定需要云端 API Key。

### 第 2 步：查看可用模型

可以通过控制台查看，也可以请求模型接口：

```bash
curl http://localhost:20128/v1/models/image \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY"
```

### 第 3 步：生成图片

```bash
curl http://localhost:20128/v1/images/generations \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto:image",
    "prompt": "一张科技感的 9Router 教程封面，橙色和深蓝色配色，包含 AI 路由、模型节点、数据流动的视觉元素",
    "size": "1024x1024"
  }'
```

如果你要指定模型，使用控制台显示的模型名，例如：

```json
{
  "model": "gemini/imagen-3.0-generate-002",
  "prompt": "一只坐在服务器机柜旁的橙色机器人猫，赛博朋克风格"
}
```

> 提醒：不同图片提供商支持的参数不同。`prompt` 和 `model` 是必填基础字段，`size`、`n`、`response_format` 等字段是否生效取决于上游。

---

## 场景五：文本转语音 TTS

### 目标

输入一段文字，输出语音文件。

### 第 1 步：添加 TTS 提供商

进入：

```text
Dashboard → Media Providers → Text To Speech
```

常见选择：

- **Gemini TTS**：`gemini/gemini-2.5-flash-preview-tts` 等。
- **Edge TTS**：适合免费/本地测试。
- **Google TTS / AWS Polly / ElevenLabs / Cartesia / PlayHT**：适合稳定配音。
- **NVIDIA TTS**：例如 `nvidia/fastpitch`、`nvidia/tacotron2`。

### 第 2 步：生成 MP3

```bash
curl "http://localhost:20128/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -o output.mp3 \
  -d '{
    "model": "auto:tts",
    "input": "欢迎使用 9Router。它可以把文本、语音、图片和视频模型统一到一个接口里。",
    "voice": "default",
    "language": "zh-CN"
  }'
```

### 第 3 步：调试 JSON 返回

部分调试场景下，可以请求 JSON 格式：

```bash
curl "http://localhost:20128/v1/audio/speech?response_format=json" \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto:tts",
    "input": "这是一段 TTS 测试。",
    "language": "zh-CN"
  }'
```

> `voice` 字段是否可用取决于上游。某些提供商使用固定 voice，某些提供商要求指定 voice ID。

---

## 场景六：语音转文字 STT

### 目标

上传音频文件，转成文字。

### 第 1 步：添加 STT 提供商

进入：

```text
Dashboard → Media Providers → Speech To Text
```

常见选择：

- **Gemini STT**：如 `gemini/gemini-2.5-flash`。
- **Deepgram**：适合语音识别服务。
- **AssemblyAI**：适合会议、播客转写。

### 第 2 步：上传音频

```bash
curl http://localhost:20128/v1/audio/transcriptions \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -F "model=auto:stt" \
  -F "file=@meeting.mp3" \
  -F "language=zh"
```

返回通常包含识别文本，格式取决于上游和 9Router 的兼容层。

### 实用案例：会议纪要自动化

1. 用 STT 把 `meeting.mp3` 转成文字。
2. 把转写文本发给 `/v1/chat/completions`。
3. 让模型输出会议摘要、行动项、负责人和截止时间。

示例提示词：

```text
请把下面的会议转写整理成 Markdown：
1. 三句话总结
2. 决策事项
3. TODO 表格：事项 / 负责人 / 截止时间 / 风险
4. 需要追问的问题
```

---

## 场景七：视频生成

### 目标

用统一的 `/v1/video/generations` 生成视频任务或视频结果。

### 第 1 步：添加视频提供商

进入：

```text
Dashboard → Media Providers → Video
```

常见视频上游包括 Runway、Fal 或其他在控制台显示支持 `Video` 的提供商。

### 第 2 步：发送视频生成请求

```bash
curl http://localhost:20128/v1/video/generations \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto:video",
    "prompt": "一个 6 秒的产品演示视频：橙色光线从多个 AI 模型节点汇聚到 9Router 标志，再流向开发者的终端窗口。镜头平滑推进，科技感，深色背景。",
    "duration": 6,
    "size": "1280x720"
  }'
```

### 视频提示词模板

```text
主体：9Router AI 路由器
场景：深色数据中心，橙色数据流穿过多个模型节点
动作：数据流汇聚到中央网关，然后分发到文本、语音、图片、视频四个图标
风格：科技感、干净、产品宣传片
镜头：缓慢推进，最后定格在 9Router 控制台
时长：6 秒
比例：16:9
```

### 注意事项

- 视频模型通常是异步任务，上游可能返回任务 ID 或 URL。
- `duration`、`size`、`fps`、`image` 等参数是否支持取决于具体提供商。
- 如果返回任务 ID，需要按上游能力继续查询；9Router 的统一程度取决于该提供商适配器。

![媒体接口示意图](/images/9router-tutorial/03-media-flow.svg)

---

## 场景八：网页搜索、网页抓取与 Embedding

### 网页搜索

如果你配置了 Gemini Web Search、Tavily、Brave Search、Serper、Exa 等搜索提供商，可以调用：

```bash
curl http://localhost:20128/v1/search \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto:search",
    "query": "9Router OpenAI compatible endpoint usage",
    "max_results": 5
  }'
```

适合场景：

- 让写作助手查资料。
- 给代码助手补充最新文档。
- 搭建 RAG 前的信息收集。

### 网页抓取

如果配置了 Jina Reader、Firecrawl 或类似 Web Fetch 提供商，可以调用：

```bash
curl http://localhost:20128/v1/web/fetch \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto:fetch",
    "url": "https://example.com",
    "format": "markdown"
  }'
```

### Embedding

```bash
curl http://localhost:20128/v1/embeddings \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto:embedding",
    "input": ["9Router 是一个 AI 路由器", "它支持文本、语音、图片和视频接口"]
  }'
```

适合场景：

- 本地知识库向量化。
- 文档检索。
- 相似问题匹配。

---

## 场景九：用量统计、限额和排障

### 查看用量

进入：

```text
Dashboard → Usage
```

重点看：

- 请求总量。
- 成功率 / 失败率。
- token 消耗。
- 当前使用的 provider / model。
- 失败状态码和错误信息。

### 常见错误处理

| 现象 | 可能原因 | 处理方式 |
| --- | --- | --- |
| `401 Missing API key` | 开启了 Require API Key 但请求没带 Key | 加 `Authorization: Bearer ...` |
| `401 Invalid API key` | Key 填错或复制了上游 Key | 使用 9Router 控制台生成/显示的 Key |
| `No credentials for provider` | 该提供商没有配置账号/API Key | 到 Providers 或 Media Providers 添加连接 |
| `Invalid model format` | 模型名无法解析 | 使用 `provider/model`、`auto`、`auto:image` 或 Combo 名 |
| 上游 429 | 限流 | 给 Combo 添加备用模型，或增加账号轮询 |
| Cursor 不能连 localhost | Cursor 云端无法访问本机 | 开启 Tunnel / Tailscale / Cloud Endpoint |
| 图片/视频参数不生效 | 上游不支持该参数 | 查看对应提供商说明，减少为 `model` + `prompt` 测试 |

### 推荐的排障顺序

1. 在 **Basic Chat** 里测试模型是否可用。
2. 用 `curl /v1/models` 或控制台确认模型名。
3. 在 **Usage** 里查看请求是否到达 9Router。
4. 查看 **Console Log**，定位是 9Router 鉴权错误还是上游错误。
5. 如果是上游限流，给 Combo 增加备用模型。

---

## 综合案例：自动生成一条产品介绍短视频素材

目标：把一句产品介绍扩展成脚本、配音、封面图和视频提示词。

### 第 1 步：生成脚本

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "writing",
    "messages": [
      {"role":"user","content":"请为 9Router 写一段 30 秒中文产品介绍短视频脚本，包含旁白和画面描述。"}
    ]
  }'
```

### 第 2 步：生成配音

```bash
curl http://localhost:20128/v1/audio/speech \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -o voice.mp3 \
  -d '{
    "model":"auto:tts",
    "input":"9Router 是你的本地 AI 路由器，把 Codex、Cline、Cursor 和各种多模态模型接到同一个入口。",
    "language":"zh-CN"
  }'
```

### 第 3 步：生成封面图

```bash
curl http://localhost:20128/v1/images/generations \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model":"auto:image",
    "prompt":"一张 9Router 产品短视频封面，中央是 AI 路由节点，周围有文本、语音、图片、视频四个图标，橙色科技风，中文标题：一个入口连接所有 AI 模型",
    "size":"1280x720"
  }'
```

### 第 4 步：生成视频

```bash
curl http://localhost:20128/v1/video/generations \
  -H "Authorization: Bearer YOUR_9ROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model":"auto:video",
    "prompt":"9Router 产品宣传片，深色背景，橙色数据流连接 Codex、Cline、Cursor、Gemini、OpenRouter 等节点，最后汇聚到一个本地控制台。镜头平滑，科技感，6 秒。",
    "duration":6,
    "size":"1280x720"
  }'
```

这个流程可以扩展成：脚本生成 → TTS 配音 → 图片生成封面 → 视频生成 → 字幕转写 → 发布素材。

---

## 常见问题

### 1. `auto` 和 `auto:image` 有什么区别？

- `auto` 默认用于文本/LLM。
- `auto:image` 用于图片。
- `auto:tts` 用于文本转语音。
- `auto:stt` 用于语音转文字。
- `auto:video` 用于视频。
- `best`、`fast`、`cheap` 也支持类似写法，例如 `cheap:tts`、`best:image`。

### 2. 我应该优先用指定模型还是 auto？

- 新手测试：用 `auto`。
- 生产稳定：用 Combo 名，例如 `coding`、`writing`。
- 精准控制成本：指定 `provider/model`。

### 3. 为什么我的媒体接口没有可用模型？

你需要在 **Media Providers** 里添加对应类型的提供商。文本 Providers 和 Media Providers 的能力分类不同：一个提供商可能支持 LLM，但不一定支持 TTS 或 Video。

### 4. 9Router 的 API Key 是上游 API Key 吗？

不是。客户端里填 9Router 的 API Key；上游 API Key 保存在 9Router 的 Providers / Media Providers 连接里。

### 5. 局域网或公网使用安全吗？

建议：

- 开启 Require API Key。
- 不要把控制台暴露到公网。
- 必须公网访问时，使用 Tunnel / Cloud Endpoint，并设置强 Key。
- 避免把 `.env`、数据库文件和上游 Key 提交到 Git。

---

## 推荐学习路径

1. 先跑通 `auto` 文本对话。
2. 配置一个 `coding` Combo，接入 Codex / Cline。
3. 配置 `auto:tts`，生成第一段配音。
4. 配置 `auto:image`，生成第一张封面图。
5. 配置 `auto:video`，生成第一段短视频。
6. 最后打开 Usage，观察哪些模型最稳定、最便宜，再优化 Combo。


