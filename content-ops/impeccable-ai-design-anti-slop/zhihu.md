# 实跑 62 条规则：这个 9.9 万 Star 的项目，想在提交前消灭「AI 味界面」

用任何 AI 编码助手做前端，如果不额外给设计指导，输出会高度趋同：紫蓝渐变与青色发光的深色页、奶油色配纤细衬线标题的浅色页、圆角卡片套卡片、标题上方的小胶囊标签、Inter 字体全家桶。这类跨模型、跨项目反复出现的默认审美，社区称为 AI slop。它不报错、能运行，但一眼就是"AI 做的"，缺少品牌和设计判断。

pbakaus/impeccable 针对的正是这个问题。它把自己定义为"编码 Agent 的设计词汇表"（design vocabulary for your coding agent），由 jQuery UI 作者 Paul Bakaus 创建，脱胎于 Anthropic 官方 skills 仓库里的 frontend-design skill。截至本文约 99,438 Star、5,881 Fork，Apache-2.0；npm 包 v4.8.0，检测引擎为独立 Rust 二进制 v0.1.18（仓库约 26 万行 Rust、430 个 .rs 文件）。

我克隆了仓库，实际运行了检测器的规则列表，通读了 PRODUCT.md、DESIGN.md、README 和 crate 结构。这篇不谈玄学审美，重点拆解它的三个可验证机制：命令词汇、确定性检测、以及"一份 skill 派生 20 种 Agent 工具"的工程结构。

## 一、它不是提示词合集，而是词汇表 + 评审员 + 检测器

安装入口是 Node 生态的一行命令：

```bash
npx impeccable install
```

安装器探测本机的 AI 编程工具（官方支持列表约 20 种：Claude Code、Cursor、Codex CLI、GitHub Copilot、Devin、Replit Agent、Gemini CLI、Grok Build、OpenCode、Google Antigravity、Kiro、Trae、Rovo Dev、Qoder、Mistral Vibe、Pi、Hermes Agent、DeepSeek Harness、Veto 等），选择项目级或全局安装，并在支持的工具里挂载 design hook。Node 只在 `npx` 安装阶段需要；skill 实际运行依赖的是随包分发或首次下载到 `~/.impeccable/bin/` 的自包含引擎二进制。

初始化后在 Agent 里使用斜杠命令（Codex 用 `$impeccable`）：

```text
/impeccable init
/impeccable critique the pricing cards
/impeccable bolder the pricing cards
/impeccable audit
```

系统由三层组成：

![24 个设计命令的五类分工](COMMANDS)

1. **Steer（精确指挥）**：`bolder`、`quieter`、`distill`、`colorize`、`typeset`、`layout`、`animate`、`delight`、`overdrive`。关键不是命令名本身，而是每个命令都要求指定**具体目标**（"the pricing cards"），并加载针对这一个动作的 playbook，把"make it pop"这类不可执行的自然语言换成有方向、有对象的编辑请求。
2. **Review（评审）**：`critique` 是基于可用性启发式的打分式 UX 评审并排序修复项；`audit` 面向可访问性、性能、主题、响应式，产出 P0–P3 分级。这一层可以使用 LLM 判断。
3. **Finish / Live / Plan**：`polish`、`harden`（错误态、i18n、溢出、边界）、`adapt`、`optimize`、`onboard` 负责收尾；`live` 在浏览器里选中元素热切换变体并写回源码；`shape`/`init`/`document`/`extract` 负责 UX 规划与设计系统沉淀。合计 24 个（第 24 个 `craft` 是已弃用别名）。

官方反复强调的用法原则是**窄目标**：单组件就近细看胜过对整页走马观花。

## 二、上下文先行：PRODUCT.md 与 DESIGN.md

命令能给出一致建议，靠的是先把"事实"固化。`/impeccable init` 读取代码，只追问无法推断的信息（受众、用途、约束），写入 `PRODUCT.md`；`/impeccable document` 把现有视觉系统写入 `DESIGN.md`，后续所有命令读取这两份文件。

