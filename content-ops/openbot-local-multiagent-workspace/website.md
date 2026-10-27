---
title: "7 个 Coding Agent 一个桌面：我扒了 OpenBot 的源码，看它怎么做本地多智能体工作台"
slug: "openbot-local-multiagent-workspace"
date: 2026-10-27
draft: false
categories: ["开源项目", "AI工具"]
tags: ["开源", "OpenBot", "多智能体", "Codex", "Claude Code", "Agent", "AI编程", "Electron"]
cover: "/images/openbot-local-multiagent-workspace/cover.png"
description: "nightly-labs/openbot 是 2026 年 8 月才建仓、两个多月涨到 1.8K Star 的本地优先多 Agent 桌面工作台：Codex、Claude Code、Grok CLI、OpenCode、Gemini、Cursor CLI、Cline CLI 各占一个独立工作区，支持 FIFO 任务队列、Agent 互发消息、内置浏览器和 Computer Use，还能部署成 VPS 常开服务器并用 iPhone 远程指挥。本文克隆 v0.51.1 源码，拆解它的架构、七个 Provider 的接入方式、协作模型和安全边界，也如实说明它 PolyForm 非商用许可证和 danger-full-access 的风险。"
---

过去一年你装了几个 Coding Agent？我自己机器上躺着 Claude Code、Codex CLI、Grok CLI、OpenCode，还试过 Cursor CLI 和 Cline。每个都要单开终端、各自登录、各自维护一套上下文，想让它们互相搭把手？只能手动复制粘贴。终端里开三个 tmux pane 假装是「多智能体协作」，本质上是三个互不相干的打工人，连个传文件的共享盘都没有。

