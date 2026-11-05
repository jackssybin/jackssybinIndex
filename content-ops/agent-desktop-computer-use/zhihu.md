# 读了 Vercel 的 1.5 万 Star 新项目：不靠截图的 Computer Use，工程设计比概念更值得看

主流 computer use 方案建立在视觉回路上：截屏 → 视觉模型识别控件 → 输出像素坐标 → 模拟输入 → 再截屏验证。它的脆弱性也来自这条回路：分辨率和缩放变化会改变坐标、相似控件无法区分、每一步都要付出视觉模型的 token 和延迟，验证本身还是一次概率性的图像判断。

vercel-labs/agent-desktop 给出的是另一条路：直接消费操作系统已经维护好的无障碍树（accessibility tree）。Agent 拿到的不是图片，而是一份描述界面角色、名称、状态和可执行动作的 JSON，每个可操作元素带一个 ref 句柄；动作作用在 ref 上，而不是坐标上。项目 2026-02 建仓，截至本文 15,585 Star、1,083 Fork，Apache-2.0，Rust 工作区约 35.1 万行、2628 个源文件，npm 包月下载约 3.1 万，11 月 5 日发布 1.2.0。我克隆仓库通读了 README、CONCEPTS.md、CHANGELOG 和 crate 结构，这篇从工程角度拆解它的设计，以及为什么"读无障碍树"听起来简单、做起来难。

## 一、基本形态：无模型的机制层 + 你自己的 Agent 循环

首先要明确它的边界：**agent-desktop 内部没有任何模型**。它只提供两个确定性能力——观察（observe）和执行（act），决策循环（看什么、点哪里、失败后怎么办）完全在调用方的 Agent 里。

最小循环是三条命令：

```bash
agent-desktop snapshot --app Finder -i     # 观察：可交互元素带 ref
agent-desktop click '@s8f3k2p9:e8'          # 执行：作用在带快照限定的 ref 上
agent-desktop snapshot --app Finder -i      # 验证：重新观察确认结果
```

每次命令输出一个版本化的 JSON 信封（当前 envelope 版本 2.6），`ok`、`command`、`data`、`error` 结构固定，退出码也有契约。这种"机制与策略分离"带来三个直接好处：机制层可以用 Rust 做到跨平台确定性、可以无 token 成本反复调用、可以被任何 Agent 框架甚至 shell 脚本复用；策略层（模型）可以随时替换，不锁定供应商。

![observe→act→verify 工作循环](LOOP)

## 二、ref 系统：把"定位元素"变成可证明的身份问题

这个项目最有技术含量的部分在 CONCEPTS.md，核心是 ref 的严格解析（Strict Ref Resolution）。

**ref 是快照作用域的，不是全局句柄。** 完整形式必须带快照限定符 `@s8f3k2p9:e8`，裸 `@e8` 直接以 `INVALID_ARGS` 拒绝。UI 变化后旧 ref 返回 `STALE_REF` 或 `AMBIGUOUS_TARGET`，强制调用方重新快照。这从协议层面消灭了"拿着旧坐标点新界面"这类静默错误。

**重新解析是 fail-closed 的计数匹配。** 一个 ref 可用，当且仅当捕获时它所在的窗口被完整观察过、且当前窗口里恰好有一个元素满足完整谓词：role + native id + 稳定的 name/description。零匹配判过期，两个及以上判歧义，实时读取回答不了的字段保持 unknown 而不是参与匹配。控件的当前值和 bounds 明确不参与身份——值会变、窗口会移动，它们不是身份。

**macOS 的直引优化与统一回退。** 在 macOS 上，ref 记录元素的无障碍地址（retained_object），元素存活且进程/role/标识匹配时直接还原；应用重启或元素销毁则落回捕获证明（capture proof）的计数匹配。两个外观完全相同的"双胞胎"控件各自持有独立 ref，不会互相顶替。

**窗口句柄复用防护。** 操作系统的窗口句柄（HWND/窗口号/X11 client id）在窗口销毁后可能被重新分配给别的窗口。项目的窗口身份定义为"句柄 + 进程创建时间令牌"的组合佐证，并且要求在每次写操作执行前立即复核——因为"操作开始时检查一次"只能证明当时有效，无法覆盖检查与执行之间的换窗。截图类工具很少处理这一层，但在长时间运行的自动化里它是真实事故源。

## 三、证据模型：三态语义与透明容器折叠

两个设计体现了对"自动化系统如何不可信地观察世界"的深入思考。

**Evidence Tri-State。** 适配器读到的每个属性只能是 Known、Absent、Unknown 三者之一，且永不合并。Absent 是"问了提供方，明确没有"，Unknown 是"读取失败或结果不可信"。区别是双向重要的：Absent 可以满足完整性校验，Unknown 不能；角色和状态只在正面证据下授予，读失败的节点不会被装饰上看似合理的默认状态。文档里有一句很到位的警告：把三态压成 bool 的便捷谓词，只有在正面位置（"它说是"）安全，一旦取反就会把"我不知道"静默改写成"它没有"。

**Web Wrapper 的透明折叠。** Chromium/Electron 应用会制造大量匿名容器（UIA 的 Group/Custom/Pane、AX group、AT-SPI panel），不处理的话一棵 Web 应用的树会吃掉整个深度预算，使可达内容被低估一个数量级。规则是：无名、无值、无开发者标识、除滚动外无动作的容器跳过逻辑深度；但命名的或可操作的容器照常计数。Windows 上这个跳过还要先验证 Chromium 来源（根窗口类 `Chrome_WidgetWin_1`），因为原生栈里匿名容器是正常结构，全局套用会误删真实节点。

