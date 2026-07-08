---
title: "Agency Agents 教程：一个仓库把 238 个 AI 专家装进 Claude Code / Cursor / Codex / Hermes"
cover: "https://jackssybin.cn/images/agency-agents-238-specialist-installer/cover-zhihu.png"
---

# Agency Agents 教程：一个仓库把 238 个 AI 专家装进 Claude Code / Cursor / Codex / Hermes

先说个真实场景。你手上同时装了 Claude Code、Cursor、Codex、Gemini CLI、Hermes 五六个 agentic 工具，每个工具你都想装一套「专家角色」——Frontend Developer、Backend Architect、UX Researcher、SRE、Solidity 工程师。你怎么维护？

我一开始的答案是「每个工具单独写一份 prompt 模板」。写到第 30 个 agent 的时候我放弃了。每个工具目录不同、frontmatter 不同、Codex 要 TOML、Cursor 要 `.mdc`、Osaurus 要 `SKILL.md`——改一次要在七八个位置同步。

后来在 GitHub 找到 [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)——这是目前我看到把「多工具、多角色、多分工」解决得最彻底的开源仓库。

**这篇文章拆三件事**：

1. 这个仓库到底和「打包一堆 prompt 模板」有什么本质区别。
2. `convert.sh` / `install.sh` 双脚本的工作方式，以及为什么 Hermes 单独走懒加载 router。
3. NEXUS-Micro / Sprint / Full 三种编队怎么用，附可直接抄的三段激活 prompt。

## 旧认知 vs 新认知

先把观念校准一下。

**旧认知**：agent 定义 = 一段 prompt。想复用就复制粘贴到每个工具目录。

**新认知**：agent 定义 = 一份工程 artifact。它需要版本管理、CI 校验、跨工具渲染、可选安装、可回滚、可 dry-run。

一旦你接受了新认知，你会发现单纯的 prompt 库根本不够用。你需要的是：

- 权威清单：`tools.json` / `divisions.json` 记录支持的工具和 division。
- 渲染器：把源 agent 转成 15 种工具格式。
- 分发器：按选择的工具 + division + agent 组合安装。
- CI 守护：任何漂移直接挂。
- 编队 runbook：把单个 agent 组成协作流水线。

Agency Agents 是我看到的第一个把这五件事都做齐的开源实现。

## 一、238 个专家的结构

