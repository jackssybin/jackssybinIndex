---
title: "diagram-design：让 AI 画的图第一次不像 AI 画的，39 种编辑级图表 Skill"
url: "/articles/2026/09/06/cathrynlavery-diagram-design-editorial-diagrams.html"
date: "2026-09-06T00:00:00+08:00"
lastmod: "2026-09-06T00:00:00+08:00"
description: "diagram-design 是一个跨 Claude Code、Codex、Factory Droid、Pi 的开源 Agent Skill，用自包含 HTML+SVG 产出 39 种编辑级图表：无阴影、无 Mermaid 自动布局味，能读你的网站 60 秒匹配品牌色，还能把 draw.io / Mermaid 旧图重绘成同一套设计系统。本文梳理它的机制、上手方式与适用边界。"
tags: ["开源", "AI Agent", "Claude Code", "Codex", "图表", "数据可视化", "SVG", "Mermaid"]
topic: "开源工具"
topicSlug: "open-source-tools"
layout: article
contentType: article
draft: false
---
# diagram-design：让 AI 画的图第一次不像 AI 画的

每个用 AI 写过技术文章或方案的人，大概都撞上同一堵墙：你让 Claude / Codex 画个架构图，它吐回来一堆千篇一律的圆角矩形，配着 Mermaid 自动布局的蜘蛛网连线，跟你网站其余部分的排版气质完全不搭。接下来要么在 Figma 里磨半小时，要么干脆不画了。

