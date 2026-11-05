---
title: "Vercel 开源 1.5 万 Star：AI 不用截图、不看像素，也能操作你的电脑"
cover: /root/jackssybinIndex/content-ops/agent-desktop-computer-use/media/cover-ip.jpg
source_url: https://github.com/vercel-labs/agent-desktop
---

过去一年"让 AI 操作电脑"的演示你应该看过不少：给模型一张屏幕截图，它用眼睛找按钮，输出一个坐标，模拟鼠标点过去。

看着很科幻，用起来全是坑——分辨率一变就点空，两个长得差不多的按钮分不清，到底点没点中还得再截一张图接着猜。

Vercel Labs 最近开源的 **agent-desktop** 走了一条完全相反的路：**不让 AI 看屏幕，而是让它直接"读"操作系统的无障碍树。** 界面在它眼里不是一张图，而是一份带句柄的结构化 JSON。1.5 万 Star、Apache-2.0、核心 35 万行 Rust，我把仓库拉下来通读了一遍，这篇讲讲它凭什么。

## 核心循环：快照、操作、再验证

它的用法简单到三行命令：

```bash
npm install -g agent-desktop
agent-desktop snapshot --app Finder -i     # 快照：每个可操作元素拿到一个 ref
agent-desktop click '@s8f3k2p9:e8'          # 对 ref 点击
agent-desktop snapshot --app Finder -i      # 再快照，验证结果
```

![agent-desktop 的 observe→act→verify 循环](/root/jackssybinIndex/content-ops/agent-desktop-computer-use/media/loop.png)

快照返回的是这种 JSON：窗口、角色（button/treeitem/window…）、名称、可执行动作，每个元素一个 ref。**注意一个关键设计：agent-desktop 自己没有任何模型。** 它不推理、不决策，只负责"读界面"和"执行动作"，观察—判断—验证的智能循环住在你自己的 Agent 里。它是眼睛和手，不是大脑。

和截图派的差别是本质的：语义定位代替像素猜坐标、本地 JSON 代替每次视觉模型调用（零 token 费用）、默认无头——不移动你的鼠标、不抢窗口焦点，多个 Agent 能并行干活。

## 最硬的部分：它怎么保证"点的还是那个元素"

如果只是读无障碍树，这工具不值 1.5 万 Star。真正的工程含量在它的 ref 机制：

**第一，ref 只属于它的快照。** 必须写全 `@s8f3k2p9:e8`，裸 `@e8` 直接报错。界面一变，旧 ref 返回 `STALE_REF` 或 `AMBIGUOUS_TARGET`，让你重新快照——宁可失败，绝不猜。

**第二，严格解析，零匹配判过期、两个以上匹配判歧义。** 重新解析时拿捕获时存的身份证据（角色+原生 id+稳定名称）在当前窗口里重新计数，恰好一个匹配才动手。控件的当前值和坐标不参与身份判断，因为它们会变。

**第三，防操作系统"句柄复用"。** 窗口销毁后，它的句柄可能被系统分配给一个新窗口。agent-desktop 用句柄+进程创建时间令牌双重佐证，并且在每次写操作执行前立即复核——防止"检查时对的、点的时候房子已经换了住户"。这种坑，截图派工具基本不会考虑。

**第四，证据三态。** 每个属性只有 Known（确认有）、Absent（问了，系统说没有）、Unknown（读失败）三种，绝不混为一谈。读失败就宁可不写状态，避免给一堆无关节点装饰假属性。

## 三种用法：CLI、C 库、MCP

![三种接入方式](/root/jackssybinIndex/content-ops/agent-desktop-computer-use/media/usage.png)

- **CLI**：60 个命令名、56 个可操作命令，观察、点击输入、键鼠、窗口管理、通知、剪贴板、会话全有。有个细节很说明问题：`key-down/up`、`mouse-down/up` 四个命令默认拒绝执行，要等守护进程能保证"按住的键一定释放"才开放——防止 Agent 崩了之后你的键盘卡在按下状态。
- **C 库**：每个 release 附 `libagent_desktop_ffi`，进程内调用，Python ctypes 直接接。
- **MCP server（1.2 版刚加）**：`agent-desktop mcp` 通过 stdio 把全部命令变成 MCP 工具，三行配置接进任何 MCP 客户端，工具名就是 `desktop_snapshot`、`desktop_click` 这种。

