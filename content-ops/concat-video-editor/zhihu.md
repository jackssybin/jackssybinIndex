# 读了 Concat 的 18.9 万行 Rust：本地优先剪辑软件，怎么把 MCP 做成一等公民

视频剪辑软件长期被订阅制和在线服务主导：专业工具价格不菲，而打着 AI 旗号的新产品又普遍要求注册登录、上传素材、成品带水印。最近一个名为 [Concat](https://github.com/jub0t/Concat) 的开源项目选择了相反的路线——完全免费、本地运行、素材从不上传，并把一个 MCP 服务器直接内置进编辑器，让 AI Agent 能够操作时间线。它 2026 年 8 月底才建仓，三个月便积累到 1.87 万 Star。

我把仓库克隆下来逐个 crate 阅读，这篇文章谈三件事：它如何用 Rust 搭建一个完整的本地编辑器、本地 AI 与 MCP 自动化的具体实现，以及 beta 阶段和 AGPL 协议带来的真实约束。

## 一、18 个 crate：一个 workspace 承载的完整编辑器

Concat 不是对 FFmpeg 的简单封装。统计 src 目录可以看到，它由 276 个 Rust 源文件、约 18.9 万行代码构成，组织为 18 个 crate 的单一 Cargo workspace，当前版本 0.2.12，要求 Rust 1.93。

![Concat 的 18 个 crate 分层架构](media/architecture.png)

分层职责从命名就能读出来：主程序 concat 有 4.4 万行，用 Slint 构建声明式界面、Skia 承担 GPU 渲染；concat-core 定义核心数据模型，concat-media 约 1.67 万行负责基于 FFmpeg 7 的解码，concat-render 是可选的 GPU 合成器，concat-effects 实现约上百种特效、滤镜与转场；能力层由 concat-vision、concat-speech、concat-text 和两万行的 concat-project 构成；自动化层则包括 concat-mcp、concat-api、concat-server、concat-cli 与负责 4K 导出的 concat-export。

这种架构最实际的收益是引擎与界面解耦。GPU 合成器被设计成可选 feature，纯引擎任务不必承担它的编译成本，整个编辑器也因此能在没有窗口的 headless 模式下运行渲染。质量保障方面，仓库有 187 个带测试的文件，CI 执行格式检查和 clippy 严格告警，发布物全部由 GitHub Actions 从打 tag 的提交构建、测试通过后才上传，个人机器上的构建不会进入发布渠道。

## 二、22 个模型全部本地运行，素材不出磁盘

剪辑软件都在集成 AI，Concat 的差异在于推理完全发生在用户本机。阅读 models/manifest.toml 可知它管理着 22 个模型，按用途分为几类。

![Concat 的 22 个本地 AI 模型与供应链设计](media/local-ai.png)

智能抠像包括 RobustVideoMatting 人物分割、ISNet 通用物体分割、基于 SAM 的笔刷手绘蒙版，以及 Real-ESRGAN 超分辨率；语音侧有 Chatterbox 本地文字转语音、基于几秒录音的声音克隆和 Kokoro 桌面语音库；字幕与音频处理则包括 Whisper 本地转写、Spleeter 人声与伴奏分离，以及一键降噪、人声增强和响度均衡。

值得专门说明的是它的模型供应链设计。模型体积远大于编辑器本体，所以安装包不捆绑任何权重，而是在功能首次被调用时按需下载。清单中的每个模型都附带 sha256 摘要，下载后必须校验通过，缺少摘要的模型会被拒绝运行；Hugging Face 上游被锁定到具体 commit 而非浮动的 main 分支，同时所有模型还镜像到项目自己的 models-v1 release，避免第三方存储路径失效。网络访问只发生在用户主动检查版本或下载模型时，剪辑与推理全程离线，这是它能够承诺素材永不离开本机磁盘的技术基础。

## 三、内置 MCP：让 Agent 以相同的原语操作时间线

Concat 最具差异化的部分，是把 MCP 服务器做进了应用本身。任何 MCP 客户端——Claude Code、Claude Desktop 或其他兼容工具——只要把启动命令指向 `concat --mcp`，就能调用与图形界面完全一致的编辑能力，无需额外安装。

![Concat 内置 MCP 的接入方式与 Agent 工具集](media/mcp.png)

docs/MCP.md 显示它在运行模式上做了刻意的安全区分。窗口模式下，Agent 通过正在运行的编辑器工作，但无法打开并覆盖用户屏幕上的工程，导出任务还会与手动操作排队；无头模式下，MCP 服务器自行拉起引擎，不需要任何窗口。每个进程通过 concat.lock 锁定它打开的工程，窗口与 Agent 同时编辑同一工程会被直接拒绝，从机制上消除双写冲突。在文件层面，Agent 产生的工程、导出和帧默认只能写入用户家目录，headless 模式要访问其他目录必须显式配置 CONCAT_MCP_ROOTS 白名单。

它暴露的工具覆盖了完整剪辑链路：工程的创建、打开、保存与关闭，timeline_read 读取时间线，素材探测与导入，分割、修剪、移动、变速、冻结帧，captions_add 生成字幕、title_add 添加标题，keyframe_set 打关键帧和特效层管理，直到带进度反馈的 export_start、export_status、export_wait 导出闭环，总计四十余个；通用编辑还可以通过 edit_apply 把多条命令合并为一个撤销步骤。关键在于这些工具的参数 schema 由 API 的 Rust 类型自动生成，Agent 面对的约束与引擎内部完全一致，从根上避免了文档与实现漂移。除 MCP 外它还提供 JSON-RPC，从源码编译则额外解锁 gRPC 与命令行工具，便于接入自建服务和批量流水线。

## 四、作为编辑器的基本功与平台覆盖

抛开 AI 和自动化，Concat 的常规能力覆盖了大多数剪辑场景：多轨多时间线、画中画与叠加层、混合模式、关键帧曲线编辑器、磁吸时间线、约一百种特效转场、标题预设和一键语音清理；导出支持 H.264、HEVC、AV1，最高 4K 60 帧、10-bit 色深，并通过代理素材保证 4K 时间线拖动流畅。平台方面覆盖 macOS、Windows、Linux（deb/rpm/AppImage/Arch/Flatpak）、Android，iOS 通过侧载安装，界面支持 26 种语言，工程文件跨平台互通，官方定位的场景包括短视频、YouTube、教程录屏、播客切片与梗图。

## 五、理性看待：beta 成熟度与 AGPL 的合规边界

![Concat 的价值与能力边界](media/limits.png)

第一，它仍然是 beta。当前版本处于 v0.2.x，README 也明确承认仍有棱角，开放 issue 超过三百个，近期 release notes 还在修复剪切点黑帧、预览异常等基础问题，重度生产使用前应先在非关键项目中验证。

第二，安装与硬件存在门槛。Windows 构建尚未取得代码签名证书，SmartScreen 会弹出未知应用警告，启用 Smart App Control 的系统可能直接阻止运行；ARM 版 Windows 暂停维护，iOS 需侧载；本地模型对算力有要求，低配设备运行抠像和转写会比较吃力。

第三，也是最容易被忽视的——AGPL-3.0-or-later 协议。它不同于 MIT 或 Apache 这类宽松许可，具有强 copyleft 特性：基于它分发闭源产品需要开放衍生代码，而 AGPL 更进一步，即使你把它做成在线剪辑服务、通过网络向用户提供，同样触发开源义务。作者在 LICENSING.md 中提供了商业授权路径供闭源集成。个人剪辑、学习和内部使用不受影响，但任何商业化规划都应先理清授权。

## 结论

Concat 的价值，在于把本地优先的隐私可信与 AI 原生、Agent 可编排这两件事，在一个专业编辑器里同时做到了可用水准。近 19 万行分层清晰的 Rust、严格的模型供应链校验、带工程锁和目录沙箱的 MCP 设计，都表明它是奔着替代订阅制剪辑软件而去的严肃工程，而非蹭热点的演示项目。

对隐私敏感的创作者、需要脚本化批量剪辑的开发者，以及希望给工作流接入 MCP 自动化的团队，它现在就值得试用；但同时需要接受 beta 的不成熟，并在任何商业动作之前认真对待 AGPL 的合规要求。

项目地址：[https://github.com/jub0t/Concat](https://github.com/jub0t/Concat)
