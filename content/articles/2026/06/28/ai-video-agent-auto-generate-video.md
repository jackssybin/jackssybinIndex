---
title: "AI 视频制作智能体：输入一句话，自动生成完整视频"
url: "/articles/2026/06/28/ai-video-agent-auto-generate-video/"
date: "2026-06-28T15:00:00+08:00"
lastmod: "2026-06-28T15:00:00+08:00"
description: "一个开源的 AI 视频创作工作台，输入一句话需求，自动完成大纲生成、分镜、配音、字幕，最后导出 MP4。支持图片轮播和 HTML 动画两种模式，三种内置风格。"
tags: ["AI 视频", "Next.js", "开源项目", "AI Agent"]
topic: "AI 工具"
topicSlug: "ai-tools"
layout: article
contentType: article
---

![封面](/images/ai-video-agent-auto-generate-video/homepage.png)

做视频太麻烦了，是不是？

写脚本、画分镜、找图片、配音、剪字幕，一套流程下来大半天过去了。如果你只是想快速做一个知识分享或者技术演示视频，其实没必要这么麻烦。

最近 GitHub 上看到一个国人开源的项目 **ai-video-agent**，它做的事情很简单：**你输入一句话主题，AI 帮你做完剩下的所有事情** —— 大纲生成、分镜生成、旁白配音、字幕同步，最后直接导出 MP4。

项目支持两种创作模式：
- **图片模式**：文生图分镜，适合知识讲解、口播轮播
- **HTML 模式**：AI 生成 HTML/CSS/JS 动画分镜，适合科技演示、动态可视化

![创作页预览](/images/ai-video-agent-auto-generate-video/creation.png)

## 它解决了什么痛点？

做短视频的流程，相信很多人都熟：

1. 想主题 → 写脚本 → 改三五遍
2. 找图片素材 → 或者自己画分镜
3. 找配音工具 → 导出音频 → 对齐时间轴
4. 剪视频 → 加字幕 → 导出

大半天过去了，视频还没出来。如果你是做知识分享、技术演示，其实不需要这么复杂 —— 你需要的只是一个**快速出草稿**的工具。

ai-video-agent 就是干这个的：**对话式创作，AI 自动流水线，你只需要改改不满意的地方，不用从头搭框架**。

它能帮你做这些：

- 自动判断你是要生成大纲还是改某个分镜
- 自动生成视频大纲，包含标题、旁白、分镜提示
- 图片模式自动生成分镜图 + 旁白音频 + 字幕
- HTML 模式自动生成可播放的网页动画分镜
- 支持单个分镜重生成，不用推倒重来
- 长任务中断也不怕，已完成内容自动保留
- 浏览器直接预览，支持 MP4 导出

## 两种模式，三种风格

### 两种创作模式

| 模式 | 适用场景 | 说明 |
|------|----------|------|
| 图片模式 | 知识讲解、口播轮播 | 每一镜生成一张图，配上旁白 |
| HTML 模式 | 科技演示、动态可视化 | AI 直接生成 HTML/CSS/JS 动画 |

### 三种内置风格（仅 HTML 模式）

三种风格针对不同场景：

1. **科技博主 (cyber-clean)**：深色科技感、青色霓虹、卡片化布局，适合测评、拆解、科技分享

2. **黑客风 (terminal-matrix)**：终端界面、Matrix 绿、ASCII 装饰、扫描线效果，适合技术演示和极客内容

3. **暖色系 (warm-story)**：奶油米色、暖橘琥珀、衬线标题大留白，适合人文、生活方式、故事表达

## 技术栈

- Next.js 14 + React 18 + TypeScript
- Prisma + MySQL 8
- Tailwind CSS
- OpenAI SDK（兼容任意 OpenAI 接口网关）
- Vitest

## 五分钟本地部署

我把完整步骤写在这里，跟着走就行：

### 1. 环境准备

需要：
- Node.js 22+
- MySQL 8+
- OpenAI 兼容的 API 网关（支持聊天 + TTS）

如果你本地没有 MySQL，可以直接用项目里的 Docker 启动：

```bash
docker-compose up -d
```

这会启动一个叫 `ai-video-mysql` 的 MySQL 8 实例。

### 2. 拉代码装依赖

```bash
git clone https://github.com/xuanyuanzhifeng/ai-video-agent
cd ai-video-agent
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填上你的配置：

```env
DATABASE_URL="mysql://root:***@localhost:3306/ai_video"

AI_BASE_URL="https://your-openai-compatible-gateway/v1"
AI_API_KEY="sk-xxx"
AI_MODEL="gemini-3-flash-preview"

TTS_VOICE="nova"
TTS_MODEL="qwen3-tts-flash"

IMAGE_API_BASE_URL="https://api.evolink.ai"
IMAGE_API_KEY="your-image-key"

NEXT_PUBLIC_APP_NAME="AI 视频制作智能体"
```

**几点说明：**
- `AI_BASE_URL` 需要是 OpenAI 兼容协议地址，任何网关都能用
- 如果只体验 HTML 模式，可以不配置图片相关变量
- 图片模式依赖单独的文生图接口，目前按 `z-image-turbo` 适配

### 4. 初始化数据库

```bash
npx prisma db push
```

### 5. 启动

```bash
npm run dev
```

浏览器打开 http://localhost:3000 就能用了。

## 实际怎么用？

基本流程很简单：

1. 首页选 `图片轮播模式` 或 `HTML 动画模式`
2. 创建项目，在聊天框输入你的主题
3. AI 先生成视频大纲
4. 逐镜生成图片/HTML 动画，同时生成旁白音频
5. 预览试听，不满意可以单独重生成某一镜
6. 最后导出 MP4

**输入示例参考：**
- `帮我做一个 30 秒的视频，讲清楚什么是 RAG`
- `做一个科技感强一点的 AI Agent 工作流介绍`
- `把第 3 镜改成更偏数据可视化，不要人物`
- `删掉最后一镜，再补一个总结镜头`

![首页预览](/images/ai-video-agent-auto-generate-video/homepage.png)

界面布局：左侧项目管理，中间预览，右侧对话创作，一目了然。

## 体验完说点感受

这是一个实验性开源项目，作者也说了可能还有 Bug，但这个方向是对的：**AI-native 视频创作，就是应该对话驱动，自动流水线，把人从繁琐的手工操作里解放出来**。

如果你：
- 经常做知识分享类短视频
- 需要快速出视频草稿给客户看
- 想自己搭一个内部 AI 视频创作工具
- 对 AI 自动生成视频这个方向感兴趣

那这个项目非常值得你 clone 下来试试。

作者还有一个商业化版本 [SVG Animate](https://svganimate.ai)，功能更完整更稳定，如果这个实验性版本满足不了你，可以去试试官方服务。

![SVG Animate 预览](/images/ai-video-agent-auto-generate-video/svganimate-preview.png)

## 项目信息

- GitHub：https://github.com/xuanyuanzhifeng/ai-video-agent
- 作者：@xuanyuanzhifeng
- 许可证：README 没写，建议 issue 里问一下再商用
- 体验完整功能：https://svganimate.ai
