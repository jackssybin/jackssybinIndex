---
title: "丢个 YouTube 链接，AcFun 和 B 站自动发：我读了这个 3000 星开源搬运项目的 5 万行代码"
date: 2026-09-11T21:40:00+08:00
lastmod: 2026-09-11T21:40:00+08:00
slug: y2a-auto-youtube-to-bilibili-acfun-pipeline
draft: false
description: "Y2A-Auto 是一个把 YouTube 视频自动搬运到 AcFun/bilibili 的开源工具（GPL v3，3256 star）。我克隆仓库读了 5 万行 Python，拆解它的 8 阶段 checkpoint 状态机、字幕 ASR+翻译+QC 分层质检、转载声明合规默认值、YouTube 监控配额预算和 HEVC 硬编回退，并说清它适合谁、要承担什么账号与版权风险。"
tags: ["开源", "自动化", "YouTube", "bilibili", "AcFun", "字幕翻译", "自媒体"]
topic: "开源项目"
topicSlug: "open-source"
layout: article
contentType: article
type: article
cover: "/images/y2a-auto-youtube-to-bilibili-acfun-pipeline/cover-wechat.jpg"
---

# 丢个 YouTube 链接，AcFun 和 B 站自动发：我读了这个 3000 星开源搬运项目的 5 万行代码

搬过视频的人都知道，真正折磨人的从来不是下载。

把一个 YouTube 视频搬到 AcFun 或 B 站，完整动作是这样的：想办法绕过反爬把视频和封面下下来；听不懂原文就开 ASR 听写字幕；字幕翻译成中文，还得手动断行、对齐时间轴；AI 生成的字幕偶尔会冒出几句"幻觉"，不检查就直接烧进画面；再改标题、写简介、选分区、加标签；最后分别登录两个平台，把压制好的视频传一遍。一条视频折腾半小时起步，中途任何一步报错，常常要从头再来。

