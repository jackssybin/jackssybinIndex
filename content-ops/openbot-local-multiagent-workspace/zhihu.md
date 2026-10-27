# OpenBot：一个不给你模型、却给七个 Coding Agent 排好工位的本地工作台

这两年 Coding Agent 的数量有点失控了。Claude Code、Codex CLI、Grok CLI、OpenCode、Gemini、Cursor CLI、Cline CLI——很多人的机器上装了三四个，日常的使用状态却是：每开一个 Agent 就单开一个终端，各自登录，各自维护一套互不相通的上下文。所谓「多智能体协作」，多数时候只是人在中间做复制粘贴。

最近一个叫 OpenBot 的项目试图正面解决这个问题。它的定位很克制：**自己不提供任何模型，只做本地编排**，把上述七个官方 Agent CLI 收进同一个桌面应用，给每个 Agent 独立的工作区、持久的会话和任务队列，并让它们之间可以通信和传文件。仓库 2026 年 8 月 12 日才创建，截至本文已经有约 1837 Star、213 Fork，版本号迭代到 v0.51.1，几乎每天都有更新。

我把整个仓库克隆下来，通读了 README、`docs/architecture/` 的架构文档和近期 changelog。下面按「它是什么、怎么接入七家 Agent、协作如何发生、部署形态，以及两个绕不开的限制」来讲。

## 一、它不是 Agent，是 Agent 的编排层

先看一张接入关系的总表，这也是理解整个项目的基础：

![OpenBot 统一编排的 7 个 Agent 及接入认证方式](PROVIDERS_IMG)

这里有几个值得注意的工程决策。

**第一，凭据不经过它。** 所有 Provider 都复用各 CLI 自己在本机的登录态——Codex 用 ChatGPT 登录，Claude 用订阅登录，Grok 用 `grok login` 或环境变量。README 明确写了 Grok 的 `XAI_API_KEY` 和会话级 MCP bearer token 从不持久化、不写日志。换句话说，OpenBot 不掌握你的账号，它只是启动和管理这些官方进程。

**第二，运行时由它托管但可被覆盖。** 在引导流程里它可以自动下载并「锁定」一个受管 CLI（比如 `cursor-agent`、`cline`），启动时每小时检查上游更新；但显式的 `OPENBOT_*_PATH` 环境变量优先级最高，系统里已装的 CLI 也会被识别。它还特意避免误用同名命令：比如绝不用搜索路径上的 `cursor`（那是 Cursor 编辑器），也不用 `antigravity`（那是 Antigravity 编辑器的命令）。

**第三，零成本试用路径存在。** OpenCode 提供免账号、免登录的免费模型，选中后点 Connect，应用直接读取 CLI 声明的模型列表即可开始，不需要任何 Key。

技术栈是 Electron + SolidJS + Bun 1.4.2 的 monorepo，主进程、预加载、渲染器、后端分层清晰；`apps/` 下还有跑在 Cloudflare Workers 上的账号 API、Telegram/Discord/Slack 平台应用和移动端。所谓 local-first 指数据落在本机，但模型调用照常发往各自厂商，这点 README 没有含糊。

## 二、持久化 Agent：把脚本变成「常驻同事」

OpenBot 与「开容器跑完即销」式 Agent 工具最大的区别，在它的 persistent agent 模型：

![持久化 Agent 的四个核心设计](ARCH_IMG)

- **独立工作区与会话**：每个 Agent 绑定独立的本地目录和对话历史，重启应用后状态完整保留；
- **上下文监控与自动压缩**：按 Agent 单独计量上下文，在接近模型窗口上限前自动 compact；
- **FIFO 队列**：消息按顺序执行，支持暂停、恢复、取消，队列做了崩溃安全（crash-safe）持久化；
- **独立配置**：模型、推理强度、通知、浏览器状态、面板布局各自记忆。

创建过程也做了产品化：桌面端和移动端都支持用自然语言描述来生成 Agent 的指令、头像，保存前逐段确认。

## 三、协作机制：频道、单一负责人、技能与文件传输

多 Agent 部分最容易做成噱头，OpenBot 的设计明显参考了真实团队规则。

**Agent 间消息**支持直接发送消息、回复、表情反应、图片，以及应用层托管的文件传输，数据不经过第三方服务。

**共享频道（channel）**允许多个 Agent 共处，但每个任务只有一个 task owner。频道提供明确的委派（delegation）动作，以及 Stop、Resume、Reassign、Archive、Restore 控制——「一件事一个负责人」这条现实世界的管理规则被直接做进了交互里。

