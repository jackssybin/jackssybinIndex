---
title: "我拆了一遍 Claw Code：AI 编程助手真正难的不是聊天，而是可控执行"
url: "/articles/2026/06/12/claw-code-agent-harness-deep-dive.html"
date: "2026-06-12T00:00:00+08:00"
lastmod: "2026-06-12T00:00:00+08:00"
description: "基于 ultraworkers/claw-code 仓库的实测与源码拆解，分析一个 AI 编程 Agent 从聊天框走向可控执行系统时，必须补齐的模型路由、权限沙箱、工具协议、Skills/MCP、JSON 输出和测试 harness。"
tags: ["AI", "Agent", "Claw Code", "AI 编程", "Rust", "MCP", "教程"]
topic: "AI、Agent 与本地模型"
topicSlug: "ai-agent"
layout: article
contentType: article
---
# 我拆了一遍 Claw Code：AI 编程助手真正难的不是聊天，而是可控执行

> 项目地址：`https://github.com/ultraworkers/claw-code.git`  
> 本文不是“十分钟上手”那种轻教程，而是一次工程视角拆解：一个能改代码、跑命令、接工具的 AI CLI，到底要靠什么才能不失控。

![Claw Code 深度拆解封面](/images/claw-code-tutorial/v2/cover.png)

我一开始看 `ultraworkers/claw-code`，以为它只是又一个 Claude Code / Codex CLI 风格的开源复刻。真正翻完 README、`USAGE.md` 和 `rust/` 工作区后，我改了判断。

这个仓库最值得看的不是“它能不能替你写代码”，而是它把 AI 编程助手背后的难题暴露得很完整：模型怎么路由，权限怎么收口，工具怎么执行，MCP 怎么降级，Skills 怎么发现，JSON 输出怎么给自动化系统用，测试怎么覆盖工具调用。

换句话说，Claw Code 不是一个普通聊天壳。它更像一份公开的 agent harness 剖面图。

## 1. 先看定位：它自己都没把自己包装成万能产品

README 里有一段很有意思的提醒：Claw Code 不是最严肃的生产项目，更像一个由 agent 管理的 exhibit。如果你只是想跑稳定日常任务，README 还会指向 LazyCodex、Gajae-Code 这类更偏使用的项目。

这反而让我觉得它值得写。很多 AI 工具的宣传会把“能聊天、能改文件、能执行命令”揉成一句话，但真正落地时，这三件事之间隔着一整套工程系统。Claw Code 没有把这些复杂度藏起来。

![Claw Code GitHub 仓库截图](/images/claw-code-tutorial/v2/github-repo.png)

当前仓库根目录既保留了一些 Python/归档辅助代码，也把主线放在 `rust/`：

```text
rust/
  Cargo.toml
  crates/
    rusty-claude-cli/
    runtime/
    api/
    tools/
    commands/
    plugins/
    claw-rag-service/
    mock-anthropic-service/
```

这不是一个单文件 demo，而是按 agent runtime 的关键边界拆了 crate。

## 2. 我的本机实测：先卡在 Rust 工具链，而不是模型

这次我在 Windows PowerShell 环境里做调研，Node 和 pnpm 可用，但本机没有 Rust 工具链：

![本机命令实测截图](/images/claw-code-tutorial/v2/terminal.png)

这件事也值得写进教程。很多文章会直接从 `cargo build --workspace` 开始，好像每个人环境都已经就绪。但对 Claw Code 这种 Rust CLI 来说，第一步不是模型 key，而是工具链。

最小检查：

```powershell
node -v
pnpm -v
cargo --version
rustc --version
```

如果 `cargo` 或 `rustc` 不存在，先装 Rust：

```powershell
winget install Rustlang.Rustup
```

或者去 `https://rustup.rs/` 安装。安装后重新打开 PowerShell，再运行：

```powershell
rustup default stable
cargo --version
rustc --version
```

然后再构建：

```bash
git clone https://github.com/ultraworkers/claw-code.git
cd claw-code/rust
cargo build --workspace
```

构建完成后，Windows 二进制通常在：

```text
rust\target\debug\claw.exe
```

macOS/Linux 则是：

```text
rust/target/debug/claw
```

## 3. 为什么我说它是 harness，而不是聊天框

