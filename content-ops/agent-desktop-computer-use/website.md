---
title: "Vercel 开源的 1.5 万 Star 工具：让 AI 不用截图、不靠像素，直接「读懂」你的桌面"
slug: "agent-desktop-computer-use"
date: 2026-11-05
draft: false
categories: ["开源项目", "AI Agent"]
tags: ["开源", "Vercel", "Computer Use", "AI Agent", "Rust", "无障碍", "桌面自动化", "MCP", "CLI"]
cover: "/images/agent-desktop-computer-use/cover.png"
description: "vercel-labs/agent-desktop 是 Vercel Labs 开源的 Computer Use CLI（Apache-2.0，Rust 约 35 万行、2628 个源文件）：与主流「截图+视觉模型+像素坐标」的 computer use 不同，它直接读取操作系统的无障碍树（macOS AX API / Windows UI Automation / Linux AT-SPI），把桌面 App 的界面结构化成带 ref 的 JSON，Agent 对 ref 点击、输入，再重新快照验证，形成确定性的 observe→act→verify 循环，内部不含任何模型。默认无头（不移动鼠标、不抢焦点），60 个命令名/56 个操作命令，支持 CLI、C 库和 stdio MCP server，npm 月下载约 3.1 万。本文克隆仓库拆解它的快照/ref 严格解析机制、三态证据模型、防窗口句柄复用的身份校验、平台适配架构和安全边界（快照可能含隐私、密钥走 stdin），也说清它的局限：依赖 App 无障碍支持质量、部分操作必须 headed、1.2 版仍在快速迭代。"
---

过去一年"让 AI 操作电脑"（computer use）的主流玩法你大概已经见过：给大模型一张屏幕截图，模型用眼睛找按钮、输出像素坐标，然后模拟鼠标点过去。能用，但你也一定见过它的翻车现场——分辨率一变就点空、相似按钮分不清、点没点中还得再截图猜。

