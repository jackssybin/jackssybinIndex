---
title: "用了十年的PPT工具，被这个AI项目淘汰了"
url: "/articles/2026/07/21/ai-ppt-slide-maker.html"
date: "2026-07-21T00:00:00+08:00"
lastmod: "2026-07-21T00:00:00+08:00"
description: "GitHub 开源 AI PPT 工具 slide-maker 深度体验：多智能体分工 + 独立评审 + 原生可编辑，解决了传统 AI PPT 工具编造数据、内容不可编辑的两大痛点，支持 Claude Code / OpenAI Codex / GPT 商店多种使用方式。"
tags: ["AI工具", "PPT生成", "开源", "Claude Code", " productivity"]
topic: "AI工具"
topicSlug: "ai-tools"
layout: article
contentType: article
---

# 用了十年的PPT工具，被这个AI项目淘汰了

你做 PPT 时有没有遇到过这些糟心事：

- 喂给 AI 一篇论文，生成的 PPT 里**关键数据被改得面目全非**，12% 增长率写成了 43%
- 导出 PPTX 一看，三分之一的页面**整个都是图片**，想改一个字都改不了
- 生成就是最终版本，内容错了也没人帮你检查，**作者自己给自己打分**，永远发现不了问题

最近 GitHub 上开源了一个叫 **slide-maker** 的项目，它把这些问题一次性解决了。我用它生成了几份学术 PPT，体验下来只有一句话：这才是 AI 做 PPT 该有的样子。

![主流 AI PPT 工具对比](/images/ai-ppt-slide-maker/01-tool-comparison.png)

## 为什么说它和别的 AI PPT 工具不一样？

市面上绝大多数 AI PPT 工具，拼的都是「快」—— 几秒给你出十几页，好不好看另说。但 slide-maker 走的是完全相反的路线：**当你这份 PPT 要拿去讲、要负责的时候，它把真正重要的四件事给做到位了**。

### 1. 读你的材料，绝不编造数字

这是最基本，但也是绝大多数工具做不到的一点。

slide-maker 拿到你的论文、PDF、代码仓库，会**真的从头到尾读完**：

- 论文里的图直接从 PDF 裁剪，绝不重新瞎画
- 表格里的数据一条一条核对，每个数字都能溯源
- 哪怕你只给了一个主题，它也会先联网调研找到最新数据，不会闭着眼睛瞎编

我之前用某热门工具生成一份行业分析，它把某公司 2024 年营收 12 亿写成了 42 亿，这种错误拿到场上讲直接社死。slide-maker 不会犯这种错 —— 没有来源的数字它根本不会往页面上放。

### 2. 输出真 PPTX，所有元素都能改

很多 AI PPT 工具说支持「导出 PPTX」，但打开一看，每页都是一张大图片，你想改个字、调个间距都改不了。

slide-maker 输出的是**真正原生可编辑的 PPTX**：

- 文本框就是真文本框，双击就能改字
- 数据表格默认做成原生 PowerPoint 图表，双击就能改数据
- 公式默认是可编辑的原生数学文本，只有分式矩阵这种二维排版才会渲染成图片

你拿到的是一份可以继续打磨的半成品，不是一张只能看的截图。这才是能落地使用的格式。

### 3. 独立评审先挑错，通过了才给你

绝大多数 AI PPT 是「生成即交付」，写的人就是审的人，很难发现自己的问题。

slide-maker 用了 **actor-critic 多智能体分工**：

- **Content-planner（内容规划）**：通读材料，规划每页讲什么，保证关键信息不丢
- **Slide-design（美术总监）**：设计每页版式配色，不套模板，围绕内容设计
- **Critic（评审）**：**一个没参与搭建的独立 agent** 专门挑错：数字对不对？版式挤不挤？对比度够不够？有问题直接打回重修

相当于你免费请了个技术审稿人，帮你把一遍关再交付。

### 4. 不止 16:9，任意比例画布都能排

你以为它只能做 16:9 演讲 PPT？错了。

同一套内容，它能给你重新编排成任意比例：

- 小红书 3:4 图文卡
- 方形 1:1 社交平台帖子
- 9:16 抖音/视频号竖版封面
- 4:3 老式会场投影
- A4 打印一页纸

每种比例都会自动调整内容安全区，不会出现文字贴边被裁的问题。你做一份内容，多个渠道复用非常方便。