它还自带跟二进制同版本的技能包，`agent-desktop skills get desktop` 直接吐出操作循环和重试规则，能装进 Agent harness。安全规则也写得很明确：**只在错误标记 `retry=safe` 时才重试**，否则可能重复下单、重复提交。

## 一套核心，三个平台适配器

![Rust 分层架构](/root/jackssybinIndex/content-ops/agent-desktop-computer-use/media/arch.png)

Rust workspace 分 core + macos/windows/linux 三个适配器，核心只通过一个 `PlatformAdapter` trait 碰操作系统：macOS 走 AX API、Windows 走 UI Automation、Linux 走 AT-SPI（X11/Wayland 都行），编译期定平台。

三家的分类法并不平行，比如同一个开关：macOS 报 button+pressed，Windows 重分类成 switch+checked，Linux 又不一样。CONCEPTS 文档里管这叫"两个正确映射相遇"。核心维护一套封闭词表，适配器**禁止自造 token**，不认识就老实报 unknown。

密集应用（Slack 这种）还能先 `--skeleton --compact` 看骨架、再 `--root` 下钻子树；Electron 套壳应用那种一层套一层的匿名容器节点会被"透明折叠"，但 Windows 上要先验证 Chromium 来源才敢跳，防止误删原生控件。

## 安全：能读你整个桌面的工具，必须先讲风险

README 开篇第一句警告就很加分：**快照、剪贴板、截图、调试产物都可能含隐私，禁止放进公开日志和上传。** 另外几个设计：

- 密码类输入用 `--stdin` 走管道，不出现在进程参数里（`ps` 看不到）；
- macOS 必须手动授予辅助功能权限，有完整引导；
- 截图前后做"身份三明治"校验，防止中途显示器热插拔把像素记到错误屏幕；
- 数据不出本机，Agent 循环跑在你自己的进程里。

## 几句实话

它不是万能的：

1. **能力上限取决于 App 的无障碍实现。** 自绘 UI、游戏、Canvas 里的东西读不到——这种场景截图派反而更强，两者互补；
2. 部分操作必须开 `--headed`，平台文档逐类标了能无头/要物理输入/直接拒绝；
3. 它只给机制不给智能，你得自己配 Agent、自己写循环，对非技术用户有门槛；
4. 迭代很快，1.0 到 1.2 不到两周一个 minor，C ABI 已经有过破坏性升级，生产环境要锁版本；
5. 166 个 open issues，三平台矩阵庞大，菜单、弹层、Electron 深树这些边缘场景还在打磨。

## 上手

```bash
npm install -g agent-desktop          # 或 brew install agent-desktop
agent-desktop status
agent-desktop permissions --guide      # macOS 走授权引导
agent-desktop snapshot --app Finder -i
```

文档在 agent-browser.dev/desktop，概念词汇表看仓库的 CONCEPTS.md，写得比大多数商业产品文档还严谨。

说到底，agent-desktop 的洞察是：**操作系统本来就维护着一份完整、语义化、可查询的界面描述（无障碍 API），那为什么还要让视觉模型把像素重新"猜"回结构？** 当你在做需要操作真实桌面软件（而不只是浏览器）的 Agent，这个 1.5 万 Star 的项目值得立刻装一轮——尤其当你已经受够了截图派的点空和幻觉。

---

我是 jk，一个只信「自己跑过」的开源/AI 工具实测派。
每次帮你筛一个能真正省钱、省时间的开源项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目地址我放在了「**阅读原文**」。

相关阅读：
- [用了 Claude Code 半年后，我换成了这个完全开源的终端编码 Agent](https://mp.weixin.qq.com/s/_2gkNg1fECDEM62GNbTy9w)
- [30MB 内存替代 Chromium！这个开源 Rust 无头浏览器太香了](https://mp.weixin.qq.com/s/8CtFLrv-MO_ljIuRA4yJlw)
