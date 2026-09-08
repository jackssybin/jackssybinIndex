---
title: 登顶 GitHub Trending 的 OpenMontage：一句话，AI 帮你做完一整条视频
cover: /root/jackssybinIndex/content-ops/openmontage-agentic-video-production/media/wechat-cover.jpg
---

# 登顶 GitHub Trending 的 OpenMontage：一句话，AI 帮你做完一整条视频

你有没有过这种经历？

看到别人用 AI 做的视频很惊艳，兴冲冲去试 Kling、可灵、Sora，结果发现：

> 输入一段提示词，出来一段 5 秒钟的片段。

**就这？**

想要一条完整的视频？你还得自己写脚本、自己找素材、自己剪、自己配音、自己加字幕、自己找配乐。

AI 给你的只是一块砖，不是一座房子。

但最近有个项目，直接把这件事给颠覆了——**OpenMontage**。

它登顶了 GitHub Trending 日榜第一，被称为「首个开源的 Agent 视频制作系统」。

**一句话丢进去，一条完整的视频出来。**

不是 5 秒素材，是 60 秒、90 秒、甚至更长的完整成片——脚本、分镜、素材、剪辑、配音、字幕、配乐，全自动。

成本最低多少？

**0.15 美元。** 甚至零 API Key 也能做。

![OpenMontage 项目展示](/root/jackssybinIndex/content-ops/openmontage-agentic-video-production/media/01-showcase.jpg)

## 一、这不是又一个「AI 视频生成器」

先把概念掰扯清楚。

市面上 99% 的 AI 视频工具，做的都是「**文字 → 一段动态画面**」。

输出单位是：**clip（片段）**。

OpenMontage 做的是「**一句话 → 一条完整视频**」。

输出单位是：**video（完整影片）**。

它模拟的是一整个视频制作团队的工作流程：

```
研究 → 提案 → 脚本 → 分镜 → 资产 → 剪辑 → 合成
```

你只需要说一句：

> 「做一个 60 秒的动画解说，讲神经网络是怎么学习的」

然后 Agent 就开始干活了。

### 研究阶段

自动搜 YouTube、Reddit、Hacker News、学术网站，收集数据点、受众问题、热门角度，产出结构化研究简报。

### 提案阶段

给你 2-3 个差异化的概念方案，每个都有明确的工具路径、成本估算、预期效果。你选一个。

### 脚本阶段

写带时间戳的旁白脚本，标注语气、重音、停顿。

### 分镜阶段

把脚本拆成具体场景，每个场景有类型、描述、时长、视觉参考。

### 资产生成

调用图像、视频、音频工具生成所有素材，自动选最优提供商。

### 剪辑合成

用 Remotion 或 HyperFrames 渲染，自动加转场、字幕、配乐。

### 自检输出

ffprobe 验证格式、帧采样检查画面、音频分析音量……通不过就自己返工。

![OpenMontage 流水线：7 个阶段全自动化](/root/jackssybinIndex/content-ops/openmontage-agentic-video-production/media/02-pipeline-flow.png)

**你是制片人，Agent 是执行团队。**

每一个创意决策点，它都会停下来等你拍板——脚本要审、分镜要审、素材联系表要审。

## 二、最反直觉的设计：没有编排器

一般的 AI 工作流框架（LangGraph、AutoGen 之类），都是用 Python 写一个状态机，代码调度 LLM。

OpenMontage 反过来了。

> **没有 Python 编排器。你的 AI 编程助手，本身就是编排器。**

![Agent-First vs 传统架构](/root/jackssybinIndex/content-ops/openmontage-agentic-video-production/media/04-agent-first.png)

整个系统分三层：

**第一层：工具与流水线（有什么）**

- `tools/` — 57 个 Python 工具，都是干活的
- `pipeline_defs/` — YAML 格式的流水线清单，定义每个流程有几个阶段
- `tool_registry.py` — 自动发现所有工具的注册表

**第二层：项目技能（怎么用）**

几百个 Markdown 文件，教 Agent 每个阶段该怎么做：

- 流水线导演技能：研究怎么做、脚本怎么写、分镜怎么拆
- 创意技巧：剪辑手法、数据可视化、提示工程
- 核心工具技能：FFmpeg、Remotion、色彩分级

**第三层：外部知识（技术原理）**

通用技术知识包——FFmpeg 命令怎么写、ElevenLabs API 怎么调、FLUX 模型有什么特性。

Agent 的工作路径就是：

**读流水线 → 读技能 → 查工具 → 调用 → 自检 → 写检查点 → 提交审批**

这种架构最大的好处是什么？

**加功能不用动核心代码。**

想加一个新工具？写个 Python 类就行。
想改制作流程？改 YAML 和 Markdown 就行。
想换模型？加个环境变量就行。

系统的边界不由代码决定，由 Agent 的能力决定。

## 三、57 个工具，60+ 提供商，自动选最优

OpenMontage 的工具覆盖了视频制作的全链路。

![工具矩阵：57 个工具全链路覆盖](/root/jackssybinIndex/content-ops/openmontage-agentic-video-production/media/03-tool-matrix.png)

视频生成 18 个——Kling、Veo、Runway、WAN 2.1、Hunyuan、CogVideo……
图像生成 13 个——FLUX、Imagen、GPT Image、Recraft、本地 Diffusion……
音频语音 9 个——ElevenLabs、Google TTS（700+ 声音）、Piper 本地 TTS、Suno 音乐……
还有画面增强、视频分析、数字人、字幕……

最有意思的是 **Selector 模式**。

你要生成视频？不用指定用哪家。

