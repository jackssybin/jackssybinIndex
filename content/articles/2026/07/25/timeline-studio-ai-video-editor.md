---
title: "Timeline Studio：浏览器里跑的开源AI视频编辑器"
url: "/articles/2026/07/25/timeline-studio-ai-video-editor.html"
date: "2026-07-25T00:00:00+08:00"
lastmod: "2026-07-25T00:00:00+08:00"
description: "完全本地运行的开源AI视频编辑器，不用上传视频，支持AI配音、自动字幕、智能裁切，还能让Claude Code帮你自动化剪辑。MIT协议免费商用。"
tags: ["AI", "开源", "工具"]
topic: "AI、Agent 与本地模型"
topicSlug: "ai-agent"
layout: article
contentType: article
---


# Timeline Studio：浏览器里跑的开源AI视频编辑器

上周我需要剪辑一条带配音和字幕的产品介绍视频，打开剪映才发现又开始弹窗提示我开通会员，而且原片超过1分钟还要强制水印。

这次我没充值，直接打开了 [Timeline Studio](https://github.com/MartinDelophy/ai-video-editor) — 一个完全运行在浏览器里的开源AI视频编辑器，不用上传视频，AI配音自动字幕都有，剪完直接导出MP4，一分钱没花。

这篇文章讲清楚三件事：1）它到底能做什么，什么场景值得用；2）5分钟本地部署或直接在线体验的完整步骤；3）我实测下来发现的优势和坑。

---

## 它解决了什么痛点？

你肯定也遇到过：

- 剪辑简单视频还要下载安装好几个G的客户端
- 把原片上传到云端剪辑，担心素材隐私泄露
- 想试用AI自动字幕配音，结果要么限时长要么收月费
- 商业项目想用还得担心版权授权问题

Timeline Studio 给出了完全不同的解决方案 — **把整个视频编辑器放到浏览器里，AI模型全部本地运行，你的视频永远不需要离开你的电脑**。

![Timeline Studio 编辑器界面](/images/timeline-studio-ai-video-editor/editor-timeline.png)

## 核心能力：不仅仅是剪辑，AI功能全齐了

这个项目厉害的地方在于，它把剪映最常用的AI能力都搬到了浏览器端，而且完全本地化：

### 1. AI 配音：多语言支持，模型全部本地运行

支持中文 Piper/VITS ONNX 模型，英文有 Kokoro 82M，还覆盖了德语、西班牙语、法语等多种语言。模型是懒加载的，第一次用才下载，存在浏览器缓存里下次直接用。

不需要调用第三方API，不按字数收费，想用多少用多少。

### 2. 自动字幕：Whisper 跑在浏览器里

用的是 Whisper small q8 ONNX 量化模型，对中文识别结果还做了置信度修正，准确率比我想象的好。生成的字幕可以直接在时间线上拖动调整，支持拆分合并。

![字幕对齐预览](/images/timeline-studio-ai-video-editor/voice-caption-alignment.png)

### 3. 智能画面处理

内置 YOLOS 主体检测和 MODNet 人像抠图，可以做：
- 智能裁切：自动识别主体保证不被裁掉
- 字幕避让：自动留出底部字幕区域
- 背景移除：把人像从图片里抠出来

### 4. AI 人声分离

直接在浏览器里把伴奏从背景音乐里分离出来，放到独立音轨调整音量，不用导到别的软件里处理。

### 5. 数字人驱动

支持 JoyVASA 音频驱动动作 + LivePortrait 神经渲染，有 WebGPU 加速，256px 快速预览和 512px 高质量输出。做口播视频非常方便。

### 6. 剪辑体验接近剪映

- 多轨道时间线：主视频轨 + 字幕、配音、背景音乐独立轨道
- 支持画中画、遮罩、滤镜、关键帧动画、调速
- 磁吸对齐、右键切分/复制/删除、撤销重做
- 导出用 WebCodecs 直接生成 MP4，确定性离线渲染

### 7. 最牛的一点：AI Agent 可以帮你剪

这个项目最有意思的创新是，它内置了给 Claude Code / Codex 用的 Agent Skill，AI 可以直接读取你的项目文件，自动执行剪辑操作，最后保存可编辑的 `.timeline` 项目文件。

简单说就是：你告诉 AI 「把这个视频开头剪掉10秒，添加一句配音在第5秒，自动生成字幕」，AI 就能帮你做完，还能保留项目文件让你后续调整。

```bash
# 安装 Agent Skill
npx skills add MartinDelophy/ai-video-editor --skill edit-timeline-studio

# AI 执行剪辑计划
npm run agent -- project.run /absolute/path/edit-plan.json
```

这应该是我见过第一个把「AI 自动化剪辑」做到可复用层面的开源项目。

## 适合谁用？不适合谁用？

**适合用：**
- 在意视频隐私，不想把素材上传到云端
- 想省掉剪映会员费用，商业项目需要免费授权
- 经常做简单短视频，不想开笨重的客户端
- AI Agent 玩家，想让 Claude Code 帮你自动化剪辑
- 开发者想二次开发定制自己的剪辑工具

**不建议用：**
- 需要复杂剪辑、多镜头切换、专业色校的长视频
- 电脑性能一般，又想跑数字人渲染（需要 WebGPU）
- 完全不会代码，只想点点点就能用（在线版其实也可以，但功能不如客户端成熟）

## 5 分钟快速上手

两种方式：直接用在线版，或者本地部署。

### 方式一：直接在线体验（推荐尝鲜）

项目作者已经部署了在线版本，直接打开就能用：

**https://video-editor.ai-creator.top/**

第一次使用 AI 功能时会自动下载模型，等待几分钟就能用，模型存在你的浏览器缓存里。

### 方式二：本地部署

要求 Node.js 20+，现代 Chromium 浏览器。

```bash
git clone https://github.com/MartinDelophy/ai-video-editor.git
cd ai-video-editor
npm install
npm run dev
```

打开终端输出的本地地址（一般是 `http://localhost:5173`）就可以用了。

### 构建生产版本

```bash
npm run build
npm run preview
```

## 我实测下来发现的坑

1. **第一次加载 AI 模型比较慢** — 毕竟几个模型加起来几百MB，耐心等一会，缓存之后就快了
2. **导出大视频需要耐心** — 全浏览器渲染，性能肯定不如原生客户端，10分钟以内视频没问题
3. **WebGPU 不是必须但推荐开** — 数字人功能没有 WebGPU 会比较卡，其他功能正常用
4. **复杂剪辑功能还不全** — 毕竟是开源项目，不要和剪映比功能丰富度，简单剪辑够用

## 总结

Timeline Studio 最让人兴奋的不是它替代了剪映，而是它证明了 —— **完整的AI视频编辑器完全可以跑在浏览器里，完全本地化，完全免费开源**。

对于在意隐私、讨厌会员、喜欢折腾的开发者来说，这已经足够吸引人了。而且 AI Agent 自动化剪辑这个方向，确实打开了很多想象空间 — 以后会不会我们只需要描述需求，AI 就自动帮我们剪好视频？

如果你最近也在找开源视频编辑方案，可以去 GitHub 点个 Star 试试：

**https://github.com/MartinDelophy/ai-video-editor**