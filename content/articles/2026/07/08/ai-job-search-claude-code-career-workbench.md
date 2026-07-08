---
title: "AI Job Search 教程：把 Claude Code 变成 drafter-reviewer 求职工作台"
url: "/articles/2026/07/08/ai-job-search-claude-code-career-workbench/"
date: "2026-07-08T13:00:00+08:00"
lastmod: "2026-07-08T13:00:00+08:00"
description: "MadsLorentzen/ai-job-search 用 9 个 slash 命令 + 两个 agent 把「找工作」拆成一条流水线：/setup 建档、/scrape 扫岗位、/rank 打分、/apply 起草-审稿-编译 PDF-过 ATS，最后 /outcome 归档。本文拆流水线、拆 drafter/reviewer 双 agent 结构、拆 PDF 视觉 + ATS 文本层双重验证循环，附 5 分钟接入指南和替换本地招聘门户的清单。"
tags: ["Claude Code", "AI 求职", "LaTeX", "自动化", "开源项目"]
topic: "AI 工作流"
topicSlug: "ai-workflow"
layout: article
contentType: article
---

![封面](/images/ai-job-search-claude-code-career-workbench/cover-zhihu.png)

# AI Job Search 教程：把 Claude Code 变成 drafter-reviewer 求职工作台

我最近想搞清楚一件事：如果我打算换工作，我到底希望 AI 帮我做什么？

一种答案是「让 AI 给我写简历」。这个答案的坏处是，它把 AI 用得太浅：写完你还是要自己看要求、自己判断要不要投、自己排简历、自己想面试怎么答。AI 只是替你把打字这一段抹掉了。

另一种答案是「让 AI 陪我跑完整个求职周期」。这就复杂多了，因为求职是一个多阶段流程——找岗位、评估匹配度、按岗位改简历和 cover letter、生成 PDF、检查 PDF 会不会被 ATS 系统抓坏、面试准备，最后还有跟踪结果并反过来校准评估标准。任何一个环节掉链子，整条链就白跑。