**本地技能**沿用了 Codex 的技能目录规范（`SKILL.md` 加可选脚本、引用资料和 `assets/icon.png`）。Agent 可以把可复用流程沉淀为技能，存入共享库供其他 Agent 安装；修订保留版本，更新库内技能不会静默改动已安装副本。此外还有一个有意思的迁移功能：通过官方的 Grok export agent 可以把 Grok Bot 里的 Agent（名称、指令、头像、技能、例行任务、记忆）打包成 zip 导入，聊天记录不迁移，但关键事实以记忆形式带入，100MB 以内本地读取。

在「执行器」层面，应用内置一个**持久化浏览器**供 Agent 打开、检查和控制；可选的 Computer Use 通过随发行版分发的 `cua-driver` 子进程实现，三大桌面平台共用，macOS 需授予屏幕录制和辅助功能权限。Linux 远程桌面只支持 X11（Xorg/Xvfb），Wayland 和 arm64 AppImage 不支持。

## 四、部署形态：桌面、Nix、VPS、Docker

它不只是一个桌面 App。针对「让 Agent 在服务器上常驻」的需求，项目提供了成体系的部署方式。

无显示器的 Ubuntu 24.04/26.04 服务器，安装脚本加一次邮箱验证码登录即可：

```bash
curl -fsSL https://raw.githubusercontent.com/nightly-labs/openbot/main/scripts/install-server.sh | sudo bash
sudo openbot login
```

之后可以通过桌面端、iPhone app 或 `openbot.run/app` 网页客户端远程下发任务。容器形态提供官方镜像，并且专门附带 seccomp profile，让 Electron 沙箱在容器中保持开启：

```bash
curl -fsSLO https://raw.githubusercontent.com/nightly-labs/openbot/main/docker/seccomp.json
docker run -d --name openbot --restart unless-stopped \
  --security-opt seccomp=seccomp.json --security-opt no-new-privileges:true \
  --shm-size 1g --stop-timeout 60 -v openbot-data:/data \
  ghcr.io/nightly-labs/openbot:latest
docker exec -it openbot openbot login
```

桌面侧覆盖 macOS 13+（双架构）、Windows 10+ x64、Linux x64/arm64 AppImage，也支持 `nix run github:nightly-labs/openbot`。文档里有不少真实踩坑记录：AppImage 不依赖 libfuse2、自带 fuse3 挂载；Ubuntu 23.10+/Debian 13 需要安装随附的 AppArmor profile；并明确警告不要用 `--no-sandbox` 启动。

## 五、两个不能忽略的限制

这部分是我认为任何介绍都不该略过的。

![许可证与运行权限的两个边界](SAFETY_IMG)

**许可证。** 项目采用 PolyForm Noncommercial 1.0.0：源码可见、允许个人使用与学习，但禁止商业用途。它属于 source-available，并非 OSI 意义上的开源软件。企业在生产工作流中使用前需要法务评估，Nix 打包时也必须显式声明允许 unfree 包。

**运行权限。** 当前开发预览版中，Agent 运行在 `danger-full-access` 加 `approvalPolicy: never` 模式：首次明确授权后，读写文件、执行命令、联网和浏览器控制都不再逐次确认。README 的原话建议是只运行信任的 Agent 和任务、保留备份。结合 0.51.x 的版本号、214 个未关闭 issue、以及 Windows 早期安装包无代码签名这些事实，比较稳妥的做法是在虚拟机或容器里先行评估。

## 六、适合谁

- **本机已有多个 Coding Agent、需要队列和协作的开发者**：可以直接从 OpenCode 免费模型零成本开始，持久队列与文件传输是确实的效率提升；
- **想要常开型 Agent 服务器的人**：VPS/systemd 或 Docker 部署配合手机端派活，这类形态目前选择不多；
- **企业与商用用户**：受非商用许可和完全权限模式限制，建议观望，等待许可与审批模型的变化。

我的整体判断：OpenBot 的价值不在于模型能力，而在于它把「Agent 是有状态的常驻协作者」这件事在工程上补完整了——工位、排班、交接、远程办公都有了。多智能体工具的竞争，接下来可能确实更多发生在编排和协作这一层，而不是模型本身。

项目地址：https://github.com/nightly-labs/openbot ，官网 https://openbot.run 。安装前建议先读 README 的 Security 章节。