Vercel Labs 开源的 [agent-desktop](https://github.com/vercel-labs/agent-desktop) 走了一条完全不同的路：**不让 AI"看"屏幕，而是让它直接"读"操作系统的无障碍树（accessibility tree）。** 界面在它眼里不是像素，而是一份结构化的 JSON——每个可操作元素都带一个 ref 句柄，点按钮变成对 ref 发指令，不需要图像识别，也没有坐标猜谜。

项目数据先摆出来：**15,585 Star、1,083 Fork，Apache-2.0 协议，核心用 Rust 写成（2628 个 .rs 文件、约 35 万行），npm 包月下载约 3.1 万次**，2026 年 2 月建仓，11 月 5 日刚发布 1.2.0。我把仓库克隆下来通读了 README、CONCEPTS 和 CHANGELOG，这篇讲清楚它的原理、工程上最硬核的几个设计，以及它的边界。

## 一、核心思路：把桌面变成一个带句柄的 JSON API

一句话概括它的工作方式：**快照（snapshot）→ 对 ref 操作（act）→ 再快照验证（verify），循环往复。**

![agent-desktop 的 observe→act→verify 工作循环](/images/agent-desktop-computer-use/loop.png)

安装就是一行：

```bash
npm install -g agent-desktop
agent-desktop status                # 查看平台、权限、支持的界面
agent-desktop permissions --guide   # macOS 引导开启辅助功能授权
```

实际交互长这样：

```bash
agent-desktop snapshot --app Finder -i      # 拿到所有可交互元素，每个带 ref
agent-desktop click '@s8f3k2p9:e8'          # 对快照里的 ref 点击
agent-desktop snapshot --app Finder -i      # 重新快照，验证结果
```

每次命令输出一个 JSON 信封（envelope）。快照的精简结构是这样的：

```json
{
  "version": "2.6",
  "ok": true,
  "command": "snapshot",
  "data": {
    "app": "Finder",
    "snapshot_id": "s8f3k2p9",
    "ref_count": 59,
    "tree": {
      "role": "window",
      "name": "Downloads",
      "children": [
        { "role": "treeitem", "name": "Documents",
          "ref_id": "@s8f3k2p9:e8",
          "available_actions": ["Click"] }
      ]
    }
  }
}
```

关键在于：**agent-desktop 内部没有任何模型。** 它不做推理、不做决策，只负责"读界面"和"执行动作"两件确定性的事；观察—决策—验证的智能循环完全住在你自己的 Agent（Claude Code、Cursor、自研 Agent 等）里。它把自己定位成 Agent 的"眼睛和手"，而不是"大脑"。

这和截图派的差别是本质性的：

| 维度 | 截图 + 视觉模型 | agent-desktop（无障碍树） |
|---|---|---|
| 感知方式 | 像素截图，模型识别 | 系统 API 的结构化语义树 |
| 定位 | 猜坐标，受分辨率/缩放影响 | ref 句柄，语义定位 |
| 成本/延迟 | 每步一次视觉模型调用 | 本地 JSON，无 token 费用 |
| 可靠性 | 相似元素易混淆 | 严格身份校验，歧义直接报错 |
| 无头能力 | 通常要真实屏幕 | 默认无头，不移动鼠标不抢焦点 |

## 二、最硬核的设计：ref 不是坐标，而是一份"捕获证明"

如果只是"读无障碍树然后点元素"，这工具不值 1.5 万 Star。它真正的工程含量在 CONCEPTS.md 里——**怎么保证你点下去的那个 ref，在 UI 变化之后仍然指向当初那个元素，而不是另一个长得一样的控件。**

### 1. ref 属于且仅属于它的快照

每个 ref 都带快照限定符，形如 `@s8f3k2p9:e8`。裸写 `@e8` 会被直接拒绝（`INVALID_ARGS`）。当界面发生变化，旧 ref 会返回 `STALE_REF`（过期）或 `AMBIGUOUS_TARGET`（有歧义），要求你重新快照——**它宁可失败，也不猜。**

### 2. 严格解析（Strict Ref Resolution）：fail-closed

重新解析一个 ref 时，它拿捕获时存下的完整身份证据（role + native id + 稳定的 name/description）在当前窗口里重新计数匹配：恰好一个匹配才执行；零个匹配判过期，两个及以上判歧义。**控件的当前值和坐标从不参与身份判断**——因为值会变、窗口会移动。

macOS 上更强：ref 直接存了元素的无障碍地址（`retained_object`），元素活着且进程/role/标识仍匹配时直接还原，应用重启或元素销毁则判过期，两个"双胞胎"控件各有各的 ref。

### 3. 防操作系统的"句柄复用"

这是我觉得最老到的细节。操作系统的窗口句柄（Windows 的 HWND、macOS 窗口号、Linux 的 X11 client id）在窗口销毁后**可能被分配给另一个新窗口**。所以句柄 alone 不能当身份。它的做法是句柄 + 进程创建时间令牌（process-generation token）双重佐证，并且在每次写操作**执行前立即复核一次**——防止"检查时是对的、点击时窗口已被换了住户"。截图派工具几乎不会考虑这一层。

### 4. 证据三态：Known / Absent / Unknown 绝不合并

适配器读到的每个属性只有三种状态：已知、确认不存在、读失败不可信。`Absent`（问了，系统说没有）和 `Unknown`（没读到）被严格区分——一个没回应的目标不能伪装成"它没有这个属性"。任何角色或状态只在系统给出**正面证据**时才授予，读失败就宁可不写。这避免了"每个无关节点都被装饰上一堆假状态"的常见自动化 bug。

### 5. Web 容器的"透明折叠"

Electron/Chromium 这类 Web 套壳应用会制造大量匿名容器节点（UIA 的 Group/Custom/Pane、AX group、AT-SPI panel），能把树深撑爆一个数量级。它的处理是：无名、无值、无开发者标识、除了滚动没有任何动作的"透明包装"跳过逻辑深度；但这个跳过在 Windows 上要先验证 Chromium 来源（窗口类 `Chrome_WidgetWin_1`），因为原生栈里匿名容器是正常现象，不能一刀切。

## 三、三种用法：CLI、C 库、MCP server

![三种接入方式与适用场景](/images/agent-desktop-computer-use/usage.png)

- **CLI（最常用）**：60 个命令名、56 个可操作命令，按职责分组——观察（snapshot/find/get/is/screenshot）、ref 操作（click/type/select/toggle/check/scroll 等 16 个）、键鼠底层（press/hover/drag/mouse-wheel 等）、应用与窗口（launch/list-windows/resize/minimize 等）、通知、剪贴板、等待、会话与系统。注意 `key-down/up`、`mouse-down/up` 这 4 个默认拒绝执行，要等守护进程能保证"按住的键一定被释放"才开放——防止 Agent 异常退出后键盘卡在按下状态。
- **C 库（libagent_desktop_ffi）**：每个 release 附带动态库，可以进程内调用，Python 用 ctypes、其他语言 FFI 都行。1.1 版把 C ABI 主版本升到 7，并有意让 C 调用方无法走"精确解析"那条需要捕获证明的路径，强制走快照 ref。
- **MCP server（1.2.0 新增）**：`agent-desktop mcp` 通过 stdio 把每个命令暴露成 MCP 工具（`desktop_snapshot`、`desktop_click`……），配置只有三行：
  ```json
  { "mcpServers": { "agent-desktop": {
      "command": "agent-desktop", "args": ["mcp"] } } }
  ```
  全局 flag（`--session`、`--headed`、`--trace`）对每次调用生效。

它还自带与二进制版本匹配的技能包：`agent-desktop skills get desktop` 输出操作循环、ref 和重试规则，`skills get platform` 输出当前系统的差异；也能通过 `npx skills add` 直接装进 Agent harness，或写进 AGENTS.md。一条重要的安全规则：**只在错误的 `disposition.retry` 标记为 `safe` 时才重试**，否则重试可能造成重复下单、重复提交。

## 四、平台架构：一套核心，三个适配器，编译期定平台

![Rust 分层架构与三大平台的无障碍 API](/images/agent-desktop-computer-use/arch.png)

Rust workspace 分五个 crate：`core`（领域模型、ref 解析、证据规则）、`ffi`（C ABI）、`macos`/`windows`/`linux` 三个平台适配器。核心只通过一个 `PlatformAdapter` trait 接触操作系统，每个二进制只为本机 OS 编译：

| 平台 | 系统要求 | 无障碍 API |
|---|---|---|
| macOS | 13+，Intel/Apple Silicon | AX API |
| Windows | 10 1809+，x64/ARM64 | UI Automation |
| Linux | Ubuntu 24.04+，x86_64/aarch64，X11 或 Wayland | AT-SPI |

三家的分类法并不平行，适配器要做大量语义折衷。比如同一个开关控件：macOS 报成 `button` + `pressed` 状态，Windows 会把带 toggle 能力的 Button 重分类为 `switch` + `checked`，Linux 报 `checked` 而把 `pressed` 留给普通按钮——CONCEPTS 里明确说这是"两个正确映射相遇"，不是 bug。核心拥有一套封闭的 role/state 词表，适配器**绝不允许自造 token**，识别不了的角色只能报 `unknown`（这本身是一个正面陈述）。

还有两个很实用的工程特性：

- **默认无头（headless）**：ref 操作走无障碍 API，不移动真实鼠标、不抢窗口焦点，意味着多个 Agent 可以并行工作而不互相干扰；需要物理输入时才加全局 `--headed`。
- **部分快照与下钻**：Slack 这类密集应用先用 `snapshot --skeleton --compact` 看骨架，再用 `--root @ref` 只观察某个子树。快照超时不整体失败，返回已观察到的部分并逐节点标注哪里被截断；但下钻要求底层观察必须完整——宁可报错也不破坏无法重新分配的后代 ref。

## 五、安全与隐私：把"桌面自动化"的风险摆到明面上

能读你整个桌面的工具，安全设计必须经得起审视，这个项目在文档里相当坦诚：

- README 开篇就警告：**快照、剪贴板内容、截图、命令输出和调试产物都可能包含隐私数据，禁止放进公开日志和上传。**
- 密钥不落进程参数：`type`、`set-value`、`clipboard-set` 支持 `--stdin` 从管道读文本，密码类步骤单独成命令执行——因为 `batch` 的 JSON 会出现在进程参数里（`ps` 可见）。
- 窗口/显示器身份都做失效关闭（fail-closed），截图前后还有"身份三明治"校验，防止捕获中途显示器热插拔导致像素被记到错误屏幕名下。
- 权限模型交给操作系统：macOS 必须显式授予辅助功能权限，`permissions --guide` 全程引导；Linux 的 Wayland/X11 差异、Windows 的可信工作区要求都在平台文档里列明哪些能无头、哪些必须 headed、哪些直接拒绝。
- 遥测方面仓库文档强调快照数据不出本机，Agent 循环在用户自己的进程里。

## 六、局限：它不是万能的"电脑接管者"

为了不写成软文，边界要说清楚：

1. **能力上限取决于 App 的无障碍实现质量。** 自绘 UI、游戏、Canvas/WebGL 里的内容、没有暴露 AX/UIA 语义的控件，它读不到——这类场景截图派反而有优势。两者是互补不是替代。
2. **部分操作必须 `--headed`**，平台文档逐类标注了 headless 可行、需要物理输入、直接拒绝三种情况；Linux 下窗口管理器动画期间的移动/缩放要等动画结束确认才算数。
3. **它只给机制不给智能**：没有模型意味着你需要自己配 Agent、自己写循环和重试策略；对不会写 prompt/Agent 编排的普通用户有门槛。
4. **仍在快速迭代**：1.0→1.1→1.2 不到一周一个 minor，envelope 版本到 2.6、C ABI 已经发生过破坏性升级（v7），生产集成需要锁版本并跟迁移文档。
5. 166 个 open issues、跨三平台的适配矩阵庞大，边缘场景（多窗口歧义、菜单/弹层生命周期、Electron 深树）仍在持续打磨。

## 七、上手路径

```bash
# 安装（npm/bun/yarn/pnpm 均可，含 x64/ARM64 原生二进制；macOS/Linux 也可 brew install agent-desktop）
npm install -g agent-desktop
agent-desktop status && agent-desktop permissions --guide

# 最小循环
agent-desktop snapshot --app Finder -i
agent-desktop click '<快照里的 ref>'
agent-desktop snapshot --app Finder -i

# 或直接作为 MCP server 接进你的 Agent
# {"mcpServers":{"agent-desktop":{"command":"agent-desktop","args":["mcp"]}}}
```

文档主站在 [agent-browser.dev/desktop](https://agent-browser.dev/desktop)，概念词汇表看仓库里的 CONCEPTS.md。

## 结语

agent-desktop 代表了 computer use 的另一条技术路线：**当操作系统本身已经维护了一份完整、语义化、可查询的界面描述（无障碍 API），为什么还要让视觉模型把像素重新"猜"回结构？** 它用严格的 ref 身份模型、证据三态、句柄复用防护这些扎实的分布式系统式设计，把桌面操作从"看起来像 AI 在点鼠标"变成了可验证、可重试、可并行的确定性调用。

Vercel 把它放在 Labs 下以 Apache-2.0 开源、同时提供 CLI/C 库/MCP 三种接入，野心显然是成为 Agent 操作桌面应用的标准底层。如果你在做需要操作真实软件（而不只是浏览器）的 Agent，这个项目值得立刻装上试一轮——尤其当你受够了截图派的点空和幻觉。

> 项目地址：[https://github.com/vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop) ｜ 文档：[agent-browser.dev/desktop](https://agent-browser.dev/desktop)
> 协议：Apache-2.0 ｜ 最新版本：1.2.0（2026-11-05）｜ 数据基准：2026-11-05
>
> 本文基于仓库源码、README、CONCEPTS.md 与 CHANGELOG 撰写，命令与平台支持以官方最新文档为准。
