# 读完 3500 行源码：一个把抖音收藏变成 Obsidian 笔记的开源小工具，细节意外扎实

"收藏即学会"大概是这个时代最普遍的自我安慰。刷到教程觉得有用，手指一点收藏，内容就此沉底——视频无法全文检索，收藏夹越攒越乱，也进不了自己真正在用的笔记系统。

我最近看到一个专门解决这个问题的开源项目：tars1230/douyin-favorites-to-knowledge。它在你本人授权登录后，把抖音**收藏**同步为本地 Markdown，可直接进 Obsidian，并能把口播视频转写成全文、给图文画面 OCR 认字，还能每晚自动出日报。项目不大（约 3500 行 Python，79 Star，MIT，v2.3.6，作者 Cheng Chen），但我克隆仓库读完 README、CHANGELOG、配置 schema 和核心模块后，发现它在安全和工程上的克制远超一般的"爬虫小脚本"。这篇做一次源码向拆解。

## 一、它的定位：个人授权同步，不是爬取工具

先把边界讲清楚，因为这决定了整个架构：

- 只访问你**主动登录后本来就有权查看**的收藏/喜欢，不绕过登录或平台访问控制；
- 默认产物是本地纯文本 Markdown，不做批量视频下载器，也不做内容分发；
- Cookie 不作为命令行参数或配置字段，不进入笔记和日志。

工作流可以概括为：

![从刷到收藏到可搜索本地笔记的工作流](WORKFLOW)

```text
独立浏览器 profile 授权登录 → 扫描新增收藏 → (可选)转写/认字 → 写入 Markdown + SQLite 防重账本
```

日常使用只有两个命令：`setup` 选知识库目录和转录方案并完成官方页登录，之后 `sync` 静默增量同步。没有新增返回 `no_changes`，有新增返回 `committed`，同一条不会重复入库。

## 二、收藏与喜欢：从数据结构上强制隔离

抖音里"收藏"（favorite_collection）是主动筛选的高信噪比集合，"喜欢/点赞"（like）往往是随手行为、量大噪声多。项目默认只同步收藏，只有用户明确说"喜欢/点赞"才采集 `showTab=like`，二者绝不混用：

![收藏与喜欢两套列表严格隔离](SOURCES)

这不是文档层面的约定，而是落到了存储：两类来源使用**独立的防重键、独立的文件名**（喜欢是 `like-*.md`）、独立的日报文件（`日报/YYYY-MM-DD-喜欢日报.md`）。CHANGELOG 里明确提到历史上出现过"收藏与喜欢混成同一个增量状态"导致的漏采事故，新版本用物理隔离来杜绝同类回归。对于做增量同步的人，这是个很值得借鉴的教训：不要用一个状态机承载两种语义不同的来源。

## 三、转写：针对抖音防盗链的真实选型

三种 ASR 方案的取舍，是这个项目最有实战含量的部分：

![三种转写方案与防盗链处理](ASR)

**默认 SiliconFlow SenseVoice。** 抖音 `play_url` 带防盗链，本机下载必须携带 `Referer: https://www.douyin.com/`，否则返回 403。程序的路径是：用带本轮登录态和正确 Referer 的浏览器式请求在本机临时下载已授权播放地址 → `ffmpeg -vn` 抽音频（默认 64kbps/16kHz，可用 `DOUYIN_ASR_AUDIO_BITRATE`、`DOUYIN_ASR_SAMPLE_RATE` 调）→ 把**音频**上传给 `FunAudioLLM/SenseVoiceSmall` → 删除临时媒体。截至 2026-08-05 官方价格页该模型标注免费，项目也明确写"价格会调整，不承诺永久免费"。

**本地 faster-whisper。** 不上传任何内容，零 API 费用，代价是 ffmpeg、约 500MB 模型和本机算力。

**阿里云百炼 qwen3-asr 仅可选、不默认。** 原因很硬核：百炼的 URL-ASR 是让阿里云服务器去拉媒体 URL，而 `*.douyinvod.com` 有 Referer 防盗链，云服务器拿不到，属于**结构性失败**，不是偶发网络问题。所以即使百炼是大厂方案，也不能作为抖音场景的默认。这个判断比"接几个 ASR 厂商让用户自己选"要负责任得多。

2.2.4+ 还统一了媒体路径：优先 `play_url`/`video_url` 抽人声，而不是常为 BGM 的 `music.play_url`（audio_url）。转写失败、文件超 512MB 上限或预算超限的条目不写笔记也不打防重标记，下次自动重试。

**图文 OCR（2.3.4+）**同样分级：SiliconFlow 方案下把图文下载到本机，先用免费的 `PaddleOCR-VL-1.5` 读画面文字；只有识别结果少于 12 字、且用户显式把 `vision.enabled` 设为 `true`，才对第一张图调用一次付费的 `Qwen3-VL-32B`，并有每日条数上限（`max_daily_items` 默认 20）和输出长度上限（`max_output_length` 默认 400）。付费能力默认关闭，升级不会产生意外费用。

## 四、安全设计：密钥与 Cookie 的零落地

