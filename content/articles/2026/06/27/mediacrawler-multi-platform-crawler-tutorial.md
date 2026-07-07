---
title: "MediaCrawler 教程：一键爬取小红书/抖音/B站/知乎等多平台自媒体数据"
url: "/articles/2026/06/27/mediacrawler-multi-platform-crawler-tutorial/"
date: "2026-06-27T16:00:00+08:00"
lastmod: "2026-06-27T16:00:00+08:00"
description: "MediaCrawler 是一个基于 Playwright 的强大自媒体爬虫工具，支持小红书、抖音、快手、B站、微博、贴吧、知乎七大平台，无需逆向 JS 加密，CDP 模式复用浏览器登录态，大幅降低风控概率。本文带你完整上手，从环境配置到实际爬取。"
tags: ["爬虫", "数据采集", "多平台", "开源项目"]
topic: "AI 工具"
topicSlug: "ai-tools"
layout: article
contentType: article
---

![封面](/images/mediacrawler-multi-platform-crawler-tutorial/img.png)

# MediaCrawler 教程：一键爬取小红书/抖音/B站/知乎等多平台自媒体数据

做自媒体内容分析、竞品调研、数据挖掘的时候，你是不是遇到过这些痛点：

- 想要批量采集竞品笔记内容，一个个手动复制太折磨人
- 各大平台反爬机制越来越严，接口说封就封
- 网上的爬虫教程要么过时，要么需要复杂的 JS 逆向，新手根本搞不定
- 每个平台都要写不同的爬虫，维护成本太高

今天给大家介绍一个 GitHub 上 13k+ Star 的开源项目 **MediaCrawler**，它完美解决了这些问题。

## 什么是 MediaCrawler

MediaCrawler 是一个功能强大的**多平台自媒体数据采集工具**，支持小红书、抖音、快手、B站、微博、贴吧、知乎七大主流平台的公开信息抓取。

它最聪明的地方在于技术路线的选择：

- **基于 Playwright 浏览器自动化**，直接操作真实浏览器
- **利用浏览器登录态**，不需要逆向复杂的签名算法
- **支持 CDP 模式**，连接你自己已经登录的 Chrome 浏览器，风控概率极低
- **代码结构清晰**，每个平台解耦，二次开发很方便

![MediaCrawler 项目主页](/images/mediacrawler-multi-platform-crawler-tutorial/img.png)

## 功能特性一览

| 平台 | 关键词搜索 | 指定帖子爬取 | 二级评论 | 创作者主页 | 登录缓存 | IP代理池 | 词云图 |
|------|-----------|-------------|---------|------------|----------|---------|--------|
| 小红书 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 抖音 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 快手 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| B 站 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 微博 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 贴吧 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 知乎 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

支持多种数据存储格式：CSV、JSON、JSONL、Excel、SQLite、MySQL。爬完直接分析，非常方便。

还自带 **WebUI 可视化界面**，不用记命令也能玩：

![WebUI 界面](/images/mediacrawler-multi-platform-crawler-tutorial/img_8.png)

## 技术原理：为什么它不容易被封

传统爬虫的思路是：

1. 抓包分析接口
2. 逆向 JS 找到加密签名算法
3. 模拟请求获取数据

这条路现在越来越难走：

- 各大平台签名算法经常变，今天能用明天就挂
- IP 风控严格，请求几次就限流
- 需要不停维护，精力都花在适配反爬上了

MediaCrawler 换了个思路：

```
你的浏览器已经登录了 → 用 CDP 远程连接你的浏览器 → 直接在浏览器里执行 JS 获取数据 → 天然带着登录态和真实指纹
```

优点显而易见：

1. **无需 JS 逆向**：不用跟加密算法斗智斗勇
2. **登录态复用**：你已经在浏览器登录过，不需要再处理二维码登录（当然也支持二维码）
3. **极低风控**：请求来自真实浏览器，指纹就是你的指纹，很难被检测
4. **稳定性高**：平台界面变了只要结构不变，代码不用大改

## 5 分钟快速上手

### 环境要求

- Python 3.10+
- Node.js 16+（抖音、知乎需要）
- uv（推荐，比 pip 快 10x）

### 步骤 1：克隆项目

```bash
git clone https://github.com/NanmiCoder/MediaCrawler.git
cd MediaCrawler
```

### 步骤 2：安装依赖

推荐用 uv 安装：

```bash
# 安装 uv（如果还没装）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 安装项目依赖
uv sync
```

如果你坚持用 pip：

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 步骤 3：浏览器驱动安装（标准模式需要）

如果你用默认的 CDP 模式（连接已有 Chrome），**这一步可以跳过**。只有切换到标准 Playwright 模式才需要：

```bash
uv run playwright install
```

### 步骤 4：配置 Chrome 远程调试（推荐 CDP 模式）

CDP 模式是我最推荐的方式，因为它复用你已经登录的浏览器，几乎不会被封。

**开启方法：**

1. 确保安装了 Chrome >= 144
2. 在 Chrome 地址栏输入：`chrome://inspect/#remote-debugging`
3. 勾选 **"Allow remote debugging for this browser instance"**
4. 看到 `Server running at: 127.0.0.1:9222` 就好了

> 运行爬虫后，Chrome 会弹出连接确认框，点接受即可。程序会等你 60 秒。

如果不想用 CDP 模式，在 `config/base_config.py` 里改：

```python
ENABLE_CDP_MODE = False
```

### 步骤 5：修改配置

打开 `config/base_config.py`，根据需要修改：

