---
title: "把 AI 装进终端的正确方式：拆 crynta/terax-ai 的 7 MB 开发终端"
url: "/articles/2026/07/03/terax-ai-lightweight-terminal-agentic-workspace/"
date: "2026-07-03T09:30:00+08:00"
lastmod: "2026-07-03T09:30:00+08:00"
description: "读完 Terax 的 20k 字 TERAX.md，我改变了对「AI 终端」这四个字的理解。7-8 MB 的 Tauri 2 产物，Rust 后端把 OS 层全接了下来，AI 是一等原语，密钥进钥匙串，无账户无遥测。这一篇拆到源码级：架构、模块、AI 工作流、和它和 Warp/Wave/Cursor 的边界。"
tags: ["AI Terminal", "Tauri", "Rust", "Agent Skills", "开源项目"]
topic: "AI 工具"
topicSlug: "ai-tools"
layout: article
contentType: article
---

![封面](/images/terax-ai-lightweight-terminal-agentic-workspace/cover-zhihu.png)

先说结论。

绝大多数「AI 终端」的做法，是在旧终端旁边挂一个 chat 面板：右侧多一列，输入框里塞一段 prompt，回车把答案打在窗口里。这套做法上手快，但它治不了一件事——真正的终端工作永远发生在**当前工作目录里，和当前的进程共享同一颗心跳**。侧栏拿不到你正在跑的服务、拿不到 shell 的退出码、拿不到你刚刚 stage 但还没 commit 的 diff。它只是一个更贵的浏览器书签。

`crynta/terax-ai` 走的是另一条路。它不是把 AI 塞进终端，而是把终端重新设计成「AI 天生就是一等原语」的形态。

我把它的仓库拉下来，通读了 20k 字的 `TERAX.md`（这个仓库自己的架构文档，也是它塞给 AI Agent 当项目记忆的那份），然后按源码往下摸。这一篇是我对它的完整判断——包括谁应该现在装、谁再等一等、以及它跟 Warp、Wave、Cursor、iTerm2 的真实边界。

## 一个具体的差距：调 AI 修一个跑挂的 dev server

先摆一个真实场景。你在跑一个 `pnpm dev`，端口 3000，控制台开始报一个组件里的 hydration mismatch。传统流程是：

1. 复制报错，切窗口到 Cursor 或者浏览器。
2. 粘到 chat 里，AI 说：需要看那个组件的代码。
3. 你再复制粘贴文件路径、内容、prompt、context……
4. AI 给个改法，你再切回终端手动改。
5. 保存，等热更新，看结果。

这中间发生了什么？你和 AI 之间隔着**四层复制粘贴**。终端知道 cwd、编辑器知道文件树、浏览器知道报错、chat 什么都不知道——只知道你此刻塞给它的那点字符串。

Terax 的做法是这样：AI Agent 挂在同一个进程里，能直接调用「当前活跃 tab 的 cwd + 缓冲区末尾 300 行」（源码里叫 live context bridge，`App.tsx` 里 `setLive` 那一段），能调 `read_file` / `fs_grep` 自动读文件，能开 `shell_bg_spawn` 后台跑命令，甚至能通过 sub-agent 拆任务。**你只需要说「fix 这个 hydration 错误」，剩下的动作它自己完成**。写文件之前会弹一个 diff 让你 hunk-by-hunk 接受，跑 shell 会弹一个审批卡片，防止它 `rm -rf`。

这才叫「AI 是一等原语」。不是 UI 上多一列，是**架构上让 AI 直接摸到终端的状态**。

## 项目一句话说清

Terax 是一个用 **Tauri 2 + Rust** 做后端、**React 19 + xterm.js** 做前端的开源桌面终端，产物只有 7-8 MB。它把多标签终端、代码编辑器、文件浏览器、带 commit graph 的 git 面板、本地 dev server 预览、以及一个可以调 BYOK 云端模型或本地模型的 Agent 工作流塞进同一个可执行文件里。密钥进操作系统钥匙串，不做遥测，不需要注册账户。

