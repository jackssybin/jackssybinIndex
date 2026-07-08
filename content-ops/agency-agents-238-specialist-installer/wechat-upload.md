---
title: "238 个 AI 专家、15 个工具，一个仓库一次装完"
author: "jk"
digest: "msitarzewski/agency-agents 用两个 shell 脚本把 238 个带人格的 AI 专家铺满 Claude Code、Cursor、Codex、Hermes 等 15 个工具。这篇拆结构、拆脚本、拆 NEXUS 编队。"
cover: "/root/workspace/jackssybinIndex/content-ops/agency-agents-238-specialist-installer/media/cover-wechat.jpg"
theme: "newsroom"
---

# 238 个 AI 专家、15 个工具，一个仓库一次装完

同时装了 Claude Code、Cursor、Codex、Gemini CLI、Hermes 的人，都会遇到同一个问题：Frontend Developer、Backend Architect、UX Researcher 这些 agent 定义要在每个工具里各写一份。改一次 Frontend Developer 的 prompt，得在 5 个位置同步。写到第 30 个 agent，我知道这条路走不下去。

最近在 GitHub 找到一个把这件事解决得最彻底的仓库：`msitarzewski/agency-agents`。238 个 agent、17 个 division，两个 shell 脚本一次铺满 15 个工具。这篇讲三件事：仓库结构、双脚本工作流、Hermes 为什么走懒加载路线。

## 一、这不是又一个 prompt 合集

先看规模。`agency-agents` 目录下 17 个 division，每个 division 是一个顶层目录，里面是若干带 YAML frontmatter 的 `.md` 文件——每个 `.md` 就是一个「人格 + 使命 + 工作流 + 交付物 + 沟通风格」的完整定义。

![Agency Agents 17 divisions 238 specialists 分布图](/root/workspace/jackssybinIndex/content-ops/agency-agents-238-specialist-installer/media/01-divisions-map.png)

各 division 的 agent 数：

- specialized: 53（Agents Orchestrator、CFO、Reality Checker）
- engineering: 36（Frontend / Backend Architect / SRE / Solidity）
- marketing: 36（Growth Hacker、SEO、Newsletter Strategist）
- gis: 13
- security: 10
- design: 9（UI / UX Researcher / Whimsy Injector）
- sales: 9（Outbound、Deal Strategist、MEDDPICC）
- testing: 9
- paid-media / project-management: 7
- spatial-computing / support: 6
- academic / finance / game-dev / product: 5
- healthcare: 2

关键差别不在数量，在**每个 agent 的写法**。看一段 Multi-Agent Systems Architect 的定义：

> Personality: 分布式系统严谨 + demo 怀疑派。看到有人把五个 agent 串成链、不做 failure handling 就说"完成了"会明显不安。
>
> 沟通风格：先问失败问题——"Agent B 超时或返回垃圾时，恢复路径是什么？走一遍给我。"

这就是「不问不做」的判据，写在 prompt 里模型不会漏。每个 agent 都是一个带明确失败判据的合同，而不是玄学咒语。

## 二、convert.sh + install.sh：一份源码，铺到 15 个工具

仓库官方支持 15 个工具，每个格式不同：Codex 是 TOML、Cursor 是 `.mdc` rule、Osaurus/Antigravity 要 `SKILL.md`、Aider 只吃一个大 `CONVENTIONS.md`。手工同步纯属浪费生命。

仓库的解法是三个东西：`tools.json` 权威清单 + `convert.sh` 渲染 + `install.sh` 分发。

![convert.sh + install.sh 双段式工作流](/root/workspace/jackssybinIndex/content-ops/agency-agents-238-specialist-installer/media/02-two-scripts-flow.png)

两段式的好处：

- **可回滚**：`integrations/` 是平铺产物，出问题 diff 一眼看到。
- **可 CI 校验**：`check-tools.sh` / `check-divisions.sh` 会检查 `tools.json`、`divisions.json`、目录和两个脚本是否一致，任何漂移直接挂 CI。
- **可组合安装**：三个筛选维度可以叠加。

```bash
# 只装工程组 + 安全组，铺到 Claude Code
./scripts/install.sh --tool claude-code --division engineering,security

# 只装两个具体 agent，铺到 Cursor
./scripts/install.sh --tool cursor --agent frontend-developer,ui-designer

# dry-run 看清单
./scripts/install.sh --tool opencode --division engineering --dry-run

# 全自动：探测已装工具 + 装全部 agent
./scripts/install.sh
```

