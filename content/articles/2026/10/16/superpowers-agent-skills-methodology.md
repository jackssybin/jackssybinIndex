---
title: "30 万 Star 的 Superpowers：我通读源码，看它怎么把 Claude Code 驯成靠谱工程师"
slug: "superpowers-agent-skills-methodology"
date: 2026-10-16
draft: false
categories: ["开源项目", "AI工具"]
tags: ["开源", "Claude Code", "Agent Skill", "TDD", "工作流", "Hermes", "AI编程"]
cover: "/images/superpowers-agent-skills-methodology/workflow.png"
description: "obra/superpowers 是一年涨到 30 万 Star 的编码 Agent 方法论插件：15 个可组合 skill 加一个 SessionStart 钩子，强制 AI 先头脑风暴、再写规格与计划、用子 Agent 执行、TDD、评审。本文克隆 v7.0.0 源码、实跑启动钩子，拆解它的注入机制、七步工作流、跨 16 种 Agent 外壳的适配，以及那个反直觉的 94% PR 拒绝率。"
---

你给 Claude Code 或 Cursor 下一句「帮我做个待办应用」，它最常见的反应是什么？几秒沉默，然后开始疯狂写文件，半小时后甩给你一个能跑、但不是你想要的东西。你想要的它没问，你没说的它替你拍了板，测试？它说「建议补充」。这不是模型不够聪明——它太想立刻「动手帮忙」了，而软件工程里最贵的错误，恰恰都发生在动手之前。

