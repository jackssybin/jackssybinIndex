---
title: 用了十年的PPT工具，被这个AI项目淘汰了
cover: /root/workspace/jackssybinIndex/content-ops/ai-ppt-slide-maker/media/cover-wechat.jpg
---

你做 PPT 时有没有遇到过这些糟心事：

- 喂给 AI 一篇论文，生成的 PPT 里**关键数据被改得面目全非**
- 导出 PPTX 一看，三分之一页面**整个都是图片**，改一个字都改不了
- 生成就是最终版本，内容错了也没人帮你检查，作者给自己打分，永远发现不了问题

最近 GitHub 开源的这个 `slide-maker` 项目，把这些问题一次性解决了。

![主流 AI PPT 工具对比](/root/workspace/jackssybinIndex/content-ops/ai-ppt-slide-maker/media/01-tool-comparison.png)

## 为什么说它和别的 AI PPT 不一样？

绝大多数 AI PPT 工具拼「快」—— 几秒出十几页，好不好看另说。

但 slide-maker 走的完全是相反路线：**当这份 PPT 是你要拿去讲、要负责的时候，它把真正重要的四件事做到位了**。

### 🔍 读你的材料，绝不编造数字

这是最基本，也是绝大多数工具做不到的一点。

slide-maker 拿到你的论文/PDF，会**真的从头到尾读完**：

- 论文里的图直接从 PDF 裁剪，绝不重新瞎画
- 表格里的数据一条一条核对，每个数字都能溯源
- 什么材料都没有？给主题它先联网调研，不会闭着眼睛瞎编

我之前用热门工具生成行业分析，它把 12 亿营收写成 42 亿，这种错误拿到场上讲直接社死。

slide-maker 不会犯这种错 —— 没有来源的数字，它根本不会往页面上放。

### ✏️ 输出真 PPTX，所有元素都能改

很多工具说「支持导出 PPTX」，打开一看，每页都是一张大图片，想改一个字都改不了。

slide-maker 输出的是**真正原生可编辑的 PPTX**：

- 文本框就是真文本框，双击就能改
- 数据图默认做成原生 PPT 图表，双击就能改数字
- 公式默认是可编辑的原生数学文本，只有分式矩阵才回退为图片

你拿到的是一份可以继续打磨的半成品，不是一张只能看的截图。

### 🧑‍⚖️ 独立评审先挑错，通过了才给你

绝大多数 AI PPT 是「生成即交付」，写的人就是审的人，很难发现自己的问题。

slide-maker 用了 **多智能体分工**：

- 内容规划：通读材料，规划每页讲什么，保证关键信息不丢
- 美术设计：围绕内容设计版式，不套模板
- **独立评审**：一个没参与搭建的 AI 专门挑错，数字错了、版式挤了、对比度不够，直接打回重修

相当于免费请了个技术审稿人，帮你把一遍关再交付。

### 🎨 不止 16:9，任意比例都能排

不止传统 16:9 演讲 PPT，同一套内容能重新编排成任意比例：

- 小红书 3:4 图文卡
- 方形 1:1 社交帖子
- 9:16 竖版封面
- 4:3 老式投影
- A4 打印一页纸

每种比例都会自动调整安全区，不会文字贴边被裁。一份内容多渠道复用非常方便。

## 五分钟就能上手，安装只要四步

### 1. 安装系统依赖

```bash
# macOS
brew install --cask libreoffice && brew install librsvg

# Linux
sudo apt install libreoffice librsvg2-bin
```

### 2. 克隆安装

```bash
git clone --depth 1 https://github.com/addsumtech/slides_maker.git
cd slides_maker
python3 -m pip install -r skills/slide-maker/requirements.txt
python3 skills/slide-maker/scripts/install_skill.py --target both
```

### 3. 敲命令开始

```
/slide-maker
```

然后跟着提问一步步回答就行，它给你现成选项，箭头选择回车确认。

赶时间也可以一句话开场：

```
用 slide-maker 按 paper.pdf 做一份 12 分钟组会汇报
```

## 一句话总结

AI 做 PPT 其实分成两个方向：

- 一个方向拼速度，十秒出十页，适合随便玩玩
- 一个方向像 slide-maker，拼准确可靠，解决你真要上台讲的时候那些痛点

后者才是大多数时候的刚需 —— 我们要的不是「快点出一份PPT」，而是出一份**不会让你翻车**的 PPT。

项目地址：[addsumtech/slides_maker](https://github.com/addsumtech/slides_maker)，MIT 协议免费开源，Claude Code / Codex / GPT 商店都能用。

如果你也受够了 AI PPT 瞎编数据改不动，不妨去试试。
