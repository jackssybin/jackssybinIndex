---
title: "把 Claude Code 变成求职工作台：9 个命令 + 双 agent + 强制过 ATS"
author: "jackssybin"
digest: "MadsLorentzen/ai-job-search 用 9 个 slash 命令 + drafter-reviewer 双 agent + PDF 视觉/ATS 文本层双重验证，把「投简历」拆成一条可复用的流水线。附 5 分钟上手清单。"
cover: "/root/workspace/jackssybinIndex/content-ops/ai-job-search-claude-code-career-workbench/media/cover-wechat.jpg"
theme: "newsroom"
tags: ["Claude Code", "AI 求职", "LaTeX", "自动化"]
---

# 把 Claude Code 变成求职工作台：9 个命令 + 双 agent + 强制过 ATS

![封面](/root/workspace/jackssybinIndex/content-ops/ai-job-search-claude-code-career-workbench/media/cover-wechat.jpg)

在 GitHub 上翻到 **`MadsLorentzen/ai-job-search`** 之后我发了会儿呆——**这不是又一个 "AI 帮我写简历" 项目，而是一整套围绕 Claude Code 搭起来的求职工作台**。它把「投简历」这件事拆成了 9 个 slash 命令，让两个 agent 分工写和审，最后强制把 PDF 编出来亲眼看 + 用 `pdftotext` 抽文本层校对 ATS。

这篇文章拆三件事：这条流水线长啥样、`/apply` 里的 drafter/reviewer 双 agent 结构为什么必要、PDF+ATS 验证循环挡住了哪些看不出来的坑。

## 一、9 个命令把求职流程压成一条流水线

![Ai-Job-Search 5 步流水线](/root/workspace/jackssybinIndex/content-ops/ai-job-search-claude-code-career-workbench/media/01-pipeline.png)

主流程 5 个命令：

- **`/setup`** 建档：把 CV/LinkedIn 导出/学位证/推荐信丢进 `documents/`，命令自动填 `CLAUDE.md` 里的候选人档案。
- **`/scrape`** 扫岗位：跑仓库自带的 5 个门户 skill（丹麦四大 + LinkedIn），去重、追踪 seen jobs。
- **`/rank`** 打分：并行派 agent 给新岗位打 triage 分数，返回 top-N 短单——**贵的 apply 只花在挑出来的岗位上**。
- **`/apply`** 起草+审稿+编译：drafter 写、reviewer 挑刺、编译 PDF 视觉检查、pdftotext 过 ATS。
- **`/outcome`** 归档：把 CV、Cover Letter、岗位文本归档进 `documents/applications/<company>_<role>/`，写 `outcome.md`，更新 `job_search_tracker.csv`。

四个辅助命令解决顺手要做的事：

- **`/expand`** 从你 GitHub/portfolio/Kaggle/Scholar 补技能进档案
- **`/upskill`** 分析岗位 vs 档案的技能差 heatmap + 学习计划
- **`/add-template`** 注册你自己的 LaTeX CV 模板（强制先跑 test compile）
- **`/add-portal`** 生成本地招聘门户 skill——BOSS、拉勾、猎聘都可以接（能不能匿名爬另说，见文末）

我第一次读的时候奇怪 rank 和 apply 为啥要分开——直接 apply 挑最高分不就行？后来看代码里的注释才懂：**`/rank` 只做基于岗位描述的 triage 打分，不做公司调研、不起 reviewer；`/apply` 才是贵的。用便宜的排序过滤，让昂贵的申请只花在 top N 上**——这是我看过最漂亮的 agent 成本控制。

## 二、`/apply` 的双 agent：drafter 写，reviewer 挑刺

![Drafter-Reviewer 双 agent 结构](/root/workspace/jackssybinIndex/content-ops/ai-job-search-claude-code-career-workbench/media/02-drafter-reviewer.png)

`/apply` 走 6 步：

- **Step 0 DRAFTER** 解析 URL 或岗位描述
- **Step 1 DRAFTER** 对着 `04-job-evaluation.md` 打 5 维分（技能/经验/行为/位置/职业方向）
- **Step 2 DRAFTER** 写 `cv/main_<company>.tex` + `cover_letters/cover_<company>_<role>.tex`
- **Step 3 REVIEWER**（**空 context 独立 agent**）研究公司 + 读四份档案文件 + 返回 JSON 结构化 edits + 叙述反馈
- **Step 4 DRAFTER** 按 JSON edits 精改，按叙述反馈判断结构
- **Step 5 DRAFTER** lualatex/xelatex 编 PDF + 读渲染出的 PDF 视觉检查
- **Step 6 DRAFTER** pdftotext 过 ATS + 跑一次终版 checklist

最见工程功力的三个决定：