通读 `security.py`、`config.py`、`browser_collector.py` 后，几条安全策略是实打实写进代码的：

1. **不要求复制 Cookie**。通过 Playwright 启动独立浏览器 profile，用户在抖音官方页面登录，Cookie 只留在该本地 profile；优先复用系统 Chrome/Edge。
2. **密钥只从环境变量读**（`SILICONFLOW_API_KEY`/`DASHSCOPE_API_KEY`），配置文件、笔记、日志都不写。配置校验会扫描疑似密钥字段并报 `secret-like key blocked` 阻止入库。
3. **最小化外传**：上传给模型服务的是抽出的音频/本机下载后的小图，从不把抖音播放地址交给第三方域名；下载时登录态只发给抖音相关域名。
4. **输入防御**：推理标签、NUL、常见密钥格式、重复 ID、哈希篡改、冲突文件都会阻断写入。
5. **临时文件与限额**：单视频默认 512MB，可配；进程被杀后下次清理超过 24 小时的临时目录。

这套设计的核心思想是：授权凭据和第三方密钥都尽量"只用不存"，而能持久化的只有不含秘密的笔记与账本。

## 五、可靠性：原子事务、漂移处理与定时日报

`sync` 内部不是"边扫边写"，而是三段式原子事务：

```bash
douyin-favorites-knowledge scan   --review review.json     # 扫描，生成评审文件
douyin-favorites-knowledge review --review review.json \
    --approve-all --approval approval.json                  # 批准，绑定 review 的 SHA-256
douyin-favorites-knowledge promote --review review.json \
    --approval approval.json                                # SQLite 账本 + 原子文件替换入库
```

每一步都支持 `--dry-run`，批准文件与评审内容做哈希绑定，避免"评审的"和"写入的"不是同一批数据。

v2.3.6 还处理了一个很真实的问题——**作者改昵称**。默认 `drift_policy=manual`：仅作者昵称这种非身份元数据变化时，跳过该条、继续同步其余内容，已有笔记保持原样；但标题、描述、转录、标签等**正文一旦冲突，宁可中止整轮也不静默覆盖**，并且一次列出全部冲突而不是停在第一条。可以用 `sync --list-drift` 只盘点不落库，确认无误后再在 config 里改成 `auto_update_metadata`。

定时能力由具备 scheduler 的 Agent 承担：首次配置后创建并验证每天 23:00 的 `daily --source collection --no-login-prompt`，生成 `日报/YYYY-MM-DD-….md`，登录失效则任务失败、不弹浏览器，下次 `login` 后恢复；纯 CLI 环境不假装已创建后台任务，而是明确报告"自动日报未启用"。

## 六、可扩展性与上手

配置 v2 把能力拆成转录、分析、通知三个独立阶段，均支持 Python 的 `module:function` adapter：

```python
def transcribe(item: dict, context: dict) -> dict:
    return {"transcript": "..."}

def analyze(item: dict, context: dict) -> dict:
    return {"tags": ["主题"], "description": "..."}

def notify(event: dict, context: dict) -> None:
    ...
```

分析阶段默认关闭，可以接本地模型或 MiniMax（`mmx` 只有语音合成命令时 check-config 会明确提示不可用于转录，避免误判）；通知支持飞书 webhook 或多维表格，webhook URL 只走环境变量、不落配置，通知失败只标记 `not_sent`，不影响本地写入。依赖中固定版本的 `douyin-knowledge-core` wheel 是抽离的中立内核（不含 Cookie），便于复用。Obsidian 侧不依赖插件：初始化时建好收藏/喜欢/日报/模板目录和可移植 Markdown 模板。

安装（Python 3.10+，建议用 Gitee，国内更快）：

```bash
git clone https://gitee.com/tars1230/douyin-favorites-to-knowledge.git
cd douyin-favorites-to-knowledge
python3 -m venv .venv && . .venv/bin/activate
python -m pip install .
douyin-favorites-knowledge setup                 # 选目录/方案并在官网登录
export SILICONFLOW_API_KEY="你的 Key"             # 用免费云端转写时
douyin-favorites-knowledge sync --dry-run        # 先看新增
douyin-favorites-knowledge sync                  # 正式写入
```

## 结语

这不是一个追求大而全的项目，79 Star、3500 行代码，只做"把抖音收藏变成本地知识"这一件事。但它把几件容易被忽略的事做对了：默认产出不锁定的纯文本、默认只同步高信噪比的收藏、默认选对抖音真正可用且免费的转录路径、默认关闭一切付费与外传开关，并在 Cookie/密钥、原子写入、来源隔离、内容漂移上都有明确机制。

知识管理的瓶颈往往不在收集，而在把收集转化为可检索、可复用的资产。如果你也有一个积灰的抖音收藏夹，与其继续"码了等于学了"，这类"个人授权 + 本地沉淀 + 自动转写"的小工具，可能正是缺的那一环。使用时也请注意：只同步你本人账号有权访问的内容，遵守平台条款与相关法规。

项目地址：https://github.com/tars1230/douyin-favorites-to-knowledge （国内镜像 Gitee 同名仓库），MIT 协议，当前 v2.3.6。