![Agency Agents 17 divisions 238 specialists](https://jackssybin.cn/images/agency-agents-238-specialist-installer/01-divisions-map.png)

各 division 的 agent 数（clone 后 `find *.md` 计数）：

| Division | 数量 | 代表角色 |
| --- | --- | --- |
| specialized | 53 | Agents Orchestrator、CFO、Reality Checker、Persona Walkthrough |
| engineering | 36 | Frontend / Backend Architect / SRE / Solidity / Voice AI / Prompt Engineer |
| marketing | 36 | Growth Hacker、SEO Specialist、Newsletter Strategist |
| gis | 13 | GIS Analyst、Cartographer、Remote Sensing |
| security | 10 | AppSec、Cloud Security、Incident Responder |
| design | 9 | UI Designer、UX Researcher、Whimsy Injector |
| sales | 9 | Outbound Strategist、Deal Strategist |
| testing | 9 | API Tester、Evidence Collector |
| paid-media | 7 | PPC Strategist、Tracking Specialist |
| project-management | 7 | Sprint Prioritizer、Project Shepherd |
| spatial-computing | 6 | XR Interface Architect |
| support | 6 | Support Responder、Community Manager |
| academic / finance / game-dev / product | 5 each | 略 |
| healthcare | 2 | Clinical Ops、Health Data |

每个 agent 长这样（Multi-Agent Systems Architect 节选）：

```yaml
---
name: Multi-Agent Systems Architect
description: Systems architect specializing in the design, coordination,
  and governance of multi-agent AI pipelines...
vibe: Treats a team of AI agents like a distributed system — if it only
  survives the demo and not production load, ambiguous inputs, and cascading
  failures, it isn't architecture yet.
---

## 🧠 Your Identity & Memory
- Personality: 分布式系统严谨 + demo 怀疑派。看到有人把五个 agent 串成链、
  不做 failure handling 就说"完成了"会明显不安。
- Memory: 跟踪 topology、每个 agent 的 I/O 契约、权限范围、
  失败恢复路径、HITL 关卡、context 预算。
```

关键差别不是「你是前端工程师」这种角色扮演，而是把**性格、记忆、经验、沟通风格、拒绝什么、交付什么**都写具体。等于给 agent 一份带明确失败判据的合同。

## 二、convert.sh + install.sh 双段式

15 个官方支持工具（`tools.json`）：Claude Code、Codex、Gemini CLI、GitHub Copilot、Qwen Code、Cursor、OpenCode、Osaurus、Aider、Antigravity、Kimi Code、OpenClaw、Windsurf、Hermes、Mistral Vibe。每个工具格式都不同。

仓库的解法是 `tools.json` 做权威、两个脚本干活：

![convert.sh + install.sh 双段式工作流](https://jackssybin.cn/images/agency-agents-238-specialist-installer/02-two-scripts-flow.png)

两段式设计的三个好处：

1. **可回滚**：`integrations/` 是平铺产物区，出问题先 diff 再 install。
2. **可 CI 校验**：`check-tools.sh` / `check-divisions.sh` / `lint-agents.sh` 校验 `tools.json`、`divisions.json`、目录、convert.sh、install.sh 是否一致。
3. **可组合安装**：三个筛选维度可以叠加。

```bash
# 只装工程组 + 安全组，铺到 Claude Code
./scripts/install.sh --tool claude-code --division engineering,security

# 只装两个具体 agent，铺到 Cursor
./scripts/install.sh --tool cursor --agent frontend-developer,ui-designer

# 用清单文件批量指定
./scripts/install.sh --tool opencode --agents-file agents-to-install.example

# dry-run 看清单
./scripts/install.sh --tool opencode --division engineering --dry-run
```

**踩坑**：OpenCode 现在只能注册 ~119 个 agent，超过静默丢弃（[upstream #27988](https://github.com/anomalyco/opencode/issues/27988)）。装 OpenCode 一定要 `--division` 筛。

## 三、Hermes 的例外：懒加载 Router

前面 14 个工具都是「一 agent 一文件塞目录」。Hermes 是例外——单独做了一个 `agency-agents-router` 插件。

看官方 README 原话：

> 这个 integration 装的是**一个** Hermes 插件，而不是往 `skills.external_dirs` 里加 232+ 个 skill。Hermes 启动时看到的是一个小的固定 tool surface，全套 roster 保存在 `data/agents.json` 里按需搜索/加载。

对外只暴露四个入口：

![Hermes 懒加载 Router](https://jackssybin.cn/images/agency-agents-238-specialist-installer/03-hermes-router.png)

- `agency_agents_search`：按 query / division 搜专家。
- `agency_agents_inspect`：查专家 metadata / 完整 body。
- `agency_agents_load`：把专家 prompt 合到当前任务。
- `agency_agents_delegate`：转交 Hermes `delegate_task` 独立跑。

**为什么必须这样**：直接把 232 个 agent 当 skill 塞进 Hermes，system prompt token 迅速膨胀，反而让 agent 变笨。Router 模式让 Hermes 只知道「Agency 是可搜的花名册」，用谁再拉谁，启动开销 O(1)。

这是这个仓库让我觉得作者靠谱的关键点——他知道多 agent 时代 context budget 是真金白银。

## 四、五分钟上手（Claude Code）

```bash
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents
./scripts/convert.sh                       # 生成 integrations/
./scripts/install.sh --tool claude-code    # 铺到 ~/.claude/agents/
```

激活时在会话里说：

```
Activate Frontend Developer.

Task: 用 React + Vite 给我搭一个 SaaS 项目的登录页，
要求 mobile-first、A11y AA、支持深色模式。
```

Claude Code 自己去 `~/.claude/agents/` 匹配。

**必须知道的三个坑**：

1. clone 完必须先 `./scripts/convert.sh`，`integrations/` 不在版本控制里。
2. Cursor / OpenCode / Aider / Windsurf / Qwen 是**项目级**，要在目标项目根目录里跑。
3. 想让 upstream 更新自动生效，加 `--link` 用软链而不是复制。

## 五、NEXUS 三种编队

单 agent 价值有限。仓库 `strategy/` 目录把 agent 打包成三种编队，官方叫 NEXUS。

| 模式 | 用途 | agent 数 | 建议时长 |
| --- | --- | --- | --- |
| NEXUS-Micro | 单一任务（bug 修复、audit、campaign） | 5-10 | 1-5 天 |
| NEXUS-Sprint | 一个 feature 或 MVP | 15-25 | 2-6 周 |
| NEXUS-Full | 从 0 到 1 完整产品 | 全部 | 12-24 周 |

**NEXUS-Micro：修一个线上 bug**

```
Activate Agents Orchestrator in NEXUS-Micro mode.

Task: 排查生产环境 Java 内存泄漏。JVM heap 每 6 小时涨 300 MB，
GC 后不回退。仅限阅读代码 + 分析 flamegraph + 提出补丁方案，
不改动生产。

Team: Incident Response Commander (lead)、SRE (metrics owner)、
Senior Developer (Java patch)、Reality Checker (最终把关)。
```

**NEXUS-Sprint：4 周做完 SaaS MVP**

```
Activate Agents Orchestrator in NEXUS-Sprint mode.

Project: RetroBoard，为远程团队做的实时回顾工具。
Timeline: 4 weeks to MVP。
Constraints: solo dev, React + Node.js, Vercel + Railway。

Team: Sprint Prioritizer、UX Researcher、Backend Architect、
Frontend Developer、Rapid Prototyper、Growth Hacker、Reality Checker。

在每个 sprint 结束前，让 Reality Checker 出 gate report。
```

**NEXUS-Full：完整产品**

```
Activate Agents Orchestrator in NEXUS-Full mode.

Project: Nexus Spatial Discovery，AI agent 编排 × 空间计算。
Deliverables: 市场验证、8-service 架构 + SQL schema、
品牌与视觉、GTM、Support 蓝图、UX 研究、35 周排期与 65 个 sprint 工单、
XR 空间界面规范。

Deploy the full agency. 每个 phase 结束由 Project Shepherd 汇总，
Reality Checker 放行。
```

第三段真实运行结果在 `examples/nexus-spatial-discovery.md`：8 个 agent 并行，交付交叉引用一致的完整蓝图，无人工协调。

## 六、判断：谁该用，谁该等

**适合马上用**：

- 一个人或小团队同时用 2 个以上 agentic 工具。
- 有 SaaS / 产品从 0 到 1 sprint。
- 想把 agent 纳入版本控制，写 CI 校验。

**可以观望**：

- 只用一个工具、只跑 3-5 个固定 prompt 的独立开发者。
- 完全依赖 OpenCode（119 上限没修好之前）。

**不建议直接用**：

- 追求即插即用中文效果。仓库主要是英文 agent，中文场景要自己后置调整。

## 七、可收藏的命令清单

一次装齐（用户级 + 项目级混合）：

```bash
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents
./scripts/convert.sh

# 用户级
./scripts/install.sh --tool claude-code
./scripts/install.sh --tool codex
./scripts/install.sh --tool copilot
./scripts/install.sh --tool antigravity
./scripts/install.sh --tool osaurus
./scripts/install.sh --tool hermes

# 项目级（切到目标项目根目录）
cd ~/projects/my-saas
./scripts/install.sh --tool cursor --division engineering,design
./scripts/install.sh --tool aider
./scripts/install.sh --tool windsurf

# OpenCode 必须限制规模
./scripts/install.sh --tool opencode --division engineering,design,testing,security
```

只装最常用 12 个 agent：

```bash
cat > /tmp/my-agents.txt <<'EOF'
frontend-developer
backend-architect
senior-developer
devops-automator
sre
code-reviewer
prompt-engineer
ui-designer
ux-researcher
sprint-prioritizer
reality-checker
agents-orchestrator
EOF

./scripts/install.sh --tool claude-code --agents-file /tmp/my-agents.txt
```

日常查找与更新：

```bash
./scripts/install.sh --list teams
./scripts/install.sh --list agents
./scripts/install.sh --link                # 软链自动跟 upstream
git -C ~/…/agency-agents pull && ./scripts/convert.sh
```

## 八、我的最终判断

以前我对「agent 大合集」的第一反应是「又是一个 prompt 商店」。这次改看法。

Agency Agents 值得看，不是因为 agent 数量多，而是因为它把 agent 定义当作**可 CI、可 diff、可 dry-run 的工程 artifact**：

- `tools.json` / `divisions.json` 生死绑定 convert / install / lint 三条链。
- 单独给 Hermes 做懒加载 router，说明作者理解 context budget 的实际代价。
- NEXUS 把 Reality Checker、Evidence Collector 抽出来当 gate，说明作者理解 pipeline 失败点通常不在专家身上，在没人把关。

从今天起我不用在多个工具之间搬 prompt 了。维护一份 fork，agent 变更走 PR，CI 挂 `check-tools.sh`，剩下的交给两个脚本。

如果你在维护多工具的 agent 配置，直接 clone 下来跑一遍 `convert.sh`，按前面清单挑子集装到 Claude Code。跑一次你就知道它是不是你的菜。

---

**参考**：

- 主仓库：<https://github.com/msitarzewski/agency-agents>
- App：<https://agencyagents.app>
- OpenCode 上限 issue：<https://github.com/anomalyco/opencode/issues/27988>
- 完整示例产物：`examples/nexus-spatial-discovery.md`