仓库自身的 PRODUCT.md 很能说明它的产品立场：用户是"已经知道 AI 生成 UI 有质量问题、来找实际方案"的人，因此不做问题科普；品牌人格是 expert / decisive / editorial，禁用"might、could、consider、perhaps"这类对冲措辞。DESIGN.md 则是一套名为 neo kinpaku 的 token 系统：金箔色与铜绿色两个锚点落在暖黑漆面上，颜色用 OKLCH 表达，并注明这些值必须与站点 CSS 逐字一致。也就是说，它用自己的产品实践"网站必须通过自己的反套路检测"这条原则。

## 三、62 条确定性规则：我实际跑了一遍

检测器是整个项目里最适合工程化落地的部分：它**不调用 LLM、不需要 API Key**，是本地确定性规则。实跑 `npx . detect --list-rules` 确认共 62 条（部分标注 advisory），可粗分为四类：

![62 条规则的四大分类](RULES)

**1）风格套路（slop tells）**，用来识别跨模型趋同的默认审美，例如：

- `ai-color-palette`：紫/品红渐变、深底青色，单条渐变即可判定；
- `overused-font`：Inter、Roboto、Fraunces、Geist、Plus Jakarta Sans、Space Grotesk 等被过度使用的字体；
- `gradient-text`（装饰性渐变文字）、`side-tab`（卡片单侧粗彩边，README 称其为最易识别的 AI 特征）、`nested-cards`（卡片嵌套）、`dark-glow`/`radial-halo`/`radial-spotlight-glow`（零偏移彩色光晕与径向聚光）；
- `cream-palette`（反射性选择的奶油/米色背景）、`italic-serif-display`、`hero-eyebrow-chip`、`kicker-above-heading`；
- `pulsing-dot`、`blinking-cursor`、`marquee`、`bounce-easing`、`shape-assembled-illustration`（基础几何形拼贴的占位插画）等装饰性"伪鲜活"元素。

**2）可用性与排版硬伤**：`low-contrast`、`gray-on-color`、`tiny-text`、`undersized-ui-text`、`cramped-padding`、`skipped-heading`、`heading-rhythm`、`tight-leading`、`line-length`、`text-occlusion`、`first-viewport-column-overflow`、`all-caps-body`、`justified-text` 等。

**3）节奏与系统一致性**：`monotonous-spacing`、`flat-type-hierarchy`（相邻字号差小于 1.25 倍即判字阶太平），以及 `design-system-font/color/radius/font-size`，检查是否绕开设计 token 随手写值。

**4）运行时问题**：`broken-image`、`script-error`、`content-hidden-at-rest` 等，这些只有在页面真实渲染后才能判定。

规则给出了合理的逃生口：品牌字体可以加值白名单：

```bash
npx impeccable ignores add-value overused-font Inter --reason "Brand font"
```

也可以在单个文件里用注释关闭：

```html
<!-- impeccable-disable overused-font: exported brand doc -->
```

这避免了"规则真理化"——刻意使用某个套路的品牌不会被工具绑架。

## 四、三种接入点：hook、CLI/CI、浏览器扩展

同一引擎有三种运行方式，工程意义不同：

![检测器的三种运行方式](DETECTOR)

**Agent design hook 是默认推荐路径。** 它在 Agent 每次编辑 UI 文件后自动扫描，并在 Agent 宣布完成之前把发现回灌。README 的判断很直接：没有 hook，检测器只在有人记得运行时才运行，而绝大多数 slop 正是这样进入代码库的。目前 Claude Code、Cursor、Codex、GitHub Copilot、Grok Build、Hermes Agent 支持 hook，安装器负责写入；Codex 需要在 `/hooks` 里再批准一次，Grok Build 需要 `/hooks-trust`，Hermes 上以插件形式启用（`hermes plugins enable impeccable-design-hook`）。

**CLI 不依赖 Agent，可进 CI：**

```bash
npx impeccable detect src/                   # 只扫源码：模式类规则
npx impeccable detect http://localhost:5173  # 扫渲染页：对比/字号等规则
npx impeccable detect --json .              # 机器可读
npx impeccable detect --github src/          # GitHub Actions 注解
npx impeccable detect --list-rules           # 列规则
```

