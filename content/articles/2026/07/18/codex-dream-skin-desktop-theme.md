---
title: "3 天涨 8660 star：这个开源项目只用一张壁纸，把 Codex 桌面端换了张脸"
url: "/articles/2026/07/18/codex-dream-skin-desktop-theme/"
date: "2026-07-18T07:00:00+08:00"
lastmod: "2026-07-18T07:00:00+08:00"
description: "Fei-Away/Codex-Dream-Skin 是 GitHub 2026-07-15 才创建的开源项目，3 天时间涨到 8660 star / 921 fork。它不改 app.asar、不动 WindowsApps，只通过本机 CDP 注入 CSS 就能让 Codex 桌面端铺满一整张自选壁纸。这篇讲清楚：它到底动了什么、macOS / Windows 5 分钟怎么装、原生控件为什么还能点、以及什么场景别装。"
tags: ["Codex", "开源工具", "桌面美化", "CDP", "macOS", "Windows"]
topic: "开源工具"
topicSlug: "open-source-tools"
layout: article
contentType: article
---

![Codex Dream Skin 封面](/images/codex-dream-skin/cover-zhihu.png)

上周三我在 Codex 桌面端翻设置想给背景换个色调，翻完设置面板才想起来——官方只给了 Light / Dark 两个开关，连一个自定义强调色都没有。搜到有人在 Reddit 抱怨同一个问题，下面第一条回复贴了一个仓库地址：`Fei-Away/Codex-Dream-Skin`。

点过去看时间戳，2026-07-15 才建的仓库，我打开那天已经 5.4k star；今天早上再看，8660 star / 921 fork / 3 天。Trending 榜上排第 4，中文技术圈的公众号还没怎么开始写。

我把源码翻了一遍，也在自己 Mac 上跑了一遍。这篇讲清楚三件事：

1. **它到底动了什么** — 一张壁纸怎么就能盖满整个 Codex 窗口，同时侧栏、输入框、项目选择还能正常点。答案是 **CDP 注入 + CSS + 装饰 DOM**，一个字节的 `app.asar` 都没改。
2. **5 分钟安装完整命令** — macOS 双击 `.command`、Windows 一条 PowerShell，把 8 张官方预设 / 两套精选主题装到本机。
3. **踩坑清单和适用边界** — 什么场景装、什么场景别碰、和「AI 中转 / 换 API 供应商」有什么严格边界。

## 一、先给判断，节约你 5 分钟

先把可收藏的对照结论摆上：

| 你的诉求 | 是否推荐这个项目 |
|---|---|
| 想给 Codex 桌面端换背景/氛围图 | 强烈推荐 |
| 想自定义 Codex 强调色、深浅之外的主题 | 推荐 |
| macOS/Windows 想要一键装、一键恢复 | 推荐（脚本齐全） |
| 想同时改 Codex 的 API 供应商 / Base URL | 别装（作者明确不做，需要单独配置中转） |
| 想改 Codex 官方二进制或 `app.asar` | 别用（作者拒绝这条路） |
| 想给 VS Code / Cursor / Zed 换肤 | 别装（只针对 Codex Desktop） |

**一句话总结**：**给 Codex 桌面端换脸**，除此之外不做任何事。装了不会动你的 API Key，不改官方安装包，一键恢复。

## 二、Codex Dream Skin 是什么