## 四、平台适配：一套核心词表，三套互不一致的现实

Rust 工作区五个 crate：core、ffi，加上 macos、windows、linux 三个平台适配器，核心只通过 `PlatformAdapter` trait 接触 OS，二进制在编译期选定平台：

| 平台 | 最低版本 | 无障碍 API |
|---|---|---|
| macOS | 13+ | AX API |
| Windows | 10 1809+，x64/ARM64 | UI Automation |
| Linux | Ubuntu 24.04+，X11/Wayland | AT-SPI |

三套 API 的分类法并不平行，文档举的开关控件例子很典型：同一控件在 macOS 是 `button` + `pressed` 状态；Windows 把声明 toggle 能力的 Button 重分类为 `switch` + `checked`；Linux 报 `checked` 而把 `pressed` 保留给普通按钮。结论是"两个正确映射相遇"，而非缺陷。core 拥有封闭的 role/state 词表，适配器禁止自造 token，无法映射就报 `unknown`——unknown 本身是关于元素的正面陈述，和读取失败严格区分。

![Rust 分层架构与三平台适配器](ARCH)

其他工程细节：快照超时不整体失败，返回部分观察并在每个被截断的节点上标注（深度钳制能报告跳过了多少子节点，预算耗尽则只能标记）；下钻（drill-down）要求底层观察完整，宁可失败也不破坏无法重新分配的后代 ref；Slack 这类密集应用建议先 `--skeleton --compact` 取骨架再 `--root` 下钻。

## 五、三种接入面与无头模型

![三种接入方式](USAGE)

1. **CLI**：60 个命令名、56 个可操作命令，分观察、ref 动作、键鼠、应用窗口、通知、剪贴板、等待、会话、系统九组。`key-down/up`、`mouse-down/up` 四个命令默认拒绝执行，要等守护进程能保证释放按住的键/钮才开放——防止 Agent 异常退出后键盘卡在按下态，这是很有运维经验的设计。
2. **C 库（libagent_desktop_ffi）**：进程内调用，当前 ABI 主版本 7。1.1 版有意让 C 调用方无法走需要捕获证明的精确解析路径，强制通过快照 ref 动作，收窄了 FFI 的误用面。
3. **MCP server（1.2.0 新增）**：`agent-desktop mcp` 以 stdio 把每个叶子命令暴露为 MCP 工具（`desktop_snapshot`、`desktop_click`……），参数 schema 直接来自 CLI 定义，返回同一个 JSON 信封。对 MCP 生态这是最低摩擦的接入方式。

默认无头（headless）是它相对截图方案的另一个结构性优势：ref 动作通过无障碍 API 完成，不移动物理指针、不抢焦点，多个 Agent 可以并行操作不同应用而不互相干扰；全局 `--headed` 才走物理输入。平台文档逐项标注了哪些能力可无头、哪些必须 headed、哪些直接拒绝。

## 六、安全模型与真实局限

README 的安全警告放在很靠前的位置：快照、剪贴板读取、截图、命令输出和调试产物都可能包含桌面隐私，禁止进入公开日志和上传。具体机制上：`type`、`set-value`、`clipboard-set` 支持 `--stdin` 从管道读取 UTF-8 文本，密钥不必出现在进程参数（`ps` 可见）或 shell 历史里；文档建议把秘密步骤拆成独立命令，因为 `batch` 的 JSON 会进入进程参数。截图有"身份三明治"——长耗时捕获前后各做一次显示器身份校验，捕获中途热插拔或模式变化则丢弃字节，避免像素被记到错误屏幕名下。重试纪律也写进了技能包：只在 `error.disposition.retry` 为 `safe` 时重试，否则可能造成重复提交。

局限需要客观说明：

- **能力天花板是应用的无障碍实现质量。** 自绘 UI、游戏、Canvas/WebGL 内容、没有暴露语义的控件读不到，这类场景视觉方案反而占优，两者互补而非替代。
- **机制层不含智能。** 没有模型意味着你要自己准备 Agent、编排 observe→act→verify 循环和重试策略，对非开发者不友好。
- **平台差异无法完全抹平。** 菜单、弹层、Wayland、Electron 深树等边缘场景仍在迭代，仓库有 166 个 open issues 和按平台划分的 probes 测试目录。
- **迭代速度快、有破坏性变更。** envelope 已到 2.6、C ABI 到 v7，1.1 有明确 breaking changes，生产集成应锁版本并跟迁移文档。

## 结语

agent-desktop 的价值不在于"又一个 computer use"，而在于它把一个常被忽视的事实工程化了：**桌面可访问性 API 本身就是一份现成的、语义化的、操作系统级维护的 UI 状态流。** 在这条信息流上，元素定位从概率性的图像识别变成了有身份证据、有歧义检测、有失效关闭的协议问题。它的三态证据、句柄复用防护、部分观察语义和平台词表折衷，都是分布式系统式的严谨设计，值得做 Agent 基础设施的人细读 CONCEPTS.md。

上手路径：`npm install -g agent-desktop`（或 `brew install agent-desktop`），macOS 先跑 `agent-desktop permissions --guide` 完成辅助功能授权，再用 `snapshot/click/snapshot` 走通最小循环；接 MCP 客户端只需把 `agent-desktop mcp` 配进 mcpServers。

项目地址：https://github.com/vercel-labs/agent-desktop ，文档站 https://agent-browser.dev/desktop ，Apache-2.0。本文基于 1.2.0 时期的仓库源码与文档撰写，命令与平台矩阵以官方最新文档为准。