[obra/superpowers](https://github.com/obra/superpowers) 想治的就是这个病。它不是一个带聊天框的新产品，也不是某个框架的 SDK，而是一套写给编码 AI 的「纪律」：15 个可组合的 skill（技能文件），加一个在每次会话开始时自动注入的引导，让你的 Agent **不允许**跳过「先问清楚、写规格、写计划、测试先行、同行评审」这套流程。作者是 Jesse Vincent（网名 obra，Prime Radiant 团队），2025 年 10 月建仓，到我写文时刚好一年，已经 **30 万 Star、2.68 万 Fork**，版本迭代到 v7.0.0，并且被 Anthropic 收进了 Claude 官方插件市场。

我把仓库完整克隆下来，通读了 `README.md`、`AGENTS.md`、全部 15 个 skill 和各平台的钩子源码，还在这台机器上实跑了它的启动脚本。这篇文章讲清楚四件事：它到底靠什么机制「管住」一个大模型、那七步工作流每步在干什么、跨 16 种 Agent 外壳（包括我自己跑的 Hermes）是怎么适配的，以及——谁该现在装、谁应该再等等。

## 一个核心心智模型：纪律是一段被强制加载的文字

理解 Superpowers 最快的方式，是先破除一个误解：它几乎没有代码。整个插件零第三方依赖，核心资产是一堆 Markdown 文件，每个 skill 就是一个目录里的 `SKILL.md`，最长的也不到 5000 英文单词。真正让这套 Markdown「生效」的，是两个朴素但被打磨到极致的机制。

**第一，会话开局强制注入。** 插件通过各 Agent 外壳的 `SessionStart` 钩子，在你每次打开会话（startup）、清空上下文（clear）、压缩上下文（compact）时，把 `using-superpowers` 这个总纲 skill 的全文塞进模型的第一句话里。我在本地直接执行了它的钩子脚本 `hooks/session-start`，它的输出是一段 JSON，核心字段是注入给模型的上下文，开头是这样的：

```text
<EXTREMELY_IMPORTANT>
You have superpowers.
Below is the full content of your 'superpowers:using-superpowers' skill ...
```

我特意用空环境变量模拟了「启动时 PATH 是坏的」这种边界情况去读它的脚本，发现一个很说明设计态度的细节：脚本连 `dirname`、`cat` 都不调用——因为 Claude Code 曾经在 PATH 尚未修复时就批量执行启动钩子（issue #43127），一旦钩子报错，纪律就静默读不进来了。于是它用 bash 参数展开自己切路径、用 `$(<file)` 内置语法读文件、用纯字符串替换做 JSON 转义。**一个「保证规则永远在场」的脚本，自身必须在最恶劣的环境里也不失败**——这是整套项目工程气质的缩影。

**第二，用强祈使语气对抗模型的「合理化」。** 注入的总纲里没有一句「你可以考虑」，全是这种文字（摘自 `skills/using-superpowers/SKILL.md`）：

```text
If you think there is even a 1% chance a skill might apply
to what you are doing, you ABSOLUTELY MUST invoke the skill.
IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE.
This is not negotiable.
```

更妙的是它专门列了一张「红旗对照表」，把模型给自己找借口时的内心独白预先写死、再逐条怼回去：

![Superpowers 用一张「想法 vs 现实」对照表，预先堵死模型想跳过流程时的合理化借口](/images/superpowers-agent-skills-methodology/redflags.png)

「这只是个简单问题」「我先看下代码再说」「这 skill 太重了」——每一条模型最容易冒出来的自我说服，右边都跟着一句「问题也是任务，先查 skill」「skill 会告诉你该怎么看，先查」。这背后是一个很清醒的认知：**大模型不守规矩，很少是因为不知道规矩，而是因为它太擅长现场编一个听起来很合理的理由去破例。** Superpowers 做的，是把这些理由提前枚举、逐一封死。

## 七步工作流：把一个热情但没判断力的 junior 关进轨道

装完之后你什么都不用记，skill 会根据你要做的事自动触发。README 里把标准流程拆成七步，我对照源码逐个看了它的触发条件和产物：

![Superpowers 的七步强制工作流：从头脑风暴到收尾，每一步都有明确产物和关卡](/images/superpowers-agent-skills-methodology/workflow.png)

**1. brainstorming（头脑风暴）——在写任何代码之前。** 这是 v7.0.0 完全重写过的一个 skill，也是整个系统的闸门。它的第一条规则就反直觉：Agent 不许上来提方案，先问自己「我到底知道用户想要什么、以及为什么吗？」，然后向你抛出一个关于具体场景的开放问题（「你是在哪个瞬间希望有这个东西的？」）。它还会主动给你台阶——「如果你想跳过提问直接开干，说一声就行」。小改动在对话里达成一致即可，真正的项目则要产出一份**设计文档**，并派一个全新的子 Agent 假装自己是要接手实现的人，读完设计后列出「我还有哪些地方看不懂、必须问」，把会改变成品的问题一次性抛回给你。

**2. using-git-worktrees（隔离工作区）。** 设计批准后，它不在你当前分支上直接改，而是开一个 git worktree、跑一遍项目初始化、确认现有测试是干净的绿，再动工。目的是让「开工前基线就是坏的」这种坑无所遁形。

**3. writing-plans（写计划）。** 把工作切成一个个「一次动作、一个可检查结果」的任务。v6.4.2 对这个 skill 做过一次很值得说的瘦身：早期版本会把每个任务的完整代码都写进计划，结果某些强模型在「写计划」阶段就忍不住把整个项目实现了；新版要求计划只记录**决策**——函数签名、测试断言、规格里的值，算法主体只在这些信息不足以确定实现时才写。发布说明里给了实测数据：新计划耗时降到原来的四分之一、token 约三分之一，而在 Sonnet 5 的植错探针上 9/9 全部执行成功。

**4. subagent-driven-development / executing-plans（执行）。** 这里有个成本与严谨度的权衡：最彻底的做法是**每个任务派一个全新的子 Agent** 实现，主 Agent 在每个任务后做两阶段评审（先查是否符合规格、再查代码质量），上下文彼此隔离，Agent 因此能连续自主工作一两个小时而不跑偏；省钱的做法则在当前会话里顺序执行所有任务、最后统一评审一次。

**5. test-driven-development（测试驱动）。** 强制红—绿—重构：先写一个会失败的测试、亲眼看它失败、写最小实现、亲眼看它变绿、再提交。它甚至写明「先于测试写出来的实现代码要删掉」，并把「就这一次跳过 TDD 吧」直接标注为危险的合理化念头。

**6. requesting-code-review（代码评审）。** 任务之间按计划评审，问题按严重程度上报，**严重问题会阻断进度**，不许带病前进。

**7. finishing-a-development-branch（收尾）。** 全部任务完成后核对测试，给你合并 / 开 PR / 保留 / 丢弃几个选项，并清理 worktree。

需要强调的是，这七步不是提示词里的「建议」。总纲里明确写了优先级：流程类 skill 优先于实现类 skill；用户的直接指令（CLAUDE.md / AGENTS.md / 当面要求）高于一切，skill 高于模型默认行为——也就是说，**只有你本人能让它破例**。

## 出错时它还给自己留了「黑匣子」

这套系统有个很打动我的设计：它知道自己一定会有失灵的时候——某个 skill 不该触发却触发了、该触发却沉默、Agent 无视计划、或者 token 烧得离谱。于是它专门做了第十五个 skill，`diagnosing-superpowers`。

你只要对 Agent 说「复盘一下这次会话里 superpowers 哪里出了问题」，它会去读会话记录（transcript），用**带行号的证据**报告实际发生了什么，还能在你授权后把一份脱敏（scrubbed）的记录打包，方便你提 issue。一个靠「行为塑形」吃饭的项目，把「如何调查自己塑形失败」也做成了标准流程，这种自省的闭环在同类项目里非常少见。

## 一套 Markdown，喂给 16 种 Agent 外壳

最能体现工程含量的，是它的跨平台适配。README 里列了 16 种安装方式：Claude Code、Codex App/CLI、Cursor、Gemini CLI、GitHub Copilot CLI、Grok Build、Kimi、OpenCode、Devin、Antigravity、Factory Droid、Qwen Code、Pi、Muse，以及 **Hermes Agent**——没错，就是我现在运行的这个 Agent 框架，安装命令是 `hermes plugins install obra/superpowers --enable`。

难点在于：这些外壳的钩子机制并不统一。我翻了仓库里的适配层，三种典型路径都有：

- **有标准 SessionStart 钩子的**（Claude Code、Cursor、Copilot、Muse 等）：走 `hooks/session-start` 脚本，但不同平台读取的 JSON 字段名还不一样——Claude 读嵌套的 `hookSpecificOutput.additionalContext`，Cursor 读下划线风格的 `additional_context`，Copilot/Muse 读顶层的 `additionalContext`。脚本里有大段注释解释如何只输出当前平台消费的那一个字段，因为 Claude 会把两种字段都读进去导致重复注入。
- **没有启动钩子事件的**（如 Antigravity）：改为在插件清单里把每个 skill 的描述暴露给模型，而 `using-superpowers` 的描述写成「任何会话开始时都要使用」，靠描述诱导模型自己在第一轮加载它。发布说明记录了在 agy 1.3.1 上跑了 12 次验证：「做个 react 待办」会在写代码前触发头脑风暴，失败的测试会在改动前触发系统化调试。
- **有原生插件运行时的**（Hermes、OpenCode、Pi）：各写一小段适配代码。以 Hermes 为例，`.hermes-plugin/__init__.py` 注册全部 15 个 skill，并通过 `pre_llm_call` 钩子在第一轮把总纲注入用户消息。源码注释里还留着两个踩坑记录：`register_skill` 必须传 `pathlib.Path`，传字符串会让 Hermes 静默禁用整个插件；只注册路径会导致每个 skill 的描述为空、模型无从选择，所以现在会从 frontmatter 里读出描述一起注册。

看这些适配代码的收获比看 README 大得多：你能直观体会到「一次编写、到处运行」在 Agent 生态里是个多奢侈的愿望，而 Superpowers 选择用最笨也最可靠的办法——为每个外壳写经过真实会话验证的胶水层。

## 反常识的一面：94% 的 PR 拒绝率

如果你打算给它提 PR，先读根目录的 `AGENTS.md`，开篇第一句就是：**这个仓库有 94% 的 PR 拒绝率，而几乎所有被拒的 PR 都来自没读规范的 AI Agent。**

维护者的处理方式相当强硬：几小时内关闭「slop PR」（垃圾 PR），还会公开评论「This pull request is slop that's made of lies」。文件里给 AI 贡献者列了六条硬规矩，包括必须读完整 PR 模板、先搜新旧重复 PR、确认问题真实存在、确认改动属于核心库、**必须在 PR 里披露自己用的模型、Agent 外壳、版本和全部已装插件**、以及提交前把完整 diff 给真人过目。PR 一律面向 `dev` 分支，零第三方依赖，拒绝任何「为了符合 Anthropic 文档而重构 skill 措辞」的合规性改动——因为核心 skill 的文字是大量真实会话调优出来的，改一句话都要拿 eval 证据说话。

这个 94% 和 30 万 Star 放在一起，构成了一种少见的姿态：**越是靠提示词影响 AI 行为的项目，越要严防 AI 用无证据的文字反过来稀释自己。** 它对贡献质量的苛刻，和它对模型「不许合理化破例」的苛刻，其实是同一种世界观。

另外两点如实交代：项目带一个**默认开启的轻量遥测**——仅在你使用头脑风暴的可选可视化伴侣时，从官网拉一个带版本号的 logo，不含任何项目、提示词或模型信息，设置 `SUPERPOWERS_DISABLE_TELEMETRY=1` 即可关闭，同时也尊重 Claude Code 自身的遥测开关。它背后有商业实体（Prime Radiant）提供企业支持，但核心库是 MIT 许可、完全开源。

## 谁该现在装，谁该再等等

我的判断，按人群分：

**建议立刻装的：** 天天用 Claude Code / Cursor / Codex 写真实项目、又受够了 Agent「自作聪明直接写」的人；团队里有人想把「先设计、测试先行、强制评审」固化成默认动作、而不是靠口头提醒的技术负责人；以及像我一样跑多 Agent 工作流、希望子 Agent 也守纪律的人。它零依赖、可随时卸载，试错成本几乎只有一点 token——流程变长意味着每轮对话会多消耗一些 token、多几次确认。

**可以再等等的：** 只是用 AI 做一次性脚本、问答、快速原型的人，七步流程对你是负担而非保护（头脑风暴 skill 自己也承认可以随时跳过）；用小众或老旧 Agent 外壳的人，先去 README 确认你的平台是否有经过验证的适配；以及对任何额外 token 开销和默认遥测都敏感的环境——记得先设好关闭变量。

最后是一个方法论层面的提醒：Superpowers 的价值不在于那 15 个 skill 写了什么金科玉律，而在于它示范了一件 2026 年越来越重要的事——**约束大模型，最有效的杠杆往往不是更强的模型，而是一段在正确时机被强制读到、且预先封死了所有借口的文字。** 你完全可以读一遍它的 skill，把其中「红旗对照表」「计划只记决策不抄代码」「先看测试失败」这几条搬进自己的 CLAUDE.md。哪怕不装插件，这笔学费也已经值回票价。

项目地址：https://github.com/obra/superpowers ，MIT 许可，一年 30 万 Star，值得你亲自翻一遍那 15 个 Markdown。
