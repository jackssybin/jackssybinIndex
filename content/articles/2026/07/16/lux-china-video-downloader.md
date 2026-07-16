---
title: "折腾 yt-dlp 装了半小时 Python 还报错，我换了这个 31.5k 星的 Go 单文件后终于安稳了"
url: "/articles/2026/07/16/lux-china-video-downloader/"
date: "2026-07-16T22:00:00+08:00"
lastmod: "2026-07-16T22:00:00+08:00"
description: "iawia002/lux 是 GitHub 31.5k star 的 Go 视频下载器，支持 B 站/知乎/微博/小红书/爱奇艺/优酷/QQ 等 49 个站点。这篇讲清楚：单文件为什么比 yt-dlp 好用、release 停在 v0.24.1 但 master 还在活跃提交的坑、5 分钟上手完整命令、以及什么场景应该切回 yt-dlp。"
tags: ["视频下载", "开源工具", "Go", "命令行", "yt-dlp", "Bilibili"]
topic: "开源工具"
topicSlug: "open-source-tools"
layout: article
contentType: article
---

![lux 项目封面](/images/lux-china-video-downloader/cover-zhihu.png)

上周三我在 macOS 上装 yt-dlp，`brew install yt-dlp` 装完跑第一条命令就报 `ImportError: cannot import name 'brotli' from 'urllib3'`——很典型的 Python 依赖冲突，跟本机装过的另外几个 Python CLI 打架。折腾了 40 分钟，走的是"清 pip cache → pyenv 装干净 3.11 → 重装 yt-dlp → 又报 ffmpeg 版本"的老路子。

同事看不下去，甩了我一个仓库：`iawia002/lux`。31.5k star，Go 写的，一个 8MB 的二进制，没任何运行时依赖。装完以后我用它扒了 B 站的一个开源课公开视频（已获得作者授权归档），5 秒钟拿到 MP4。回过头我才想通一件事：**中文站视频下载这件事上，yt-dlp 已经不是最优解了。**

这篇文章讲清楚三件事：

1. **为什么 lux 在中文站上比 yt-dlp 顺手**——49 个 extractor 里差不多一半是中文站，包括 B 站、知乎、微博、小红书、抖音、优酷、爱奇艺、QQ、网易云、喜马拉雅。
2. **release 停在 v0.24.1 但 master 还在活跃提交的坑**——如果你 `brew install lux` 装到的是 2024-05 的老版本，YouTube 字幕这类新功能你根本用不上。绕过办法在文末。
3. **完整 5 分钟上手命令**，以及**什么场景应该切回 yt-dlp**（结论前置：YouTube 长期还是 yt-dlp）。

## 一、Lux 是什么