跨平台：macOS、Linux（deb / rpm / AppImage）、Windows（NSIS + WebView2），Windows 上 WSL 是一等 workspace 环境，不是套壳。

许可证 Apache-2.0。

我看过太多号称「AI 原生」但实际上是套壳的项目，Terax 是少数**从进程模型开始就把 AI 当基础设施**的。

## 架构：两进程模型是它一切能力的根

![两进程模型](/images/terax-ai-lightweight-terminal-agentic-workspace/01-architecture.png)

这张图是我读完 `TERAX.md` 之后最想第一时间画出来的。所有 OS 层能力都在 Rust 侧，webview 从不直接触碰 FS、进程或网络——所有跨界调用走 `invoke()`。

Rust 侧划分得很干净（都能在 `src-tauri/src/lib.rs` 里找到对应命令）：

- `pty::*` — `portable-pty` 拉起的长生命周期 PTY 会话，输出通过 Tauri `Channel<PtyEvent>` 流式回前端。
- `fs::tree::*` / `fs::file::*` / `fs::mutate::*` / `fs::search::*` / `fs::grep::*` — 文件浏览器和编辑器 IO、模糊查找、内容搜索（基于 `ignore` + `grep-*` crate）。
- `git::commands::*` — 一整套 git surface：`git_status`、`git_diff`、`git_stage`、`git_commit`、`git_fetch`、`git_pull_ff_only`、`git_push`、`git_log`、`git_show_commit`……都走 workspace 授权注册表。
- `shell::shell_run_command` / `shell::shell_session_*` / `shell::shell_bg_*` — 三档 shell：一次性执行、跨调用状态的会话、以及带环形日志的后台进程（dev 服务器就靠这个）。
- `net::ai_http_request` / `ai_http_stream` / `lm_ping` — 带 SSRF 防护的 AI HTTP 代理。所有 provider 调用不从 webview 直接出，从 Rust 出，天然避开了浏览器同源和 CSP 的一堆坑。
- `secrets::secrets_*` — OS 钥匙串（服务名 `terax-ai`）。密钥永远不落盘、不进 `localStorage`。Linux 有一个 `#[cfg(target_os = "linux")]` 的文件回退。
- `lsp::*` — opt-in 的语言服务器（TS / rust-analyzer / pyright / gopls），未启用时零成本，14.5 kB 的 shell 只在你点「Enable」时才真正拉起进程。
- `workspace::*` — cwd 授权注册表和 WSL 桥。

**这个划分的好处不是「架构漂亮」，是每一层都能被 test 覆盖**。`pty/framing.rs`、`lsp/framing.rs` 是纯函数、可测试的；tauri 命令是薄壳；React 组件更薄。TERAX.md 里写得很直白：

> "New or changed logic lives in pure, dependency-light functions (functional core); tauri commands and React components stay thin (imperative shell)."

这是一个愿意长期维护的项目才会有的自我要求。

## 六个能力面：终端、编辑器、git、预览、主题、AI

![六个能力面](/images/terax-ai-lightweight-terminal-agentic-workspace/02-modules.png)

单独看每一面都不新奇。真正少见的是——**这六件事同时在 7 MB 里跑起来，还都做得能用**。我按重要度扫一遍。

### 终端

- xterm.js + WebGL 渲染器，多标签，后台标签保持数据流。
- 原生 PTY（zsh / bash / pwsh / fish / cmd）。
- Shell 集成通过 `OSC 7`（cwd）和 `OSC 133` A/B/C/D（提示符 + 命令边界 + 退出码），不用回去 parse prompt 字符串。
- 水平/垂直 split，inline search，link detection，true color。
- **Windows 上 WSL 是一等 workspace**，不是子进程套壳。

我最想说的是渲染器池那段。TERAX.md 里写：xterm 的渲染 slot 是池化的（`rendererPool.ts`，最大 5 个）——隐藏的 tab 如果正在跑前台任务（OSC 133 C..D 之间、或 agent 信号、或 `pty_has_foreground_job`），live grid 会 park 住、CSS `display:none` 暂停渲染；空闲隐藏 tab 释放 slot 但缓冲区保留，被别人抢占 slot 时才 lazy 序列化。**永远不会在命令跑到一半时序列化——因为 Claude Code 那种一直重绘 TUI 的应用，一序列化再重放就整个花掉**。