一个聊天框只需要把用户输入发给模型，再把文本展示回来。Claw Code 要处理的是另一类问题：模型可能要求读文件、写文件、跑 shell、找符号、查 MCP 服务、加载项目记忆、保存会话、输出 JSON。

这时真正的系统边界变成这样：

![Claw Code 运行时架构图](/images/claw-code-tutorial/v2/architecture.png)

我把它拆成四层：

第一层是入口。包括交互 REPL、一次性 `prompt`、slash commands、`status`/`doctor` 这类直接命令。

第二层是 runtime。它决定上下文怎么组装，模型怎么选，权限从哪里来，会话怎么恢复，工具执行结果如何返回给模型。

第三层是工具和扩展。包括 read/write/bash/grep/glob，也包括 Skills、MCP、plugins。

第四层是自动化接口。比如 `--output-format json`、`status` 的结构化字段、`doctor` 的诊断结果。它让 Claw 不只是给人用，也能被 CI 或内部平台调用。

## 4. 安装后的第一条命令应该是 doctor

官方文档反复强调：先跑 `doctor`。

```bash
cd rust
./target/debug/claw doctor --output-format json
```

Windows：

```powershell
.\target\debug\claw.exe doctor --output-format json
```

这不是形式主义。Agent CLI 的失败原因比普通 CLI 多太多：

```text
模型 key 错了
模型名路由错了
base url 少了 /v1
本地模型能聊天但不支持 tool call
权限模式不允许写入
MCP 某个 server 配坏了
项目记忆文件加载错了
```

如果没有 `doctor`，你只能在一堆症状里猜。Claw Code 把 `doctor`、`status`、`sandbox` 都做成可输出 JSON 的诊断面，这点很工程化。

## 5. 模型路由：它不是 Claude-only，但不要误会兼容成本

Claw Code 默认模型常量指向 Anthropic 风格，源码里能看到类似：

```text
DEFAULT_MODEL = "anthropic/claude-opus-4-7"
```

但文档明确说它不是 Claude-only。它支持 Anthropic，也支持 OpenAI-compatible、provider-routed、本地模型。

Anthropic 最直接：

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
claw --model sonnet prompt "总结这个仓库"
```

OpenAI-compatible：

```bash
export OPENAI_API_KEY="你的 key"
export OPENAI_BASE_URL="https://api.openai.com/v1"
claw --model "openai/gpt-4.1-mini" prompt "列出目录结构"
```

Ollama：

```bash
ollama pull qwen3:latest
ollama serve
export OLLAMA_HOST="http://127.0.0.1:11434"
claw --model "qwen3:latest" prompt "Reply exactly HELLO_WORLD_123"
```

这里有一个容易被忽略的坑：普通聊天通过，不代表工具调用通过。AI 编程 Agent 依赖 tool-call wire format，本地模型和兼容网关经常在这里出问题。我的建议是三段式验证：

```text
先测普通 prompt
再测 read/grep 这种只读工具
最后才让它写文件或跑命令
```

## 6. 权限系统才是 AI 编程助手的安全阀

我认为 Claw Code 最值得普通开发者学习的点是权限，而不是某个命令。

常见模式：

```bash
claw --permission-mode read-only prompt "分析这个仓库"
claw --permission-mode workspace-write prompt "更新 README"
claw --permission-mode danger-full-access prompt "..."
```

我的实际使用原则：

```text
陌生仓库：read-only
明确要改文件：workspace-write
需要危险命令：单次确认，不常驻 danger-full-access
```

为什么这么强调？因为 AI 的风险不是“它会说错”，而是“它说错时还拥有执行权限”。一个能 `rm`、能改配置、能写 CI、能访问环境变量的助手，本质上是自动化系统，不是聊天工具。

Claw Code 在 `status` JSON 中记录 model provenance、permission provenance 之类信息，说明它不是只关心“结果”，也关心“这个结果是在什么权限和模型来源下产生的”。这对审计很关键。

## 7. Skills 和 MCP：把个人提示词变成可复用能力

Claw Code 支持 Skills inventory/install/uninstall，也有 MCP lifecycle 和 inspection。这里要分清两件事。

Skills 更像“本地流程说明包”。一个最小 skill：

```text
my-skill/
  SKILL.md
