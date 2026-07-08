---
title: "Agency Agents 教程：一个仓库把 238 个 AI 专家装进 Claude Code / Cursor / Codex / Hermes"
url: "/articles/2026/07/08/agency-agents-238-specialist-installer/"
date: "2026-07-08T10:00:00+08:00"
lastmod: "2026-07-08T10:00:00+08:00"
description: "msitarzewski/agency-agents 是一套 238 个带人格与工作流的 AI 专家（覆盖 17 个 division），配一份 install.sh 就能把它们同时铺到 Claude Code、Cursor、Codex、Gemini CLI、OpenCode、Windsurf、Hermes 等 15 个工具里。本文拆解仓库结构、install/convert 双脚本、Hermes 懒加载 router 的设计，以及 NEXUS-Micro / Sprint / Full 三种编队模式的实战套路。"
tags: ["AI Agent", "Claude Code", "Cursor", "Hermes", "开源项目"]
topic: "AI Agent"
topicSlug: "ai-agent"
layout: article
contentType: article
---

![封面](/images/agency-agents-238-specialist-installer/cover-zhihu.png)

# Agency Agents 教程：一个仓库把 238 个 AI 专家装进 Claude Code / Cursor / Codex / Hermes

我最近想搞清楚一件事：如果我手上有 Claude Code、Cursor、Codex、Gemini CLI、OpenCode、Hermes 六七种 agentic 工具，每个工具都想装一批「专家角色」——Frontend Developer、Backend Architect、UX Researcher、SRE、Solidity 工程师、PPC Campaign Strategist——我该怎么管？

一开始我以为答案是：每个工具单独写一套 prompt 模板，然后手动搬运。写到第 30 个 agent 的时候，我知道这条路走不通。每个工具的目录不同、frontmatter 不同、有的要 `.mdc` 有的要 `.toml` 有的要 `SKILL.md`，改一次要在七八个位置同步。

后来我在 GitHub 上看到 [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)——这是我目前看到把「多工具、多角色、多分工」这件事解决得最彻底的开源仓库。整个仓库 238 个 agent，17 个 division（工程、设计、市场、销售、财务、游戏开发、GIS、医疗、安全、支持……），只用两个 shell 脚本（`convert.sh` + `install.sh`）就能一键铺到 15 个工具里。

这篇文章不是搬 README，我会拆三件事：

1. 这个仓库到底解决了什么问题，它跟「一堆 prompt 模板打包」有什么本质区别。
2. `convert.sh` / `install.sh` 双脚本到底怎么工作，为什么 Hermes 这一路要走「懒加载 router 插件」而不是「批量 skill」。
3. NEXUS-Micro / Sprint / Full 三种编队模式怎么在真实项目里落地，配上可以直接拿走的三段激活 prompt。

## 一、这不是又一个 prompt 合集

先看规模。`agency-agents` 目录下 17 个 division，每个 division 是一个顶层文件夹，里面是若干带 YAML frontmatter 的 `.md` 文件，每个 `.md` 就是一个「专家人格 + 使命 + 工作流 + 交付物 + 沟通风格」的完整定义。

![Agency Agents：238 个专家分布在 17 个 division](/images/agency-agents-238-specialist-installer/01-divisions-map.png)

各 division 的 agent 数（截至本文写作时，仓库当前状态）：

| Division | 数量 | 代表角色 |
| --- | --- | --- |
| specialized | 53 | Agents Orchestrator、CFO、Reality Checker、Persona Walkthrough |
| engineering | 36 | Frontend / Backend Architect / SRE / Solidity / Voice AI / Prompt Engineer |
| marketing | 36 | Growth Hacker、SEO Specialist、Newsletter Strategist |
| gis | 13 | GIS Analyst、Cartographer、Remote Sensing |
| security | 10 | AppSec、Cloud Security、Incident Responder |
| design | 9 | UI / UX Researcher / Brand Guardian / Whimsy Injector |
| sales | 9 | Outbound Strategist、Deal Strategist、MEDDPICC Coach |
| testing | 9 | API Tester、Evidence Collector、Load Tester |
| paid-media | 7 | PPC Strategist、Tracking Specialist |
| project-management | 7 | Sprint Prioritizer、Project Shepherd |
| spatial-computing | 6 | XR Interface Architect |
| support | 6 | Support Responder、Community Manager |
| academic / finance / game-dev / product | 5 each | 略 |
| healthcare | 2 | Clinical Ops、Health Data |