这段是「他们真的在做终端」的信号。做过 xterm 集成的都知道渲染性能和缓冲区管理是最容易踩坑的地方。

### 编辑器

CodeMirror 6，vim mode，10 套内置主题（Atom One / Aura / Copilot / GitHub / Gruvbox / Nord / Tokyo Night / Xcode）。**编辑器主题跟 app 主题解耦**——你可以整个 app 走 Kanagawa，编辑器单独用 Copilot；也可以让编辑器跟着 app 主题的 pairing 走（`editorTheme` 是 `"auto" | EditorThemeId`，默认 auto）。

AI 编辑不是直接改文件，而是打开一个 `ai-diff` 类型的 tab，让你按 hunk 接受或拒绝。这是我个人最喜欢的设计——「AI 提议、人类审批」比「AI 直接改」安全一个数量级。

### git / source control + git history

![Git 面板](/images/terax-ai-lightweight-terminal-agentic-workspace/source-control.png)

- Stage / unstage hunks，Cmd+Enter / Ctrl+Enter 提交，push 有 upstream awareness。
- 分支显示（含 detached HEAD）。
- 一个真正的 commit graph，lane rendering，merge 和分支能看清。
- 搜 commit、点击直达远端 commit 页。

这里比大多数「顺手做的 git 面板」重得多。Gitkraken / Fork 那种独立客户端有的东西，Terax 在终端窗口里就有。

### 编辑器 + AI 工作流

![AI 工作流](/images/terax-ai-lightweight-terminal-agentic-workspace/ai-workflow.png)

AI 子系统才是我最想拆的一块。

**BYOK provider**：OpenAI、Anthropic、Google (Gemini)、xAI (Grok)、Cerebras、Groq、DeepSeek、OpenRouter、Mistral，加任何 OpenAI-compatible 端点。**本地 / 离线**：LM Studio、MLX、Ollama。全都是 Vercel AI SDK v6，走的是 `Experimental_Agent` + `DirectChatTransport`，`stopWhen: stepCountIs(MAX_AGENT_STEPS)`。

**工具审批策略**是我看过的里面最合理的：

- 读取类工具（`read_file`、`list_directory`、`fs_search`、`fs_grep`）自动执行。
- 写入 / 破坏性工具（`write_file`、`create_directory`、`rename`、`delete`、`run_command`、`shell_session_run`、`shell_bg_spawn`）都设了 `needsApproval: true`，AI SDK 暂停，弹 UI 审批卡片。
- 密钥路径有一个 deny-list（`.env*`、`.ssh/`、credentials、keychain 目录），**读写两端都拦，永远不让 bypass**。这是真的把 AI 当成不可信输入源在处理。

**Sub-agent**：可以定义命名的子 agent，各自带 system prompt 和工具子集，主 agent 通过 `run_subagent` 工具调用。这是 Claude Code / Codex 已经在做的事，Terax 也做了，而且是内嵌在终端里的。

**会话**：对话组织成命名 session，持久化到 `terax-ai-sessions.json`。切换 API key 会清空 chat map，但 session 本身保留。

**项目记忆**：Terax 会从 workspace root 加载 `TERAX.md` 当 agent memory（跟 `AGENTS.md` / `CLAUDE.md` 同一套约定）。这是我给这个项目最大的加分——**它在自己的仓库里就用了自己的记忆约定来写自己的架构文档**。dogfooding 到这个程度的项目已经不多见了。

**Composer**：`#handle` 引 snippet，`@path` 引文件，slash command，voice 输入，从 explorer 或选中态直接 attach 到 agent。选中内容不会粘进 textarea，而是包装成 `<selection source="terminal|editor">…</selection>` 块，在提交时才拼进去。这是我很欣赏的细节：**上下文和用户输入分离**，AI 不会把它误读成指令。

