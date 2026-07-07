---
title: "OpenMontage：把你的 AI 编程助手变成全自动视频制作工作室"
url: "/articles/2026/06/27/openmontage-ai-video-studio/"
date: "2026-06-27T17:00:00+08:00"
lastmod: "2026-06-27T17:00:00+08:00"
description: "OpenMontage 是首个开源的智能体化视频制作系统，它能把 Claude Code/Cursor 变成全自动视频工作室，从创意到成品视频一条龙，全程智能体自动完成研究、脚本、素材、剪辑、合成。"
tags: ["AI 视频", "Remotion", "工具教程", "开源项目"]
topic: "AI 工具"
topicSlug: "ai-tools"
layout: article
contentType: article
---

![封面](/images/openmontage-ai-video-studio/diagram.png)

# OpenMontage：把你的 AI 编程助手变成全自动视频制作工作室

你有没有想过：只需要给一句话描述，就能从创意到成品自动产出一整部视频？研究脚本素材剪辑合成一条龙，不用你手动开各种软件，AI 智能体自己全搞定？

最近 GitHub Trending 榜首的 [OpenMontage](https://github.com/calesthio/OpenMontage) 做到了。它是**首个开源的代理化（agentic）视频制作系统**，能把你已有的 Claude Code、Cursor、Copilot 变成一个完整的视频制作工作室。

![OpenMontage 架构图](/images/openmontage-ai-video-studio/diagram.png)

## 它到底能做什么？

给它一句提示，比如：

> "制作一个 60 秒的动画解说视频，讲解神经网络是如何学习的"

或者：

> "制作一部 75 秒的纪录片蒙太奇，展现雨中的城市生活。只使用真实素材，无旁白，需要一种挽歌般的基调和配乐。"

然后它就会自动完成：

1. **网络研究** — 搜索相关主题，收集事实数据，确保内容准确
2. **提案阶段** — 给出 2-3 个概念方案，预估成本，等你批准
3. **脚本编写** — 撰写分镜头脚本，规划时长节奏
4. **资产生成/检索** — AI 生成图像视频，或从免费素材库检索真实 footage
5. **剪辑编排** — 按照时间线剪辑拼接
6. **配音配乐** — TTS 旁白，自动找免版税音乐
7. **字幕生成** — 词级时间轴字幕
8. **合成输出** — 使用 Remotion 或 FFmpeg 渲染最终视频
9. **质量检查** — 自我审查，ffprobe 验证，确保输出可用

整个过程中，它只在关键创意决策点问你意见，其他全自动。

## 和其他 AI 视频工具有什么区别？

| 特性 | 传统 AI 视频工具 | OpenMontage |
|------|----------------|-------------|
| 端到端自动化 | ❌ 大多只能生成单一片段 | ✅ 从创意到成品完整流水线 |
| 真实素材剪辑 | ❌ 大多是"图片动一动" | ✅ 能从免费素材库检索剪辑真实动态 footage |
| 智能体协作 | ❌ 单一模型生成 | ✅ 你的 AI 编程助手就是编排器 |
| 多提供商支持 | ❌ 绑定单一平台 | ✅ 50+ 提供商，自动评分选最优 |
| 开源可扩展 | ❌ 大多闭源 | ✅ 完全开源，AGPLv3 |
| 预算控制 | ❌ 无预估 | ✅ 事前预估成本，每步都要你批准 |

最核心的区别：**大多数 AI 视频工具只给你一个片段，OpenMontage 给你一整部完成的视频，就像一个迷你制作团队**。

它也不是那种"把几张静态图片加个 Ken Burns 效果就叫视频"的把戏 — 它真的能从 Archive.org、Pexels、Pixabay 这些免费素材库挖真实动态片段，然后剪成一部完整的纪录片蒙太奇。

## 五分钟快速上手

### 环境要求

- Python 3.10+
- FFmpeg
- Node.js 18+
- 一个 AI 编程助手（Claude Code、Cursor、Copilot、Windsurf、Codex 都可以）

### 安装

```bash
git clone https://github.com/calesthio/OpenMontage.git
cd OpenMontage
make setup
```

如果没有 `make`，手动来：

```bash
pip install -r requirements.txt
cd remotion-composer && npm install && cd ..
pip install piper-tts
cp .env.example .env
```

### 添加 API 密钥（可选，密钥越多能力越强）

编辑 `.env` 文件：

```bash
# 图像 + 视频网关（fal.ai）
FAL_KEY=your-key               # FLUX 图像 + Google Veo、Kling、MiniMax 视频

# 免费素材库
PEXELS_API_KEY=your-key        # 免费库存视频和图像
PIXABAY_API_KEY=your-key       # 免费库存视频和图像
UNSPLASH_ACCESS_KEY=your-key   # 免费库存图像

# 音乐
SUNO_API_KEY=your-key          # 完整的歌曲、伴奏

# 语音
ELEVENLABS_API_KEY=your-key    # 顶级 TTS、AI 音乐
OPENAI_API_KEY=your-key        # OpenAI TTS、DALL-E 3
XAI_API_KEY=your-key           # xAI Grok 图像/视频生成
```

**重点：零密钥也能用！** 开箱即用就支持：

- Piper TTS 离线免费旁白
- Archive.org + NASA + Wikimedia Commons 免费素材
- Remotion 合成渲染
- FFmpeg 后期制作
- 自动字幕生成

零密钥就能做：基于静态图像的动画视频、纪录片蒙太奇（只用开源档案素材）、数据可视化解说。

### 开始制作

在你的 AI 编程助手打开项目，输入：

```
"制作一个 45 秒的动画解说视频，解释为什么天空是蓝色的"
```

就是这么简单。剩下的交给智能体。

## 核心架构：智能体优先设计

OpenMontage 走的是 **agent-first** 架构，思路很聪明：

```
你：需求描述
  ↓
AI 编程助手读取流水线 YAML（知道分几个阶段）
  ↓
AI 编程助手读取阶段导演技能（知道每个阶段该怎么做）
  ↓
调用 Python 工具（提供商评分选择）
  ↓
自我审查（Schema 验证、质量检查）
  ↓
保存检查点（可恢复，决策日志可追溯）
  ↓
请求人类批准关键创意决策
  ↓
合成前验证（拦截垃圾输出）
  ↓
渲染输出（Remotion / FFmpeg）
  ↓
渲染后审查（ffprobe + 抽帧 + 音频分析）
  ↓
最终视频
```

三层知识架构设计得很清晰：

| 层级 | 内容 | 作用 |
|------|------|------|
| 第 1 层 | `tools/` + `pipeline_defs/` | "有什么功能" — 可执行工具 + 流水线编排 |
| 第 2 层 | `skills/` | "怎么用" — OpenMontage 约定和质量标准 |
| 第 3 层 | `.agents/skills/` | "深入原理" — 外部技术知识包 |

所有创意决策、选择推理都记录在 JSON 检查点里，完全可审计可追溯。你可以随时看到它为什么选这个提供商不选那个。

## 支持的流水线

OpenMontage 内置 12 条完整流水线，覆盖常见场景：

| 流水线 | 适用场景 |
|--------|----------|
| **动画解说** | 教育内容、教程、主题解析 |
| **动画** | 社交媒体短片、产品演示、抽象概念 |
| **化身代言** | 数字人演讲、企业培训、公告 |
| **电影级** | 预告片、品牌宣传片 |
| **片段工厂** | 长内容切分社交媒体短片 |
| **纪录片蒙太奇** | 真实素材剪辑、情绪短片、空镜头 |
| **混合** | 源素材 + AI 生成辅助画面 |
| **本地化与配音** | 多语言翻译配音 |
| **播客重制** | 播客片段转视频 |
| **屏幕演示** | 软件演示、产品教程 |
| **口播** | 真人出镜演讲、vlog、访谈 |

每条流水线都是完整的工作流，从创意到成品。

## 示例作品

作者已经用它做出了不少成品：

| 作品 | 说明 | 成本 |
|------|------|------|
| **来自明天的信号** | 科幻预告片，概念→剧本→Veo 片段→配乐→合成 | 完整电影级 |
| **最后的香蕉** | 60 秒皮克斯风格动画短片，Kling v3 + Google Chirp3-HD | $1.33 |
| **虚空神经接口** | 产品广告，GPT-Image-1 + TTS + 自动音乐 | $0.69 |
| **糖果乐园的午后** | 吉卜力风格动画，12 张 FLUX 图像 + 动画 + 配乐 | $0.15 |
| **森林之灵** | 吉卜力风格动画，静态图像转动态 | $0.15 |

全部示例视频在 [项目 README](https://github.com/calesthio/OpenMontage) 可以直接看。

## 参考驱动创作

一个非常实用的功能：你可以扔一个参考视频给它。

```
"这是一个我非常喜欢的 YouTube Short。请给我制作一个类似的，但主题是关于量子计算，面向高中生。"
```

它会：

1. 分析参考视频的节奏、钩子、结构、风格
2. 告诉你它保留了什么、改变了什么
3. 预估成本
4. 用同样结构制作你的新视频

不用你绞尽脑汁想提示词，学会了你喜欢的风格直接套用。

## 零 API 密钥能做什么？

很多人担心没有各种 API 密钥能不能玩，其实零密钥开箱就能做不少事情：

| 能力 | 工具 | 说明 |
|------|------|------|
| 旁白配音 | Piper TTS | 免费离线，发音逼真 |
| 开源影像素材 | Archive.org + NASA + Wikimedia | 免费档案素材直接用 |
| 额外素材 | Pexels/Unsplash/Pixabay | 开发者密钥可免费获取 |
| 合成 | Remotion | React 渲染，支持图片动画、字幕 |
| 合成 | HyperFrames | HTML/CSS/GSAP 渲染，适合动态排版 |
| 后期 | FFmpeg | 编码、字幕烧录、音频混合 |
| 字幕 | 内置 | 词级时间轴自动生成 |

两条推荐的零密钥入门路线：

1. **基于图像的动画视频** — Piper 配音 + FLUX（如果有密钥）/静态图片 + Remotion 动画
2. **纪录片蒙太奇** — 只用 Archive.org/Wikimedia/NASA 免费素材，自动剪辑出完整视频

如果你想要真实素材的纪录片，提示词可以这么写：

```
"制作一部 90 秒的纪录片蒙太奇，展现凌晨 4 点城市的感觉。只使用真实素材，无旁白，挽歌般的基调。"
```

## 谁应该用 OpenMontage？

✅ **非常适合：**
- 内容创作者想要自动化重复剪辑工作
- 教育博主需要快速制作知识点解说视频
- 产品经理需要制作产品演示宣传片
- AI 智能体开发者想要学习 agent-first 工作流设计
- 开源爱好者想要折腾全自动 AI 工作流

❌ **可能不适合：**
- 你想要完全无代码的 GUI 产品（它需要 AI 编程助手配合）
- 你需要一秒渲染 4K 60fps（它走流水线，需要时间，但质量可控）
- 你只想生成单个视频片段（它擅长端到端整部视频）

## 体验感受

我觉得这个项目最惊艳的是**思路** — 它没有重复发明轮子，没有自己做一个大模型，也没有重新做一个视频生成模型，而是**把已有的 AI 编程助手变成视频编排器**，把各种云 API 和本地工具串成流水线。

这种架构很聪明：

- 你的 AI 编程助手本来就会读文件、写代码、做决策，为什么还要再做一个？
- 各种提供商已经有很好的图像/视频生成了，为什么要重复造轮子？
- 把架构开放出来，社区可以加新流水线、新工具、新提供商

作者的设计哲学很清晰：**智能体负责决策和编排，专业工具负责专业任务**。

## 总结

OpenMontage 是我最近看到最有想法的 AI 原生项目之一：

- 它重新定义了"AI 视频制作" — 不是单一生成，是端到端流水线自动化
- agent-first 架构把你已有的 AI 编程助手利用率拉满
- 完全开源，支持从免费零密钥到全付费 API 多种配置
- 质量关卡内置，不会随便输出垃圾，节省你的时间和 API 额度

如果你对 AI 智能体自动化感兴趣，或者你经常需要制作视频，一定要试试。

**项目地址：** https://github.com/calesthio/OpenMontage

> 免责声明：本项目开源 AGPLv3，仅供学习研究使用，使用时请遵守相关法律法规和各平台 API 条款。

## 常用提示词参考

收藏起来，直接拿去用：

### 零密钥
```
Make a 45-second animated explainer about why the sky is blue
```
（制作一个 45 秒的动画解说视频，解释为什么天空是蓝色的）

### 纪录片蒙太奇
```
Make a 90-second documentary montage about what a city feels like at 4am. Use real footage only, no narration, elegiac tone.
```
（制作一部 90 秒的纪录片蒙太奇，展现凌晨 4 点城市的感觉。只使用真实素材，无旁白，挽歌般的基调。）

### AI 生成动画
```
Create a 30-second Ghibli-style animated video of a magical floating library in the clouds at golden hour
```
（制作一部 30 秒的吉卜力风格动画视频，展示黄金时刻云端上一座神奇的漂浮图书馆）

### 参考视频改编
```
Here's a YouTube short I love. Make me something like this, but about CRISPR for high school students.
```
（这是一个我非常喜欢的 YouTube 短片。请给我制作一个类似的，但主题是面向高中生的 CRISPR 基因编辑技术。）
