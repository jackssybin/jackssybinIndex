---
title: "9.9 万 Star：这个项目给 AI 程序员配了个「设计总监」，专治一眼假的 AI 味界面"
slug: "impeccable-ai-design-anti-slop"
date: 2026-11-01
draft: false
categories: ["开源项目", "AI工具"]
tags: ["开源", "Impeccable", "AI设计", "前端", "反AI味", "Claude Code", "Cursor", "设计系统", "Agent Skill"]
cover: "/images/impeccable-ai-design-anti-slop/cover.png"
description: "pbakaus/impeccable 是 jQuery UI 作者 Paul Bakaus 开源的「编码 Agent 设计词汇表」：一句 npx impeccable install 装进 Claude Code、Cursor、Codex、Copilot、Gemini CLI 等 20 来种 AI 编程工具，用 24 个设计命令（bolder/quieter/polish/critique/audit 等）精确指挥 AI 改设计，再用一个无 LLM、无 API Key、62 条确定性规则的「AI 味检测器」在提交前拦截紫色渐变、Inter 全家桶、卡片套卡片、侧栏色边等典型 slop。Rust 写的引擎约 26 万行，Apache-2.0，支持命令行/CI/浏览器扩展三种检测方式，还能在浏览器里 live 热替换设计变体。本文克隆仓库、实跑检测器拆解它的命令体系、规则清单、PRODUCT/DESIGN 上下文机制和实时迭代模式，也说清它最适合改已有界面、99K Star 的时间线与遥测边界。"
---

你让任何一个 AI 编程助手"做个落地页"，如果不加任何设计指导，出来的东西几乎长得一样：奶油色背景、纤细的衬线大标题配一个斜体词、两个胶囊按钮、一排圆角卡片里塞着扁平插画，或者——深色模式下——紫到蓝的渐变、青色发光、毛玻璃卡片。

模型不同、项目不同，"AI 味"却惊人地一致。英文社区管这叫 **AI slop**（AI 泔水）：不是不能用，而是一眼就能看出"这是 AI 默认吐出来的"，专业度和品牌感全无。