[diagram-design](https://github.com/cathrynlavery/diagram-design) 想解决的就是这件事。它不是一个画图网站，也不是一个 SaaS，而是一个**装在你 AI 编程助手里的 Skill（技能包）**：让 Claude Code、Codex、Factory Droid、Pi 这类 Agent 直接产出**编辑级（editorial）质量的图表**。形态是自包含的 HTML + SVG，**没有阴影、没有 JavaScript 运行依赖、没有 Mermaid 那种自动布局味**。项目 MIT 协议，截至发稿 GitHub 约 **3.15 万 star**，2026 年 4 月创建，迭代非常活跃。

它的一句话主张很直接：**"Editorial diagrams your designer won't hate"（你的设计师不会嫌弃的图表）**。

## 为什么"AI 画图"默认很难看

先拆问题。让大模型直接生成图表，丑通常不是模型不会画，而是三个结构性原因：

- **没有设计约束**：模型不知道你站点的配色、字体、留白标准，只能用最"安全"的通用样式——灰色圆角框 + 彩色填充；
- **布局靠自动引擎**：Mermaid / Graphviz 这类工具自动算坐标，连线交叉、节点对不齐是常态，信息密度也不可控；
- **没有"减法"意识**：模型倾向于把你说的每个元素都画上去，缺少"最高质量的一步通常是删除"这种编辑判断。

diagram-design 的作者 Cathryn Lavery（BestSelf.co 创始人，写 littlemight.com）在 README 里把这个动机讲得很实在：她每次需要架构图、流程图、金字塔图，找 Claude 拿到的都是和网站风格完全不符的通用圆角方块，最后要么和 Figma 搏斗 30 分钟，要么放弃配图。于是她把自己的编辑设计标准固化成了一个 Skill。

## 它的机制：不是"更多图形"，而是"设计系统 + 渐进加载"

理解这个项目，关键是看懂它和普通"图表模板库"的区别。

**1. 一套强约束的设计系统，而不是一堆素材。** 它规定：一张图只用一个强调色、1–2 个焦点元素；1px 发丝边框、**不用阴影**、圆角最大 10px；所有坐标、宽度、间距都能被 4 整除——README 里明确说这是"让图不显得像 AI 生成的"关键。字体用三套：Instrument Serif（标题和斜体批注）、Geist sans（节点名）、Geist Mono（技术标注，如端口、URL、字段类型）。强调色只留给"读者第一眼该看的 1–2 个东西"，目标信息密度 4/10。

**2. 语义模式与视觉类型分离。** 这是一个非显而易见的工程决策。它先判断你要表达的**行为**（扇入队列与瓶颈、重复阶段槽位、非结构化输入转换、成对策略追踪、安全铺装路径、治理目录、补偿性安全层等 7 种语义模式），再选最近的**视觉类型**来画。好处是：队列、策略追踪、信任边界这类东西可以复用最接近的现有图形，而不必无限扩充图形种类。README 里有一条 ADR 专门叫"语义模式不得扩张分类法"。

**3. 渐进披露，控制 Agent 上下文。** 这是给 AI 用的 Skill 和给人用的素材库最大的不同。它的 `SKILL.md` 只负责路由；日常画一个流程图，Agent 只加载 `SKILL.md` + 对应的一个 `type-flowchart.md`；要动画才加载动画契约，要导入 draw.io 才加载导入规程。"不管有多少种图，Agent 只读你需要的那一个。"这对 token 成本和触发准确率都很关键。

**4. 静态优先，动效是受控可选项。** 默认输出是**无脚本的静态 HTML**，双击就能离线打开。动效（`reveal/step/loop`）只有在你明确要"按顺序讲解"时才启用，且强制用经过审查的单一控制器、完整静态首帧、确定性时序，并尊重 `prefers-reduced-motion`——任意内联脚本、远程资源、可执行属性都会被拒绝。

## 39 种图表，三种皮肤

它内置 **39 种编辑级图表类型**，每种都给三套静态变体：极简浅色、极简深色、完整编辑版（带摘要卡片）。覆盖的范围远超普通画图工具：

- **技术架构类**：架构图、IT 现状图、部署图、依赖图、UML 类图、数据库 schema、ER 数据模型、分层栈、层级嵌套、树形、组织架构；
- **流程与时序类**：流程图、时序图、状态机、泳道图、过程图、甘特图、时间线、看板、用户旅程、故事地图；
- **商业/咨询类**：四象限、雷达图、金字塔/漏斗、韦恩图、Sankey 桑基图、鱼骨图、Wardley 地图、环形飞轮（2.0 新增的 Loop，带共享中枢和虚线回写）；
- **数据可视化类**：柱状、折线、散点、树图、极坐标图、奖牌架（medallion）数据分层、数据流、数据平台集成与安全矩阵。

2.5.10 版本一次补了最后十种布局语法（Sankey、鱼骨、Wardley、看板、用户旅程、部署、依赖、UML 类、故事地图、数据库 schema）。你可以在[在线画廊](https://cathrynlavery.github.io/diagram-design/)直接翻全部 39 种、切换浅色/深色/编辑版三个 tab。

![diagram-design 的架构图示例（官方示例图）](/images/cathrynlavery-diagram-design-editorial-diagrams/architecture.png)

## 60 秒匹配你的品牌

这是我觉得最实用的功能。开箱时它用一套干净的默认配色（雪白纸色 + 墨黑 + 原子橘强调色 + 蓝灰弱化色 + 银色发丝线），直接截图就能用。但花 60 秒做一次 onboarding 更值：

```
你：  "onboard diagram-design to https://yoursite.com"
Agent：→ 抓首页
      → 提取主色板和字体栈
      → 映射成语义角色：paper / ink / muted / accent / link
      → 给出一份拟修改 diff
      → 写入 style-guide.md
你：  "yes, apply it"
```

之后每张新图都用你的颜色：网站 `<body>` 背景变成图的纸色，CTA 颜色变成焦点强调色，正文/标题/代码字体分别映射到节点名、标题和技术标注。关键点在于它下游全部读**语义角色名**（`accent`，而不是写死的 `#eb6c36`），所以换品牌只改一处。

它还会做两件专业的事：一是写 token 前自动校验 **WCAG AA 对比度**，不够就提出调整并解释原因；二是产出一份**保真回执（fidelity receipt）**，列出采样的 URL、具体颜色角色、字体族与字重、字体来源 URL、以及任何回退——公网字体直接使用并在渲染后校验，而不是悄悄换成系统字体。多客户场景下，可以把品牌存成命名 profile，用 `.diagram-design` 标记文件按项目切换。

## 把旧的 draw.io / Mermaid 图重绘掉

如果你已经有一堆 draw.io 或 Mermaid 图，它不是做格式转换，而是**用同一套设计系统重画**——内容不变，但排版、配色、连线全部编辑化：

```
/diagram-design:import-drawio platform.drawio --size=slide-16x9 --detail=simplified --audience=executive
/diagram-design:import-mermaid architecture.mmd --size=slide-16x9 --detail=simplified
```

它提供四个"调节旋钮"，核心思想是**让输出匹配目的地**：

| 旋钮 | 选项 | 作用 |
|---|---|---|
| 格式 | html / svg / png / html+png | SVG 给 Figma，PNG 给幻灯片，HTML 给网页 |
| 尺寸 | doc-inline / doc-wide / slide-16x9 / social-og / print-a4 等 | 同时改 viewBox 和字号（投影用 16px 节点名，不是 12px） |
| 细节 | faithful(≤24节点) / balanced(≤12) / simplified(≤7) | 固定降级阶梯：先去装饰，再去重复，再并叶簇，最后基础设施 |
| 受众 | engineer / mixed / executive | 改的是**措辞**不是数量：`Auth Service / JWT·RS256·:8443` → `Auth Service / token check` → `Sign-in` |

每次导入结束都给一份**保真台账（fidelity ledger）**，明确告诉你哪些节点被合并、折叠、丢弃了。它只解析文本，不跑 JS、不开浏览器、不联网，安全面很小。

![一个 12 节点 draw.io 文件被重绘为博客用 balanced 细节（官方示例图）](/images/cathrynlavery-diagram-design-editorial-diagrams/import-drawio.png)

## 怎么装

它以插件/Skill 形式装进各个 Agent 宿主，各有一条命令：

```bash
# Claude Code
/plugin marketplace add cathrynlavery/diagram-design
/plugin install diagram-design@diagram-design

# Codex
codex plugin marketplace add cathrynlavery/diagram-design
codex plugin add diagram-design@diagram-design

# Factory Droid
droid plugin marketplace add https://github.com/cathrynlavery/diagram-design
droid plugin install diagram-design@diagram-design --scope user

# Pi
pi install https://github.com/cathrynlavery/diagram-design
```

Kiro、OpenCode、Cursor、Cline 等任何兼容 Agent Skills 的宿主，都可以把 `skills/diagram-design/` 软链/拷贝到对应 skills 目录。想直接改 `style-guide.md` 做深度定制，就 clone 仓库做 editable install；普通用户用市场安装即可，profile 存在 `~/.diagram-design/profiles/` 升级不丢。

装好之后直接用自然语言：

```
"给我的应用画个架构图：前端、后端、数据库、Redis 缓存。"
"给我一个四象限，按影响力 vs 工作量摆 Q2 的项目。"
"画一个带 token 刷新（401 时）的 bearer 调用时序图。"
```

导出 PNG/SVG 用 `/export-diagram`（PNG 通过 Playwright 光栅化，2× 默认；一次性 `pip install playwright && playwright install chromium`）。

![Loop / 飞轮：带共享中枢和虚线回写（2.0 新增，官方示例图）](/images/cathrynlavery-diagram-design-editorial-diagrams/loop.png)

## 适合谁，不适合谁

**适合：**
- 经常写技术文章、方案、PPT，受够了 Mermaid/默认 AI 出图风格的开发者和技术博主；
- 需要图表和品牌视觉统一、要给客户交付的咨询/独立开发者；
- 已经在用 Claude Code / Codex / Pi，想把"出图"并进现有 Agent 工作流的团队；
- 有大量历史 draw.io / Mermaid 图，想批量升级视觉质量的人。

**建议先等等 / 注意边界：**
- 它明确**不该**被滥用：快速 unicode 文本图、纯列表、前后对比（该用表格）、单个方块"图"——README 直接说这些不如写一句话；
- PNG 导出依赖 Playwright/Chromium，纯离线无 Node/Python 环境只能用 HTML/SVG；
- 品牌 onboarding 要抓你的公网，本地内网/未上线站点得手动贴 token；
- 它是"设计系统 + 生成规范"，不是交互式绘图 GUI，想拖拽微调的人仍需在 Figma 里用导出的 SVG 收尾。

## 结论

diagram-design 切中的是一个真实而普遍的痛点：**AI 能写代码、能写文章，但随手画的图总是"一眼 AI"**。它的解法不是堆更多图形，而是把一套经过编辑验证的设计纪律——克制的用色、4px 网格、语义化 token、静态优先、渐进加载、以及"敢删"的减法——固化成 Agent 能严格执行的 Skill。再加上品牌自动匹配和 draw.io/Mermaid 重绘，它实际上把"出一张能放进正式材料的图"的成本从半小时压到了一句话。

如果你每天都在和技术文档、架构图、咨询幻灯片打交道，这个 Skill 值得装进你的 Agent 试一轮。

项目地址：<https://github.com/cathrynlavery/diagram-design>
在线画廊：<https://cathrynlavery.github.io/diagram-design/>