`iawia002/lux`（[GitHub 仓库](https://github.com/iawia002/lux)）是一个用 Go 写的视频下载 CLI，作者是 Xinzhao Xu。项目 2018-02 开始，到 2025-12 仍有活跃提交。定位是 **fast and simple video downloader**——slogan 里的 `Let there be Lux!` 是圣经"要有光"的双关。

**核心数据**（截至 2026-07）：

| 项 | 数据 |
|---|---|
| GitHub star | 31,526 |
| fork | 3,314 |
| open issues | 545 |
| license | MIT |
| 最后一次提交 | 2025-12-29 |
| 最新 release | v0.24.1（2024-05-06） |
| 支持站点 | 49 个 extractor |
| 主要语言 | Go |
| 二进制大小 | ~8MB（无依赖） |

**支持的中文视频/图片/音频站点**（不完全列表）：

- 视频：**哔哩哔哩 · 抖音 · 快手 · 小红书 · 微博 · 知乎 · 爱奇艺 · 优酷 · 腾讯视频 · 芒果 TV · AcFun · 好看视频 · 西瓜视频/头条 · 斗鱼 · 虎牙 · 秒拍 · 糖豆广场舞**
- 图片：**半次元（bcy） · pixivision · 小红书 · 抖音**
- 音频：**网易云音乐 · 喜马拉雅 · 音悦台**
- 海外：YouTube · Vimeo · Facebook · Instagram · Threads · Twitter · TikTok · Reddit · Pinterest · Tumblr · Odysee · Rumble · VKontakte · Bitchute · StreamTape · Zing MP3 · XVIDEOS · Pornhub · Eporner
- 其它：**极客时间 · 联合新闻网（udn）** · Universal（通用抓取）

![lux 支持的视频站点分类图](/images/lux-china-video-downloader/01-supported-sites.png)

**这里的对比落差点很清晰**：yt-dlp 对海外站点（YouTube/Twitter/Instagram/TikTok）覆盖是行业顶配，几乎每周都在打补丁；但对中文站点，yt-dlp 靠社区志愿维护，B 站的 DASH 修复、抖音的动态签名、优酷的 ccode/ckey 这些细节，长期不如 lux 上心。Lux 反过来——**中文站是它的主战场，海外站是补充**。

## 二、为什么单文件二进制这件事很重要

用过 yt-dlp 的都知道那个感觉：装完 `yt-dlp`，还得单独装 `ffmpeg`，Python 版本要对，`pip install --upgrade` 时经常和其他工具打架，Windows 用户还得处理 PATH。

Lux 是 Go 写的，编译产物就是单文件。你可以：

```bash
# 方案 A: Go 环境（推荐，拿到 master 最新）
go install github.com/iawia002/lux@latest

# 方案 B: 系统包管理器（简单，但版本老）
brew install lux              # macOS
scoop install lux              # Windows
choco install lux              # Windows
xbps-install -S lux            # Void Linux

# 方案 C: 直接下 release 二进制
# https://github.com/iawia002/lux/releases
```

**唯一的外部依赖是 ffmpeg**，只用来合并分片（B 站的 DASH、YouTube 的 video/audio 分流下载后合并成一个 MP4）。如果你只下已经是单文件的视频，连 ffmpeg 都不需要。

## 三、5 分钟上手：完整命令清单

先明确一个前提：**下面所有演示我都用作者公开授权的视频**（Rick Astley 的官方 YouTube MV、B 站官方版权视频等）。工具本身是中性的，用来做什么由使用者负责——归档自己上传的内容、抢救即将下线的开源课程、备份免费公开演讲，都是常见合规场景。

### 3.1 看视频有哪些清晰度可选

```bash
lux -i "https://www.bilibili.com/video/BV1xx411c7mD"
```

`-i` 是 info-only，不下载，只列出所有 stream 选项。会打印一个表格，告诉你有 1080p / 720p / 480p 分别多大、编码是什么、下载命令是什么。

### 3.2 直接下载（默认最高清晰度）

```bash
lux "https://www.bilibili.com/video/BV1xx411c7mD"
```

Lux 默认取最高清晰度。你会看到进度条、下载速度、剩余时间。下完是一个 MP4 或 FLV，文件名默认取视频标题。

### 3.3 选特定清晰度 / 特定 stream

```bash
# 用 -f 指定 stream ID，ID 从上一步的 -i 输出里拿
lux -f mp4-1080 "https://www.bilibili.com/video/BV1xx411c7mD"
```

### 3.4 下载合集 / 播放列表

```bash
lux -p "https://www.bilibili.com/video/BV1xx411c7mD"
```

`-p` 走 playlist 模式，会自动把合集里的每一集都下下来。配合 `--items 1,3,5-8` 可以只下指定分 P。

### 3.5 多线程加速

```bash
lux --multi-thread -n 10 "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

`-n 10` 起 10 个线程分段下载，对大文件（>100MB）加速明显。

### 3.6 提交 URL 列表批量下

```bash
# urls.txt 每行一个视频链接
lux -F urls.txt
```

### 3.7 需要登录的站点：用 cookie

某些平台（B 站的会员专享、知乎的付费专栏、极客时间）需要登录。Lux 支持传原始 cookie 字符串：

```bash
lux -c "SESSDATA=xxx; bili_jct=yyy" "https://www.bilibili.com/video/BV..."
```

**这里必须提醒**：cookie 是你的账号凭证，别贴到公开的地方。而且这只适用于"归档你自己有权访问的内容"——比如你花钱订阅的极客时间课程、你自己上传的作品——不适用于共享/借用他人账号。

### 3.8 只下音频（讲座/播客场景）

```bash
lux --audio-only "https://www.bilibili.com/video/BV..."
```

### 3.9 YouTube 字幕下载 + 嵌入（新功能，需 master 版本）

这个功能是 2025-12-12 才合并的（PR #1430）：

```bash
lux --caption --embed-subtitle "https://www.youtube.com/watch?v=..."
```

`--caption` 是下字幕文件（`.srt`/`.vtt`）；`--embed-subtitle` 是直接把字幕烧进视频（需要 ffmpeg）。

![lux 命令使用流程图](/images/lux-china-video-downloader/02-workflow.png)

## 四、release 停滞的真相：一定要装 master

这是本文最关键的一个坑。

Lux 的最新 release 是 **v0.24.1（2024-05-06）**，到今天已经 20 个月没打新 tag。但 master 分支从来没停过——

- 2025-12-29：export `Bar` field for progress tracking (#1434)
- 2025-12-12：**add YouTube subtitle download & embed support** (Fixes #288) (#1430)
- 2025-11-25：Bilibili 相关修复
- 2025-11-21：Fix YouTube download issue: update dependency version
- 2025-09-15：Bilibili 修复

换句话说，如果你 `brew install lux` 装了 v0.24.1，你会**没有 YouTube 字幕功能，缺一批 Bilibili 修复，可能碰到已经修好的 bug**。

**绕过办法只有一个：走 `go install`**：

```bash
# 需要先装 Go（macOS: brew install go）
go install github.com/iawia002/lux@latest
# 之后 lux 二进制在 $GOPATH/bin 或 $HOME/go/bin
which lux
```

Master 编译不需要你有 fork，Go module 系统会直接从 GitHub 拉。这是唯一能拿到最新代码的稳定路径。作者不打 tag 的原因，issue 里没有明确说明——猜测是版本策略保守，认为 master 需要更多稳定期。但对读者来说，结果就是**Homebrew/Scoop/Chocolatey 装到的都是过时版本**。

## 五、什么场景应该切回 yt-dlp

Lux 好用，但不是万能。**结论前置**：

| 场景 | 首选 |
|---|---|
| B 站/知乎/微博/小红书/抖音/爱奇艺/优酷/QQ 视频归档 | ✓ Lux |
| 播客/演讲的音频提取 | ✓ Lux（`--audio-only`） |
| 单文件二进制、无 Python 依赖 | ✓ Lux |
| YouTube 长期主力 | yt-dlp |
| Twitter / Instagram / TikTok / Reddit 高频抓取 | yt-dlp |
| 需要 `--cookies-from-browser` 自动读浏览器 cookie | yt-dlp |
| 需要复杂后处理 pipeline（音质转码、chapters 切片） | yt-dlp |
| 需要活跃社区打补丁（每周更新） | yt-dlp |

**核心判断**：yt-dlp 强在**海外站生态活跃度 + 后处理能力**，Lux 强在**中文站覆盖 + 部署简单**。真要归档中文视频，Lux 顺手；真要长期跟 YouTube 或 Twitter 的反爬打，yt-dlp 更靠谱。

**两个都装并不冲突**——lux 就一个二进制，占 8MB。我现在的策略是：

- 中文站 → lux
- YouTube / Twitter / TikTok → yt-dlp
- 都能下的时候 → 谁先跑通用谁

![lux vs yt-dlp 场景选择表](/images/lux-china-video-downloader/03-lux-vs-ytdlp.png)

## 六、进阶用法（收藏向）

### 断点续传

Lux 默认支持断点续传，中途 Ctrl+C 之后再跑同一条命令，会从断点续。

### 出错自动重试

```bash
lux --retry 5 "URL"
```

### 指定输出路径和文件名

```bash
lux -o "/path/to/dir" -O "custom-name" "URL"
```

`-o` 是目录，`-O` 是文件名（不带扩展名）。

### 通过代理

Lux 遵守标准的 `HTTP_PROXY` / `HTTPS_PROXY` 环境变量：

```bash
HTTPS_PROXY=http://127.0.0.1:7890 lux "URL"
```

### 复用抓取的元数据

如果你想编程使用 lux 的抓取能力（比如把 stream 列表塞给自家的下载器），用 `-j` 输出 JSON：

```bash
lux -j "URL" | jq '.[0].Streams'
```

### 优酷的 ccode/ckey

优酷因为签名机制，有时需要传：

```bash
lux --youku-ccode 0502 --youku-ckey "xxx" "https://www.youku.com/..."
```

具体值 issue 里有人整理过，因为优酷不定期变，README 已经声明 known issues。

## 七、什么时候等一等

- **Lux 更新周期不像 yt-dlp 那么快。** 一个新的站点反爬变更，yt-dlp 可能几天内出补丁，lux 平均是几周到几个月。所以如果你今天下载失败，先检查是不是 lux 版本老（走 `go install @latest`），然后再查 issue（有人可能已经提了）。
- **付费专栏/VIP 内容不在合规使用范围内。** 别拿去做这个，工具会不会被用可以另外聊，但读者不应该把 lux 当破解工具。
- **企业内网/合规环境**，先跟你们的合规团队报一下——单文件二进制通常还容易审批（对比 Python + pip install 的攻击面）。

## 八、一句话总结

**如果你还在中文视频站上折腾浏览器插件、脚本、SwitchyOmega + 抓包，lux 值得替代掉那一套。** 装完只有 8MB，一条命令走天下，`go install @latest` 装到 master，比 brew 装的老版本更值得。

如果你主要下 YouTube，别换。yt-dlp 就是它的舒适区，动 pip 依赖那点疼痛，比切工具的心智成本低。

## 参考资料

- 官方仓库：<https://github.com/iawia002/lux>
- Author：Xinzhao Xu（<https://github.com/iawia002>）
- License：MIT
- YouTube 字幕功能 PR：#1430（2025-12-12）
- yt-dlp 对比：<https://github.com/yt-dlp/yt-dlp>
