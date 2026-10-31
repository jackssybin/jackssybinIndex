---
title: "刷抖音收藏了几千条然后再也没看？这个 79 Star 的小工具，把收藏自动变成 Obsidian 笔记"
slug: "douyin-favorites-to-knowledge"
date: 2026-10-30
draft: false
categories: ["开源项目", "效率工具"]
tags: ["开源", "抖音", "知识管理", "Obsidian", "Markdown", "Python", "语音转写", "自动化"]
cover: "/images/douyin-favorites-to-knowledge/cover.png"
description: "tars1230/douyin-favorites-to-knowledge 是一个 MIT 协议的 Python 小工具：授权登录自己的抖音账号后，把新增收藏（和可选的喜欢）同步成本地可搜索的 Markdown，可直接进 Obsidian，还能用 SiliconFlow SenseVoice 免费把口播视频转成全文、用免费 OCR 读图文画面上的字，每晚 23:00 自动出日报。本文克隆仓库（v2.3.6，约 3500 行 Python）拆解它的工作流、收藏与喜欢严格隔离、防重账本、原子事务（scan→review→promote）、安全边界（不存 Cookie/Key、Referer 防盗链）和三种转录方案的取舍，也说清它只是个人授权同步、不绕过平台控制、不做内容下载器这些边界。"
---

每个人的抖音收藏夹都是一座数字坟场。

刷到"这个有用，先码了"，手指一点收藏，然后——就没有然后了。收藏夹里躺着几千条视频，真要找一个当初觉得"以后一定用得上"的教程，只能在无尽的下滑里碰运气，视频又没法全文搜索，更别说整理进自己的知识体系。

