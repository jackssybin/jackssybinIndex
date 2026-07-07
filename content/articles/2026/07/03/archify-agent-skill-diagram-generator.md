---
title: "聊两句就画一张架构图：拆开 tt-a1i/archify 这个 agent skill"
url: "/articles/2026/07/03/archify-agent-skill-diagram-generator/"
date: "2026-07-03T14:00:00+08:00"
lastmod: "2026-07-03T14:00:00+08:00"
description: "Archify 是给 Claude / Codex CLI / opencode 用的一个 agent skill：用自然语言描述系统，生成单文件 HTML 里的一张 SVG 图，支持深浅色切换、4× 原生光栅化和双主题 SVG 导出。这篇拆到源码级：JSON IR、五种渲染器、生成后 checker，以及它和 Mermaid / draw.io / Excalidraw 的边界。"
tags: ["Agent Skill", "架构图", "Diagrams as Code", "Claude", "开源项目"]
topic: "AI 工具"
topicSlug: "ai-tools"
layout: article
contentType: article
---

![封面](/images/archify-agent-skill-diagram-generator/cover-zhihu.png)

先说个具体的场景。

你正在写一份技术方案评审文档，需要一张架构图：React 前端调 Node API，Postgres 做主库，Redis 挡在前面做缓存，JWT 鉴权，CDN 卡在 CloudFront 上。三年前你会打开 draw.io，拖二十个盒子，连三十条线，配一套自己觉得还行的颜色，导一张 PNG。半小时。改一个组件位置，再花十分钟。

这几年常见的替代是 Mermaid。你写一段 DSL，浏览器渲一张图。快，但那张图长得像所有别人写出来的 Mermaid：一个自动布局把方块摆成网格，语义颜色你不管就没有，安全边界你不写就没有——它是**流程图**，不是**架构图**。

`tt-a1i/archify` 是一条第三路：把画图这件事完全塞进 agent。你在 Claude Code 或者 Codex CLI 里用大白话描述系统，它调用一个叫 archify 的 skill，输出一个**单文件 HTML**——里面是一整张 SVG，深浅色一键切，导 PNG / JPEG / WebP 都是浏览器 4× 原生光栅化，SVG 甚至自带两套主题变量，贴进 GitHub README 后跟随读者的 `prefers-color-scheme` 自动切色。

