---
title: "AI 内容创作的另一条路：我跑了 DSH-Creator 的 351 个测试，看它怎么把整条视频流水线装进本地文件夹"
date: 2026-09-16T17:00:00+08:00
lastmod: 2026-09-16T17:00:00+08:00
slug: dsh-creator-local-content-cockpit-deep-dive
draft: false
description: "DSH-Creator（Jacky Creator）是一个 DeepSeek Harness 桌面端插件，把选题、脚本、录屏、字幕、封面、多平台发布、数据回收、复盘装进同一条本地内容流水线。本文基于 v0.1.0-beta.8 源码实测：56 个测试文件、351 个用例全绿，14 个 jacky_creator_* 工具，核心设计是一条片子一个普通文件夹、磁盘文件为唯一真相源、所有写操作先预览后确认。文章讲清它和云端内容 SaaS 的路线差异、最小上手路径、可选能力矩阵，以及谁现在该用、谁该等。"
tags: ["开源", "DeepSeek Harness", "AI视频", "内容创作", "本地优先", "DSH插件"]
topic: "开源项目"
topicSlug: "open-source"
layout: article
contentType: article
type: article
cover: "/images/dsh-creator-local-content-cockpit-deep-dive/cover-zhihu.png"
---

# AI 内容创作的另一条路：我跑了 DSH-Creator 的 351 个测试，看它怎么把整条视频流水线装进本地文件夹

做视频和公众号的人，大多经历过同一种混乱：选题在备忘录里，脚本在某个云文档里，录屏工程在 Screen Studio 里，字幕在一个网页工具里，封面在另一个 AI 生图网站里，发布要登四个后台，发完的数据还得手抄回表格。工具越多，「这条片子到底进行到哪一步了」越没人答得上来。