退出码是明确的契约：`2` 表示发现问题、`1` 表示目标无法扫描、`0` 表示通过，因此可以直接作为流水线门禁。源码（JSX/TSX）只能跑静态模式规则，低对比、小字号等需要真实布局的规则必须指向 dev server URL。

**浏览器扩展**把相同发现以 overlay 叠在任意网页上，适合做设计走查，也能审查非本人的页面。

## 五、Live 模式与"一份源、多端分发"架构

`/impeccable live` 在运行中的 dev server 上叠加选择层：点选元素、选择方向后热替换多个变体，接受后写回本地源码，支持 Vite、Next、SvelteKit、Astro、Nuxt 与纯 HTML。它明确只允许作用于本地 checkout，禁止注入生产站点或为其削弱 CSP；文案类修改可选用 `package.json` 的 `impeccable:manual-edit-validate` 钩子以用户权限校验，属于对"AI 直接改源码"风险的克制设计。

架构层面值得一提的是分发方式：维护者只在 `skill/` 写一份权威 skill（`SKILL.src.md` + reference + agents + hermes-plugin），Rust 侧的 `xtask`、`bundle`、`wasm` 等 crate 构建出 `.claude/`、`.cursor/`、`.agents/`、`.github/`、`.gemini/`、`.grok/`、`.hermes/`、`.trae/` 等各 Agent 原生目录，而不是为每个工具维护一套分叉提示词。工作产物落在 `.impeccable/`，其中 `config.json`、`design.json`、`surfaces/*.md`、`critique/*.md` 等共享产物建议入库，截图、缓存、live 会话状态走 gitignore。团队可用 git submodule 钉版本，再 `npx impeccable link` 分发 skill。

遥测上它区分两类请求：开始新设计时从 impeccable.style 拉取视觉方向目录的请求即使关闭遥测也会发生；被匿名记录的只是"展示了哪些方向、选了哪个"，用于目录学习，项目名、代码、PRODUCT.md 不上传，可用 `npx impeccable telemetry off`、`DO_NOT_TRACK=1` 或配置关闭。

## 六、边界与适用判断

几个需要客观说明的点：

1. **最强场景是迭代已有界面**，而不是从零生成新页面（官方明确标注 build new 是更难的模式，可先生成高保真 comp 再对码实现，应用类界面仍直接写代码）。
2. **62 条规则覆盖的是可判定的信号，不是审美本身**；`critique` 的 LLM 判断是独立的另一层，最终设计责任仍在人。
3. **规则会与真实品牌冲突**：刻意的奶油色、Inter、侧边强调都需要 ignores，否则工具会持续误报。
4. **20 种工具的接入深度不一致**：Copilot VS Code 扩展只装 skill 不装 hook，Trae 装后需重启，各类工具的全局目录和信任机制也不同。
5. 近 10 万 Star 是 2025 年 11 月开源后约一年、踩中 AI 编码普及与"反 slop"情绪双重风口的结果；对没有 UI 的纯后端项目没有价值。

## 结语

Impeccable 的核心主张可以归纳成一句话：**AI 界面的平庸，多数时候不是模型能力不足，而是指挥语言太模糊、质量闸门缺位。** 它用设计动词替代"高级一点"，用 PRODUCT/DESIGN 文件对齐上下文，再用一个不依赖模型、可进 CI、可挂在每次 Agent 提交上的确定性检测器兜底。如果你正在用 AI 写前端，最小可行的试用路径是：`npx impeccable install` → 同意 hook → `/impeccable init` → 对一个你最有信心的组件运行 `/impeccable critique`，再用 `npx impeccable detect http://localhost:5173` 看静态规则会报出什么。

项目地址：https://github.com/pbakaus/impeccable ，官网与文档：https://impeccable.style/docs ，Apache-2.0 协议。文中规则清单基于本地实跑的 v0.1.18 引擎，共 62 条，后续版本以官方为准。