最近这个问题有了一个极受欢迎的答案：[Impeccable](https://github.com/pbakaus/impeccable)。截至本文 **99,438 Star、5,881 Fork**，Apache-2.0 协议，核心引擎用 Rust 写成（仓库约 26 万行 Rust、430 个源文件）。作者不是无名之辈——**Paul Bakaus，jQuery UI 的创造者**，项目也起源于 Anthropic 官方的 frontend-design skill。

我把仓库克隆下来、把它的检测器真跑了一遍、读完了产品与设计文档。这篇讲清楚它到底是什么、怎么用、为什么能拿到近 10 万 Star，以及它的边界在哪。

## 一、它的本质：给你和 AI 之间，装一套「设计词汇表」

一句话定位（来自仓库描述）：**The design vocabulary for your coding agent**——你编码 Agent 的设计词汇表。

它解决的核心矛盾是：人类说"让它更有设计感一点""make it pop""高级一点"，AI 只能靠猜，猜错了再来一轮，越改越糊。Impeccable 把模糊的审美指令，变成了一组**精确、有明确定义、指向具体操作对象**的命令。

安装简单到一行：

```bash
npx impeccable install
```

安装器会自动探测你机器上的 AI 编程工具（Claude Code、Cursor、Codex CLI、GitHub Copilot、Devin、Replit Agent、Gemini CLI、Grok Build、OpenCode、Trae、Kiro、Qoder、Hermes Agent 等，官方列了 20 种左右），让你选装在当前项目还是全局，然后重载工具，在 Agent 里跑一次 `/impeccable init` 即可（Codex 上是 `$impeccable init`）。

之后的交互长这样：

```text
/impeccable bolder the pricing cards      # 让定价卡片更大胆
/impeccable critique the onboarding flow  # 给新手引导流程做打分评审
/impeccable quieter the landing page      # 让太吵的落地页收敛
/impeccable polish settings               # 上线前最后一遍打磨
/impeccable harden checkout               # 补错误态/国际化/溢出边界
```

README 里有张对比图特别能说明问题：同一个模型（Fable 5.1）、同一个需求——"利古里亚海岸一家 14 间房的家庭旅馆"。**不用 Impeccable**，AI 给出的是标准的"得体默认值"：奶油色页面、纤细衬线标题、胶囊按钮、扁平矢量插画；**用了 Impeccable**，页面围绕一张真实图片展开——夜晚从海面看到的悬崖上的旅馆，配上凝缩字体的奶油色和朱红色标题。前者正确但毫无记忆点，后者像一个有主张的设计总监做的。

## 二、24 个命令：从"指挥"到"评审"到"收尾"

它不是一堆零散提示词，而是一套有分工的命令系统，按用途分五类：

![Impeccable 的 24 个设计命令地图](/images/impeccable-ai-design-anti-slop/commands.png)

- **Steer（引导方向）**：`bolder` 放大胆、`quieter` 做收敛、`distill` 删冗余、`colorize` 给灰白界面加颜色、`typeset` 修字体层级、`layout` 修间距节奏、`animate` 加过渡反馈、`delight` 加个性、`overdrive` 直接上 shader、弹簧物理和滚动驱动特效。每个命令都对应一份"playbook"，并且作用于你指定的**单一目标**（"the pricing cards"），而不是泛泛改全页。
- **Review（评审）**：`critique` 对照可用性启发式做**打分制**设计评审并排出该先修什么；`audit` 查可访问性、性能、主题、响应式，发现按 P0（阻断）到 P3（打磨）分级。
- **Finish（收尾）**：`polish` 上线前最后一遍；`harden` 补错误态、i18n、溢出和边界情况；`clarify` 重写含糊文案；`adapt` 适配各种屏幕；`optimize` 修加载和渲染性能；`onboard` 设计首次使用流程和空状态。
- **Iterate live（实时迭代）**：`live` 在浏览器里选中元素、热切换多个设计变体，满意了直接写回源码（支持 Vite、Next、SvelteKit、Astro、Nuxt 和纯 HTML）；`generate` 自动批量生成某个元素的变体。
- **Plan & setup（规划与建档）**：`shape` 在写代码前规划 UX；`init` 生成 `PRODUCT.md`；`document` 把你现有的视觉系统沉淀进 `DESIGN.md`；`extract` 把重复模式抽成设计系统。

用得勤的命令还能钉成独立快捷方式，比如 `/impeccable pin audit` 之后直接打 `/audit`。

一个关键设计理念：**窄目标胜过宽扫射**。官方反复强调"挑一个组件、就近细看评审"，效果远好于一句话扫整页。

## 三、上下文机制：让 AI 先懂你的产品和设计

命令为什么能给出不跑偏的建议？因为它要求先建立两份"事实文件"，之后每条命令都会读取：

- **`PRODUCT.md`**：`init` 时通过读你的代码 + 只问它推断不出来的问题（产品给谁用、要做什么、有什么约束）生成。仓库里自带的 PRODUCT.md 把目标用户写得极准——"已经知道 AI 生成 UI 有质量问题、来找实际方案的人，不需要被科普问题本身"。
- **`DESIGN.md`**：`document` 命令把你现有的视觉系统（颜色 token、字体、圆角等）固化下来，保证后续改动不跑偏品牌。它自己的 DESIGN.md 就是范本：一套叫"neo kinpaku（新金箔）"的体系，金箔色和铜绿色两个品牌锚点落在暖黑漆面上，颜色全部用 OKLCH 表达。

这种"先立产品事实和设计事实，再下指令"的做法，本质是把资深设计师开工前的调研步骤，变成了 Agent 的强制上下文。

## 四、最硬的部分：62 条确定性规则的「AI 味检测器」

如果说命令是"方向盘"，那检测器就是"刹车"，而且它是整个项目里工程含量最高、最容易集成进现有流程的部分。

它跑起来**不需要大模型、不需要 API Key**——是一个 Rust 编译的自包含引擎二进制（随 skill 分发或首次下载到 `~/.impeccable/bin/`），用 62 条确定性规则去识别 AI slop。我实跑了 `npx impeccable detect --list-rules`，规则覆盖四大类：

![检测器的 62 条规则分四大类](/images/impeccable-ai-design-anti-slop/rules.png)

**1. AI 风格套路（slop tells）**——最有趣的一类，精准到让人会心一笑：
- `ai-color-palette`：紫/品红渐变、深底青色，最经典的 AI 配色；
- `overused-font`：Inter、Roboto、Fraunces、Geist、Plus Jakarta Sans、Space Grotesk——这些字体被用得太多、已经无法传达个性；
- `gradient-text`：渐变标题字（装饰而非表意）；
- `side-tab`：卡片一侧那道粗彩色边——README 称它为"最容易辨认的 AI 生成 UI 特征"；
- `nested-cards`：卡片套卡片；`dark-glow`/`radial-halo`：零偏移彩色光晕和径向聚光；`marquee` 自动滚动跑马灯；`pulsing-dot` 装饰性脉冲点；`blinking-cursor` 假打字光标；`shape-assembled-illustration` 用一堆基础几何形拼出来的占位插画；还有 `cream-palette`（奶油色默认审美）、`italic-serif-display`（斜体衬线点缀）、`hero-eyebrow-chip`（标题上方那个小胶囊标签）等等。

**2. 可用性与排版硬伤**：`low-contrast` 低对比、`gray-on-color` 彩底灰字、`tiny-text` 文字过小、`cramped-padding` 拥挤内边距、`skipped-heading` 跳过标题层级、`tight-leading` 行距过紧、`line-length` 行长失控、`text-occlusion` 文字遮挡、`first-viewport-column-overflow` 首屏横向溢出。

**3. 节奏与系统一致性**：`monotonous-spacing` 到处一个间距值、`flat-type-hierarchy` 标题和正文字号差不到 1.25 倍、`design-system-font/color/radius/font-size` 检查你是否在设计系统定义的 token 之外随手写值。

**4. 运行时问题**：`broken-image`、`script-error`、`content-hidden-at-rest`（静止状态下内容被隐藏）等，这类必须扫描渲染后的真实页面才能发现。

规则还分严重级别，部分标注 `(advisory)`（建议性，不阻断）。它对品牌字体也留了口子：可以把 Inter 加进白名单——`npx impeccable ignores add-value overused-font Inter --reason "Brand font"`；也能在单个文件里用注释关掉某条规则。

## 五、三种姿势运行：Agent 钩子、CI/终端、浏览器

检测器真正发挥作用，靠的是嵌入工作流的三种方式：

![检测器的三种运行方式与典型命令](/images/impeccable-ai-design-anti-slop/detector.png)

- **Agent 设计钩子（最推荐）**：安装时勾选后，每当你的 Agent 编辑一个 UI 文件，钩子就自动扫描，在 Agent 宣布"搞定"之前把问题塞回去。README 有句话很到位："没有钩子，检测器只会在有人记得运行它时才运行"——而大多数 slop 正是这么溜上线的。Claude Code、Cursor、Codex、Copilot、Grok Build、Hermes Agent 支持，安装器自动配。
- **终端 / CI（不需要 Agent）**：
  ```bash
  npx impeccable detect src/                   # 扫源码目录
  npx impeccable detect http://localhost:5173 # 扫渲染后的页面（用本机 Chrome/Edge）
  npx impeccable detect --json .              # 机器可读输出
  npx impeccable detect --github src/          # 输出 GitHub Actions 注解
  ```
  退出码 `2` 表示发现问题、`1` 表示目标无法扫描，可以直接接进 CI 门禁。源码（JSX/TSX）只跑模式规则，对比、字号这类需要渲染的规则则要扫 URL。
- **浏览器扩展**：Chrome 扩展把同样的检测结果以浮层形式叠在任何网页上——包括别人的网站，可以拿来"考古"任意产品的 AI 味。

## 六、Live 模式：在浏览器里边看边改，改完写回源码

`/impeccable live` 是体验上最惊艳的部分。它在你正在跑的 dev server 上加一层浮层，你点选任意元素、选一个方向（更大胆/更安静/换配色……），它就地热替换多个变体，你挑中一个，它把结果**写回你的源代码**，而不是只停留在浏览器里。

这把"和设计师来回改稿"压缩成了"自己在页面上翻牌子"。安全上也有考量：live 模式只改本地 checkout，明确警告不要注入已部署站点、不要为它削弱生产环境 CSP；应用文案改动时会以你的权限运行 `package.json` 里可选的 `impeccable:manual-edit-validate` 校验脚本。

## 七、工程与生态：一份源，派生到 20 种工具

为什么它能同时适配这么多 AI 编程工具？看仓库结构就明白了：维护者只在 `skill/` 目录写**一份权威的设计词汇表**，构建脚本（Rust 的 xtask + bundle/wasm 等 crate）把它**派生**成各工具的原生分发——`.claude/`、`.cursor/`、`.agents/`、`.github/`、`.gemini/`、`.grok/`、`.hermes/` 等目录都是生成物，而不是为每个工具单独维护一套提示词。引擎本身编译成自包含二进制甚至 WASM。

团队还可以用 **git submodule** 把版本钉死，全员共享同一套设计标准；工作文件放在 `.impeccable/`，其中 config、design.json、surfaces、critique 等共享产物建议入库，截图、缓存、运行态则进 `.gitignore`。`/impeccable doctor` 能排查失效的上下文文件和坏掉的钩子。

遥测也说得比较透明：开始一个新设计时会从 impeccable.style 拉取一组视觉方向（关遥测也照拉），真正被记录的只是"展示了哪些方向、你选了哪个"这种匿名信息，用来让方向目录学习什么有效；你的项目名、代码、PRODUCT.md 从不上传，可用 `npx impeccable telemetry off`、`DO_NOT_TRACK=1` 或配置项关闭。

## 八、边界：它不是万能的

为了不写成软文，几个需要说清楚的点：

1. **它最擅长改"已经存在"的界面**。官方明确说最强场景是指着一个页面或组件迭代；从零生成新页面是更难的模式（虽然支持，还能先生成高保真 comp 再对着写代码）。
2. **它不替你做审美决策，而是给你精确的语言和一个挑错的审查员**。`critique` 里的打分和 LLM 判断仍是"另一层"，62 条确定性规则只管可量化的问题；好不好看的最终责任还在人。
3. **规则是"强信号"不是"真理"**。比如奶油色、Inter、侧边色边在多数场景下是 AI 套路，但某些品牌刻意如此时，必须用 ignores 白名单，否则会和你的设计系统打架。
4. **工具体系碎、适配有差异**：Codex 要手动在 `/hooks` 批准、Grok Build 要 `/hooks-trust`、Hermes 要 `hermes plugins enable impeccable-design-hook`、Copilot 扩展不带钩子、Trae 装完要重启——20 种工具的接入深度并不完全一致。
5. 近 10 万 Star 是 2025 年 11 月中开源后约一年的积累，且踩中了"AI 编程爆发 + 所有人都受够了 AI 味界面"两个风口，热度本身不等于它对纯后端、无 UI 项目有用。

## 九、上手

```bash
npx impeccable install      # 自动探测并装进你的 AI 编程工具，记得同意装 hook
# 重载工具后，在项目根目录：
/impeccable init            # 生成 PRODUCT.md
/impeccable document        # （可选）沉淀现有 DESIGN.md
/impeccable critique <某个组件>   # 先从一个组件的评审开始
npx impeccable detect http://localhost:5173   # 不给 Agent 用时，直接 CLI 扫页面
```

文档在 [impeccable.style/docs](https://impeccable.style/docs)。

## 结语

Impeccable 真正的洞察是：**AI 生成界面的平庸，往往不是模型能力问题，而是"沟通语言"和"质量闸门"同时缺失。** 你没法用"高级一点"指挥出好设计，也没法靠事后肉眼 review 拦住所有套路。

它用一套设计师的词汇表解决前者，用一个不上 LLM、可进 CI、能挂在每次 AI 提交上的确定性检测器解决后者——再配上浏览器里翻牌子式的 live 迭代和一份源派生 20 种工具的工程架构。jQuery UI 作者出手，做的确实是"基础设施"而不是又一个提示词合集。

如果你已经在用 Claude Code 或 Cursor 写前端，又总觉得产出的页面"能用但土"，花十分钟装上、先让它 `critique` 你最得意的一个组件，大概率会被它说中几处。

> 项目地址：[https://github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable) ｜ 官网：[impeccable.style](https://impeccable.style)
> 协议：Apache-2.0 ｜ 引擎 v0.1.18 / npm v4.8.0 ｜ 数据基准：2026-11-01
>
> 本文基于仓库源码、PRODUCT.md/DESIGN.md、检测器 `--list-rules` 实跑结果撰写，62 条规则以官方最新版为准。