我最近翻到一个很对胃口的开源小工具：[douyin-favorites-to-knowledge](https://github.com/tars1230/douyin-favorites-to-knowledge)。它做的事一句话讲得清：**你在自己账号里授权登录，它把你的抖音收藏同步成本地 Markdown 笔记，能直接进 Obsidian，还能把视频里说的话转成文字**——于是"收藏"第一次变成了"可搜索、可沉淀的知识"。

项目不大（约 3500 行 Python，79 Star，MIT 协议，v2.3.6，作者 tars1230/Cheng Chen），但完成度和工程细节相当扎实。我把仓库克隆下来通读了一遍，这篇讲清楚它怎么工作、几个设计得很克制的地方，以及边界在哪。

## 一、它解决的核心问题：收藏 ≠ 知识

先看它的产品形态，简单到只有两个命令：

![抖音收藏转知识库：从刷到收藏到可搜索笔记的工作流](/images/douyin-favorites-to-knowledge/workflow.png)

第一次运行 `setup`，选好知识库目录和转录方案，在弹出的**抖音官方页面正常登录**；以后每次想整理，只需要一条：

```bash
douyin-favorites-knowledge sync
```

它静默扫描"自上次同步以来新增的收藏"，逐条写成独立 Markdown 文件，没新增就返回 `no_changes`，有新增返回 `committed`，同一条不会重复入库。每条笔记里包含：标题、作者、抖音原始链接、你的收藏描述、视频口播的转写全文（可选）、标签和采集时间。

默认产物就是**一堆干净的本地 Markdown**——这是它最让我认可的决定。知识被牢牢握在你自己硬盘上的纯文本里，不锁定在任何 App、不依赖任何插件，Obsidian 能直接打开，将来换任何工具都能带走。

## 二、收藏和喜欢，绝不混用

这个细节能看出作者是真用过、真踩过坑。

抖音里"收藏"和"喜欢（点赞）"是两套完全独立的列表：收藏是你主动筛选过的知识候选，而随手点赞的量更大、噪声更多。工具默认**只同步收藏**，只有你明确说"喜欢/点赞"时才扫喜欢列表：

![收藏与喜欢两套列表严格隔离，各有独立账本与文件名](/images/douyin-favorites-to-knowledge/sources.png)

两类来源有各自独立的防重键和文件名：收藏是普通笔记，喜欢是 `like-*.md`，日报也是分开的 `YYYY-MM-DD-喜欢日报.md`。README 里专门提到，历史上出过"收藏和喜欢混成同一个增量状态"导致漏采的事故，所以这一版从数据结构上彻底隔开。

这种"默认做对的事、把噪声挡在门外"的克制，贯穿整个项目——比如它不会因为检测到 API Key 就偷偷帮你开启付费转录，所有花钱的动作都要你显式选择。

## 三、口播视频自动转全文：三种方案，默认免费

收藏教程类视频，真正有价值的是里面"说了什么"。它内置三种语音转写（ASR）方案，适配思路非常实际：

![三种转录方案对比与抖音防盗链的处理路径](/images/douyin-favorites-to-knowledge/asr.png)

- **SiliconFlow（硅基流动）SenseVoice —— 默认推荐**。这是最关键的工程点：抖音播放地址带防盗链，本机下载必须带 `Referer: https://www.douyin.com/` 这个请求头，否则 403。它在本机用带正确 Referer 的浏览器式请求把已授权的视频临时下载下来，用 `ffmpeg` 抽出音频（默认 64kbps/16kHz），上传给 SiliconFlow 的 `FunAudioLLM/SenseVoiceSmall` 转写，结束后删除临时文件。截至 2026-08-05 官方价格页这个模型标注**免费**（以价格页为准，不承诺永久免费）。
- **本地 Whisper（faster-whisper）**：完全不走云端，没有 API 费用，但要装 ffmpeg、首次下载约 500MB 模型，吃本机算力。
- **阿里云百炼 qwen3-asr —— 仅可选，且不再默认**。原因写得很坦诚：百炼是"把 URL 交给阿里云服务器去拉"，而抖音 `*.douyinvod.com` 的地址带 Referer 防盗链，阿里云服务器拉不到，所以**对抖音是结构性失败**。只有当你确认音频 URL 能被公网直接访问时才用。

这个"为什么默认选 SiliconFlow 而不是百炼"的判断，是项目里最有含金量的实战经验之一——它没有简单罗列一堆 ASR 厂商，而是针对抖音的防盗链机制选了真正能跑通的那条路。

**图文内容还能"认字"**（2.3.4+）：选 SiliconFlow 时，图文条目会下载到本机，用免费的 `PaddleOCR-VL` 读画面上的文字；只有当认出来的字太少（少于 12 个字符）且你手动打开 `vision.enabled` 时，才会对第一张图调用一次付费的 Qwen3-VL，并且按自然日设了条数上限（默认 20）。升级到新版不会自动开始扣费——付费开关默认是关的。

## 四、安全模型：最让我放心的部分

一个能登录你抖音、又能调云端 API 的工具，安全设计必须经得起看。这个项目在这方面写得异常清楚，而且和代码一致：

- **不需要你复制 Cookie**。很多同类工具要你 F12 抓 Cookie 粘贴进配置，既麻烦又危险。它直接开一个独立的本地浏览器 profile，你在抖音官方页面正常登录，Cookie 只留在那个浏览器 profile 里；
- **配置文件不存任何秘密**。Cookie、API Key、密码、token 都不进配置、不进笔记、不进日志。`SILICONFLOW_API_KEY` 这类密钥只从环境变量读；
- 内置安全检查会**主动拦截**：配置里如果写了疑似密钥的字段（`secret-like key blocked`）、重复 ID、哈希篡改、冲突文件、可疑的 NUL 字符，都会阻止入库；
- 下载媒体只给抖音相关域名带本轮登录态，**绝不把抖音播放地址交给模型服务商**（传给 SiliconFlow 的是抽好的音频，不是视频 URL）；
- 单视频下载默认上限 512MB，转录失败/超限的条目不入库、不写防重账本，下次自动重试；临时文件用完即删，进程被杀还会清理超过 24 小时的遗留目录。

它还把自己的边界划得很明白：**只访问你自己登录后本来就有权看的收藏，不绕过登录或平台访问控制，也不做批量视频下载器。**

## 五、不只是脚本：原子事务、日报和可插拔架构

如果说前面是"好用的小工具"，那下面这些是"工程上认真了"的证据。

**原子事务保证不写花。** `sync` 内部拆成 `scan → review → promote` 三步：先扫描生成评审文件，再批准（批准文件绑定 review 的 SHA-256），最后用 SQLite 防重账本 + 原子文件替换一次性入库。每一步都支持 `--dry-run`，中途失败不会留下半写的笔记库。

**作者改昵称不会再卡死同步。** 2.3.6 刚修的点：如果只是作者昵称变了（`drift_policy` 默认 `manual`），跳过这一条继续同步其余内容，已有笔记保持原样；但**标题、描述、转录、标签这些正文一旦有冲突，宁可中止整轮也不静默覆盖**。你可以先 `sync --list-drift` 一次性看清所有"漂移"条目再决定怎么处理。

**每晚 23:00 自动日报。** 具备定时能力的 Agent 首次配置后会创建并验证一个每天 23:00 跑的任务，静默同步新增并在知识库 `日报/` 目录生成当天 Markdown 日报，没新增也会写"今日没有新增条目"；登录失效时任务失败但不弹浏览器，等你下次 `login` 后自动恢复。纯命令行环境则很诚实地不假装自己创建了后台任务。

**可插拔的三阶段架构。** 转录、分析、通知三个阶段都能通过 `module:function` 的 adapter 接你自己的实现——转录可换本地/百炼/自定义，分析默认关闭（可接本地模型或 MiniMax），通知可接飞书 webhook 或多维表格。依赖里那个固定版本的 `douyin-knowledge-core` wheel 是抽出来的中立共享内核（不含 Cookie），方便别的工具复用。

## 六、上手与真实成本

**系统要求**：Python 3.10+、Chrome/Edge 或 Playwright Chromium、能访问自己账号的收藏。国内网络建议从 Gitee 克隆（GitHub 存源码和 issue，Gitee 自动同步 main 和正式标签）：

```bash
git clone https://gitee.com/tars1230/douyin-favorites-to-knowledge.git
cd douyin-favorites-to-knowledge
python3 -m venv .venv && . .venv/bin/activate
python -m pip install .

douyin-favorites-knowledge setup          # 选目录、选转录方案、官方页登录
export SILICONFLOW_API_KEY="你的Key"       # 用免费云端转录时
douyin-favorites-knowledge sync           # 以后每次整理
douyin-favorites-knowledge sync --dry-run # 只看新增不写入
```

想交给 AI Agent 用更省事：支持 ClawHub 的 Agent 一句 `clawhub install douyin-favorites-to-knowledge`，然后说"把我的抖音收藏同步到 Obsidian，用 SiliconFlow 转录，别让我复制 Cookie"即可。

成本上：默认的 SiliconFlow SenseVoice 当前免费，建议装 ffmpeg；本地 Whisper 零 API 费用但要 ~500MB 模型和本机算力；选 `none` 则只存收藏描述和链接，完全不花钱不装额外东西。

## 结语

它不是什么革命性的大项目——79 Star，3500 行代码，只做"把抖音收藏变成本地笔记"这一件事。但我喜欢它的理由恰恰是这种"小而对"：

默认产物是不锁定的纯文本 Markdown；默认只同步高信噪比的收藏而不混进点赞；默认选真正能跑通防盗链且免费的转录；默认把所有花钱、动账号的开关都关着，等你显式打开；还把 Cookie、密钥、原子性、防漂移这些"不出事时没人注意、一出事就是事故"的地方一个个处理到位。

如果你也有个积灰的抖音收藏夹，与其继续"码了等于学了"，不如让它每晚自动把真正有价值的口播，沉淀成你搜得到、带得走的笔记。知识管理最难的从来不是收藏，而是把收藏变成自己的东西——这个工具补上的正是中间那一步。

> 项目地址：[https://github.com/tars1230/douyin-favorites-to-knowledge](https://github.com/tars1230/douyin-favorites-to-knowledge)（国内：[Gitee 镜像](https://gitee.com/tars1230/douyin-favorites-to-knowledge)）
> 协议：MIT ｜ 当前版本：v2.3.6（2026-10-29）｜ 数据基准：2026-10-30
>
> 本文基于仓库 v2.3.6 源码、README、CHANGELOG 与配置 schema 撰写。请仅同步你本人账号有权访问的内容，遵守平台条款与相关法律法规。