### Web 预览

![Web 预览](/images/terax-ai-lightweight-terminal-agentic-workspace/web-preview.png)

自动检测本地 dev server（有 localhost URL 时状态栏 pill 提示），打开就是一个 preview tab，用原生 child webview 渲染。图片、PDF、Markdown 也走同一个 preview surface。

这不是套一个 iframe——是**沙箱化的原生子 webview**，跟主进程隔离。跑一个不受信的 demo 网站不会污染 Terax 本身。

### 主题和自定义

![主题](/images/terax-ai-lightweight-terminal-agentic-workspace/themes.png)

15 套内置主题（terax-default / claude / kanagawa / tokyo-night / catppuccin / rose-pine / everforest / nord / gruvbox / dracula / solarized / tide / sage / caffeine），支持背景图 + 模糊 + 透明度，可以 in-app 编辑主题并导入分享。

自研主题引擎，不用 `next-themes`——`ThemeProvider` + `applyTheme` 直接写 CSS variables。用户主题在 `customThemes.ts`，验证在 `validateTheme.ts`。

## Terax 和 Warp / Wave / Cursor / iTerm2 的真实边界

![对比](/images/terax-ai-lightweight-terminal-agentic-workspace/03-boundary.png)

我经常看到「Terax 是 Warp 的替代吗」这类问题，答案是：**它们瞄准的用户不是同一群人**。

- **Warp**：云端账户 + 云端 AI，团队场景强，但你的命令历史、AI 交互都在他们那边。它是「有账户的 AI 终端」。
- **Wave**：AI 终端 + workspace（tab 里可以放 note、AI chat、终端），介于终端和 workspace 之间。
- **Cursor**：AI 编辑器，本质是 VS Code fork，不是终端。
- **iTerm2**：老牌 macOS 终端，无 AI，稳定第一。
- **Terax**：AI 原生开发终端，7-8 MB，无账户、无遥测，密钥进钥匙串，本地模型一等公民。

选 Terax 的关键：你要**「AI 原语 + 轻量 + 本地可控」**。不选的关键：你想要**托管账户、多人协作、或者「一个能替代 IDE 的东西」**。

Terax 不是 IDE。它的 ROADMAP.md 明确写了：

> "Not a full IDE replacement. Heavy IDE features that overlap with VS Code / Cursor / Zed are out of scope."

## 五分钟上手：装 + 配 AI + 跑一个 agent 任务

### 装