这周我翻到一个叫 [DSH-Creator（Jacky Creator）](https://github.com/Jackywxsz/DSH-Creator) 的开源项目，它的回答相当反直觉：不做又一个云平台，而是做 DeepSeek Harness（DSH）桌面端里的一个插件，让 AI 围绕你本地的一个普通文件夹工作——一条片子就是一个文件夹，从选题、脚本、录屏、字幕、封面、发布到复盘，全部在这个文件夹和它的工作台里推进。当前版本 v0.1.0-beta.8，MIT 协议，来自中文开发者社区。

我没有停留在 README。我把仓库 clone 到本地，装完依赖，跑通了完整测试套件，又通读了核心源码和文档。这篇文章讲清楚四件事：它的核心设计为什么是「文件夹即数据库」、14 个 AI 工具的边界划在哪、实测证据如何，以及什么人现在就该装、什么人应该等。

## 一、核心心智：一条片子就是一个文件夹

大多数内容工具的第一课是教你用它的数据库、它的云、它的项目系统。DSH-Creator 的第一课在 [docs/files.md](https://github.com/Jackywxsz/DSH-Creator/blob/main/docs/files.md) 里，只有一张文件夹约定图：

![DSH-Creator 文件夹契约：一条片子就是内容目录下的一个普通文件夹](/images/dsh-creator-local-content-cockpit-deep-dive/diagram-folder-contract.png)

默认目录是 `~/Movies/视频项目/`，每条片子一个 `YYYY-MM-DD_可读标题/` 文件夹：

- `topic.md`：选题笔记；
- `script.md`：口播脚本；
- `*.mp4 / *.mov`：成片，文件名带 `_subtitled` 的是烧过字幕的版本；
- `*.srt / *.ass`：字幕稿；
- `*_3x4.png / *_4x3.png / *_16x9.png`：三种画幅封面；
- `演示/`：Jacky Motion 生成的横屏/竖屏 HTML 演示；
- `公众号文章/`：由脚本改写的 Markdown 图文和配图；
- `publish-package.json`：发布标题和 tags。

文档里有一句很关键的话：**磁盘上的文件是正文、脚本、字幕、封面的准，插件不负责再读一遍这些文件。** 插件自己的本地状态只记四类东西：影片目录路径、创作者档案、工程绑定、发布标记和同步回来的播放/赞/评——**不保存正文**。

这是个典型的「本地优先（local-first）」决策，和云 SaaS 是两条路：

| 维度 | 云端内容 SaaS | DSH-Creator |
| --- | --- | --- |
| 正文存放 | 服务商数据库 | 你自己的本地文件夹 |
| 导出 | 通常是降级快照（格式丢失） | 文件本来就是 md/mp4/srt/png |
| 断网 | 不可用 | 片库、脚本、封面全部可用 |
| 卸载 | 数据可能被锁 | 卸载插件不删内容目录 |
| AI 读写 | 通过平台 API | 通过系统文件工具直接读写 |

这也是为什么它敢说「AI、编辑器和你自己都能继续读写」——因为没有私有格式，Obsidian、VS Code、Finder 都是合法入口。

## 二、14 个工具，边界划得很克制

插件通过 DSH 的工具体系向 Agent 暴露 14 个统一 `jacky_creator_*` 前缀的工具（beta.7 刚完成从历史 `oil_*`/`cockpit_*` 命名的硬切换，不留兼容别名）。我按职责分成四组：

![DSH-Creator 14 个 jacky_creator 工具与人机边界](/images/dsh-creator-local-content-cockpit-deep-dive/diagram-tools-boundary.png)

- **引导与配置**：`guide`（自举指引，问「这个插件怎么用」时返回当前能力状态）、`setup`（只读检查环境/先预览后保存）、`script_rules`（读写脚本人设规则）、`profile`（管理启用的发布平台）；
- **内容生产**：`create_content`（按日期新建文件夹）、`update_content`（标记待录制/绑定工程/发布标记）、`organize_library`（默认只预览重命名）、`open_studio`（打开绑定的 Screen Studio 工程）；
- **制作流水线**：`wait_export`（等文件大小稳定的成片落盘）、`generate_subtitles`（转录校对排版，不烧录）、`open_subtitle_preview`（浏览器预览字幕）、`burn_subtitles`（确认后烧录，产物带 `_subtitled`）、`generate_cover`（三画幅封面）；
- **发布与回收**：`sync_publish`（只读翻创作者后台，写回播放/赞/评）。

真正让我觉得这个项目「懂内容生产」的，是它明确**不做**的事。文档写得很直白，有四件事永远留给人：

1. 在 Screen Studio 里录制，亲手导出 MP4；
2. 在字幕预览里确认专有名词，再烧录；
3. 核对封面标题、人物身份和错别字；
4. 在每个平台点最终的「发表」按钮。

换句话说，AI 负责推动流程和处理重复劳动，但录制、事实确认、质量把关、公开发表这四个不可逆动作的开关在人手里。所有写操作也都是「先预览、确认后执行」：新建目录要先展示完整路径、批量重命名默认只预览、安装依赖到 `~/.agents/skills` 要明确确认且不覆盖已有目录、`setup` 只接受已存在的目录而不会偷偷建文件夹。

工程上还有个防呆设计值得一提：长任务全是异步的。`wait_export` 不是「帮你导出」，而是轮询直到文件大小稳定；`generate_subtitles` 立即返回，产物出现后再打开预览。文档反复提醒「不要把一次启动当成已经完成」——这是真做过流水线的人才会写的话。

## 三、实测：351 个测试全绿

说再多不如看代码质量。我在一台 Linux 机器上做了验证（注意：官方推荐环境是 macOS + DSH Desktop 2.0.2，我这里验证的是源码层质量，不含 GUI 实操）：

![本地实测：56 个测试文件、351 个用例全部通过](/images/dsh-creator-local-content-cockpit-deep-dive/diagram-tests.png)

```bash
git clone --depth 1 https://github.com/Jackywxsz/DSH-Creator
cd DSH-Creator
pnpm install --frozen-lockfile   # 39.2s
pnpm check                        # typecheck + test + build
pnpm test                         # Vitest 4.1.10
```

结果：

- **56 个测试文件，351 个用例全部通过**，耗时 31.71s；
- `src/` 下 TypeScript/TSX 约 1.73 万行，测试名覆盖内容工作流、能力安装、发布晋升、持久化、品牌术语等；
- 运行时依赖只有 **zod 一个**，DSH 相关包全部声明为 peerDependency——插件本体很薄，能力由宿主提供；
- 要求 Node `>=22.19.0`，我用 v22.22.0 一次通过。

我翻 `src/capabilities.ts` 时注意到一个细节，它把每项能力标成 `ready / missing / unsupported` 三态：非 macOS 上 Screen Studio 直接报「unsupported，其他内容管理能力仍可用」；检测到公开的 oil-cover 但缺少 Jacky 品牌层时，设置页**只说明缺失、不伪造一个一键安装按钮**。数据回收侧（`src/collectCache.ts`）有 90 秒结果缓存（`COLLECT_CACHE_TTL_MS = 90_000`），每次同步开新的 Ego 浏览器空间、采完就关；平台上有但本地没有文件夹的内容，不会自动建条目。这些都是小地方，但能看出作者对「AI 权限」的态度是保守的。

整个内容闭环长这样：

![DSH-Creator 内容生命周期：灵感→选题→脚本→演示/视频→字幕/封面→发布→复盘，规则回流](/images/dsh-creator-local-content-cockpit-deep-dive/diagram-pipeline.png)

运营工作台（`src/cockpit/`）还提供档期、阶段目标、六维发布前诊断（可选项，不点采纳不写入）和复盘模板。复盘内容必须人工确认后才写入 Markdown。发布侧默认四个平台（小红书、抖音、B 站、视频号）**全部不勾选**，勾选只代表允许 AI 操作，不代表已登录——登录状态用 Ego Browser 只读检测。

## 四、最小上手路径

普通用户不用碰源码：

1. 安装 [DSH Desktop 2.0.2](https://github.com/anywhere-labs/dsh-desktop/releases/tag/v2.0.2)（同为社区项目）；
2. 打开 DSH Desktop 的**内置终端**（不是聊天框），执行：

```bash
dsh plugin --profile web add jacky-creator
```

npm 不可用时可以钉死 Release 成品包：

```bash
dsh plugin --profile web add https://github.com/Jackywxsz/DSH-Creator/releases/download/v0.1.0-beta.8/jacky-creator-0.1.0-beta.8.tgz
```

3. 彻底退出并重启 DSH Desktop，侧边栏左上角出现 Jacky Creator 即成功；
4. 新建会话，选 `standard` 或 `code` Agent（`minimal` 没有 Skill 和文件工具，不适合首次引导），发送：「帮我配置 Jacky Creator：选择本地内容目录，先预览准备修改的设置，确认后再保存。」

之后直接用自然语言推进即可，比如「等这条的成片落盘，落盘后生成字幕和封面」。字幕转录需要百炼 `DASHSCOPE_API_KEY`，封面需要 ZenMux `ZENMUX_API_KEY`，Key 由 DSH 凭据服务保存，界面只显示配置状态、不回读。

## 五、谁该现在用，谁该再等等

**现在就值得试的人：**

- 已经在用或打算试 DeepSeek Harness Desktop、主力机是 Mac 的个人创作者；
- 多平台分发（小红书/抖音/B 站/视频号）但被「四个后台四份数据」折磨的人；
- 在意数据主权、受不了内容被锁进云端黑盒的人；
- 喜欢「AI 干活、人握确认键」这种克制自动化风格的人。

**建议再等等的人：**

- Windows/Linux 主力用户：核心片库和脚本能用，但 Screen Studio、Ego Lite 等扩展仅支持 macOS，等于少了半条制作链；
- 追求「一句话全自动出片」的人：它明确不替你录制、导出和点发表，要的是协作者而不是替身；
- 需要生产级稳定性保证的团队：还在 `0.1.0-beta`，beta.7 刚做过硬性命名迁移，升级前务必看 [CHANGELOG](https://github.com/Jackywxsz/DSH-Creator/blob/main/CHANGELOG.md)。

还有一个法律细节：代码是 MIT，但 Jacky Creator 名称、芽仔形象、Logo 等品牌资产**不随 MIT 自动授权**（见 BRAND_ASSETS.md），二开或商用前要单独读。

## 结语

AI 内容工具的主流叙事是「上云、托管、全自动」，DSH-Creator 给出的是另一条路：内容留在你自己的文件夹里，AI 通过一套边界清晰的工具推进流水线，所有不可逆的动作都要你点头。它不适合每个人，尤其不适合想要全自动矩阵号的人；但如果你认同「创作资产应该可迁移、AI 应该是副驾而不是代驾」，这 351 个全绿测试背后的项目，值得你花二十分钟装起来跑一条片子。

项目地址：[https://github.com/Jackywxsz/DSH-Creator](https://github.com/Jackywxsz/DSH-Creator)