> 计数用 `find academic design engineering finance game-development gis healthcare marketing paid-media product project-management sales security spatial-computing specialized support testing -name "*.md" -type f | wc -l`。仓库还会继续加，README 里给的最大出货口径是 232+，我 clone 时数出来 238。

每个 agent 长这样（截取自 `engineering/engineering-multi-agent-systems-architect.md`）：

```yaml
---
name: Multi-Agent Systems Architect
emoji: 🕸️
description: Systems architect specializing in the design, coordination,
  and governance of multi-agent AI pipelines...
color: cyan
vibe: Treats a team of AI agents like a distributed system — if it only
  survives the demo and not production load, ambiguous inputs, and cascading
  failures, it isn't architecture yet.
---

# 🕸️ Multi-Agent Systems Architect Agent

## 🧠 Your Identity & Memory
- Role: ...
- Personality: 分布式系统严谨 + demo 怀疑派。看到有人把五个 agent 串成链、
  不做 failure handling 就说"完成了"会明显不安。
- Memory: 跟踪 topology、每个 agent 的 I/O 契约、权限范围、失败恢复路径、
  HITL 关卡、context 预算。
- Experience: 分布式系统（熔断、幂等、补偿、检查点回滚）、
  编排模式（sequential、fan-out/in、hierarchical、evaluator-optimizer、mesh）、
  上下文预算、prompt-injection 防御、eval-driven 开发、多跳可观测。
```

关键差别在这里：不是 "帮我扮演前端工程师"，而是把「你是谁」「你的记忆」「你的性格」「你在意什么」「你的沟通风格」「你要拒绝什么」「你要交付什么」写得非常具体。**每个 agent 都是一个带明确失败判据的合同**。

比如 Multi-Agent Systems Architect 会主动问「Agent B 超时或返回垃圾时，恢复路径是什么？」——这是一个「不问就不做」的判据，写在 prompt 里，模型不会漏掉。

这让 agent 不再是「玄学咒语」，而更像 SRE 意义上的 runbook：你能在 review 阶段用同行专家的眼光去挑毛病。

## 二、convert.sh + install.sh：一份源码，铺到 15 个工具

仓库有 15 个官方支持的工具（`tools.json`）：

- Claude Code、Codex、Gemini CLI、GitHub Copilot、Qwen Code
- Cursor、OpenCode、Osaurus、Aider、Antigravity
- Kimi Code、OpenClaw、Windsurf、Hermes、Mistral Vibe

每个工具的 agent 格式都不同。Codex 是 TOML，Cursor 是 `.mdc` rule，Osaurus / Antigravity 要求 `SKILL.md`，Aider 只吃一个大 `CONVENTIONS.md`，Windsurf 只吃一个 `.windsurfrules`。手工同步这些差异是纯手工活。

仓库的解法是两个脚本 + 一份权威清单：

- `tools.json`：15 个工具的元数据（label、accent color、检测目录、目标路径模板、渲染 format、`installKind`）。
- `scripts/convert.sh`：把源 agent 渲染成每个工具需要的格式，输出到 `integrations/<tool>/`。
- `scripts/install.sh`：读取 `integrations/` 里已经渲染好的文件，按目标工具复制到本机对应目录。

![convert.sh 与 install.sh 的分工](/images/agency-agents-238-specialist-installer/02-two-scripts-flow.png)

这个「先 convert 到 integrations/，再 install 到用户目录」的两段式设计有几个好处：

1. **可回滚**：`integrations/` 是一个平铺的产物区，出问题可以先 diff 再 install。
2. **可 CI 校验**：`check-tools.sh` / `check-divisions.sh` 会检查 `tools.json` / `divisions.json` 是否和目录、`convert.sh`、`install.sh` 保持一致，任何漂移都会挂 CI。
3. **可组合安装**：`install.sh` 支持三种维度的筛选，可以任意组合：