`video_selector` 自动从 7 个维度给所有可用提供商打分：

1. 任务契合度
2. 输出质量
3. 控制能力
4. 可靠性
5. 成本效益
6. 延迟
7. 连续性

分数最高的上。挂了？自动走回退链。

加了新 Key？自动纳入选择范围。

**完全没有供应商锁定。**

而且每个能力都同时支持云端 API 和本地方案——有 GPU 跑免费的 WAN/Hunyuan/CogVideo，没 GPU 调云 API。

## 四、12 条流水线，什么视频都能做

不是一个「生成视频」按钮，是 12 条专门化的流水线：

🎓 **动画解说** — 科普、教程、知识类视频
🎬 **电影级** — 预告片、品牌宣传片
📹 **口播** — 真人出镜演讲视频
🎭 **角色动画** — SVG 绑定 + GSAP + HyperFrames
📰 **纪录片蒙太奇** — CLIP 语义检索真实素材剪辑
🎙️ **播客重制** — 播客高光转视频
✂️ **片段工厂** — 长视频批量剪短视频
🌐 **本地化配音** — 多语言字幕+翻译+配音
🖥️ **屏幕演示** — 软件演示视频
👤 **化身代言** — 数字人演讲视频
🎨 **动画** — 动态图形、动态排版
🔀 **混合** — 实拍 + AI 生成辅助

最绝的是**纪录片蒙太奇**那条线。

不需要任何付费视频生成 API。它从 Archive.org、NASA、Wikimedia Commons、Pexels、Pixabay 这些免费来源建一个 CLIP 可检索的语料库，然后用语义搜索找匹配主题的**真实动态镜头**，再剪辑成一部完整影片。

**零成本，真素材。**

不是那种图片推拉的 Ken Burns 效果，是真的视频素材剪辑。

## 五、零 API Key 也能出片

这一点必须单独拿出来说。

大多数 AI 视频工具，你不配 Key 根本用不了。

OpenMontage 你 `make setup` 完就能干活。

- **旁白**：Piper TTS（本地离线，真人发音）
- **真实素材**：Archive.org + NASA + Wikimedia Commons
- **库存素材**：Pexels + Unsplash + Pixabay（开发者 Key 免费）
- **合成**：Remotion（React）+ HyperFrames（HTML/GSAP）
- **后期**：FFmpeg
- **字幕**：内置自动生成

两条完全免费的出片路径：

1. **图像动画路径** — Piper 配音 + 图像 + Remotion 动画化（缩放、平移、淡入淡出、粒子）
2. **真实素材路径** — 纪录片蒙太奇流水线，CLIP 检索真实镜头剪辑

装完跑 `make demo`，零配置直接看效果。

## 六、钱的事，你说了算

AI 工具最容易翻车的地方——**账单爆炸**。

OpenMontage 内置了完整的预算治理：

```
预估 → 预留 → 结算
```

三种模式：
- 只记账
- 超支警告
- 超预算直接拒绝

默认总预算 10 美元，10% 安全预留，单笔超过 0.5 美元暂停等你批准，第一次用新的付费工具必须确认。

**绝无意外账单。**

质量也有三道关卡：
- 合成前：检查是不是做成了 PPT 播放效果
- 渲染后：格式、画面、音频全检
- 人工门：每个创意决策点都可以要求你确认

通不过？Agent 自己返工。

## 七、怎么上手？

环境要求很简单：
- Python 3.10+
- FFmpeg
- Node.js 18+
- 一个 AI 编程助手（Claude Code / Cursor / Copilot / Windsurf / Codex 都行）

```bash
git clone https://github.com/calesthio/OpenMontage.git
cd OpenMontage
make setup
```

然后在你的 AI 助手里说一句：

> 「做一个 45 秒的动画解说，解释天空为什么是蓝色的」

就完事了。

想加 API Key？编辑 `.env`，加什么解锁什么，不加也能跑。

## 八、适合谁？不适合谁？

**适合你：**

- 🎬 内容创作者 / 自媒体 — 批量产出短视频，不想剪
- 👨‍💻 开发者 / 技术博主 — 给项目做演示视频，但不会剪
- 🎓 教育工作者 — 快速做教学视频
- 🤖 Agent 爱好者 — 对「指令驱动的 Agent 系统」感兴趣
- 📊 营销/运营 — 低成本做产品宣传片

**暂时不建议：**

- 🚫 想要一键出 Sora 级电影 — 这是制作系统，不是魔法
- 🚫 完全不想碰代码 — 至少得会命令行 + 一个 AI 编程助手
- 🚫 需要专业级影视后期 — 它替代不了达芬奇和 Premiere

## 写在最后

OpenMontage 最打动我的，不是它能生成视频。

而是它代表了一种**新的软件范式**：

> 软件不再是写死功能的代码。
> 而是一组工具 + 一套指令 + 一个 Agent。
> 智能不在代码里，智能在 Agent 的阅读和执行能力里。

这可能就是 AI 原生软件该有的样子。

---

觉得有意思？去 GitHub 点个 Star 试试：

**[github.com/calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)**

---

*我是 jk，一个关注 AI 生产力和开源工具的开发者。如果你觉得这篇文章有帮助，欢迎**关注、在看、星标本公众号**，第一时间获取新鲜的 AI 工具和技术洞见。*

*点击「阅读原文」可直接访问 OpenMontage 项目主页。*

**相关阅读：**
- dsh-ego-browser：让 DeepSeek Harness Agent 浏览器操作看得见也控得住
- Navop：开源免费的一体化原生开发工作台