**macOS / Linux / Windows**：直接去 [Releases](https://github.com/crynta/terax-ai/releases/latest) 页拿 installer，Terax 自己带 auto-updater。

**Arch / AUR**：

```bash
yay -S terax-bin
```

**NixOS / Nix**：

```bash
nix profile install github:crynta/terax-ai
```

**AppImage 用户**：需要 FUSE。没有 FUSE 时：

```bash
./Terax_*.AppImage --appimage-extract-and-run
```

Wayland 上如果渲染有花屏，加环境变量：

```bash
WEBKIT_DISABLE_DMABUF_RENDERER=1 ./Terax_*.AppImage
```

`.deb` / `.rpm` 通常比 AppImage 更顺。

**Windows** 首次启动 SmartScreen 会拦（还没 code-sign），点 More info → Run anyway。默认 shell 探测顺序：`pwsh.exe` (PS 7+) → `powershell.exe` (PS 5.1) → `cmd.exe`。

### 配 AI

1. Settings → AI。
2. 选 provider，粘 API key。
3. 想跑本地：把 endpoint 指向你的 LM Studio / MLX / Ollama。默认端口它自己会试。

Key 存到 OS 钥匙串，服务名 `terax-ai`。**永远不会落到 disk 或 localStorage**。这一条你可以自己去看 `secrets::secrets_*` 的实现。

### 跑一个真实 agent 任务

在 workspace 根新建一个 `TERAX.md`，告诉 agent 这个项目是什么。举例：

```markdown
# TERAX.md

## Project
一个 Vite + React 19 的组件库，pnpm workspaces。

## Conventions
- Imports 用 `@/...`，从不跨模块相对路径
- 提交前先 `pnpm lint && pnpm check-types && pnpm test`

## Where to look
- 主入口：`src/index.ts`
- 组件：`src/components/`
```

然后在 composer 里输入：

```
@src/components/Button.tsx 帮我加一个 loading state，
参考现有 Props 的类型风格，写完跑一遍 pnpm check-types。
```

会发生什么：agent 读文件（自动通过）→ 生成 diff（弹 ai-diff tab，你 hunk-by-hunk 接受）→ 跑 `pnpm check-types`（弹审批，你确认）→ 报结果。中间任何一步你都可以停。

## 从源码构建（想自己改的话）

```bash
# 依赖
# - Rust stable (rustup)
# - Node 20+
# - pnpm
# - Tauri prerequisites: https://tauri.app/start/prerequisites/

pnpm install
pnpm tauri dev            # 开发
pnpm tauri build          # 打包

# 检查
pnpm exec tsc --noEmit                                            # 前端类型
cd src-tauri && cargo clippy --all-targets --locked -D warnings   # Rust lint
cd src-tauri && cargo test --locked                               # Rust 测试
```

TERAX.md 有一整段「Quality bar」写得挺严：production-grade 才 ship，correctness / performance / security / UX / architecture 每一项都要过关。

## 一份可收藏的判断清单

**它现在能给你什么**：

- 一个 7-8 MB 的 AI 原生终端。跨平台。
- 一个能真正读到你 cwd + shell 状态 + 文件树的 agent，工具审批完整。
- 一个带 lane graph 的 git 面板。
- 15 套主题、编辑器主题解耦。
- 密钥进钥匙串、无遥测、无账户。

**它现在不能给你什么**：

- 完整的 IDE 体验（无 project-wide refactor、无 debugger、无 IDE-scale search）。
- 云端多人协作、账户系统、命令历史同步。
- SSH 支持（roadmap 里，还没做）。

**你应该现在装**：

- 你终端在多、想让 AI 直接摸到 shell 状态的开发者。
- 想跑本地模型（LM Studio / MLX / Ollama）+ 不想密钥泄漏的人。
- 用 WSL 的 Windows 开发者（一等 workspace 环境）。
- 喜欢开源 / 无遥测 / Apache-2.0 的人。

**你应该再等等**：

- 需要 SSH 到远端做主要开发的（还没做）。
- 想把它当 Cursor 用的（Cursor 是编辑器，Terax 是终端）。
- 需要团队账户 / 命令历史多端同步的（out of scope）。

## 我怎么判断一个「AI 终端」项目值不值得看

我看开源 AI 终端时会问四件事，你可以拿去筛别的项目：

1. **AI 有没有摸到 shell 状态？** 只是给 chat 面板 = 侧栏；能读 cwd + buffer + 选中态 = 一等原语。
2. **写操作是否强制审批？** 无审批直接跑 shell / write file 的项目，一次错误决策就足够毁掉你半天工作。
3. **密钥去哪了？** localStorage / 落盘 = 危险；OS 钥匙串 = 及格。
4. **有没有 sub-agent + 项目记忆？** 单 agent 只能做小事；能拆任务 + 记住项目约定的才叫 agent 系统。

Terax 这四条全过。这就是我拆完它的架构、认为它「不是又一个 AI 终端 fork」的原因。

## 参考

- GitHub 仓库：[crynta/terax-ai](https://github.com/crynta/terax-ai)
- 官网：[terax.app](https://terax.app)
- 文档：[terax.app/docs](https://terax.app/docs)
- 官网源码：[crynta/Terax-website](https://github.com/crynta/Terax-website)
- Roadmap：仓库根 `ROADMAP.md`
- 架构文档：仓库根 `TERAX.md`（也是它给 agent 的项目记忆）
- License：Apache-2.0

如果你也在做 AI 终端 / AI 桌面工具，`TERAX.md` 值得完整读一遍——把它当作一份「production-grade Tauri + AI 应用」的公开范本。