[nightly-labs/openbot](https://github.com/nightly-labs/openbot) 想解决的就是这个尴尬。它是一个本地优先（local-first）的桌面工作台，把 Codex、Claude Code、Grok CLI、OpenCode、Gemini、Cursor CLI、Cline CLI 七家 Agent 收进同一个 Electron 应用：**每个 Agent 拥有独立的会话、独立的本地工作区和独立的模型配置，可以排队跑任务、互相发消息传文件、共用一个可被操控的内置浏览器，还能跨设备远程指挥**。项目 2026 年 8 月 12 日才建仓，到我写文时两个多月，已经 1837 Star、213 Fork，版本迭代到 v0.51.1——光看 changelog 一周十几个版本的密度，就知道团队在全速推进。

我把仓库完整克隆下来（一个 TypeScript + SolidJS + Bun 的 monorepo，6000 多个文件），通读了 README、`docs/architecture/` 下的架构文档和最近几个版本的 changelog。这篇文章讲清楚四件事：它和「多开几个 CLI」到底差在哪、七个 Provider 是怎么统一接进来的、多 Agent 协作具体怎么运转，以及——谁现在该装、谁必须先等等。

## 一、先定位：OpenBot 不是又一个 Agent，而是 Agent 的「工位」

理解 OpenBot 最快的方式，是看它**自己不提供模型**。仓库里没有任何模型推理代码，它做的全部事情是编排你已经在用的官方 CLI：

| Agent | 接入方式 | 认证 |
|---|---|---|
| Codex | 本地 Codex App Server | ChatGPT 登录态 |
| Claude Code | 本地 Claude CLI | Claude 订阅登录态 |
| Grok CLI | 本地 CLI | `grok login` 或 `XAI_API_KEY` |
| OpenCode | 下载并锁定 OpenCode CLI | 免费模型免登录，Go 模型用 Key |
| Gemini | Google Antigravity ACP server | Google AI Pro/Ultra |
| Cursor CLI | 下载锁定 `cursor-agent` | Cursor 套餐或 API Key |
| Cline CLI | 下载锁定 `cline` | Cline 账号（有免费额度模型） |

注意 OpenCode 那一列——它是七家里唯一提供**免账号、免登录免费模型**的入口，README 里写得很清楚：选 OpenCode、点 Connect，直接读 CLI 暴露的模型列表就能用。这也是你零成本试用整套工作台的最短路径。

![OpenBot 统一编排的 7 个 Agent 及各自接入方式](/images/openbot-local-multiagent-workspace/providers.png)

技术栈上，桌面端是 Electron + SolidJS（`src/main`、`src/renderer`、`src/preload` 三段式），包管理和构建全用 Bun 1.4.2；后端逻辑在 `src/backend`，另外还有 `apps/` 下的 Cloudflare Workers 账号 API、Telegram/Discord/Slack 三个消息平台 app、移动端 app 和状态站。值得一提的是 `remote/` 目录——同一份服务器代码既能跑在你自己的 VPS 上（systemd），也能跑 Docker（官方提供 seccomp 配置文件），还支持 AWS ECS。

「本地优先，但不只是离线」是 README 反复强调的定位：数据存在你自己机器上，可 Codex 照样要连 OpenAI、Claude 连 Anthropic——它不截留任何凭据，用的是各 CLI 自己的本地登录态，Grok 的 `XAI_API_KEY` 和会话级 MCP token 甚至从不落盘、不写日志。

## 二、核心设计：每个 Agent 是一个有状态的「常驻同事」

大多数多 Agent 工具里，Agent 是一次性的：你提需求、它开个容器跑完、输出结果、容器销毁。OpenBot 的模型完全不同——它的关键词叫 **persistent agents（持久化 Agent）**：

- **独立工作区**：每个 Agent 有自己的本地文件夹、自己的会话历史，重启应用后原样还在；
- **上下文监控与自动压缩**：每个 Agent 单独监控上下文长度，在长对话撑爆模型窗口之前自动 compact，不用你操心；
- **FIFO 消息队列**：发给 Agent 的任务排队执行，支持暂停、恢复、取消，队列持久化、崩溃后不丢任务；
- **独立状态**：模型选择、推理强度、通知、浏览器、面板布局全部按 Agent 记忆。

创建 Agent 的过程本身就是产品化的：桌面端和手机端都支持用自然语言提示词创建和编辑 Agent——你描述「我要一个专门审查依赖安全的工程师」，它帮你生成可编辑的指令、头像，保存前还能逐段审阅。

![持久化 Agent 的四个核心设计](/images/openbot-local-multiagent-workspace/architecture.png)

## 三、Agent 之间怎么协作：频道、委派与文件传输

这是把它和「tmux 多开」区分开的核心部分，架构文档集中在 `docs/architecture/channels-and-messaging.md`。

**Agent 对 Agent 消息**：一个 Agent 可以直接给另一个 Agent 发消息、回复、加表情反应、发图片，还有托管式文件传输（managed file transfers）——文件不经过第三方服务器，在本地应用层完成交接。

**共享频道（Channel Chat）**：你可以开一个桌面端共享频道，里面可以有多个 Agent，但一个任务只有一个 **task owner（任务负责人）**。你可以明确委派（delegation）任务、共享对话历史，控制台上有 Stop / Resume / Reassign（改派）/ Archive / Restore 全套操作。这对应了真实团队的工作方式：一个活只能有一个主责人，但上下文对协作者透明。

**本地技能（Local Skills）**：Agent 能把可复用的工作流程沉淀成一个标准结构的 `SKILL.md` 技能（脚本、参考资料、`assets/icon.png` 图标，沿用 Codex 的技能目录规范），保存在本地共享库后其他 Agent 也能安装；修订带版本号，更新库内技能不会悄悄改动已安装副本。项目还带一个技能/Agent 市场（`marketplace/` 目录），本地技能可以提交发布。

甚至有个很妙的迁移功能：从 Grok Bot 导入 Agent。在 Grok 里加官方的 export agent 说一句「Export my agents for OpenBot」，它导出一个 zip（含名字、指令、头像、技能、例行任务和记忆），在 OpenBot 里选文件即可导入，100MB 以内，本地读取不上传。

## 四、手和眼：内置浏览器 + Computer Use

Agent 光会读写文件不够，真实任务往往要操作网页。OpenBot 给了两层能力：

一是**持久化内置浏览器**，Agent 可以打开页面、检查 DOM、控制浏览器，浏览器状态在会话间保留。

二是可选的 **Computer Use**，通过随发行版附带的 `cua-driver` 二进制实现——OpenBot 把它作为自己的子进程启动，所有 Provider 共用这一个驱动。macOS、Windows、Linux 都支持，无需额外安装，只是 macOS 需要授予屏幕录制和辅助功能权限。Linux 远程桌面有明确限制：只在 X11 会话（Xorg 或 Xvfb）下工作，Wayland 不行，arm64 AppImage 也不带这个运行时。

## 五、部署形态：不只是桌面应用

对「想让 Agent 7×24 在服务器上干活」的人，OpenBot 的服务器形态是它区别于同类桌面产品的关键。

无屏幕的 Linux 服务器（Ubuntu 24.04/26.04 + systemd）两行命令：

```bash
curl -fsSL https://raw.githubusercontent.com/nightly-labs/openbot/main/scripts/install-server.sh | sudo bash
sudo openbot login
```

之后你可以用桌面应用、iPhone app 或 `openbot.run/app` 网页端连上去指挥。容器化也很干脆，官方镜像 `ghcr.io/nightly-labs/openbot:latest` 支持 amd64/arm64，并且特意提供 seccomp profile 让 Electron 沙箱在容器里依然保持开启：

```bash
curl -fsSLO https://raw.githubusercontent.com/nightly-labs/openbot/main/docker/seccomp.json
docker run -d --name openbot --restart unless-stopped \
  --security-opt seccomp=seccomp.json --security-opt no-new-privileges:true \
  --shm-size 1g --stop-timeout 60 -v openbot-data:/data \
  ghcr.io/nightly-labs/openbot:latest
docker exec -it openbot openbot login
```

桌面端的安装覆盖 macOS 13+（Apple 芯片/Intel）、Windows 10+ x64、Linux x64/arm64 AppImage，甚至能 `nix run github:nightly-labs/openbot`。几个 Linux 细节看得出团队真在踩坑：AppImage 不依赖 libfuse2、自带 fuse3 挂载，所以 Arch/Omarchy 也能跑；Ubuntu 23.10+ 和 Debian 13 因为 AppArmor 限制非特权用户命名空间，要装一个随包附带的 AppArmor profile 才能启动；文档明确警告**不要用 `--no-sandbox` 启动**。

## 六、必须泼的两盆冷水

讲到这里得刹车，因为 README 自己用醒目警告写了两件事，任何推广文章都不该替它藏着。

**第一，许可证不是标准开源协议。** 项目用的是 [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/)——源码可见、可以自用和学习，但**禁止商业用途**，公司里拿来跑生产工作流前需要法务评估。Nix 打包时甚至必须显式声明 `allowUnfreePredicate`。所以严格说它是「源码可用（source-available）」而不是 OSI 定义的开源软件。

**第二，当前版本 Agent 运行在 `danger-full-access` + `approvalPolicy: never` 模式。** 首次启动明确授权后，Agent 可以无二次确认地读写文件、执行命令、联网、操控浏览器。README 的原话是：只运行你信任的 Agent 和任务，保留备份，使用前阅读安全章节。这意味着现阶段它适合清楚自己在干什么的开发者，不适合在有敏感数据的主力机器上毫无戒备地放飞。

另外别忘了它还是 **development preview（开发预览版）**：214 个 open issues、版本号 0.51.x，Windows 早期安装包连代码签名都没有（现在由 SYNTHETIFY LABS 签名，SmartScreen 仍可能拦截）。安装前核对 GitHub release 校验和或构建证明（build attestation）是文档建议的基本操作。

![上手前必须知道的许可证与运行权限两个边界](/images/openbot-local-multiagent-workspace/safety-v2.png)

## 七、谁现在就该试，谁再等等

我的建议很直接：

- **多 Agent 重度用户，现在就装**。机器上本来就有两三个 CLI、经常需要 Agent 之间传文件交接、或者想要持久队列和崩溃恢复的人，它解决的是真实痛点；零成本路径是用 OpenCode 的免费模型先跑通。
- **想拥有一台「常开 Agent 服务器」的人，值得专门部署**。VPS 装 server 版、手机和网页随时派活，这套形态在目前的产品里相当少见。
- **公司团队和商用场景，先等等**。非商用许可证 + full-access 模式 + 0.x 版本号，三个因素叠加，别急着上生产。
- **对安全敏感的普通用户，至少读完 Security 章节再决定**，或者放在虚拟机/容器里用。

两个多月从 0 做到 1.8K Star，靠的不是又套一层聊天框，而是把「Agent 是常驻同事而不是一次性脚本」这件事做透了：独立工位、可排队、能协作、有手有眼、可远程。多智能体的下半场，可能真不在更聪明的模型，而在给这些模型什么样的办公室。

> 项目地址：[https://github.com/nightly-labs/openbot](https://github.com/nightly-labs/openbot)
> 官网：[https://openbot.run](https://openbot.run)
> 当前版本：v0.51.1（2026-10-26）｜许可证：PolyForm Noncommercial 1.0.0
>
> 本文基于仓库 main 分支 v0.51.1 的源码与文档撰写，功能以官方最新 README 为准。
