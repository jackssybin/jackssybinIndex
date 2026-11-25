---
title: "7 周 8885 Star、27 万行代码：我把 DS-Bot 克隆下来，看它怎么把 DeepSeek Harness 变成一支有编制的 bot 团队"
slug: "ds-bot"
date: 2026-11-25
draft: false
categories: ["开源项目", "AI Agent"]
tags: ["开源", "DS-Bot", "DeepSeek Harness", "dsh", "多智能体", "Agent", "本地部署", "群聊", "MCP", "Apache2.0"]
cover: "/images/ds-bot/cover-zhihu.png"
description: "DS-Bot 是基于 DeepSeek Harness（dsh）的开源社区项目（Apache-2.0，非 DeepSeek 官方），把 dsh 改造成一支长生命周期 bot 团队，GitHub 8885 Star、903 Fork，仓库已从 Fei2411 迁移至 Fei-Craft 组织。本文基于本地真实克隆逐文件核验：核心 ds-bot 插件 615 个 JS/MJS 脚本约 27.35 万行、282 个测试文件，配套 Electron 桌面端、Expo 移动端、link 中继与浏览器插件，7 周内 CHANGELOG 迭代 24 个版本。文章讲清四件事：第一，产品形态差异——每个 bot 是持久身份，有独立记忆、工作文件夹、权限预设和模型，Main Bot（Chief）用 tools.js 的 rt.isMain/isAdminOf 做代码级分权，群聊用管理员默认回复加显式 @ 的机制控制 token 成本，Goal 模式先对齐验收标准再拆阶段；第二，群聊 token 经济学，朴素全员推理每条消息 N 次调用，DS-Bot 用管理员闸门把常规对话压回接近单人调用；第三，四种部署形态（dsh 插件、Electron、Docker 13080 端口、移动+中继 E2EE）与浏览器、电脑操控、Office、8 个 IM、MCP、连接器等能力地图，以及接入 Claude Code/Codex/Cursor 等 10 种本地 CLI 的方式；第四，安全模型，依据 SECURITY_MODEL.md 拆解六条信任边界、prompt injection 首要威胁、secrets.json 权限 600 加 AES-256-GCM 静态加密与 redaction 机制，并诚实指出静态加密不保护运行进程、Docker 全权限、隐私 bot 非系统沙箱等维护者明确接受的风险，最后给出适用与缓行判断。"
---

这个网站之前写过几篇 DeepSeek Harness（dsh）生态的文章，从 harness 本体到浏览器 agent、内容工作台都拆过。但最近有个项目让我觉得角度不一样：它不再问"一个 agent 能做什么"，而是问"怎么让一群 agent 像一个有编制的团队那样长期工作"。

