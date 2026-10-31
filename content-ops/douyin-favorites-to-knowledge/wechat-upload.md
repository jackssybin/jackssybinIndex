---
title: "抖音收藏了几千条再也没看？这个开源小工具，把你的收藏自动变成 Obsidian 笔记"
cover: /root/jackssybinIndex/content-ops/douyin-favorites-to-knowledge/media/cover-ip.jpg
source_url: https://github.com/tars1230/douyin-favorites-to-knowledge
---

你的抖音收藏夹，是不是也早就成了一座坟场。

刷到"这个干货，先码了"，手指一点收藏，然后就没有然后了。几千条视频躺着吃灰，真要找一个当初觉得"以后一定用得上"的教程，只能在无尽下滑里碰运气。视频又搜不了文字，更不可能整理进你自己的知识体系。

我最近挖到一个很对胃口的开源小工具，叫 **douyin-favorites-to-knowledge**（抖音收藏转本地知识库）。

它干的事一句话：**你在自己账号正常登录，它把新增收藏自动同步成本地 Markdown 笔记，能直接进 Obsidian，还能把视频里说的话转成全文。**

项目不大，79 个 Star，3500 来行 Python，但工程细节做得相当克制。我把仓库克隆下来读了一遍，这篇讲讲它怎么解决"收藏不等于学会"这件事。

## 一条命令，收藏变笔记

它的使用路径简单到只有两个命令。

第一次 `setup`：选好知识库目录、选好转录方案，在弹出的**抖音官方页面正常登录**。以后想整理，就一条：

```bash
douyin-favorites-knowledge sync
```

它静默扫描"上次同步以后新增的收藏"，每条写成一个独立 Markdown：标题、作者、原始链接、你的收藏描述、视频口播的文字稿、标签、采集时间。没新增就告诉你 `no_changes`，同一条绝不重复入库。

![抖音收藏转知识库的完整工作流](/root/jackssybinIndex/content-ops/douyin-favorites-to-knowledge/media/workflow.png)

我最认可的是它默认产物就是**一堆纯文本 Markdown**，牢牢存在你自己硬盘上，不绑定任何 App、不靠任何插件，Obsidian 直接打开，将来换什么工具都带得走。

## 收藏和点赞，它替你分清楚

这个细节说明作者是真踩过坑。

抖音里"收藏"和"喜欢"是两套列表：收藏是你主动精挑过的，喜欢（点赞）往往是随手一滑，量大、噪声多。这个工具**默认只同步收藏**，只有你明确说"把我点赞的也同步"才会去扫喜欢。

![收藏与喜欢两套列表严格隔离](/root/jackssybinIndex/content-ops/douyin-favorites-to-knowledge/media/sources.png)

两类内容有各自独立的防重键和文件名：喜欢的笔记叫 `like-*.md`，日报也单独一份。README 里专门提到，以前出过"收藏和喜欢混成一个增量状态"导致漏采的事故，所以这版从数据结构上就彻底隔开了。

这种"默认帮你做对、把噪声挡在门外"的克制贯穿全项目——比如它检测到你有 API Key，也不会偷偷帮你开付费功能，凡是花钱的动作都得你自己点头。

## 口播视频，自动转成能搜的文字

教程类视频真正值钱的是里面"说了什么"。它内置三种语音转写方案：

![三种转写方案对比](/root/jackssybinIndex/content-ops/douyin-favorites-to-knowledge/media/asr.png)

**默认推荐 SiliconFlow（硅基流动）的 SenseVoice，当前免费。** 这里有个很关键的实战点：抖音播放地址带防盗链，本机下载必须带上 `Referer: https://www.douyin.com/` 这个请求头，不然直接 403。它的做法是本机带正确 Referer 把视频临时下下来，用 ffmpeg 抽出音频，再上传给 SenseVoice 转写，转完删掉临时文件。

另外两个方案：**本地 Whisper** 完全不走云端、零 API 费用，但要下约 500MB 模型、吃本机算力；**阿里云百炼**被明确标成"仅可选、不默认"，原因写得特别诚实——百炼是让阿里云服务器去拉 URL，而抖音地址有防盗链，服务器拉不到，对抖音是**结构性失败**。

图文内容还能"认字"：用免费的 PaddleOCR 读画面上的文字，只有读得太少、且你手动开了付费开关，才会调一次付费的视觉大模型，还设了每天条数上限。升级新版本不会偷偷开始扣费。

## 最让我放心的是安全

一个能登你抖音、又能调云 API 的工具，安全必须经得起看。这项目写得很明白，代码也对得上：

- **不用你复制 Cookie**。它自己开一个独立浏览器，你在抖音官网正常登录，Cookie 只留在本地浏览器里；
- **配置文件不存任何秘密**，Cookie、Key、密码、token 都不进配置、笔记、日志，密钥只从环境变量读；
- 配置里要是写了疑似密钥的东西、重复 ID、文件冲突、哈希被改，都会**主动拦截、拒绝入库**；
- 传给云端的只是抽好的音频，**绝不把你的抖音播放地址交给模型服务商**；
- 单个视频默认 512MB 上限，转写失败的条目不入库，下次自动重试，临时文件用完即删。

它还把边界划得很清楚：**只同步你本人登录后本来就有权看的收藏，不绕登录、不碰平台控制，也不做批量视频下载器。**

## 工程上是认真的

别被"小工具"骗了，底下有不少正经设计：

`sync` 内部是 `scan → review → promote` 的**原子事务**：先扫描、再批准（批准文件绑定 SHA-256）、最后用 SQLite 账本加原子替换一次性写入，中途崩了不会留下写一半的库。作者改个昵称也不会让整轮同步卡死——昵称变了跳过这一条继续，但标题、正文一旦有冲突，宁可中止也不偷偷覆盖。

具备定时能力的 Agent 还能帮你建一个**每天 23:00 的任务**，自动同步并生成当天日报；纯命令行环境则老实告诉你"我没本事建后台任务"，不装。转录、分析、通知三个阶段都能通过 adapter 接你自己的模型或飞书。

## 怎么上手

需要 Python 3.10+、Chrome/Edge（或 Playwright 的 Chromium）。国内建议从 Gitee 克隆：

```bash
git clone https://gitee.com/tars1230/douyin-favorites-to-knowledge.git
cd douyin-favorites-to-knowledge
python3 -m venv .venv && . .venv/bin/activate
python -m pip install .

douyin-favorites-knowledge setup   # 选目录、选方案、官网登录
export SILICONFLOW_API_KEY="你的Key"
douyin-favorites-knowledge sync    # 以后每次整理
```

成本上默认方案当前免费，本地 Whisper 零费用但吃算力，选 `none` 就只存描述和链接、一分钱不花。

说到底，知识管理最难的从来不是"收藏"，而是把收藏真正变成自己的东西。这个 79 Star 的小工具不革命、不花哨，就扎扎实实补上了中间那一步——让你每晚自动把刷到的干货，沉淀成搜得到、带得走的笔记。

如果你那个收藏夹也积灰很久了，值得今晚就跑一次。

---

我是 jk，一个只信「自己跑过」的开源/AI 工具实测派。
每次帮你筛一个能真正省钱、省时间的开源项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目地址和完整安装命令我放在了「**阅读原文**」。

相关阅读：
- [剪映逼我开会员后，我找到了这个免费工具](https://mp.weixin.qq.com/s/bkYGzCKGOoT9AEtq1fnqMQ)
- [找了半年终于找到：全平台媒体下载神器开源了](https://mp.weixin.qq.com/s/QNmVOYyRHlwX94PDQZmlnw)