在 GitHub 上翻到 [`MadsLorentzen/ai-job-search`](https://github.com/MadsLorentzen/ai-job-search) 后，我意识到有人已经把这件事做完了——不是又一个「AI 简历生成器」，而是一个**围绕 Claude Code 搭起来的求职工作台**，把整套流程压成 9 个 slash 命令、两个协作 agent、一条自我验证的 PDF-ATS 循环。这篇文章拆三件事：

1. 这套流水线到底长什么样，为什么把 9 个命令拉出来比塞一个大 agent 更好；
2. `/apply` 里的 drafter-reviewer 双 agent 分离到底解决了什么问题；
3. 强制 PDF 视觉 + ATS 文本层双重验证的循环怎么运作、能挡住哪些「.tex 看着挺好」的坑。

顺带附一份 5 分钟上手清单和「换成中文招聘门户」的路径。

## 一、流水线：从 /setup 到 /outcome，9 个命令

先看骨架。仓库的核心是 `.claude/commands/` 目录下 9 个命令文件：

```
.claude/commands/
├── setup.md          # 建立你的候选人档案
├── scrape.md         # 扫多个招聘门户
├── rank.md           # 批量给新岗位打分排序
├── apply.md          # drafter + reviewer + PDF 双验证
├── outcome.md        # 记录申请结果、归档材料
├── expand.md         # 从 GitHub/Portfolio 补齐档案
├── upskill.md        # 分析技能差距并给学习计划
├── add-template.md   # 注册自定义 LaTeX CV 模板
├── add-portal.md     # 生成本地招聘门户 skill
└── reset.md          # 清档案 / 清素材
```

其中 `/setup`、`/scrape`、`/rank`、`/apply`、`/outcome` 是主流程，另外四个是辅助命令。整条流水线是这样跑的：

![Ai-Job-Search 5 步流水线](/images/ai-job-search-claude-code-career-workbench/01-pipeline.png)

每个命令都有明确的输入和输出：上一步的产物就是下一步的输入。

- **`/setup`**：三条路径任选。一是把 CV PDF、LinkedIn 导出、学位证、推荐信、过往申请材料丢进 `documents/`，命令自动读；二是在聊天里粘一份 CV；三是走一遍访谈问题。产物是 `CLAUDE.md` 里的候选人档案 + `.claude/skills/job-application-assistant/01-candidate-profile.md`。
- **`/scrape`**：对着 `.agents/skills/` 里配好的招聘门户 skill 跑抓取。仓库自带 5 个：`jobbank-search`、`jobdanmark-search`、`jobindex-search`、`jobnet-search`（丹麦四大门户）+ `linkedin-search`（国家无关）。抓完去重、跨轮追踪 seen jobs。产物是 `job_scraper/seen_jobs.json` + 一份候选清单。
- **`/rank`**：如果一轮 `/scrape` 扔回 30 个岗位你懒得挨个看，就 `/rank` 让它一次性打分。命令内部并行派多个 agent（默认每个 agent 处理约 5 个岗位），每个 agent 独立 fetch 岗位 URL、按同一份 rubric 打分（技术 / 经验 / 行为 / 职业方向），deadline 加急标，dead posting 直接标 expired。产物是 top-N 短单。
- **`/apply`**：主戏。传一个 URL 或者粘岗位描述，走完 drafter-reviewer 双 agent 流程，最终产物是一份编译过并做过 ATS 检查的 CV PDF + Cover Letter PDF。下面第二节详细讲。
- **`/outcome`**：投完之后追踪。把 CV、Cover Letter、岗位文本归档进 `documents/applications/<company>_<role>/`，写一份 `outcome.md`（面试进展 / offer / 拒信 / 沉默），更新 `job_search_tracker.csv`。积累够几条之后，`/outcome` 会提示你回过头再跑 `/setup`，用「真拿到面试」的岗位反推你的评估框架该怎么调。

四个辅助命令解决三种「顺手要做的事」：

- **`/expand`**：档案填完还嫌薄？让它爬你的 GitHub、portfolio、Kaggle、Google Scholar，把你显式没写但公开可见的技能扒回来，标注来源。
- **`/upskill`**：跑完一轮 tracker 或者对着某个具体岗位，问「我离这个岗位的差距是啥？该学什么？先学哪个？」生成一份带 web-search 来源的学习计划。
- **`/add-template`**：默认 CV 是 moderncv/banking 风格，Cover Letter 是自定义 `cover.cls`。你自己有一套 LaTeX 模板？`/add-template` 会先做一次强制 test compile 再注册进 `/apply`。
- **`/add-portal`**：这是个「地区无关化」的钩子。仓库自带的是丹麦门户，你在中国就跑 `/add-portal https://www.zhipin.com/...` 让它探测这个门户的搜索 URL、结果结构、访问规则，脚手架自动生成一个 CLI skill，跑一次 live query 验证再接进 `/scrape`。

我第一次读的时候还奇怪，为什么 rank 和 apply 要拆开——直接 apply 挑最高分的不就完事了吗？后来看代码里的注释才明白：`/rank` 只做**基于岗位描述的 triage 打分**，不做公司调研、不做 salary 查询、不派 reviewer。它是廉价的、快的、可以一次跑 30 个的。`/apply` 才是贵的、慢的、要独立起 reviewer agent 的。**用便宜的排序过滤，让昂贵的申请只花在 top N 上**——这是我第一次看到有人把 agent 的成本约束显式写进工作流里。

## 二、双 agent：drafter 写，reviewer 挑刺

`/apply` 是这个仓库最值得拆的一段。整段命令定义有 284 行，核心是一个 6 步流程 + 一个空 context 的 reviewer agent。

![Drafter-Reviewer 双 agent 结构](/images/ai-job-search-claude-code-career-workbench/02-drafter-reviewer.png)

左边 drafter 是主 agent：带着你的完整档案上下文、评估框架、写作风格、LaTeX 模板、既往 CV 和 Cover Letter 的样板。右边 reviewer 通过 `Agent` 工具起一个**独立空 context** 的新 agent，只从 prompt 里拿到岗位描述和 CV/CL 草稿正文，不许 Read 草稿文件（避免 reviewer 从磁盘再读一次浪费 token）。

流程：

```
Step 0  DRAFTER：解析 URL 或粘贴的岗位描述
Step 1  DRAFTER：对着 04-job-evaluation.md 打 5 维分（技能/经验/行为/位置/职业方向）
        + 可选 salary_lookup.py 查薪资分位
        向用户确认「继续起草吗？」
Step 2  DRAFTER：写 cv/main_<company>.tex + cover_letters/cover_<company>_<role>.tex
Step 3  REVIEWER：空 context 起 agent，做公司调研 + 读四份档案文件（01/02/03/04）
        + 挑刺，返回：
        - Part A: JSON 结构化 edits (old_string → new_string)
        - Part B: 叙述式反馈（missed keywords / company angle / reframing / tone）
Step 4  DRAFTER：按 Part A 精改（能直接 patch 的直接 patch），按 Part B 判断要不要动结构
        整个过程不重读 Step 1/2 里已经在 context 里的文件
Step 5  DRAFTER：lualatex 编 CV，xelatex 编 Cover Letter，读渲染出的 PDF 视觉检查
        循环修 LaTeX 直到 CV 正好 2 页、CL 正好 1 页、字体不回退、bullet 不孤行
Step 6  DRAFTER：pdftotext 抽文本层 → ATS 校对
        + 完整验证 checklist（事实核对 / 定制度 / 一致性 / LaTeX 质量 / ATS）
```

这段流程里我觉得最见工程功力的三个决定：

**第一，reviewer 从空 context 起。**如果 reviewer 复用 drafter 的 context，它会不自觉地被 drafter 已经写下的框架带跑——drafter 写的是什么它就跟着夸什么，或者只在细节上挑毛病。空 context 的 reviewer 得从头解析岗位、独立研究公司，才会挑出 drafter 完全没想到的角度（比如你把「机器学习」写进 skills 但岗位描述里全都是 "MLOps + feature store"，drafter 可能觉得意思差不多，空 context 的 reviewer 会直接标红）。

**第二，草稿内联传给 reviewer，不让它读文件。**看似小的优化实则关键：跨 agent 的 file read 会重复 token。让 reviewer 从 `<CV_DRAFT>...</CV_DRAFT>` 这样的 inline block 直接拿到内容，一次读一次，剩下的 token 预算全花在 WebSearch 公司调研和写反馈上。

**第三，reviewer 输出 Part A（JSON edits）+ Part B（narrative）。**Part A 是可以直接 apply 的机械 patch：`{"file": "...", "old_string": "...", "new_string": "..."}`。Part B 是判断题——比如「整个开头段太被动了，建议围绕你和岗位最强的一个 match 重构」。这样 drafter 就能自动 apply 掉一半反馈，剩下一半人为决策，效率和判断力都不丢。

作者在 workflow 顶部写了一段 **token-efficiency rules**（我抄一遍原文）：

- Never re-Read a file whose contents are already in your context from an earlier step.
- When dispatching the reviewer agent, pass draft content inline in the agent prompt rather than asking the agent to Read files you already have in memory.
- Run the full verification checklist exactly once, at the end.

这三条不是废话，是这个仓库和「让 AI 帮我写简历」类项目的分水岭。**多 agent 系统的失败 90% 在 context 管理，而不是在 prompt 写得好不好**。

## 三、别信 .tex：PDF 视觉 + ATS 双重验证循环

Step 5 是这个仓库最有价值的一段代码，也是我看过所有「AI 生成 CV」项目里唯一认真处理的一段。

![PDF 视觉 + ATS 双重验证循环](/images/ai-job-search-claude-code-career-workbench/03-pdf-ats-loop.png)

问题背景：**LaTeX 的分页决策是不可预测的**。同样一份 `.tex`，多加一行 bullet 可能就把最后一段挤到下一页；moderncv 的 `\cventry` 标题可能孤零零地被推到下页页首，正文 bullets 留在上一页；`cover.cls` 里的 `\lettercontent{}` 会吞掉 `\begin{itemize}` 的字体设置，让整段 bullets 从 Raleway 回退到默认 Computer Modern，看起来像换了一个人写的。

更狠的是 ATS：**招聘系统读的不是渲染出来的 PDF，而是 PDF 里嵌入的文本层**。LaTeX 可以静默地生成一份视觉完美、但文本层是 `(cid:*)` 乱码的 PDF；contact info 如果只挂在 `\faEnvelope` 这种 fontawesome 图标上，pdftotext 抽出来的就是 `Envelope` 字样，你的邮箱压根不在文本里。人事在 ATS 里搜 `@` 一无所获。

`/apply` 的解决办法是把编译 + 视觉检查 + 文本层校对当作**强制不可跳过的一步**，写死在 workflow 里：

```
Step 5 mandatory: 编译 + 视觉检查 PDF，直到全部通过
  ├── lualatex 编 CV（modern MiKTeX 上 pdflatex 会因 fontawesome5 font-expansion 报错）
  ├── xelatex 编 Cover Letter（cover.cls 需要 fontspec）
  ├── 读 PDF 视觉检查：
  │   ├── CV 正好 2 页（不是 1 也不是 3）
  │   ├── 没有 orphaned \cventry —— 标题不许出现在页底、bullets 甩到下一页
  │   │   兜底：在每个 \cventry 前放 \needspace{5\baselineskip}
  │   │   救场：\enlargethispage{2-3\baselineskip}
  │   ├── Cover Letter 正好 1 页，signature 与正文在一起
  │   └── Cover Letter bullets 字体没回退（不能 \begin{itemize} 直接放 \lettercontent{} 里）
  └── 有问题 → 打回 Step 5 起点重编，最多 N 轮

Step 6: pdftotext 抽文本层 + ATS 校对
  ├── 抽出的文本无 (cid:*) 标记、无 � 替换字符
  ├── 邮箱和电话作为 literal 明文出现（不是只挂在图标上）
  ├── 阅读顺序与视觉顺序一致（多列布局是重灾区）
  └── 岗位关键词覆盖：能诚实覆盖的加进 experience bullets，
      真的没有的就承认 gap，绝不 keyword stuffing
```

`03-writing-style.md` 里有一条我很喜欢的规则叫「interview backtrack test」：给某个 bullet 加了强度之后，问自己「如果面试官追问，我能不能不带犹豫地解释这条？」如果得说「哦其实我意思是……」那就是过界了。命令里还写死：如果 Step 1 的 experience match 打分低于 50，Step 2 之前要先警告用户「这个岗位需要大幅重构框架，你确定继续吗？」——**不留悄悄地把简历吹圆的空间**。

对我来说这套做法的意义在于：它让 AI 生成的 CV **能过 ATS**，而不是只在 PDF 预览里好看。用过太多「AI 简历」工具，产出的 PDF 打开挺漂亮，扔进 workday 或者 lever 就被吃掉一半信息。这仓库把 PDF 层和 ATS 层的检查全都自动化了，是我见过最诚实的做法。

## 四、5 分钟接入指南

如果你想试，这是最短路径。前置：Claude Code CLI、Python 3.10+、Bun、TeX Live（Linux）/ MacTeX / MiKTeX，以及可选的 `poppler-utils`（Linux）/ `brew install poppler`（macOS）用来跑 ATS 检查。

```bash
# 1. Fork + clone
gh repo fork MadsLorentzen/ai-job-search --clone
cd ai-job-search

# 2. 装 5 个门户 CLI 依赖
for portal in jobbank-search jobdanmark-search jobindex-search jobnet-search linkedin-search; do
  (cd .agents/skills/$portal/cli && bun install)
done

# 3. 起 Claude Code，跑 /setup
claude
> /setup
```

`/setup` 有三条路径，任选：

- **Documents 模式**：把 CV PDF、LinkedIn 导出、学位证、推荐信、过去投的申请扔进 `documents/`（子目录 README 有布局说明），命令自动扫。这条路是幂等的，档案加新东西了随时可以重跑。
- **粘贴模式**：直接在 chat 里粘一份完整 CV 文本。
- **访谈模式**：走一遍问答，一步步填。

跑完之后，`CLAUDE.md`、`.claude/skills/job-application-assistant/01-candidate-profile.md`、`02-behavioral-profile.md` 里的 `[PLACEHOLDER]` 都会被换成你的实际信息。

日常流程：

```bash
> /scrape                              # 或加焦点：/scrape data science
# 命令返回一批候选岗位 + fit 快评
> /rank                                # 或 /rank --top 10
# 得到 top-N shortlist
> /apply https://jobindex.dk/job/12345 # 或 /apply <粘岗位描述>
# 走 6 步流程，最终得到 cv/main_<company>.tex + cover_letters/cover_<company>_<role>.tex
# 以及编译好并过完 ATS 检查的两份 PDF
> /outcome                             # 投出去之后归档 + 记 tracker
```

## 五、换成中文招聘门户：/add-portal 的用法

仓库自带 5 个 portal 但都在丹麦圈子里。想接入 BOSS 直聘、拉勾、猎聘、智联，走 `/add-portal`：

```bash
> /add-portal https://www.zhipin.com/web/geek/job?query=data+scientist&city=101010100
```

`/add-portal` 的做法：先 WebFetch 探测这个门户的搜索 URL 模式、结果页 DOM 结构、访问规则（有没有反爬、要不要登陆、能不能匿名 fetch），然后从既有 5 个门户 skill 的结构脚手架出一份 `.agents/skills/<portal>-search/`，包括 CLI 骨架、TypeScript 结构、测试目录。**强制跑一次 live query test** 确认脚手架跑得起来，然后把新 portal 接进 `/scrape` 的 orchestrator。

这里有个诚实的注意事项：不是每个中国门户都能匿名爬。BOSS 直聘、猎聘、拉勾都做了不同程度的反爬和登陆墙。如果 test query 失败，`/add-portal` 会直接停在测试步骤，让你人肉判断是要接 cookie，还是换个可以匿名搜的门户（比如 GitHub Jobs 的 clone、一些技术岗位聚合站）。这个行为本身就是一种保护——**不给你搭一个跑不通的空壳 skill**。

## 六、我从这个仓库学到的三件事

第一，**多命令 + 单档案** 是一个可复制的架构模式。整个仓库的所有命令共享同一份候选人档案（`CLAUDE.md` + `01-candidate-profile.md`），每个命令按需读，档案本身随 `/setup` `/expand` `/outcome` 演进。这个模式我看完之后立刻想套到别的领域：读书笔记（`/collect` 建书单、`/absorb` 读完存重点、`/link` 拉出主题脉络、`/write` 生成博客草稿）、代码 review（`/scan` 扫仓库、`/rank` 排优先级、`/review` 深评审、`/log` 归档）。

第二，**贵/便宜命令分开** 是一种成本控制。`/rank` 30 个岗位一起跑，只看文本；`/apply` 一次一个，独立起 reviewer agent。这不是 AI 的能力问题，是工程决策——你得替 AI 决定什么时候可以省 token，什么时候必须多花。

第三，**验证要挂在真实产物上，不挂在中间态**。作者不是让 drafter 承诺「我写的 LaTeX 一定 2 页」，而是**编出来 PDF 亲眼看**。不是让 drafter 保证「关键词都覆盖了」，而是**用 pdftotext 抽出来 grep**。任何 AI 工作流走到最后都要挂一个客观的、可运行的验证——这才是它区别于「AI 帮我写点东西」的分水岭。

## 参考

- 主仓库：<https://github.com/MadsLorentzen/ai-job-search>
- Claude Code：<https://claude.com/claude-code>
- LaTeX moderncv：<https://ctan.org/pkg/moderncv>
- poppler pdftotext：<https://poppler.freedesktop.org/>

如果你正处在换工作的窗口期，或者只是想找一个把 Claude Code 用得最深的项目学结构，这个仓库值得 fork 下来跑一遍 `/setup`。半小时就能感受到 drafter-reviewer 循环的价值。