```bash
# 只装工程组 + 安全组，铺到 Claude Code
./scripts/install.sh --tool claude-code --division engineering,security

# 只装两个具体 agent，铺到 Cursor
./scripts/install.sh --tool cursor --agent frontend-developer,ui-designer

# 用清单文件批量指定 agent
./scripts/install.sh --tool opencode --agents-file agents-to-install.example

# 只看会做什么，不真的写文件
./scripts/install.sh --tool opencode --division engineering --dry-run

# 全自动：探测已安装工具 + 装全部 agent
./scripts/install.sh
```

**踩坑提醒**：README 里明确写了 OpenCode 现在只能注册 ~119 个 agent，超过会被静默丢弃（[upstream bug #27988](https://github.com/anomalyco/opencode/issues/27988)）。所以给 OpenCode 装的时候一定要用 `--division` 筛，否则你以为装了 232 个，实际只有 119 个能用。install.sh 会给你一个 warning 但不会自动帮你选，需要自己看提示。

## 三、Hermes 走的是懒加载 router，而不是 232 个 skill

前面 14 个工具都是「每个 agent 渲染成一份文件，塞到工具目录里」。Hermes 是例外。仓库单独给它做了一个 lazy-router 插件。

看 `integrations/hermes/README.md`：

> 这个 integration 装的是**一个** Hermes 插件（`agency-agents-router`），而不是往 `skills.external_dirs` 里加 232+ 个 skill。Hermes 启动时看到的是一个小的固定 tool surface，全套 Agency roster 保存在 `data/agents.json` 里，按需搜索/加载。

它对外只暴露四个工具：

- `agency_agents_search`：按 query / division 找专家。
- `agency_agents_inspect`：查看某个专家的元数据或完整 body。
- `agency_agents_load`：把某个专家的 prompt 合成到当前任务里。
- `agency_agents_delegate`：交给 Hermes 的 `delegate_task` 去跑。

![Hermes 懒加载 router 的四个入口](/images/agency-agents-238-specialist-installer/03-hermes-router.png)

为什么要这样？直接把 232 个 agent 当 skill 塞进去，Hermes 每次会话都要把它们的 metadata 列出来做匹配，system prompt token 迅速膨胀，agent 反而变笨。Router 模式让 Hermes 只知道「Agency 是个可搜的花名册」，需要谁再拉谁。

给 Hermes 项目下达指令时，README 推荐的写法是：

```text
Use the agency-agents-router plugin. Search the Agency roster for the right
specialists, then load or delegate only the specific agents needed for each
part of the project. For multi-discipline projects, use multiple selected
specialists across the project, but keep routing lazy: do not preload the
full Agency roster and do not add agency-agents to skills.external_dirs.
```

这段话有两层意思：**允许**跨阶段用多个不同专家，**禁止**一次预加载全部。这对 context budget 极度敏感的 Hermes 来说是必须的。

Hermes 用户实际操作：

```bash
# 一次搞定 convert + install + enable
./scripts/convert.sh --tool hermes
./scripts/install.sh --tool hermes
```

会得到：

```text
${HERMES_HOME:-~/.hermes}/plugins/agency-agents-router
```

然后自动把 `agency-agents-router` 加入 `plugins.enabled`。**不会**碰 `skills.external_dirs`。

## 四、五分钟上手：一个 Claude Code 项目全套铺设

先给一份最短路径。macOS 用户直接 brew，其他系统用 script。

**方案 A：桌面 App（推荐给不想碰 CLI 的人）**

```bash
brew install --cask msitarzewski/agency-agents/agency-agents
```

装好后打开 [agencyagents.app](https://agencyagents.app)，勾选要铺的工具和 division，一次搞定。

**方案 B：CLI（推荐给要跑 CI / 团队共用配置的人）**

```bash
# 1. clone
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents

# 2. 先生成 integrations/ 里的所有格式（一次，之后可以复用）
./scripts/convert.sh

# 3. 交互式安装，或者显式指定工具
./scripts/install.sh                              # 探测已装工具，弹出向导
./scripts/install.sh --tool claude-code           # 只装到 Claude Code
./scripts/install.sh --tool claude-code --division engineering,design
```

Claude Code 装完之后，实际路径是 `~/.claude/agents/*.md`。要激活的时候，直接在会话里说：

```text
Activate Frontend Developer.

Task: 用 React + Vite 给我搭一个 SaaS 项目的登录页，
要求 mobile-first、A11y AA、支持深色模式。
```

不需要复制 prompt，Claude Code 自己会去 `~/.claude/agents/` 找匹配。

**踩坑提醒**：

1. 头一次 clone 之后一定要 `./scripts/convert.sh`，`integrations/` 目录不在版本控制里（会导致 `install.sh` 找不到）。
2. Cursor / OpenCode / Aider / Windsurf / Qwen 是「project 级」而不是「user 级」的，要在你的项目根目录里跑 `install.sh`，装到当前项目的 `.cursor/rules/` 或 `.opencode/agents/`。
3. 如果你要保持 agent 定义随 upstream 更新自动生效，用 `--link` 代替复制：`./scripts/install.sh --tool claude-code --link`，得到的是软链而不是拷贝。

## 五、NEXUS：把单个 agent 组成流水线

单个 agent 的价值有限，仓库的另一半价值在 `strategy/` 目录——它把这些 agent 打包成三种编队模式，官方叫 NEXUS（Network of EXperts, Unified in Strategy）。

三种模式和用法：

| 模式 | 用途 | 参与 agent 数 | 建议时长 |
| --- | --- | --- | --- |
| NEXUS-Micro | 单一任务（bug fix、audit、campaign） | 5-10 | 1-5 天 |
| NEXUS-Sprint | 一个 feature / MVP | 15-25 | 2-6 周 |
| NEXUS-Full | 从 0 到 1 的完整产品 | 全部 | 12-24 周 |

三段可以直接抄的激活 prompt：

**NEXUS-Micro：修一个线上 bug**

```text
Activate Agents Orchestrator in NEXUS-Micro mode.

Task: 排查生产环境 Java 内存泄漏。JVM heap 每 6 小时涨 300 MB，
GC 后不回退。仅限阅读代码 + 分析 flamegraph + 提出补丁方案，
不改动生产。

Team: Incident Response Commander (lead)、SRE (metrics owner)、
Senior Developer (Java patch)、Reality Checker (最终把关)。
```

**NEXUS-Sprint：4 周做完一个 SaaS MVP**

```text
Activate Agents Orchestrator in NEXUS-Sprint mode.

Project: RetroBoard，为远程团队做的实时回顾工具。
Timeline: 4 weeks to MVP.
Constraints: solo dev, React + Node.js, Vercel + Railway。

Team: Sprint Prioritizer、UX Researcher、Backend Architect、
Frontend Developer、Rapid Prototyper、Growth Hacker、Reality Checker。

在每个 sprint 结束前，让 Reality Checker 出 gate report。
```

**NEXUS-Full：完整产品**

```text
Activate Agents Orchestrator in NEXUS-Full mode.

Project: Nexus Spatial Discovery，AI agent 编排 × 空间计算。
Deliverables: 市场验证、8-service 架构 + SQL schema、品牌与视觉、
GTM、Support 蓝图、UX 研究、35 周排期与 65 个 sprint 工单、
XR 空间界面规范。

Deploy the full agency. 每个 phase 结束由 Project Shepherd 汇总，
Reality Checker 放行。
```

第三段的完整输出可以在仓库 `examples/nexus-spatial-discovery.md` 里看到，那是仓库作者跑过一次的真实产物：8 个 agent 并行，产出交叉引用一致的完整蓝图。

## 六、判断：谁应该用，谁应该等

我的判断分三类。

**适合马上用**：

- 一个人 / 小团队，同时在用 2 个以上 agentic 工具（比如 Claude Code + Cursor + Codex），受够了在多个位置维护同一份 prompt。
- 有 SaaS / 产品从 0 到 1 的 sprint 项目，需要一个「谁负责哪个环节」的可复用编队。
- 想把 agent 定义纳入版本控制，写 CI 校验，做 team-wide 的 agent 治理。

**可以观望**：

- 只用一个工具，也只用 3-5 个固定 prompt 的独立开发者。你自己写更快，装 238 个反而是负担。
- 完全依赖 OpenCode。119 agent 上限没修好之前，只装子集是唯一路径，体感会比 Claude Code 差。

**不建议直接用**：

- 追求「即插即用的中文效果」。仓库主要是英文 agent，能跑中文任务但语言风格要自己后置调整。中文场景下把 Frontend Developer / UX Researcher 拿出来单独 fine-tune 一遍。

## 七、可收藏的命令与配置清单

一次装齐（用户级 + 项目级混合的推荐路径）：

```bash
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents
./scripts/convert.sh

# 用户级工具（一次装完全局可用）
./scripts/install.sh --tool claude-code
./scripts/install.sh --tool codex
./scripts/install.sh --tool copilot
./scripts/install.sh --tool antigravity
./scripts/install.sh --tool osaurus
./scripts/install.sh --tool hermes

# 项目级工具（切到目标项目根目录后再跑）
cd ~/projects/my-saas
./scripts/install.sh --tool cursor --division engineering,design
./scripts/install.sh --tool aider
./scripts/install.sh --tool windsurf

# OpenCode 要限制规模，避免 119 上限
./scripts/install.sh --tool opencode --division engineering,design,testing,security
```

只装最常用的 12 个 agent（一个人日常够用）：

```bash
cat > /tmp/my-agents.txt <<'EOF'
# Engineering
frontend-developer
backend-architect
senior-developer
devops-automator
sre
code-reviewer
prompt-engineer

# Design
ui-designer
ux-researcher

# Ops
sprint-prioritizer
reality-checker
agents-orchestrator
EOF

./scripts/install.sh --tool claude-code --agents-file /tmp/my-agents.txt
```

日常查找与更新：

```bash
./scripts/install.sh --list teams          # 看有哪些 division / 有多少 agent
./scripts/install.sh --list agents         # 看全部 agent
./scripts/install.sh --link                # 用软链保持 upstream 更新自动生效
git -C ~/…/agency-agents pull && ./scripts/convert.sh   # 更新 upstream 后重生成
```

## 八、我的最终判断

以前我对「agent 大合集」的第一反应是「又是一个 prompt 商店」。这次改了看法。

Agency Agents 值得看，不是因为 agent 数量多，而是因为它把「agent 定义」当作**可 CI、可 diff、可 dry-run 的工程 artifact**：一份权威 `tools.json` / `divisions.json` 生死绑定 convert / install / lint 三条链，任何漂移都会挂 CI；单独给 Hermes 做懒加载 router 而不是暴力铺 skill，说明作者理解 context budget 的实际代价；`NEXUS` 编队里把 Reality Checker、Evidence Collector、Persona Walkthrough 这种「不干活但把关」的 agent 单独抽出来当 gate，说明作者理解「pipeline 的失败点通常不在专家身上，在没人把关」。

对我个人来说，最直接的收益是——从今天开始，我不需要在多个工具之间搬 prompt 了。我只要维护一份 fork，agent 变更走 PR review，CI 挂载 `check-tools.sh` / `check-divisions.sh`，剩下的交给两个脚本。

如果你正好在维护多工具的 agent 配置，这个仓库值得直接 clone 下来跑一遍 `convert.sh`，然后按前面的清单挑一个子集试着装到 Claude Code 上。跑一次，你会知道它是不是你的菜。

---

**参考**：

- 主仓库：<https://github.com/msitarzewski/agency-agents>
- App 桌面版：<https://agencyagents.app>
- OpenCode 上限 issue：<https://github.com/anomalyco/opencode/issues/27988>
- 完整示例产物：`examples/nexus-spatial-discovery.md`