```

适合沉淀固定流程，比如发布文章、代码审查、安全扫描、迁移规则。

MCP 更像“外部能力接入层”。比如数据库、浏览器、知识库、内部工单系统。对企业来说，MCP 往往比聊天模型本身更重要，因为真正的上下文和动作都在内部系统里。

Claw Code 的文档还强调了 MCP 部分失败时的结构化报告：有效 server 仍保留，坏配置进入 `invalid_servers[]`，`doctor` 和 `status` 都能报告。这种“部分降级而不是全盘失败”的设计很值得借鉴。

## 8. JSON 输出：给自动化系统用，而不是给人复制粘贴

很多 CLI 的 JSON 输出只是附加功能。Claw Code 的 JSON 输出更像一等接口。

```bash
claw status --output-format json
claw init --output-format json
claw doctor --output-format json
claw mcp --output-format json
```

这背后的理念很简单：人可以读文本，系统必须读结构。CI、内部平台、自动修复机器人不应该靠正则解析一句英文。

比如 `init` 返回 `created[]`、`updated[]`、`skipped[]`，脚本就能判断是否需要提交。`status` 暴露 memory files、MCP validation、hook validation，平台就能定位配置问题。

这也是我觉得它比“套壳聊天 CLI”更有研究价值的地方。

## 9. Mock parity harness：Agent 工具必须可测试

`rust/crates/mock-anthropic-service/` 很容易被忽略，但我觉得这是仓库里很关键的一块。

文档里列出的 mock parity 场景包括：

```text
streaming_text
read_file_roundtrip
grep_chunk_assembly
write_file_allowed
write_file_denied
multi_tool_turn_roundtrip
bash_stdout_roundtrip
bash_permission_prompt_approved
bash_permission_prompt_denied
plugin_tool_roundtrip
```

这些测试点很现实。Agent CLI 不是普通 HTTP wrapper，它有流式输出、工具调用、权限拒绝、多轮回合、插件工具、bash stdout 等复杂路径。只靠“我手动试了一下”是不够的。

如果你在做自己的 AI 编程助手，我建议优先抄这个思路：先做 mock service，再做确定性场景，最后才谈模型效果。

## 10. 一个更稳的真实使用流程

我会这样用 Claw Code，而不是上来就让它改代码。

第一步，只读扫描：

```bash
claw --permission-mode read-only prompt "阅读这个仓库，说明架构、测试命令、潜在风险，不要修改文件"
```

第二步，让它给计划：

```text
/ultraplan 给这个项目增加 GitHub Actions 构建检查
```

第三步，人工审计划，只开放工作区写入：

```bash
claw --permission-mode workspace-write prompt "按计划添加 CI 配置，并说明改动文件"
```

第四步，自己看 diff 和测试：

```bash
git diff
cargo test --workspace
```

如果本机没有 Rust 工具链，就不要假装测试通过。文章、PR、提交说明里都应该写清楚“未运行 cargo test，原因是本机缺 Rust”。这比编一个“已验证”更专业。

## 11. 它的缺点也很明显

第一，仓库气质不是传统产品文档。README 里有不少社区梗和 exhibit 叙事，新用户可能会迷路。

第二，命令面在快速变化。文档里也提醒 live help 才是 canonical command list。

第三，本地模型兼容不是“配置 base url 就完事”。工具调用、流式返回、reasoning 参数、slash-containing model id 都可能踩坑。

第四，它不适合被当成“无脑日常神器”推荐给所有人。它更适合研究 agent runtime、做二次开发、验证多模型和工具协议。

## 12. 我的结论

Claw Code 的价值，不在于它是不是今天最好用的 AI 编程工具，而在于它把一个问题讲清楚了：AI 编程助手的难点不是回答问题，而是可控执行。

要让模型安全地改代码，你至少需要：

```text
模型路由
权限边界
工具协议
项目记忆
诊断命令
结构化输出
会话恢复
MCP/Skills 扩展
可重复测试
```

少了这些，所谓“AI Agent”很容易退化成一个会调用 shell 的聊天框。能跑，但不可控；看起来聪明，但难以审计。

Claw Code 值得拆，正是因为它把这些不性感但关键的部分放在了台面上。

## 参考资料

- `https://github.com/ultraworkers/claw-code.git`
- `README.md`
- `USAGE.md`
- `rust/README.md`
- `docs/local-openai-compatible-providers.md`
- `docs/windows-install-release.md`