**1. Reviewer 从空 context 起。** 复用 drafter 的 context 会让 reviewer 被 drafter 的框架带跑。空 context 的 reviewer 从头解析岗位、独立调研公司，才能挑出 drafter 完全没想到的角度（比如 drafter 觉得 "机器学习" ≈ "MLOps + feature store"，空 context reviewer 会直接标红）。

**2. 草稿内联传给 reviewer。** 让 reviewer 从 `<CV_DRAFT>…</CV_DRAFT>` inline block 直接拿到内容，不许 Read 文件——**跨 agent 的 file read 是 token 的沉默杀手**。

**3. Reviewer 输出结构化 edits + 叙述反馈两部分。** 机械 patch 自动 apply，判断题（"整段开头太被动了"）交给 drafter 决策。**多 agent 系统的失败 90% 在 context 管理，而不是在 prompt 写得好不好**。

## 三、别信 .tex：PDF 视觉 + ATS 双重验证循环

![PDF + ATS 双重验证](/root/workspace/jackssybinIndex/content-ops/ai-job-search-claude-code-career-workbench/media/03-pdf-ats-loop.png)

**问题**：LaTeX 的分页决策不可预测，`\cventry` 标题可能孤零零推到下页页首；`\lettercontent{}` 会吞掉 `\begin{itemize}` 的字体设置让整段 bullets 字体回退；ATS 读的是 PDF 文本层不是渲染页，邮箱只挂在 `\faEnvelope` 图标上的话 `pdftotext` 抽出来只有 `Envelope` 字样——**招聘系统搜 @ 一无所获**。

`/apply` 的解决办法是把编译+视觉检查+文本层校对写死成**强制不可跳过**的步骤：

- CV 必须正好 2 页，Cover Letter 必须正好 1 页
- `\cventry` 标题不许孤行 → `\needspace{5\baselineskip}` 兜底
- Cover Letter bullets 字体不许回退 → `\fontspec{Raleway}` 包裹 itemize
- 邮箱/电话必须以**明文**出现在 pdftotext 抽出的文本里
- 岗位关键词能诚实覆盖的加进去，**真的没有就承认 gap，绝不 keyword stuffing**

`03-writing-style.md` 里有一条我很喜欢的规则叫 **"interview backtrack test"**：给某个 bullet 加了强度之后，问自己「面试官追问，我能不能不带犹豫地解释这条？」如果得说「哦其实我意思是……」那就是过界了。仓库里还写死：如果 Step 1 experience match 打分低于 50，Step 2 之前先警告用户「这个岗位需要大幅重构，确定继续吗？」——**不留悄悄吹圆简历的空间**。

## 四、5 分钟上手清单

```bash
# 前置：Claude Code CLI + Python 3.10+ + Bun + TeX Live（Linux）
# 可选：apt install poppler-utils（Linux）或 brew install poppler（Mac）

gh repo fork MadsLorentzen/ai-job-search --clone
cd ai-job-search

# 装 5 个门户 CLI 依赖
for portal in jobbank-search jobdanmark-search jobindex-search jobnet-search linkedin-search; do
  (cd .agents/skills/$portal/cli && bun install)
done

# 起 Claude Code
claude
> /setup   # 三条路径：Documents 模式 / 粘贴 CV / 访谈
> /scrape
> /rank
> /apply https://jobindex.dk/job/12345
> /outcome
```

## 五、换成中国招聘门户

```
> /add-portal https://www.zhipin.com/web/geek/job?query=data+scientist&city=101010100
```

`/add-portal` 会先 WebFetch 探测门户搜索 URL 模式、结果页 DOM、访问规则，从既有 skill 的结构脚手架出新 skill，**强制跑一次 live query test** 确认能跑通再接进 `/scrape`。

诚实提醒：BOSS/猎聘/拉勾都有不同程度的反爬和登陆墙。test query 失败的话 `/add-portal` 直接停，不会给你搭一个跑不通的空壳。

## 三个可复制的架构启示

- **多命令 + 单档案**：所有命令共享同一份候选人档案，档案随 `/setup` `/expand` `/outcome` 演进。这个模式可以立刻套到读书笔记、代码 review、内容运营等场景。
- **贵/便宜命令分开**：`/rank` 30 个岗位一起打分，`/apply` 一次一个独立起 reviewer——你得替 AI 决定什么时候可以省 token。
- **验证挂在真实产物上**：不让 drafter 承诺「一定 2 页」，而是编 PDF 亲眼看；不让它承诺「关键词都覆盖」，而是 `pdftotext` 抽文本 grep。

如果你在换工作窗口期，或想找一个把 Claude Code 用得最深的项目学结构，这个仓库值得 fork 下来跑一遍 `/setup`。

**仓库**：github.com/MadsLorentzen/ai-job-search