```python
# 是否开启评论爬取
ENABLE_GET_COMMENTS = True

# 关键词搜索
KEYWORDS = "AI工具"

# 指定帖子 ID 爬取，每行一个 ID
FETCH_POST_ID_LIST = [
    "abc123",
    "xyz456",
]

# 指定博主 ID 爬取，每行一个 ID
FETCH_CREATOR_ID_LIST = [
    "creator1",
    "creator2",
]

# 最大爬取数量
MAX_PAGE_COUNT = 5
```

每个配置项都有中文注释，很容易懂。

### 步骤 6：运行爬取

**关键词搜索示例（小红书）：**

```bash
uv run main.py --platform xhs --lt qrcode --type search
```

参数说明：
- `--platform xhs`：指定平台，xhs=小红书，douyin=抖音，bilibili=B站，zhihu=知乎...
- `--lt qrcode`：登录方式，qrcode=二维码，cdp=连接已有浏览器
- `--type search`：爬取类型，search=关键词搜索，detail=指定帖子详情

**指定帖子详情示例：**

```bash
uv run main.py --platform xhs --lt qrcode --type detail
```

**查看所有支持的参数：**

```bash
uv run main.py --help
```

![运行效果](/images/mediacrawler-multi-platform-crawler-tutorial/img_1.png)

## 使用 WebUI 可视化界面

不想敲命令？项目自带 WebUI：

```bash
uv run uvicorn api.main:app --port 8080 --reload
```

打开浏览器访问 `http://localhost:8080`，就能可视化操作：

- 选择平台、登录方式、爬取类型
- 填写关键词或帖子 ID
- 实时查看运行日志
- 预览导出数据

![WebUI 界面预览](/images/mediacrawler-multi-platform-crawler-tutorial/img_8.png)

## 数据存储配置

MediaCrawler 支持多种存储方式，在 `base_config.py` 里配置：

```python
# 支持: csv, json, jsonl, excel, sqlite, mysql
STORAGE_TYPE = "csv"

# MySQL 配置（如果用 MySQL）
MYSQL_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "password",
    "database": "mediacrawler",
}
```

配置好自动创建表，不用自己建。

## 常见问题

### Q1: 会被封号吗？

**A:** CDP 模式用的是你自己已经登录的浏览器，请求完全模拟真人，只要不是太疯狂的爬速度，概率极低。作者用了几年都没事。建议控制一下请求间隔，不要每秒请求几十次。

### Q2: 为什么需要 Node.js？

**A:** 抖音和知乎的部分签名逻辑需要用 Node.js 执行，这是从官方客户端 JS 直接抠出来的，比 Python 重新实现稳定很多。

### Q3: 支持手机号验证码登录吗？

**A:** 支持。项目里有 `recv_sms.py` 可以对接短信转发工具，配合二维码/验证码登录使用。

### Q4: 爬下来的数据在哪里？

**A:** 默认存在 `store/` 目录下，按平台分文件存放。

## Pro 版本 vs 开源版本

作者还维护了一个 Pro 版本，功能更强，架构更优：

**核心升级：**

- ✅ 自媒体内容拆解 AI Agent
- ✅ 断点续爬功能
- ✅ 多账号 + IP 代理池支持
- ✅ 去除 Playwright 依赖
- ✅ 完整 Linux 支持
- ✅ 代码重构，更易维护

![MediaCrawler Pro](/images/mediacrawler-multi-platform-crawler-tutorial/MediaCrawlerPro.jpg)

感兴趣可以关注：[MediaCrawlerPro](https://github.com/MediaCrawlerPro)

## 适用场景 & 不适用场景

### ✅ 适合用 MediaCrawler 的场景

- 竞品分析，需要批量采集对手内容
- 内容创作，找同领域热门选题
- 舆情监控，关键词信息收集
- 学术研究，数据采集分析
- 个人学习，研究浏览器爬虫技术

### ❌ 不适合的场景

- 大规模商用爬取（本来就是学习项目）
- 爬取非公开信息（违法，作者免责声明写得很清楚）
- 需要极高并发（这是浏览器爬虫，不是接口爬虫）

## 项目结构赏析

```
MediaCrawler/
├── api/              # WebUI API
├── config/           # 配置文件
├── media_platform/   # 各平台实现
│   ├── xhs/          # 小红书
│   ├── douyin/       # 抖音
│   ├── bilibili/     # B站
│   ├── zhihu/        # 知乎
│   └── ...
├── media_platform/   # 平台代码解耦，加新平台很方便
└── main.py           # 入口
```

每个平台都是独立模块，想加新平台照着抄就行，代码写得非常干净，很适合学习怎么设计一个可维护的爬虫项目。

## 总结

MediaCrawler 是我见过**对新手最友好**的多平台爬虫项目：

- 不用折腾 JS 逆向，拿到就能跑
- CDP 模式天然防封，稳定性高
- 七大平台支持，覆盖主流自媒体
- 代码清晰易懂，适合学习二次开发

如果你需要采集自媒体数据，又不想在反爬上浪费时间，一定要试试这个项目。

**项目地址：** https://github.com/NanmiCoder/MediaCrawler

> 免责声明：本项目仅供学习交流使用，请遵守各平台规定和相关法律法规，禁止用于非法用途。

## 相关链接

- [官方文档](https://nanmicoder.github.io/MediaCrawler/)
- [MediaCrawlerPro](https://github.com/MediaCrawlerPro)
- [作者 B 站主页](https://space.bilibili.com/434377496)