这个项目叫 [DS-Bot](https://github.com/Fei-Craft/DS-Bot)，建在 dsh 的插件系统之上，目前 8885 Star、903 Fork。注意仓库已经从个人账号 Fei2411 迁移到了 Fei-Craft 组织，旧链接会 301 跳转。我把整个仓库克隆下来逐层拆了一遍，先说最直观的感受：这不是一个靠概念包装的小工具，核心插件 615 个脚本、约 27 万行代码，而且项目从 10 月 7 日创建到现在只有 7 周，CHANGELOG 已经迭代了 24 个版本。这篇只讲我实测到的结构、机制和边界。

## 一、核心命题：从"一次性会话"到"长生命周期身份"

用 Claude Code、dsh 这类 agent 干真实工作时，最大的痛点其实不是单次任务完不成，而是**身份和上下文留不住**：重开窗口要重新交代背景，多个任务在一个会话里互相污染，想让"写代码的"和"写文案的"长期各司其职，却发现它们没有持久身份，关掉就散。

DS-Bot 的解法是把每个 bot 做成一个长生命周期身份。

![长生命周期 bot 团队的组织架构](/images/ds-bot/01-team-org.png)

每个 bot 拥有四样持久的东西：一是独立记忆，用 Markdown 存储，你可以直接在对话里让它记住或忘掉某些偏好；二是独立工作文件夹，换目录跟它说一声就行；三是独立权限预设，在每个会话上强制生效；四是可以单独选模型和思考强度，官方建议长期固定一个模型，只在必要时切换。上下文满了它会自动开新会话，旧会话保持可读，不会硬截断。

团队里有一个特殊角色叫 Main Bot，默认名字是 Chief。它的权限不是 UI 层面的隐藏按钮，而是在 `ds-bot/src/host/tools.js` 里用 `rt.isMain`、`rt.isAdminOf` 做的代码级强制：创建、修改、停用其他 bot，管理群聊和文件夹这些动作，普通 bot 调不到。文档里也明确说可以有多个 Main Bot。这种"角色权限写进运行时"的做法，在同类多 agent 玩具项目里并不多见。

## 二、群聊的真正难题不是协作，是钱

多 agent 群聊有个很现实的问题：token 费用。如果群里 5 个 bot，你每发一条消息它们全部推理一遍，成本随成员数线性膨胀，而且大部分回复根本没人看。

![群聊 token 经济学对比](/images/ds-bot/02-token-economics.png)

DS-Bot 的设计明显参考了真实组织的管理幅度原则。一个群必须设管理员，**你的消息默认只由管理员回复**，它判断需要谁干活再去调度；你也可以直接 @ 某个 bot，它才会直连回应；bot 之间派活走异步任务，接活方自己做完把结果发回群里，其他成员安静待命、零推理。做大任务时还能开 Goal 模式：管理员先和你对齐完成标准，再拆成阶段分给成员，逐段验收推进。

我认为这套机制是整个项目最有工程含量的设计之一——它保留了多角色协作的形态，却把常规对话的推理调用量压回接近单人对话。相比之下，很多多 agent 框架默认全员响应，demo 好看，账单吓人。另外群聊有独立的记忆和工作文件夹，群外 bot 看不到，也避免了信息串味。

## 三、四种部署形态，一套内核

DS-Bot 不是只有一个插件。我实测它用同一套 bot 内核做了四种交付形态，按使用场景分层。

![四种部署形态与能力地图](/images/ds-bot/03-deploy-capabilities.png)

**第一种是 dsh 插件**，npm 包名就叫 `ds-bot`，在 dsh Desktop 的插件市场安装即可，大陆用户可以选镜像源；dsh Web 用户用官方文档里的 `npx @deepseek-ai/dsh@0.2.2-rc.1 plugin --profile web add ds-bot` 命令接入。**第二种是 Electron 桌面端**，支持 Windows、macOS、Linux，自带一个锁定版本的 dsh 运行在独立 `DSH_HOME` 里，不用先装 dsh，还能只读导入你原来 `~/.dsh` 里的 bot 团队。**第三种是 Docker**，面向 NAS 和 Linux 服务器，compose 起在 13080 端口。**第四种是 Expo 移动端加 link 中继**，手机 App 和浏览器远程访问通过端到端加密配对，浏览器侧的密钥存在 IndexedDB 且不可导出。

能力都挂在 bot 身上。我核验了几个关键模块：每个 bot 有独立浏览器和独立登录态，发帖、上传、删除这类动作必须人工批准，遇到验证码或付款会发卡片交给你；电脑操控分"只看、后台操作、可以动前台"三档，屏幕顶部常驻指示条随时能接管；Office 能力可以直接创建和修改 docx、pptx、xlsx 并渲染图片自检排版；IM 接入在 `im/platforms` 目录下有 8 个平台的独立实现——微信、飞书、钉钉、企业微信、QQ、Telegram、Discord、Slack，电脑不需要公网 IP 或开端口。

还有一个很实用的设计：你电脑上已有的 10 种编程 CLI——Claude Code、Codex、Cursor、GitHub Copilot、Devin、OpenCode、Gemini、Antigravity、Kimi、Kilo——可以直接收编成 bot，用的是各 CLI 自己的登录、套餐和模型，照常参与私聊、群聊、派活和记忆。文档也很诚实地标注了限制：本地 Agent 走 CLI 自己的工具链，DS-Bot 的共享连接器不会传给它，切换运行方式会新开对话。

## 四、安全模型：防什么写得清楚，不防什么也写得清楚

一个能操作文件、浏览器、电脑和邮箱的 agent 项目，安全文档含糊其辞是最可怕的。DS-Bot 专门有一份 73 行的 `SECURITY_MODEL.md`，把信任边界、攻击者画像、控制措施和"明确接受的风险"全部摊开，这在国产开源项目里属于罕见的成熟度。

![安全模型与适用判断](/images/ds-bot/04-security-verdict.png)

维护者确认的**首要威胁是 prompt injection**：网页、文件、搜索结果、其他 bot 消息都是攻击者可控内容，可能诱导 bot 越权。对应的控制措施有六层：Main Bot 分权代码强制；密钥文件 `secrets.json` 权限 600，可选 scrypt 加 AES-256-GCM 的信封式静态加密；密钥在发给模型、写日志、出站请求时自动 redaction；隐私 bot 的文件夹、记忆、会话对其他 bot 不可见，外发动作强制人工批准，即使删除后保护仍持续到你手动解除；连接器拒绝非 HTTPS 地址；bot 产出的 HTML widget 放在 `sandbox="allow-scripts"` 的 iframe 里，Electron 侧开 contextIsolation 并用独立 partition，Cookie 只存在主进程。

但更值得肯定的是它**明确写出不防什么**。第一，静态加密不保护运行中的进程——进程内存里必须有解密后的密钥，被同机恶意进程读到不在防护范围内，加密的意义是磁盘副本和备份不带明文。第二，Docker 版默认 `danger-full-access` 加审批 `never`，容器本身就是沙箱边界，bot 在容器内有完全权限，真正的安全问题是容器逃逸。第三，隐私 bot 只隔离团队内的其他 bot，不是系统沙箱，你给了终端或联网权限它照样能读写系统文件。第四，微信、QQ 受平台限制，只能在你发言后的时间窗内回复，超时需要你再发一句话激活。这些限制没有藏在 issue 里，而是写进了正式安全模型。

工程上还有一条硬规则让我印象深刻：`AGENTS.md` 里写明**永远不 patch dsh**，所有能力只能走文档化的插件 API，上游缺功能就停下来反馈而不是打补丁。这解释了为什么它能用 27 万行代码跟上 dsh 的高速迭代——重活（agent loop、模型路由、终端、沙箱）全部复用上游，自己只做团队、记忆、群聊、IM 和桌面壳这层薄而厚的增量。依赖也很克制，`package.json` 只有 11 个运行时依赖，测试文件却有 282 个，CI 跑 test、release、pr-triage 三个 workflow。

我顺手看了它的代码组织，host 与 client 分层很清楚：`src/host` 128 个文件管 roster、工具、轮次投递、群聊、目标、记忆、调度、权限、隐私、连接器这些服务端逻辑，`src/client` 139 个文件管界面和 widget，而且打包产物 `client.js` 是构建生成的，AGENTS.md 明确禁止手改、要求改源码后重新 build 并同时提交，从流程上避免产物和源码漂移。移动端正经用 Expo 58 和 React Navigation 搭了一套，不是套壳网页；link 中继服务器单独成包并自带测试。这种"插件内核、桌面壳、移动壳、中继"清晰分层的结构，也是它能同时维护四种交付形态而不混乱的前提。

## 五、谁该现在上手，谁先缓一缓

**适合的人**很明确：已经在用 dsh 或编程 CLI、想把一次性会话升级成持久分工团队的重度用户；需要多 agent 协作、阶段验收又在意 token 成本的小团队；想把 agent 接到微信飞书等 8 个 IM、又没有公网服务器的人；以及重视数据本地化（全部数据在 `~/.ds-bot`，卸载不删数据）和安全文档透明度的用户。

**要缓一缓的情况**也要说透：它目前还是 v0.3 预览版，391 个 open issue，7 周的年轻项目接口可能变，不适合直接押注稳定生产环境；非技术用户会撞上未签名安装拦截、Chrome v20 Cookie 无法直读、Linux Wayland 受限这些实际坑；只有单一机器人需求的话，这套组织架构属于过度设计；最后别忘了所有 bot 烧的都是你自己的模型 API 额度，群聊虽然做了成本优化，但成员多、任务重时费用依然会明显放大。

还要提醒两点：它是独立社区项目，**不是 DeepSeek 官方产品**，README 有明确的商标声明；模型也不绑定 DeepSeek，任何 Anthropic-Messages 兼容端点都能接。README 里的 ModelGo 赞助位是商业推广，和技术能力要分开看。

## 结语

DS-Bot 真正有意思的地方，是它把"团队组织学"搬进了本地 agent 运行时：持久身份、角色分权、管理幅度、隐私隔离、阶段验收，这些原本属于人类协作的概念，被一一映射成 bot 的记忆、权限、群聊机制和 Goal 模式。再加上"永不 patch 上游"的工程纪律和一份诚实的安全模型，它在 7 周内拿到近 9000 Star 并不偶然。

如果你正在被"AI 会话留不住、多任务互相打架"困扰，可以从桌面端安装包开始，先建一个 Chief 和一个专职 bot 试一周；如果只是想找个聊天机器人，那它确实太重了。

项目地址：[https://github.com/Fei-Craft/DS-Bot](https://github.com/Fei-Craft/DS-Bot)
