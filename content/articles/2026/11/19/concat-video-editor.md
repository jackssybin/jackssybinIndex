---
title: "1.87 万 Star 的 Concat：一个用 Rust 写的本地优先剪辑软件，还内置 MCP 让 AI 替你剪片"
slug: "concat-video-editor"
date: 2026-11-19
draft: false
categories: ["开源项目", "效率工具"]
tags: ["开源", "视频剪辑", "Rust", "MCP", "本地优先", "AI", "FFmpeg", "AGPL"]
cover: "/images/concat-video-editor/cover-zhihu.png"
description: "jub0t/Concat 是一个 2026 年 8 月底才建仓、三个月冲到 1.87 万 Star 的开源视频编辑器，AGPL-3.0 协议，用 Rust 写成，覆盖 macOS/Windows/Linux/Android/iOS 五平台、26 种语言，主打无水印、无账号、无订阅、素材从不上传的本地优先体验。本文基于仓库源码实测：它由 18 个 crate 组成单一 Cargo workspace、276 个 Rust 源文件约 18.9 万行，Slint+Skia 做界面、FFmpeg 7 做媒体引擎，187 个测试文件把关；22 个 AI 模型（RVM 抠像、ISNet/SAM 分割、Real-ESRGAN 超分、Chatterbox/Kokoro 语音合成与声音克隆、Whisper 转写、Spleeter 人声分离）不打进安装包而是按需下载、sha256 校验、镜像到自有 release，下载后完全离线。重点拆解它最有差异化的设计：内置 MCP 服务器（concat --mcp）让 Claude 等 Agent 通过 40 余个工具像人一样操作时间线，支持 window/headless 双模式、工程锁防双写、家目录沙箱，并提供 JSON-RPC 与源码编译可得的 gRPC/CLI；同时如实说清它仍是 v0.2.x beta、Windows 未签名会触发 SmartScreen、本地模型吃算力、以及 AGPL-3.0 强 copyleft 对闭源商用和 SaaS 二次开发的授权要求。"
---