市面上不缺 yt-dlp、不缺翻译插件、不缺剪辑软件，缺的是把这些环节**焊成一条不会断的流水线**的东西。这周我翻到的开源项目 [Y2A-Auto](https://github.com/fqscfqj/Y2A-Auto)（GPL v3，GitHub 3256 star / 549 fork），目标就是：**丢一个 YouTube 链接进去，AcFun、B 站自动出稿**。

我把仓库克隆下来通读了源码——109 个 Python 文件、合计 50849 行，其中任务调度核心 `task_manager.py` 一个文件就有 8497 行——又核对了它的 Docker 配置、真实后台截图和仍在活跃的提交记录（2025 年 5 月立项，到我写下这行字的今天还在 push）。这篇不写软文，回答三个我自己最好奇的问题：它凭什么称得上"系统"而不是脚本缝合、字幕这种最容易翻车的环节它怎么兜底、以及用它要承担什么风险。

## 一、它的骨架是一台带断点的状态机，不是一堆脚本

很多"自动化工具"的真实形态是一个几百行的主脚本，从上往下顺序执行：下载失败、翻译超时、上传断网——任何一步崩了，整条重来。Y2A-Auto 不一样，它在 `task_manager.py` 里把整个流程显式定义成了一条有名字、有顺序、可持久化的阶段链（源码常量 `PIPELINE_STAGE_ORDER`）：

```
fetch_info → translate_content → generate_tags → recommend_partition
→ moderate_content → download_video → translate_subtitle
→ upload_to_acfun / upload 到 bilibili / both
```

![Y2A-Auto 的 8 阶段流水线与人工审核插桩点](/images/y2a-auto-youtube-to-bilibili-acfun-pipeline/02-pipeline.png)

这里有三个工程细节，是我读源码时觉得"作者真的被坑过"的地方：

**第一，断点续跑写进了数据库，而不是靠文件。** 每个任务有一个 `pipeline_checkpoint` 字段，存在 SQLite 的 `tasks` 表里，记录已经完成的阶段。注释写得很直白：就算 `downloads/` 目录被清空，断点也不会丢。进程意外退出后重启，它会把所有卡在"处理中"状态的任务回收成 `pending`，从上个完成的阶段接着跑，而不是把已经下载、已经翻译好的成果扔掉重来。

**第二，先做"元信息"，后下载视频。** 注意阶段顺序——取信息、翻译标题简介、生成标签、推荐分区、内容审核这几步，全部排在 `download_video` **之前**。这意味着最重、最占带宽和磁盘的视频文件，要等这条视频"值不值得下、过不过得了审"判断完才拉。对批量监控场景，这个顺序能省下大量无效下载。

**第三，人工审核是一个可插拔的插桩点，不是事后补丁。** 总开关 `AUTO_MODE_ENABLED` 默认是 `false`。关掉自动模式，流水线会在上传前停下来，把 AI 生成的标题、简介、标签、推荐分区摆到 Web 审核页，你可以逐项改完再点"强制上传"；打开它才进入无人值守。这种"默认把人留在环里"的设计，对搬运这种容易触发平台风控的场景是对的。

## 二、Web 后台：把 Cookie、AI、转码、监控全部收进一个面板

整个项目以 Flask 起一个本地 Web 服务（默认 `http://localhost:5000`），所有配置和任务都在后台管理。下面这张是仓库自带的真实截图：

![Y2A-Auto 任务仪表盘，展示任务列表、状态与目标平台](/images/y2a-auto-youtube-to-bilibili-acfun-pipeline/01-dashboard.png)

设置中心被分成若干组：运行概览、账号与网络、内容审核、AI 模型、字幕处理、语音识别、视频转码、监控与维护、安全。对一个要长期挂着跑的服务来说，这种分组比让用户翻配置文件友好得多。

![YouTube 频道/关键词监控页，支持 latest/historical 模式与视频类型筛选](/images/y2a-auto-youtube-to-bilibili-acfun-pipeline/03-monitor.png)

真正让它从"单条搬运工具"升级成"频道运营工具"的是 **YouTube 监控**模块（`youtube_monitor.py`，2460 行）。你可以配置：

- 监控指定频道，或用关键词定时搜索；
- `latest`（只跟最新）或 `historical`（连历史一起搬）两种模式；
- 筛选视频类型：普通视频 / Shorts / 直播回放；
- 命中后自动加入任务队列，并保存监控历史。

这里藏着一个很容易被忽略、但非常专业的设计：**YouTube Data API 的每日配额预算**。监控搜索是吃配额的，默认每天只有 1 万单位。它按太平洋时间（用 `tzdata` 做 DST 感知）对齐配额重置日，多个监控配置共享当日预算；配额耗尽时只跳过本轮，而且**不推进时间游标**——这样配额恢复后，不会永久漏掉跳过窗口里发布的视频。注释里专门解释了为什么缺时区库时要"保守回退固定 UTC-8，宁可晚一小时重置也不提前放量"。

## 三、字幕：ASR 会幻觉，所以它做了三层兜底

搬运英文视频，字幕是质量分水岭，也是最容易翻车的地方。Whisper 这类 ASR 偶尔会把背景音乐、界面提示音、说话人的口头语"听"成文字，直接烧进画面就很灾难。Y2A-Auto 的字幕链路是 **ASR 生成 → 翻译 → 质检（QC）→ 后处理 → 烧录**，我重点读了它的质检（`subtitle_qc.py`，986 行）和后处理引擎（`srt_transform_engine.py`，788 行）。

**质检是分层的，不是无脑全扔给大模型。** 先用规则做硬拦截：命中署名行（"字幕由某某提供"）、噪声提示（笑声/掌声标签）、软件界面操作词、模板化重复句这类明显低质条目，规则层直接判失败，不浪费 AI 调用。只有规则拿不准的"边界样本"才送去 AI 抽样复核——有分数阈值（默认 0.60）、抽样条数上限（默认 80 条）、单次送检字符上限（默认 9000 字符）。AI 不可用或返回不合规时，默认按失败处理，而不是放行。

更关键的是**失败后的降级策略**：QC 没过，它会跳过"烧录字幕"这一步，但保留字幕文件、继续上传原视频，任务照样标记完成，只是带上一个"字幕异常"标记。它选择了"宁可这集没中文字幕，也不让整条流水线崩掉"，把是否返工的决定留给人。

后处理引擎则处理那些机械但必须做的事：长行按 `SUBTITLE_MAX_LINE_LENGTH`（默认 42 字符）自动拆分、每条最多两行（默认）、标点标准化、过滤 um/uh 这类填充词、最短字幕时长（0.6 秒）、相邻小间隙合并（0.3 秒阈值）、统一时间偏移。烧录用的字体仓库直接内置了思源黑体（`SourceHanSansHWSC-VF.otf`），不用自己找中文字体。

ASR 侧它支持两家：OpenAI 风格的 Whisper 接口，和 Mistral 的 Voxtral（`/v1/audio/transcriptions`），并默认开 Silero VAD 先做语音活动检测，把静音切掉再送识别，字幕边界更准。

## 四、那些"能跑起来"才会遇到的脏活，它都处理了

读完源码我觉得这个项目最值钱的不是 AI，而是它把大量"不上生产不知道"的脏活固化了：

- **AI 协议双兼容 + 逐级降级。** 全局 AI 配置同时兼容 OpenAI Chat Completions 和 Responses 两套 API。`OPENAI_BASE_URL` 填根地址或完整端点都行，它会自动识别协议；当第三方网关不支持 `response_format`、自定义 token 上限或某些角色时，它根据具体报错逐级"砍参数"重试，最后降级成只有 `model + user messages` 的最小请求，成功后把这个端点的能力缓存下来（`ai_fallback_client.py`，621 行）。这意味着你可以很方便地接国产兼容接口省钱。
- **转码硬编失败自动回退。** 默认优先 HEVC/H.265 硬件编码：NVIDIA 用 `hevc_nvenc`、Intel 用 `hevc_qsv`、AMD 在 Windows 用 `hevc_amf`、Linux 用 `hevc_vaapi`；任何一个不可用或失败，自动退回 CPU 的 `libx264`。1440p 以上且超过 10 分钟的长视频还会自动把 CPU preset 从 medium 调到 veryfast。
- **通知是 SQLite outbox 异步重试队列。** 企业微信、Server 酱、message-pusher 三个渠道，任务添加/完成/失败、登录成功/锁定、扫码登录成功/失败都能推送；投递失败按 30 秒→120 秒→10 分→30 分→1 小时递增重试，保证最终送达而不是发一次就算。
- **Cookie 不一定要手动导。** 集成了 CookieCloud，可以从你自己的 CookieCloud 服务自动拉取 YouTube/Google 的 Cookie（支持 auto/legacy/aes-128-cbc-fixed 三种加密模式），输出成 Netscape 格式；AcFun 和 B 站则支持手机 App 扫码登录，B 站还能导入 Netscape/JSON Cookie。
- **安全不是摆设。** Web 密码保护、连续输错 5 次锁定 15 分钟、会话 30 分钟空闲超时、首次运行自动生成 256-bit 随机 `SECRET_KEY`，文件操作一律走 `werkzeug.security.safe_join` 防路径遍历。README 还专门提醒：不要把 5000 端口裸开公网，云服务器用 `ssh -L 5000:127.0.0.1:5000` 转发。

## 五、五分钟跑起来（Docker 路径）

官方推荐 Docker，不用自己装 Python、FFmpeg、yt-dlp：

```bash
git clone https://github.com/fqscfqj/Y2A-Auto.git
cd Y2A-Auto
# 先把三份 Cookie 放到 cookies/ 目录：
#   yt_cookies.txt（YouTube）、ac_cookies.json（AcFun）、bili_cookies.json（B站）
docker compose up -d
# 打开 http://localhost:5000
```

默认镜像从 Docker Hub 拉 `fqscfqj/y2a-auto:latest`，`config/`、`db/`、`downloads/`、`logs/`、`temp/`、`cookies/` 都会持久化到本地。如果挂载目录报 `PermissionError`，按 README 把这几个目录属主改成容器内的 `1000:1000` 即可。不用 Docker 的话，本地需要 Python 3.11+、FFmpeg、yt-dlp，`pip install -r requirements.txt` 后 `python app.py`；Windows 还有内置 FFmpeg 的便携 Release 包。

第一次进后台建议的顺序：先开登录保护 → 扫码登录 AcFun/B 站 → 放好 YouTube Cookie → 填 AI 的 Key/Base URL/模型名 → 需要字幕就开 ASR 和翻译 → 提交一条链接试跑，确认无误后再考虑打开 `AUTO_MODE_ENABLED` 和监控。

## 六、谁该用，谁先等等（以及必须想清楚的合规账）

**适合的人：** 做海外内容译介、有明确授权或搬运合理使用需求的频道运营者；需要批量给视频加中文字幕、希望"人工审核 + 无人值守"能自由切换的人；愿意自己管服务器、Cookie、API 成本的技术型玩家。作为一个工程范本，它的状态机、字幕质检分层、协议降级也很值得抄。

**先等等的人：** 纯原创 UP 主，这工具对你没价值；不愿意折腾账号 Cookie、或对平台封号零容忍的人；没有 GPU 又想批量压 1080p 长视频的人（CPU 软压 HEVC 很慢）。

**必须自己算清的账，源码替你兜不住：**

1. **版权与授权是第一位的。** 搬运他人视频涉及著作权，即使项目默认帮你加了转载声明——`UPLOAD_APPEND_REPOST_NOTICE` 默认是 `true`，上传时简介会自动追加"本视频转载自 YouTube，原始上传时间……UP 主……"（见 `acfun_uploader.py`），这是个好习惯，但**声明不等于授权**。能不能搬，取决于原作者许可、平台规则和你的使用性质。
2. **平台服务条款与风控。** 自动上传、Cookie 登录本身在各平台规则里是敏感行为，账号有被限流甚至封禁的可能。建议小号先试、控制频率、保留人工审核。
3. **成本。** ASR、翻译、QC、AI 元信息都调外部大模型，批量跑 Token 不便宜；可选的阿里云 Green 内容审核还要另付费用。
4. **凭据安全。** 三份平台 Cookie 等于登录态，机器和目录权限要管好，别把 `cookies/` 提交进任何仓库。

## 结语

Y2A-Auto 让我欣赏的地方，是它没有把"自动化"理解成"写个定时脚本"，而是老老实实地处理了状态、失败、质检、配额、合规和降级——这五样东西，恰恰是一个工具能不能长期挂着跑的真正门槛。5 万行代码里大部分不是炫技，是被现实反复捶打出来的兜底逻辑。

但工具越自动，人的责任越不能自动消失。它把"怎么搬"做到了工业级，可"该不该搬、得到授权没有、会不会伤到账号"这三个问题，永远需要你自己回答。想清楚这笔账，它会是一把极其趁手的利器；想不清楚，再强的流水线也只是把风险也一并自动化了。

项目地址我放在了公众号「阅读原文」，源码、Docker 镜像和 Telegram 试用机器人都能在仓库 README 里找到。