**踩坑提醒**：OpenCode 目前只能注册 ~119 个 agent，超过静默丢弃（[upstream issue #27988](https://github.com/anomalyco/opencode/issues/27988)）。装 OpenCode 必须用 `--division` 筛，否则你以为装了 232 个，实际只有 119 个能用。

## 三、Hermes 走的是懒加载 Router

前面 14 个工具都是「一 agent 一文件塞到目录里」。Hermes 是例外，仓库单独给它做了一个 `agency-agents-router` 插件。

看官方 README 的原话：

> 这个 integration 装的是**一个** Hermes 插件，而不是往 `skills.external_dirs` 里加 232+ 个 skill。Hermes 启动看到的是一个小的固定 tool surface，全套 roster 保存在 `data/agents.json` 里按需搜索/加载。

它对外只暴露四个工具：

![Hermes 懒加载 Router 的四个入口](/root/workspace/jackssybinIndex/content-ops/agency-agents-238-specialist-installer/media/03-hermes-router.png)

- `agency_agents_search`：按 query / division 搜专家。
- `agency_agents_inspect`：查专家的 metadata / 完整 body。
- `agency_agents_load`：把专家 prompt 合到当前任务。
- `agency_agents_delegate`：转交 Hermes `delegate_task` 独立跑。

为什么要这样？直接把 232 个 agent 当 skill 塞进去，system prompt token 会迅速膨胀，反而让 agent 变笨。Router 模式让 Hermes 只知道「Agency 是可搜的花名册」，用谁再拉谁，启动开销 O(1)。

## 四、五分钟上手（Claude Code 版）

```bash
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents
./scripts/convert.sh                      # 生成 integrations/
./scripts/install.sh --tool claude-code   # 铺到 ~/.claude/agents/
```

然后在 Claude Code 会话里说：

```
Activate Frontend Developer.

Task: 用 React + Vite 给我搭一个 SaaS 项目的登录页，
要求 mobile-first、A11y AA、支持深色模式。
```

不用复制 prompt，Claude Code 自己去 `~/.claude/agents/` 找匹配。

**三个必须知道的坑**：

1. clone 完必须先 `./scripts/convert.sh`，`integrations/` 不在版本控制里。
2. Cursor / OpenCode / Aider / Windsurf 是**项目级**，要在目标项目根目录里跑 `install.sh`。
3. 想让 upstream 更新自动生效，加 `--link` 用软链而不是复制。

## 五、NEXUS：单 agent 组成流水线

单个 agent 价值有限。仓库另一半价值在 `strategy/`——把 agent 打包成三种编队，官方叫 NEXUS。

三种模式：

- **NEXUS-Micro**：5-10 agent，1-5 天。修单一 bug、跑一次 audit、发一次 campaign。
- **NEXUS-Sprint**：15-25 agent，2-6 周。一个 feature 或 MVP。
- **NEXUS-Full**：全部 agent，12-24 周。从 0 到 1 的完整产品。

给一段可以直接抄的 Sprint 激活 prompt：

```
Activate Agents Orchestrator in NEXUS-Sprint mode.

Project: RetroBoard，为远程团队做的实时回顾工具。
Timeline: 4 weeks to MVP。
Constraints: solo dev, React + Node.js, Vercel + Railway。

Team: Sprint Prioritizer、UX Researcher、Backend Architect、
Frontend Developer、Rapid Prototyper、Growth Hacker、Reality Checker。

在每个 sprint 结束前，让 Reality Checker 出 gate report。
```

`examples/nexus-spatial-discovery.md` 里有一次完整 NEXUS-Full 运行的产物：8 个 agent 并行，交付市场验证、8-service 架构 + SQL schema、品牌视觉、GTM、35 周排期 + 65 个工单、XR 空间界面规范——**没有人工协调**，全部交叉引用一致。

## 六、我的最终判断

这仓库值得看，不是因为 agent 多，而是因为它把 agent 定义当作**可 CI、可 diff、可 dry-run 的工程 artifact**：

- `tools.json` / `divisions.json` 生死绑定 convert / install / lint 三条链。
- 单独给 Hermes 做懒加载 router，说明作者理解 context budget 的实际代价。
- NEXUS 里把 Reality Checker、Evidence Collector 单独抽出来当 gate，说明作者理解「pipeline 失败点通常不在专家身上，在没人把关」。

**适合直接用**：一个人或小团队同时用 2 个以上 agentic 工具、有 SaaS 从 0 到 1 项目、想把 agent 纳入版本控制。

**建议观望**：只用一个工具且只有 3-5 个固定 prompt 的独立开发者、完全依赖 OpenCode 的用户（119 上限没修好）。

**不推荐直接用**：追求即插即用中文效果的场景。仓库主要是英文 agent，中文使用要自己后置调整。

从今天起，我不用在多个工具之间搬 prompt 了。维护一份 fork，agent 变更走 PR，CI 挂 `check-tools.sh`，剩下的交给两个脚本。

仓库：<https://github.com/msitarzewski/agency-agents>
App：<https://agencyagents.app>