我把仓库拉下来，通读了 [`README.md`](https://github.com/tt-a1i/archify)、[`archify/SKILL.md`](https://github.com/tt-a1i/archify/blob/main/archify/SKILL.md)、五套 schema、CHANGELOG 从 2.0 一路到 2.8——这篇是我读完之后的完整判断：**它到底解了什么问题，谁应该现在装，谁再等一等，以及它跟 Mermaid、draw.io、Excalidraw 的真实边界在哪里**。

## 反例：那些"看着不错"的 AI 画图工具，问题出在哪

先摆一个大多数 AI 画图工具的通病。

它们的产品叙事都是"聊天式作图"：你说"给我画一张 SaaS 架构"，它给你一张图。听着丝滑，实际用下来往往是：

- **布局是自动的**。dagre、ELK 之类布局引擎会把节点摊成一个均匀网格。八个组件的图看起来跟四十个组件的图布局逻辑一样，节奏感是没有的。
- **语义色是没有的**。所有盒子是同一种蓝，你说"鉴权用玫红"，它下一次生成又忘了。
- **边界画不出来**。VPC、安全组、PII 边界这些"包住一组节点"的概念，Mermaid 靠 `subgraph`，draw.io 靠手拖，两者都在自动布局里塌成一坨。
- **改一个组件位置就整张图漂**。你说"把 Redis 挪到左边"，坐标系里所有节点跟着重排。

真实的架构图不是这样看的。真实的架构图里，`Auth Provider` **就应该**画在 AWS 区域框外面（因为它是 Auth0 或者 Cognito 边缘服务），`S3` **就应该**画在 CloudFront 下方（因为读者从上到下扫图会自然理解成 "CDN 回源到 S3"）。**布局本身就是信息**。

Archify 的 [ROADMAP.md](https://github.com/tt-a1i/archify/blob/main/ROADMAP.md) 里有一段话把这件事说得很明白：

> 自动布局 (dagre / elk-js) 对 archify 是一条死路。审美——Auth Provider 特意画在 AWS 区域外面、S3 特意放在 CloudFront 下方来暗示服务关系、30/50 padding 的安全组边界、legend 嵌在死角、总结卡片——**这些布局决策本身就是产品**。

Archify 的选择是让**布局回到 LLM 手里**：Claude 决定坐标、Claude 决定颜色语义、Claude 决定边界——archify 只提供五套渲染器 + schema 校验 + 一套 CSS 变量主题系统，把机械的事挡下来，把审美判断留给 Claude。

## 机制：从大白话到"能贴到任何地方的一张图"

archify 的核心是一条六段流水线。

![生成管线](/images/archify-agent-skill-diagram-generator/01-pipeline.png)

自然语言 → JSON IR → Renderer → SVG + HTML → Checker → 导出。每一段的分工：

**自然语言 / Mermaid 输入。** 用户在 chat 里描述系统，也可以粘一段 Mermaid。SKILL.md 明确写：粘 Mermaid 不走 parser，只读结构，然后**从零重新布局**。作者做过一个专门的实验（`experiments/v3-mermaid-validation/`），结论是 Mermaid + archify CSS 并不比原生 Mermaid 明显更好看——所以 Mermaid 只是输入方言，不是渲染目标。

**JSON IR。** 中间格式是 JSON，不是 YAML。原因写在 ROADMAP 里：LLM 生成 YAML 的"看着对、解析错"比例高，缩进敏感、行内流式 `pos: [40, 80]` 和 `sublabel: "Redis :6379"` 都会撞 YAML 的引号陷阱。JSON 有明确的解析规则、原生 `JSON.parse`、成熟的 JSON Schema 校验，`git diff` 友好度也够用。

**Renderer。** 五套渲染器：`architecture` / `workflow` / `sequence` / `dataflow` / `lifecycle`。每一套有自己的 schema（`archify/schemas/*.schema.json`）和 example（`archify/examples/*.json`），LLM 照着 example 抄字段结构比自己想着写靠谱。

**SVG + HTML。** 输出是**一个 HTML 文件**。里面是内联 SVG、约 19 KB 的嵌入 JS、一个 Google Fonts `<link>`。生成物**零运行时依赖**——你可以用邮件附件发出去，也可以直接 `open x.html`，浏览器打开就能切主题、复制到剪贴板、导出图片。渲染器本身需要 `npm install`（ajv 做 schema 校验），但产物不需要。

**Checker。** `scripts/check-render-output.mjs` 是一道最终闸门，检查生成的 HTML 是否只有一个 SVG 块、SVG 坐标是不是有限值、有没有意外生成两点斜线箭头、箭头有没有穿过图例。这是从 v2.7 加上的——因为视觉审查发现连线会穿过 legend，作者补了一整套 render-output-checks 测试。

**导出。** 五个动作：复制 PNG 到剪贴板、下载 PNG / JPEG / WebP / SVG。这是从 v2.0 开始迭代到 v2.8 的重头戏。

archify 完整能画的图有五种，选错模式就选错了工具：

![五种图表](/images/archify-agent-skill-diagram-generator/02-modes.png)

- **architecture**：系统组件、云资源、数据库、安全边界。
- **workflow**：泳道、审批、CI/CD、工具调用、runbook。有 phase header、group、exception lane，还有 `mainPath` lint 帮你检查主路径。
- **sequence**：调用链、缓存回源、异步 trace、参与方之间的先后顺序。
- **dataflow**：埋点管线、ETL/ELT、PII 边界、数仓同步、下游消费方。
- **lifecycle**：状态机、Agent Run 生命周期、Failed / Cancelled / Expired 终态。

## 一个非显然的工程判断：为什么导出流水线值得看

大多数画图工具的"导出 PNG"是从 canvas 拿一次 `toDataURL`。Archify 的做法比这精致一档：

1. 克隆 SVG，内联 host `<style>`。
2. 解析当前主题变量，写入 clone 的 `:root` 规则。
3. clone 的 `width` / `height` 设为 **`4 × viewBox`**。
4. 用 `XMLSerializer` 序列化。
5. 浏览器**按 4× 分辨率原生光栅化矢量**，canvas 按自然大小绘制。

关键点是第 3 和第 5 步：**不是位图放大**。位图放大是先按 1× 画到 canvas 再拉伸，糊。原生光栅化是浏览器直接在 4× 分辨率下画一次矢量，视网膜屏、演示幻灯、打印全部真正清晰。

如果目标分辨率超过浏览器 canvas 上限（每家浏览器不一样，Chrome 大概 32k×32k，Safari 更小），自动降到 3× 或 2×。JPEG 会显式补背景色（无 alpha），PNG 保留透明。

SVG 导出也做了一件狠事：**双主题自持**。同一个 `.svg` 文件里嵌了两套 CSS 变量 + `@media (prefers-color-scheme)` 规则，直接贴到 GitHub README，读者切深浅色，图跟着切。不用两张 PNG 用 `<picture>` 包起来。

这两件事都是从 v2.3 / v2.4 的迭代里读出来的。v2.0 的时候是"2× 位图放大"（糊），v2.1 加了倍数选择器（还是放大），v2.3 才改成 4× 原生光栅化——所以现在没有倍数选择器：永远选浏览器能稳定生成的最高清晰度。这是一个减法决策。

## 和它的邻居们比：架构画图这条赛道谁在哪里

Archify 不是从零开始的项目。它 fork 自 [Cocoon-AI/architecture-diagram-generator](https://github.com/Cocoon-AI/architecture-diagram-generator) v1.0（只有深色主题、只画架构、无导出），从 2.0 到 2.8 累计做了这些事：加浅色主题、加导出流水线、加剪贴板、加打印样式、加类型化渲染器、加 schema 校验、加生成后 checker、加 trace 动效……

放到当前赛道里看：

![对比表](/images/archify-agent-skill-diagram-generator/03-comparison.png)

几点判断：

**vs Mermaid。** Mermaid 是**通用图表 DSL**，覆盖面广，社区大。archify 覆盖面窄（就五种技术图），但每一种都是"有 schema、有 layout 检查、有 mainPath lint"的 opinionated 版本。判断标准：如果你只是想画一张能贴的技术图，Mermaid 足够；如果你想让 LLM 每次画出的架构图都有相同的语义色、相同的边界表达、相同的信息密度，用 archify。

**vs draw.io / Excalidraw。** 这俩是 GUI 工具，人手拖节点。archify 是"聊天式作图"，节奏差一个量级。判断标准：一次性架构图 + 需要精确排版，用 draw.io；反复迭代 + 需要 LLM 一起改的，用 archify。

**vs beautiful-mermaid / Mermaid 11.14 新主题。** 这是 archify roadmap 里承认的直接竞品——"更好看的 Mermaid"这条路已经被 lukilabs/beautiful-mermaid 占了（8.1k stars、15 套主题、Tokyo Night / Catppuccin / Nord / Dracula），Mermaid 11.14 官方也加了 Neo / Redux / Hand Drawn。archify 的判断是：**跟你抢主题跑不赢**，护城河得建在别处——所以做了 JSON IR、五种类型化渲染器、schema 校验和生成后 checker。这个判断是清醒的。

**vs Cocoon v1（archify 的祖先）。** Cocoon v1 只有深色主题、只画架构、只有一次 SVG 输出，没有主题切换、没有导出、没有 schema 校验。archify 是它的 2.x 完整重构，视觉语言（配色、网格、卡片布局、JetBrains Mono）完整继承。

## 上手：五分钟画出你的第一张 archify 图

archify 装在哪儿取决于你用哪家 agent。作者把 skill 打成了标准目录（`archify/SKILL.md`），一个 `archify.zip` 通吃 Claude、Codex CLI、opencode。

```bash
# Claude Code CLI（全局）
unzip archify.zip -d ~/.claude/skills/

# Codex CLI（全局）
unzip archify.zip -d ~/.agents/skills/

# opencode（全局）
unzip archify.zip -d ~/.config/opencode/skills/

# 装完在 skill 目录跑一次 npm install（ajv 做 schema 校验）
cd ~/.agents/skills/archify && npm install
```

**Claude.ai 直接上传 zip：** Settings → Capabilities → Skills → + Add，把 `archify.zip` 传上去，打开开关就行。

`npm install` 不装也不会挂——schema 校验会跳过（layout 检查还在跑）。产物 HTML 本身零依赖，一定能用。

装完之后一个具体的例子。假设你要画开头那张 SaaS 架构：

```
用 archify 画一张架构图：
- React 前端
- Node.js/Express API
- PostgreSQL 主库
- Redis 缓存
- JWT 鉴权
- CloudFront CDN，S3 静态资源
```

粘进 Claude Code，回车。Claude 会调用 archify skill，生成一个 `web-app.html`。浏览器打开：

![深浅色切换](/images/archify-agent-skill-diagram-generator/theme-dark.png)

右上角两个按钮，主题切换（快捷键 <kbd>T</kbd>）和 Export 菜单（快捷键 <kbd>E</kbd>）。Export 菜单里有五个动作：

![导出菜单](/images/archify-agent-skill-diagram-generator/export-menu.png)

复制到剪贴板可以直接粘进 Slack、飞书、Notion、GitHub issue、Figma。下载 SVG 拿去 Figma / Illustrator 里接着编辑也行——所有样式都内联在 SVG 里。

改图跟聊天一样：

```
把 Redis 挪到左边
鉴权那条路径高亮
加个 Kafka
Postgres 换成 MySQL
```

Claude 收到 prompt，改 JSON IR，重新调 renderer，一个新的 HTML 出来。

## 五种图各画一个：什么样的表述能画出什么样的图

archify 最容易踩的坑不是"画得不好看"，是**选错了图种**。以下五个 prompt 每个对应一种 renderer，每个都有仓库里可打开的 rendered 示例可对照。

**Architecture — 画组件和它们怎么连。**

```
用 archify 画一张架构图：
- CloudFront CDN
- API Gateway
- Lambda（Node.js）
- DynamoDB
- S3 存静态资源
- Cognito 做鉴权
```

**Workflow — 画技术流程 / 审批 / 工具调用。**

```
用 archify 画一个 workflow：
用户提交请求 → Agent 规划 → 需要审批时进入 Approval Gate → 调工具 → 记录 trace → 返回结果
```

![Workflow 示例](https://raw.githubusercontent.com/tt-a1i/archify/main/docs/assets/archify-workflow.png)

**Sequence — 画调用顺序。**

```
用 archify 画一个 sequence diagram：
用户打开页面，前端请求 API，API 校验 JWT，读取 Redis，缓存未命中则查 Postgres，返回结果并写入 trace。
```

![Sequence 示例](https://raw.githubusercontent.com/tt-a1i/archify/main/docs/assets/archify-sequence.png)

**Data Flow — 画数据资产怎么走。**

```
用 archify 画一个 data flow：
Web 和 Mobile 上报埋点，Edge API 收集事件，Consent Gate 过滤 PII，Kafka 承接事件流，
Warehouse 存分析表，Feature Store 做每日特征，Dashboard 和 ML Model 消费下游数据。
```

![Data Flow 示例](https://raw.githubusercontent.com/tt-a1i/archify/main/docs/assets/archify-dataflow.png)

**Lifecycle — 画状态怎么变。**

```
用 archify 画一个 lifecycle diagram：
Agent Run 从 Queued 进入 Planning，再进入 Executing 和 Reviewing。
需要人工确认时进入 Needs Approval，缺少输入时进入 Blocked；
工具失败可以 Failed 后重试，用户取消进入 Cancelled，超时进入 Expired，成功则进入 Completed。
```

![Lifecycle 示例](https://raw.githubusercontent.com/tt-a1i/archify/main/docs/assets/archify-lifecycle.png)

## 谁应该现在装，谁再等一等

**现在装：**

- 你天天在 Claude Code / Codex CLI / opencode 里干活，图会反复改。
- 你写技术方案 / 内部 wiki / 架构评审时经常需要"一致风格的技术图"。
- 你想在 GitHub README 里贴一张跟着读者主题切换的 SVG。
- 你在写 agent 相关内容，想画调用链、状态机、审批流。

**再等一等：**

- 你的图是**一次性的、有精确坐标要求的**——比如需要严格 pixel-perfect 的白板笔记、UI 稿，用 Figma / Excalidraw 更合适。
- 你团队里没人用 LLM 编码 agent——archify 的价值一半在 skill 一半在 SVG 产物，只用产物有点浪费。
- 你需要**图表种类特别多**（甘特图、桑基图、饼图、地理图……）——archify 只有五种技术图，Mermaid 覆盖面更广。

## 需要自己验一次的几件事

我读源码 + 读文档 + 看 changelog 得出来的判断，还有几件事需要装了之后自己验：

1. **Schema 校验的错误消息够不够 actionable。** 作者的承诺是错误路径带 element id（比如 `/nodes/3 (id/label: "router") must NOT have additional properties`）和数值阈值——但真实使用里 LLM 生成的 JSON 会踩多少种失败，我没跑过完整的 fuzz。
2. **4× 光栅化在你的浏览器上稳定不稳定。** Chrome / Firefox / Safari 的 canvas 上限不一样，超大图会自动降级，但降级阈值触发的时机需要自己看。
3. **`mainPath` lint 的召回率。** v2.7 加的这个 workflow 主路径检查，理论上能发现"happy path 走反了"或者"漏了一条边"——但只在作者放的 example 上跑通，你自己的复杂流程会不会有假阴性，装了之后需要在真实业务图上验证。
4. **Mermaid → archify 的转换质量。** SKILL.md 里的 Mermaid 映射表看着合理，但作者的实验结论是"auto-parser 那条路已经砍掉"，走的是 prompt 判断——所以稳定性取决于 Claude 每次都读得懂结构。这条不是硬承诺。

以上四条不算减分项，是"值得跟踪、值得反馈"的边界。

## 一份可以直接抄回去的清单

看完这一篇如果你决定装 archify，把下面这份带走：

```
1. 下 archify.zip → 解压到你的 agent skills 目录
2. cd skill 目录 → npm install（可选，但推荐）
3. 在 Claude Code / Codex CLI 里说：「用 archify skill 画...」
4. 五种模式对应五种问题：
   architecture = 组件怎么连
   workflow    = 泳道流程
   sequence    = 调用顺序
   dataflow    = 数据管线 + PII 边界
   lifecycle   = 状态机
5. 生成 HTML 后打开：T 切主题，E 打开导出
6. 想改就聊：「把 X 挪到左边」「加个 Kafka」「Y 换成 Z」
7. 需要贴 GitHub README，导 SVG（双主题自持）
8. 需要发飞书 / Slack / Notion，Ctrl+C 复制到剪贴板
9. 需要用于打印 / 演示 / 设计稿，导 4× PNG
```

再列一张常见踩坑：

- **老版 Safari 复制到剪贴板变灰**：`ClipboardItem` 需要 Chromium / Firefox 127+ / Safari 16+，够老就用不了。改用 Download PNG。
- **WebP 菜单项变灰**：浏览器 canvas 不支持 `image/webp` 编码，选 PNG / JPEG 就行。
- **导出图字体不一致**：光栅上下文拿不到 Google Fonts，会用系统等宽字体（`ui-monospace` / Menlo / Consolas）回退。装了 JetBrains Mono 会自动用上，像素级一致。
- **npm install 卡住**：只影响 schema 校验，layout 检查还在跑。产物 HTML 一定能用。
- **Claude.ai Project Knowledge 上传 zip**：仅架构模式可用，因为 Projects 不执行代码，纯 prompt 驱动——workflow / sequence / dataflow / lifecycle 这些渲染器跑不了。

## 结语

Archify 走的是一条挺清醒的路：不跟 Mermaid 抢主题，不跟 draw.io 抢 GUI，把布局判断留给 LLM，把机械的事（schema 校验、layout 检查、生成后 checker、导出流水线）挡下来。它承认自己覆盖面窄，但在这五种技术图里做得比通用工具精细。

如果你已经把 agent 装进了日常工作流，Archify 是 5 分钟就能装、装完就能省半小时/张图的那种加法。如果你只是偶尔画一张图，可能用不上——但看一眼它的 ROADMAP 和 CHANGELOG，能看到一个真做产品判断的作者：v2.4 加了 4× 光栅化就把倍数选择器砍了，v2.5 加了 Mermaid 映射就明确说不做 parser，v2.7 视觉审查发现连线穿过 legend 就补了一整套 checker 测试。这种做法本身值得看。

仓库：<https://github.com/tt-a1i/archify>

在线落地页：<https://tt-a1i.github.io/archify/>
