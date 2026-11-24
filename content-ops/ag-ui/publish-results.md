# AG-UI 协议三端推广发布记录

- 项目：ag-ui-protocol/ag-ui（Agent-User Interaction Protocol，CopilotKit 发起）
- 仓库 URL：https://github.com/ag-ui-protocol/ag-ui
- 官网/Demo：https://ag-ui.com · https://dojo.ag-ui.com · 文档 docs.ag-ui.com
- 发布日期：2026-11-24
- 本地工作目录：content-ops/ag-ui/
- 叙事骨架：narrative-spine.json（六段 spine 校验通过，3 标题候选，数字逐一复核）

## 一手实测（本地克隆，非照抄 README）

- GitHub：21510 star / 2168 fork / 617 open issue，2025-05-07 创建，TypeScript，MIT
- 定位：开放、轻量、基于事件的协议，标准化 agent 与用户界面应用的连接；@ag-ui/core 1.0.5，协议版本 1.0（frozen，双向向后兼容）
- 三协议分层：MCP 向下接工具、A2A 横向连 agent、AG-UI 向上接用户（互补非竞争）
- 事件：TS SDK 实测枚举正好 31 个事件、8 大家族（运行/文本/工具/状态/推理/活动/子agent/透传），仅运行生命周期必选
- 传输无关：HTTP+SSE / HTTP+Protobuf；状态 snapshot+JSON Patch delta；人在环 interrupt+resume
- **核心工程亮点（schema-first 防分叉）**：
  - spec/1.0/schema.json 94KB 唯一事实来源
  - spec/generator 代码生成 TS/Python/.NET SDK；Python 模型在 ag_ui/_generated/，PROTOCOL_VERSION='1.0'
  - conformance 68 流测试 + 303 fixtures，fatal/tolerated/warns 三级判定
- 代码规模实测：TS 242 文件 75624 行、.NET 362 文件 57343 行、Python 38 文件 11225 行；8 社区 SDK(go/rust/java/kotlin/dart/swift/ruby/c++)
- integrations 实测 23 个；middlewares 6 个（含 mcp/a2a/mcp-apps/a2ui）；大厂 Google/MS/Amazon/Oracle，Bedrock AgentCore 原生支持
- 治理：nx+pnpm monorepo，TS 六包 core/client/encoder/proto/cli/a2ui-toolkit；lefthook/eslint/coderabbit/CODEOWNERS/AGENTS.md/CLAUDE.md/.mcp.json
- 客观风险：617 issue 偏高、draft 仍演进；CopilotKit 既是发起方又是主要 client 实现，存在中立性张力

## 配图（全部过 vision QA，靛蓝品牌色#6963ff 协议文档风）

正文 4 张：
- 01-protocol-layers.png 三协议分层
- 02-event-stream.png RunAgentInput→31事件/8家族
- 03-schema-first.png 一份Schema生成三语言SDK+一致性测试
- 04-ecosystem-verdict.png 23集成生态与适用判断（修复过框架名单单行被裁切，改两行）
封面：
- cover-ip.jpg（微信1280×544双翼，随机抽中 c2 冷白+大笑，verify_wings rc=0，已记 combo-history）
- cover-zhihu.png（知乎1600×900 深靛蓝论点型，与微信不同）

## 网站端（Hugo，已 push）

- content/articles/2026/11/24/ag-ui-protocol.md（正文 2503 中文字，4 图，无 shortcode）
- static/images/ag-ui-protocol/
- hugo 临时构建 exit 0；sync-site：323 articles / 663 searchable，slug 进 home.json(4)/search-index(1)
- 一次 push 成功无 rebase；commit 81f70d5
- 预期 URL：https://jackssybin.cn/articles/2026/11/24/ag-ui-protocol/

## 微信端（仅草稿）

- 标题：Agent 接前端到底有多乱？这个 2.1 万 Star 的协议用一条事件流统一了
- 正文 2002 中文字（不含引流），4 图，无 H1，GitHub 仅文末裸链
- frontmatter：cover 绝对路径 cover-ip.jpg + source_url=GitHub
- 引流齐全：jk 自述+在看星标+阅读原文+2 条真实 mp 内链
- validate-payload rc=0；publish.js 成功（无 45166/40113）
- digest 首版 123 字超限，缩至 104 字后 set-digest 成功 + content_source_url 回读确认

## 知乎端（专栏，仅草稿）

- 标题：如何评价 AG-UI（Agent-User Interaction Protocol）这个把 agent 连接到前端应用的开放协议？
- 正文 1428 中文字，4 图，论点先行无 CTA
- 临时 markdown 草稿（传图）：p/2108708417489604883，需后台手动删
- compact HTML：4 CDN content_image，无 ol/ul/table/空段/H1
- 正式 HTML 草稿：p/2108708525576922012（ok=true HTTP200，以此为准）

## 待用户处理

- 知乎后台删临时草稿 p/2108708417489604883
- 三端均草稿/网站已推送，微信群发与知乎发布需手动确认