## 它是怎么工作的？五分钟就能上手

整个流程非常顺畅，不用你写复杂 prompt，问答式交互就能出结果：

1. **问清楚需求** — 给谁看？讲多久？现场讲还是发出去读？用什么模板？要什么语言？短句回答就行，拿不定主意说「你定」它也能帮你选。
2. **读材料（或联网调研）** — 论文、Word、Excel、CSV、图片、视频都能读，整本书也能按你的目的做章节取舍。只有主题没有材料？它先上网调研再动手。
3. **两次确认** — 先给你看逐页结构表（每页讲什么，用什么图），确认故事线没问题；再给你看设计方案（配色、风格），确认方向对了再生成。两次都在最便宜的阶段改方向，不用等全做完再返工。
4. **生成 PPTX + 独立评审** — 代码保证版式不翻车，生成后评审挑错，有问题直接修完再给你。
5. **自然语言微调** — 不满意？说一句「把第 7 页改成图表」「删掉引言」「配色暖一点」，它直接重新生成，不用你手动拖框调版式。

## 本地快速安装：四步就能用

slide-maker 依赖三个系统工具：Python 3.9+、LibreOffice（渲染预览做版式检查）、SVG 栅格化器。

### 安装系统依赖

```bash
# macOS
brew install --cask libreoffice
brew install librsvg

# Linux
sudo apt install libreoffice
sudo apt install librsvg2-bin

# Windows
winget install TheDocumentFoundation.LibreOffice
# Chrome/Edge 已安装即可，用来无头渲染 SVG
```

### 安装 slide-maker 本体

```bash
git clone --depth 1 https://github.com/addsumtech/slides_maker.git
cd slides_maker
python3 -m pip install -r skills/slide-maker/requirements.txt
python3 skills/slide-maker/scripts/install_skill.py --target both
```

如果你只用 Claude Code 或者只用 Codex，可以把 `both` 换成 `claude` 或 `codex`。

也可以用 `npx skills` 一键安装：

```bash
npx skills add addsumtech/slides_maker
```

Claude Code 用户还可以直接从插件市场安装：

```
/plugin marketplace add addsumtech/slides_maker
/plugin install slide-maker@slides-maker
```

### 使用：敲一条命令就开始

安装完成后，在 Claude Code 里直接输入：

```
/slide-maker
```

然后跟着它的提问一步步回答就行，它会给你现成选项，箭头键选择回车确认，非常方便。

赶时间也可以一句话开场：

```
用 slide-maker 按我的 paper.pdf 做一份 12 分钟的组会汇报 PPT。
```

## 谁适合用？谁应该再等等？

根据我这几天的使用体验，给你一个清晰的判断：

**✅ 特别适合这些场景**

- 学术组会汇报 / 论文解读 —— 对数据准确性要求高，容不下瞎编
- 毕业答辩 / 会议报告 —— 重要场合，需要有人帮你把一遍关
- 产品介绍 / 行业分析 —— 数据来源杂，需要逐个核对
- 你已经有材料，只想快点把 PPT 框架搭出来，剩下自己打磨

**❌ 这些场景可能不是最优解**

- 你完全没有材料，就想让 AI 帮你「瞎凑」一份 PPT 交差 —— 它会先认真调研，速度比一拍脑袋就出的工具慢
- 你需要非常花哨的动画和特效 —— 它聚焦内容，动画只给你做原生点击渐显
- 你想要在线云端分享链接 —— 它输出本地 PPTX，不搞云端托管

## 总结

AI 工具发展到今天，其实已经分成了两个方向：

一个方向拼速度、拼数量，追求「十秒出 10 页」，适合你 just for fun 随便玩玩。

另一个方向像 slide-maker 这样，拼准确、拼可靠，解决**你真要拿去讲、真要负责**的时候那些痛点：不编数据、能继续改、有人帮你审。

后者其实才是更刚需的 —— 毕竟大部分时候，我们要的不是「快点出一份 PPT」，而是出一份**能拿得出手、不会让你翻车**的 PPT。

项目地址：[https://github.com/addsumtech/slides_maker](https://github.com/addsumtech/slides_maker)，MIT 协议免费开源，Claude Code 和 Codex 用户都能用，零成本体验。

如果你也受够了 AI PPT 瞎编数据改不动，不妨去试试。