`Fei-Away/Codex-Dream-Skin`（[GitHub 仓库](https://github.com/Fei-Away/Codex-Dream-Skin)）是一个针对 **OpenAI Codex 桌面端** 的换肤工具，用作者的原话说：「给 Codex 桌面端换一张会呼吸的脸」。

**核心事实**（截至 2026-07-18）：

- Star：8660，Fork：921，Issue：83 open
- 首次提交：2026-07-15，最近推送：2026-07-17
- License：MIT
- 平台：macOS（Apple Silicon / Intel） + Windows（Store 版官方 Codex）
- 语言：JavaScript / Shell / PowerShell
- 目录：`macos/` + `windows/` + `docs/`

它做了这样一件事：让你选一张自己的 16:9 壁纸，铺满整个 Codex 窗口，同时让 Codex 的**原生侧栏、原生输入框、原生项目选择、原生建议卡片**继续可交互——它不是把整个窗口贴一张假截图。

![哥特虚空远征主题实机效果](/images/codex-dream-skin/gothic-void-crusade.jpg)

上面这张是「哥特虚空远征 / Gothic Void Crusade」预设的实机截图。作者原话：**侧栏、建议卡、项目选择、输入框都是原生可点控件**，你能看到的所有控件都是 Codex 官方渲染出来的，只是背景层和一部分 CSS 被换了。

## 三、为什么不改 app.asar：CDP 注入是什么

这块是这个项目最值得看的技术判断。

改 Electron 应用外观的常见做法有 3 条：

1. **改 `app.asar`**：解包 → 改文件 → 重新打包 → 覆盖原文件。粗暴，签名校验会挂，Codex 每次更新都要重来。
2. **写一个 Electron 扩展**：Codex 官方没有扩展接口，走不通。
3. **CDP 注入**：启动 Codex 时打开 Chromium DevTools Protocol 端口，从外部注入 CSS 和 DOM 装饰层。

Codex Dream Skin 选了第 3 条。整个架构非常直白：

```text
用户本机主题工具（本仓库脚本 / 已安装引擎）
    │  启动官方 Codex + 本机 CDP（127.0.0.1）
    ▼
官方 Codex Desktop（不改 asar / 签名）
    │  注入 CSS + 装饰 DOM
    ▼
原生侧栏 / 输入框 / 建议卡 + 主题外观
```

**这条路径带来的好处**：

- Codex 官方签名不变。macOS 上 App Bundle Team ID 校验、Windows 上 Store 包身份校验都能过。
- Codex 官方更新以后，通常只需要重跑一次注入脚本，不需要重做 asar。
- 一键恢复真的就是「杀掉注入的 CDP 会话 + 重开 Codex」，没有残留。
- CDP 只绑 `127.0.0.1`，不开局域网端口。

**风险点也要说清楚**（这也是作者在 README 上明写的）：

- CDP 本身没有同用户认证。**在皮肤运行期间不要在同一台电脑上跑来路不明的本机程序**——理论上任何本机进程都能连你的 CDP 端口发指令。
- 换肤和 API 中转（比如你用 Passion8、OpenRouter 之类的第三方 base_url）是**两件严格分开的事**。作者在 README 里反复强调：换肤脚本**不会自动改写**你的 API Key / Base URL。

## 四、macOS 5 分钟安装

前提：Apple Silicon 或 Intel Mac，官方 Codex Desktop 已装。

```bash
# 1. clone 仓库
git clone --depth 1 https://github.com/Fei-Away/Codex-Dream-Skin.git
cd Codex-Dream-Skin/macos

# 2. 双击安装（或命令行）
./scripts/install-dream-skin-macos.sh --no-launch

# 3. 切到「桥本有菜」预设
~/.codex/codex-dream-skin-studio/scripts/switch-theme-macos.sh \
  --id preset-arina-hashimoto
```

装完之后 Codex 首页大概长这样：

![桥本有菜浅色主题实机效果](/images/codex-dream-skin/arina-hashimoto-light.jpg)

![桥本有菜暗色主题实机效果](/images/codex-dream-skin/arina-hashimoto-dark.jpg)

浅色和暗色是同一个主题的两个自动分支——README 里明确写了：

> `appearance: auto` 跟随 Codex/ChatGPT 与系统外观；`light` / `dark` 为显式覆盖。图像亮度只参与配色和构图，不会反向覆盖用户选择的外观。

也就是说，你不用手动切模式，Codex 切浅色它就变浅色壳，切暗色它就变暗色壳。

macOS 版本还装了一个 **SwiftBar 菜单栏图标**（默认走 `Install Menu Bar.command`），点开菜单栏能做：

- **应用 / 暂停**：暂停后 Codex 就回到官方外观，但注入引擎还在，可以随时恢复
- **换图**：Finder 选一张纯背景图，自动换掉当前主题
- **切换已保存主题**：把常用的 3～5 套背景保存下来轮换
- **完全恢复**：关掉 CDP 会话、恢复所有备份

## 五、Windows 也是一条命令

前提：Microsoft Store 装的官方 Codex、Node.js 22 或更高、PowerShell 5.1+。

```powershell
# 1. clone 仓库
git clone --depth 1 https://github.com/Fei-Away/Codex-Dream-Skin.git
cd Codex-Dream-Skin\windows

# 2. 安装（Codex 必须先关掉）
powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\install-dream-skin.ps1

# 3. 启动 + 应用皮肤
powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\start-dream-skin.ps1
```

装完会有三个快捷方式：

- `Codex Dream Skin`：启动或重新应用皮肤
- `Codex Dream Skin - Tray`：系统托盘控制（换图、切主题、暂停）
- `Codex Dream Skin - Restore`：一键恢复

安装完成之后的 Windows 首页效果：

![Windows 首页实机效果](/images/codex-dream-skin/screenshot-windows-hero.png)

Windows 版本比 Mac 多一件事：安装器会把 runtime 原子复制到 `%LOCALAPPDATA%\CodexDreamSkin\engine`，快捷方式指向这个 managed 路径。**这意味着你 clone 出来的源码目录之后可以删掉或移动，皮肤脚本不依赖源码在磁盘上的位置。**

## 六、任务页会自动降噪：一个我没想到的细节

第一眼看到「铺满窗口的壁纸」我最担心一件事：写代码的时候花花绿绿的壁纸看着不头晕吗？

翻了源码之后发现作者做了一个叫 `taskMode` 的处理：

- **首页（Home）**：完整显示壁纸，突出氛围
- **任务页（Task）**：背景自动降低亮度、增加模糊或直接横幅化，代码区、消息区、输入框可读性优先

配置字段长这样：

```json
{
  "appearance": "auto",
  "art": {
    "focusX": 0.72,
    "focusY": 0.45,
    "safeArea": "auto",
    "taskMode": "auto"
  }
}
```

- `focusX / focusY`：0～1 的归一化坐标，告诉引擎"图像视觉焦点在哪"，用来控制背景在窗口里的位置
- `safeArea`：`auto | left | right | center | none`，自动识别图片里哪一侧信息量低，把原生首页内容放在那一侧
- `taskMode`：`auto | ambient | banner | off`，超宽图自动横幅化，普通比例图自动环境背景化，`off` 直接在任务页关掉背景

这套配置的意思是：**背景不是一层贴纸，是一个感知了图片本身构图的自适应层。** 一张右边是人物、左边是低信息量的图，脚本会自动把 Codex 的侧栏放到左边，让人物不被侧栏挡住。

对比之下，任务页的实机效果：

![macOS 任务页实机效果](/images/codex-dream-skin/screenshot-macos-task.png)

背景亮度自动降下去了一档，代码块和消息卡的对比度没被壁纸拉走。

## 七、8 张概念方向：什么样的图能当主题

作者在 `docs/images/gallery/` 里放了 8 张风格方向图，代表这套换肤工具能达到的视觉调性——但**这些图本身不能直接当背景导入**，它们是带 UI 的效果图，只用来展示方向。

| 风格 | 感觉 |
|---|---|
| skin-01 粉系定制 | 少女，樱花，轻氛围 |
| skin-02 财神打工 | 民俗，年味，反差萌 |
| skin-03 红白科幻 | 高对比，机能感 |
| skin-04 清透定制 | 极简，浅色系 |
| skin-05 灵感小宇宙 | 星云，梦幻，深色 |
| skin-06 紫夜限定 | 霓虹，赛博 |
| skin-07 青蓝虚拟歌姬 | ACG，二次元 |
| skin-08 舞台黑金 | 高对比，商务感 |

![风格方向：灵感小宇宙](/images/codex-dream-skin/gallery-skin-05.jpg)

![风格方向：青蓝虚拟歌姬](/images/codex-dream-skin/gallery-skin-07.jpg)

想要类似效果，仓库里的 `docs/reference-background-prompt-guide.md` 给了一份可以直接复制的生图 prompt 模板，`docs/background-generation-prompts.md` 有 8 种风格的详细提示词拆解。

**导入自定义图的硬规则**：

- 分辨率优先 **2560 × 1440**（16:9）
- 图中**不能有窗口、侧栏、卡片、输入框、Logo、水印或文字**——那样注入引擎会当成脏图拒绝
- 单边不超过 16384px，总像素不超过 5000 万，文件不超过 16 MB
- 左侧约 50%~58% 保持低信息量、低对比，主体放在右侧 58%~88%

## 八、旧认知 vs 新认知：换肤这件事上你要更新一下

先说一段常见的旧认知：

> 想给桌面 IDE 换外观 = 找主题商店 → 装扩展 → 官方接口有多少给多少。VS Code、Cursor 都走这条路。Codex 现在没有扩展体系，那就只能等官方。

Codex Dream Skin 展示了第二条路径：

> 官方没有扩展接口不代表没法改外观。只要应用是 Electron / Chromium 底座，就能通过 CDP 在**外部**注入 CSS 和装饰 DOM。这条路不改二进制、不动签名、一键恢复、更新友好。

这条路径不是这个项目发明的——早期 Chrome 扩展调试、DevTools 手动改 CSS，甚至一些内部工具的水印注入，都用的 CDP。它的价值是**把这条路径打包成用户不用碰调试工具就能用的一键脚本**，还预置了主题库、菜单栏 / 托盘、图像自适应引擎、恢复流程。

这带来一个副产品：**如果你以后想给别的 Electron 桌面应用（Slack、Notion、Discord 桌面版、任何一个 Store 分发的 Electron 应用）做同类换肤，Codex Dream Skin 就是一份完整的参考实现。** 项目大部分工程量在 CDP 稳定性、身份校验、恢复原子性、config.toml UTF-8 严格解析这些"看不到但要稳"的地方。

## 九、安全边界必须说清楚

这个项目最让我放心的一点：作者在多处反复强调安全边界。

**它做了什么**：

- CDP 只绑 `127.0.0.1`，不开局域网端口
- 每次连接前校验 Codex 官方签名（Team ID + bundled Node runtime 签名）
- 主题图片走真实路径 containment，拒绝 symlink 越界、空文件、超大图
- `config.toml` 严格 UTF-8 读写、拒绝 NUL、原子替换
- Windows 上快捷方式用 `RemoteSigned`，只对 managed 副本清 Zone.Identifier，不会改用户的持久化执行策略

**它明确不做什么**：

- **不写入 API Key、Base URL 或模型供应商配置**——换肤脚本永远不碰你的中转设置
- 不改 `app.asar` / WindowsApps / 官方安装目录
- 不静默劫持任何请求

如果你担心 CDP 在运行期间被本机其他程序连上，作者的建议是：**皮肤用完就用 Restore 关掉 CDP 会话，不要 24 小时开着。**

## 十、什么场景别装

不适合的场景也要写清楚，不然三端全推等于坑人：

- **你根本不用 Codex 桌面端**：这个项目跟 CLI 版本 Codex、跟 VS Code / Cursor / Zed / Warp 全都无关。
- **你想同时换 API 供应商**：作者明确把「换肤」和「中转配置」隔离了。想接 Passion8 / OpenRouter 得单独配置，跟这个项目无关。
- **你在企业受管电脑上**：Windows 版本会写 `%LOCALAPPDATA%`、注册 CDP 端口，企业 EDR 可能会报警。先跟 IT 部门确认。
- **你希望做深度 UI 改造**（比如加一个新面板、换整个交互）：CDP 注入只能改外观，不能加原生交互控件。这个项目不打算做那件事。

## 十一、5 分钟上手命令清单（可截图收藏）

```bash
# ==================== macOS ====================
git clone --depth 1 https://github.com/Fei-Away/Codex-Dream-Skin.git
cd Codex-Dream-Skin/macos

# 一键安装（Finder 里可以双击 Install Codex Dream Skin.command）
./scripts/install-dream-skin-macos.sh --no-launch

# 装菜单栏图标（可选）
open "Install Menu Bar.command"

# 切换到桥本有菜预设
~/.codex/codex-dream-skin-studio/scripts/switch-theme-macos.sh \
  --id preset-arina-hashimoto

# 切换到哥特虚空远征预设
~/.codex/codex-dream-skin-studio/scripts/switch-theme-macos.sh \
  --id preset-gothic-void-crusade

# 从一张自选图创建自定义主题
~/.codex/codex-dream-skin-studio/scripts/customize-theme-macos.sh \
  --image "/path/to/your/wallpaper.png" \
  --name "MyTheme" \
  --accent "#7cff46"

# 恢复官方外观（双击 Restore Codex Dream Skin.command 效果一样）
~/.codex/codex-dream-skin-studio/scripts/restore-codex-macos.sh
```

```powershell
# ==================== Windows ====================
git clone --depth 1 https://github.com/Fei-Away/Codex-Dream-Skin.git
cd Codex-Dream-Skin\windows

# 安装（Codex 必须已经关闭）
powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\install-dream-skin.ps1

# 启动 + 应用（普通场景走 Codex Dream Skin 快捷方式即可）
powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\start-dream-skin.ps1 -PromptRestart

# 验证注入是否成功
powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\verify-dream-skin.ps1 `
  -ScreenshotPath "$env:TEMP\codex-dream-skin.png"

# 恢复
powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\restore-dream-skin.ps1 `
  -RestoreBaseTheme -PromptRestart

# 完全卸载（顺带删掉快捷方式）
powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\restore-dream-skin.ps1 `
  -RestoreBaseTheme -PromptRestart -Uninstall
```

## 十二、我的下一步

我在自己 Mac 上装完试了两天，几个动手体验：

- 首页放氛围图这件事，比想象中容易上瘾——切换主题成了每天开工前的仪式感环节。
- 任务页真的会自动降噪，写代码时几乎感觉不到背景在。
- 从 CDP 注入角度，这份实现的代码质量比预期高。作者对身份校验、config.toml 原子写、恢复路径的细节都想得很清楚，不像随手项目。
- Windows 版体验略比 Mac 版糙一点（PowerShell 命令看着吓人），但装完之后走系统托盘就跟 Mac 差不多顺手。

如果你决定试，我建议按这个顺序：

1. 先只用官方预设（`preset-arina-hashimoto` 或 `preset-gothic-void-crusade`）跑一天，感受首页 / 任务页的自动切换。
2. 觉得可以再从 `docs/reference-background-prompt-guide.md` 生一张自己的 16:9 图，用 `customize-theme-macos.sh` 或 Windows 托盘导入。
3. 用不惯就 Restore，一键就干净了。
4. 如果你在做类似的 CDP 注入项目，`scripts/injector.mjs` 和 `common-windows.ps1` 值得抄一下——尤其是身份校验和恢复的部分。

**仓库地址**：<https://github.com/Fei-Away/Codex-Dream-Skin>

顺便说一句：作者最初把项目放在一个「中转站/New-api」的目录里维护，之后整理开源；README 里有一段声明「换肤和 API 配置严格隔离」，就是从那个背景来的。开源之后不到 72 小时涨到 8.6k star，中文开发者社群的传播速度这两年是真的快。

---

**如果你也在写 Electron 应用的外观增强脚本，或者想给别的桌面 AI 客户端做类似方案，Codex-Dream-Skin 这份实现值得完整读一遍**——尤其是它在「不改二进制」和「保留原生交互」之间的取舍。