视频剪辑软件长期是付费订阅的天下：Premiere、Final Cut、剪映专业版各有壁垒，而近几年打着"AI 剪辑"旗号的在线工具又普遍要求注册、上传素材、成品带水印。最近有个叫 [Concat](https://github.com/jub0t/Concat) 的开源项目反着来——完全免费、本地运行、素材从不上传，还把一个 MCP 服务器内置进了编辑器，让 AI Agent 能直接操作时间线。

它 2026 年 8 月底才建仓，三个月就涨到 1.87 万 Star。我把仓库克隆下来逐 crate 读了一遍，这篇回答三个问题：一个本地优先的剪辑器如何用 Rust 搭起来、它的本地 AI 和 MCP 自动化到底怎么实现、以及 beta 阶段和 AGPL 协议下你该注意什么。

## 一、先看家底：18.9 万行 Rust，一个 workspace 管 18 个 crate

Concat 不是套壳 FFmpeg 的小工具，而是一个工程化程度很高的完整编辑器。我统计了 `src/` 下的代码：276 个 Rust 源文件、约 18.9 万行，组织成 18 个 crate 的单一 Cargo workspace，版本 0.2.12，要求 Rust 1.93。

![Concat 的 18 个 crate 分层架构](/images/concat-video-editor/architecture.png)

从 crate 命名能清楚看出分层：`concat` 是 4.4 万行的主程序，用 Slint 做声明式 UI、Skia 做 GPU 渲染；`concat-core` 放核心数据模型，`concat-media`（1.67 万行）负责基于 FFmpeg 7 的解码，`concat-render` 是可选的 GPU 合成器，`concat-effects` 实现约百种特效滤镜转场；能力层有 `concat-vision`（视觉）、`concat-speech`（语音）、`concat-text`（字幕标题）、`concat-project`（2 万行的工程管理）；自动化层则是 `concat-mcp`、`concat-api`、`concat-server`、`concat-cli` 和负责 4K 导出的 `concat-export`。

这种分层最实际的好处是引擎与界面解耦：GPU 合成器被做成可选 feature，纯引擎任务不必承担这块编译重量，而且整个编辑器能在没有窗口的 headless 模式下跑渲染。仓库里有 187 个带测试的文件，CI 还会跑 `cargo fmt --check` 和 `cargo clippy -D warnings`，发布的每个文件都由 GitHub Actions 从打 tag 的提交构建、测试通过后才上传，不接受任何个人机器上的构建产物。

## 二、22 个本地 AI 模型：能力在本机，素材不上云

现在的剪辑器都在加 AI，Concat 的不同在于所有模型都跑在你自己的机器上。我读了 `models/manifest.toml`，一共管理 22 个模型，分成几类：

![Concat 的 22 个本地 AI 模型与供应链设计](/images/concat-video-editor/local-ai.png)

- **智能抠像**：RobustVideoMatting 做人物分割、ISNet 做通用物体、SAM（slimsam）支持笔刷手绘蒙版，外加 Real-ESRGAN 做超分辨率放大；
- **语音与配音**：Chatterbox 本地 TTS、几秒录音即可声音克隆，桌面端还有 Kokoro 语音库；
- **字幕与音频**：Whisper 本地自动转写生成字幕、Spleeter 做人声/伴奏分离，以及一键降噪、人声增强、响度均衡。

这里有个很专业的供应链设计值得单独说。模型体积比编辑器本身大很多倍，所以安装包**不捆绑任何权重**，而是在你第一次使用某个功能时按需下载。清单里每个模型都带 sha256 摘要，下载完必须校验通过，没有摘要的模型直接拒绝运行；Hugging Face 上游被锁定到具体 commit 而非 main，同时所有模型还镜像到项目自己的 `models-v1` release，第三方图床挂了也不受影响。网络请求只在你主动检查版本或下载模型时发生，真正的剪辑和推理完全离线——这就是它敢承诺"footage never leaves your disk"的底气。

## 三、内置 MCP：让 AI Agent 像剪辑师一样操作时间线

这是 Concat 最有差异化、也最契合当下 Agent 浪潮的部分。它在 App 里内置了一个 MCP（Model Context Protocol）服务器，Claude Code、Claude Desktop 或任何 MCP 客户端，只要把启动命令指向 `concat --mcp`，就能调用和图形界面完全相同的编辑能力，无需额外安装。

![Concat 内置 MCP 的接入方式与 Agent 工具集](/images/concat-video-editor/mcp.png)

我把 `docs/MCP.md` 读完了，它的设计有几个讲究。**一是双运行模式**：窗口模式（window）下，Agent 走你正在运行的编辑器，但不能打开并覆盖你屏幕上的工程，导出还会和你的操作排队，更安全；无头模式（headless）下，MCP 服务器自己拉起引擎，什么窗口都不用开。每个进程用 `concat.lock` 锁住自己打开的工程，窗口和 Agent 同时编辑同一个工程会被直接拒绝，从根上杜绝双写冲突。**二是文件沙箱**：Agent 写出的工程、导出、帧文件默认只能放在你的家目录，要让 headless 模式访问其他目录得显式配置 `CONCAT_MCP_ROOTS` 白名单。

在能力上，它暴露了 40 多个工具：工程的创建/打开/保存、`timeline_read` 读时间线、素材探测导入、分割/修剪/移动/变速/冻结帧、`captions_add` 加字幕、`keyframe_set` 打关键帧、特效层管理，一直到带进度的 `export_start/status/wait` 导出闭环。通用编辑还能用 `edit_apply` 把一批命令合并成一个撤销步骤。关键是这些工具的参数 schema 由 API 的 Rust 类型自动生成，Agent 拿到的约束和引擎内部完全一致，不会出现文档和实现漂移。除了 MCP，它还提供 JSON-RPC，从源码编译则额外解锁 gRPC 和命令行工具，方便把剪辑接进自己的服务和流水线。

## 四、完整的剪辑能力与五平台覆盖

抛开 AI 和 MCP，作为一个编辑器它的基本功也覆盖了大多数场景：多轨多时间线、画中画与叠加层、混合模式、关键帧曲线编辑器、磁吸时间线、约 100 种特效滤镜转场、标题样式预设、一键语音清理；导出支持 H.264、HEVC、AV1，最高 4K 60 帧、10-bit 色深，并内置代理素材让 4K 剪辑能流畅拖动。平台覆盖 macOS（Intel/Apple Silicon）、Windows、Linux（deb/rpm/AppImage/Arch/Flatpak）、Android 手机平板，iOS 走侧载，26 种语言、同一套工程文件互通。官方给的适用场景是 TikTok/Reels/Shorts、YouTube、教程录屏、播客切片和梗图。

## 五、祛魅：beta 阶段和 AGPL 协议的真实约束

![Concat 的价值与能力边界](/images/concat-video-editor/limits.png)

喜欢归喜欢，几条边界必须讲清楚。

**第一，它仍是 beta。** 当前版本 v0.2.x，README 自己都写"it works, and it still has edges"，issue 区有 300 多个开放问题，最近的 release notes 也在修剪切处黑帧、预览异常这类基础问题，重度生产使用前建议先在非关键项目里充分测试。

**第二，安装和硬件门槛。** Windows 构建还没有代码签名证书，SmartScreen 会弹未知应用警告，开了 Smart App Control 的系统甚至直接拒绝运行；ARM 版 Windows 暂停、iOS 需侧载。本地 AI 模型吃算力，低配机器跑抠像、转写会比较吃力。

**第三，也是最容易被忽略的——AGPL-3.0 协议。** 它不是 MIT/Apache 那种宽松许可。AGPL 有强 copyleft：你基于它做闭源产品分发需要开源衍生代码，**哪怕你把它做成在线剪辑服务通过网络提供给用户，同样触发开源义务**。作者明确提供商业授权（见 LICENSING.md）供闭源集成，所以个人使用、学习、内部剪辑完全自由，但想拿它做商业 SaaS 或闭源分发，必须先理清授权。

## 我的判断

Concat 真正的价值，是把"本地优先、隐私可信"和"AI 原生、Agent 可编排"这两件事在一个专业编辑器里同时做到了可用水准。18.9 万行结构清晰的 Rust、严格的模型供应链校验、带工程锁和沙箱的 MCP 设计，都说明这不是蹭热点的玩具，而是朝着替代订阅制剪辑软件去的正经工程。

对隐私敏感的创作者、需要脚本化批量剪片的开发者、以及想给工作流接 MCP 自动化的人，它非常值得现在就上手试；但请接受它 beta 的不成熟，并在商用前认真对待 AGPL。工具把能力和源码都摊开给你了，要不要押注、怎么合规使用，决定权在你手里。

项目地址：[https://github.com/jub0t/Concat](https://github.com/jub0t/Concat)

官网下载：[https://concat.standalones.org](https://concat.standalones.org)
