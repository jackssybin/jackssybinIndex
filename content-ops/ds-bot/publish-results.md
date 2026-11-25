# DS-Bot 三端推广发布记录

- 项目：Fei-Craft/DS-Bot（原 Fei2411/DS-Bot，已迁移组织，旧链接 301）
- 仓库 URL：https://github.com/Fei-Craft/DS-Bot
- 定位：基于 DeepSeek Harness（dsh）的长生命周期 bot 团队，dsh 插件 + Electron + Docker + Expo 四形态
- 发布日期：2026-11-25
- 本地工作目录：content-ops/ds-bot/
- 叙事骨架：narrative-spine.json（六段 spine 校验通过，3 标题候选，数字逐一复核）

## 一手实测（本地克隆，非照抄 README）

- GitHub：8885 star / 903 fork / 391 open issue，2026-10-07 创建（仅 7 周），JavaScript，Apache-2.0
- 非 DeepSeek 官方，README 有商标声明；模型不绑定 DeepSeek，兼容 Anthropic-Messages 端点
- 版本：ds-bot 包 0.3.10（v0.3 预览），CHANGELOG 24 个版本；CI：test/release/pr-triage 三 workflow
- 代码规模实测：核心 ds-bot 615 个 JS/MJS 共 273524 行（host 128 文件 48738 行、client 139 文件 48358 行），测试 282-296 个
  - app(Electron) 138 文件 27033 行、mobile(Expo 58 RN) 96 文件 12531 行、link 中继 21 文件 3417 行
- 依赖克制：package.json 仅 11 个运行时依赖（MCP client、playwright-core、ws、undici、邮件三件套等）
- 核心概念：持久 bot 身份（记忆/工作文件夹/权限/模型），Main Bot 用 rt.isMain/isAdminOf 在 tools.js 代码级分权
- 群聊 token 经济学：管理员默认回复 + 显式 @ 直连 + 异步派活 + Goal 阶段验收，避免全员推理烧钱
- IM 平台实测 8 个独立实现：weixin/feishu/dingtalk/wecom/qq/telegram/discord/slack，无需公网 IP
- 本地 CLI 接入 10 种：Claude Code/Codex/Cursor/GitHub Copilot/Devin/OpenCode/Gemini/Antigravity/Kimi/Kilo
- 安全：SECURITY_MODEL.md 73 行，6 条信任边界，首要威胁 prompt injection；secrets 600+scrypt/AES-256-GCM、redaction、sandbox iframe、contextIsolation
- 诚实披露的不防项：静态加密不护运行进程、Docker danger-full-access、隐私 bot 非系统沙箱、微信/QQ 限时回复
- 硬规则：AGENTS.md 明确永不 patch dsh，只走插件 API；client.js 为构建产物禁手改

## 配图（全部过 vision QA，暖琥珀+深石墨团队组织风）

正文 4 张：
- 01-team-org.png 长生命周期 bot 团队组织架构
- 02-token-economics.png 群聊 token 经济学对比
- 03-deploy-capabilities.png 四形态部署 + 能力地图（修复过第4卡贴边，收窄卡宽）
- 04-security-verdict.png 安全模型与适用判断（加高画布修复底注重叠）
封面：
- cover-ip.jpg（微信1280×544双翼，随机抽中 c1 深墨蓝+喜爱，verify_wings rc=0，已记 combo-history）
- cover-zhihu.png（知乎1600×900 深石墨论点型，与微信不同）

## 网站端（Hugo，已 push）

- content/articles/2026/11/25/ds-bot.md（正文 2633 中文字，4 图，无 shortcode）
- static/images/ds-bot/
- hugo 临时构建 exit 0；sync-site：324 articles / 664 searchable，slug 进 home.json(12)/search-index(3)
- 一次 push 成功；commit dfa3b84
- 预期 URL：https://jackssybin.cn/articles/2026/11/25/ds-bot/

## 微信端（仅草稿）

- 标题：给每个 AI 发工号：这个 8885 Star 的开源项目把 bot 变成了一支长期团队
- 正文 2177 中文字（不含引流），4 图，无 H1，GitHub 仅文末裸链（用迁移后 Fei-Craft 地址）
- frontmatter：cover 绝对路径 cover-ip.jpg + source_url=GitHub
- 引流齐全：jk 自述+在看星标+阅读原文+2 条真实 mp 内链
- validate-payload rc=0；publish.js 成功（无 45166/40113）
- set-digest：99 字独立 digest + content_source_url 回读确认

## 知乎端（专栏，仅草稿）

- 标题：如何评价基于 DeepSeek Harness 的开源多 agent 项目 DS-Bot（长生命周期 bot 团队、群聊协作与本地桌面端）？
- 正文 1602 中文字，4 图，论点先行无 CTA
- 临时 markdown 草稿（传图）：p/2108935267302359297，需后台手动删
- compact HTML：4 CDN content_image，无 ol/ul/table/空段/H1
- 正式 HTML 草稿：p/2108935438371242080（ok=true HTTP200，以此为准）

## 待用户处理

- 知乎后台删临时草稿 p/2108935267302359297
- 三端均草稿/网站已推送，微信群发与知乎发布需手动确认
- 与既有 DSH 生态文章角度差异：旧文写 harness 本体/浏览器/内容工作台，本篇专注"bot 团队组织学"，无重复
