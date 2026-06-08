---
title: "Odysseus 教程：本地 AI 工作台、Agent 与 MCP 从入门到精通"
url: "/articles/2026/06/08/odysseus-user-manual.html"
date: "2026-06-08T00:00:00+08:00"
lastmod: "2026-06-08T00:00:00+08:00"
description: "Odysseus 中文教程与使用手册，系统讲解本地 AI 工作台搭建、模型配置、Chat、AI Agent、MCP、Deep Research、Cookbook、数据备份和安全访问。"
tags: ["AI", "Odysseus", "Odysseus 教程", "Agent", "AI Agent", "MCP", "本地 AI", "本地大模型", "自托管"]
topic: "AI、Agent 与本地模型"
topicSlug: "ai-agent"
layout: article
contentType: article
---

# Odysseus 教程：本地 AI 工作台、Agent 与 MCP 从入门到精通

> 适用对象：刚接触 Odysseus 的新手、想搭建本地 AI 工作台的个人用户、希望研究 AI Agent / MCP / 本地模型工作流的进阶用户。本文是一篇 Odysseus 中文教程和使用手册，重点覆盖安装启动、模型配置、Chat、Agent、MCP、Deep Research、Cookbook、数据备份和安全访问。

本手册基于本机已下载的 Odysseus 项目整理：

```text
D:\code\ai_codex_project\hermes_project\odysseus
```

官方仓库：

```text
https://github.com/pewdiepie-archdaemon/odysseus
```

![Odysseus 项目封面](/images/odysseus-user-manual/official/odysseus.jpg)

## 目录

1. Odysseus 是什么
2. 学习路线：从入门到精通
3. 安装与启动
4. 首次登录与基础配置
5. 模型配置：让 Odysseus 真正能聊天
6. 基础使用：Chat、会话、文件、文档
7. 进阶功能：Agent、Memory、Skills、MCP
8. Cookbook：本地模型下载与服务
9. Deep Research：深度研究工作流
10. Compare：模型横向对比
11. Notes、Tasks、Calendar、Email
12. 数据目录与备份
13. 安全设置与局域网访问
14. 常用命令速查
15. 常见问题排查
16. 精通路线：如何把 Odysseus 用成个人 AI 工作台

---

## 1. Odysseus 是什么

Odysseus 是一个开源、自托管、本地优先的 AI 工作台。

你可以把它理解成：

```text
ChatGPT/Claude 式对话界面
+ 本地模型/API 模型接入
+ Agent 工具调用
+ 文件、文档、记忆、技能
+ 深度研究、模型对比、任务、日历、邮件
= 个人 AI 工作空间
```

它不是大模型本身，而是一个统一入口。你需要给它配置模型来源，比如 Ollama、LM Studio、OpenAI、OpenRouter、vLLM 或 llama.cpp。

Odysseus 适合这些场景：

- 在本地搭建自己的 AI 聊天工作台
- 统一管理本地模型和云端模型
- 使用 Agent 执行文件、Shell、搜索、MCP 等任务
- 做资料调研、文档写作、模型对比
- 构建个人长期记忆和知识工作流
- 尝试自托管 AI 工作空间

## 2. 学习路线：从入门到精通

建议不要一上来就研究所有功能。Odysseus 的能力很多，按阶段学会更稳。

![Odysseus 学习路线图](/images/odysseus-user-manual/odysseus-learning-roadmap.svg)

### 第一阶段：入门

目标：能启动、登录、配置模型、完成一次普通聊天。

你需要掌握：

- 项目目录在哪里
- 如何启动和停止服务
- 如何登录后台
- 如何配置一个模型
- 如何创建新会话
- 如何上传文件或使用文档功能

### 第二阶段：熟练

目标：把 Odysseus 当成日常 AI 工作台使用。

你需要掌握：

- Chat 会话管理
- Documents 文档写作
- Presets 预设提示词
- Memory 记忆管理
- Notes 和 Tasks
- Deep Research
- Compare 模型对比

### 第三阶段：进阶

目标：让 Odysseus 连接更多工具，开始执行任务。

你需要掌握：

- Agent 的工具权限
- MCP 服务配置
- 本地文件和 Shell 工具的风险
- Cookbook 下载和启动模型
- Search、SearXNG、Tavily、Brave 等搜索服务
- API token 和 Webhook

### 第四阶段：精通

目标：构建自己的 AI 工作流。

你需要掌握：

- 多模型路由
- 本地模型和云端模型搭配
- 长期记忆维护
- 技能沉淀
- 自动化任务
- 私有化部署和安全加固
- 备份、迁移、更新、日志排查

## 3. 安装与启动

你本机已经下载好了 Odysseus，路径是：

```powershell
cd D:\code\ai_codex_project\hermes_project\odysseus
```

### Windows 推荐启动方式

如果你已经安装过依赖，可以直接启动：

```powershell
cd D:\code\ai_codex_project\hermes_project\odysseus
.\venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 7000
```

启动后打开：

```text
http://127.0.0.1:7000
```

### Windows 一键初始化方式

首次安装可以使用官方脚本：

```powershell
cd D:\code\ai_codex_project\hermes_project\odysseus
powershell -ExecutionPolicy Bypass -File .\launch-windows.ps1
```

这个脚本会自动完成：

- 检查 Python 3.11+
- 创建 `venv`
- 安装依赖
- 运行 `setup.py`
- 启动服务

### Windows 手动安装方式

如果你想理解每一步，可以手动执行：

```powershell
cd D:\code\ai_codex_project\hermes_project\odysseus
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python setup.py
python -m uvicorn app:app --host 127.0.0.1 --port 7000
```

如果 `py -3.12` 不可用，可以改用：

```powershell
python -m venv venv
```

前提是 `python --version` 显示 3.11 或更高。

### Docker 启动方式

官方推荐 Docker，适合 Linux、服务器或希望服务隔离的用户：

```bash
git clone https://github.com/pewdiepie-archdaemon/odysseus.git
cd odysseus
cp .env.example .env
docker compose up -d --build
```

查看状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs --tail=120 odysseus
```

停止：

```bash
docker compose down
```

## 4. 首次登录与基础配置

首次运行 `setup.py` 时，Odysseus 会创建管理员账号。

![本地 Odysseus 登录页截图](/images/odysseus-user-manual/odysseus-screenshots/01-login.png)

如果是交互式终端，它会提示你输入账号和密码；如果是非交互环境，可能会生成临时密码并打印在终端或 Docker 日志里。

登录后建议第一时间做三件事：

1. 修改管理员密码
2. 检查是否开启注册
3. 配置模型来源

### 修改密码

进入页面后打开：

```text
Settings -> Account / Security
```

![本地 Odysseus Settings 与 Add Models 截图](/images/odysseus-user-manual/odysseus-screenshots/03-settings-models.png)

把临时密码换成你自己的强密码。

### 不要关闭认证

`.env` 中有一个重要变量：

```env
AUTH_ENABLED=true
```

建议保持开启，尤其是当你准备让局域网或其他设备访问时。

### 不要随便开放公网

Odysseus 具备 Shell、文件、Agent、模型、上传、API token 等高权限能力。它应该被当作一个管理员控制台，而不是普通网页。

新手阶段只建议绑定本机：

```text
127.0.0.1
```

## 5. 模型配置：让 Odysseus 真正能聊天

Odysseus 本身不是大模型。要聊天，需要接入模型服务。

![Odysseus 模型接入关系图](/images/odysseus-user-manual/odysseus-model-flow.svg)

![本地 Odysseus 模型设置页截图](/images/odysseus-user-manual/odysseus-screenshots/03-settings-models.png)

常见选择：

- Ollama：本地最容易上手
- LM Studio：图形界面友好
- OpenAI：云端能力强
- OpenRouter：模型多，统一 API
- vLLM：适合服务器部署
- llama.cpp：适合 GGUF 模型

### 配置 Ollama

如果你在 Windows 上用 Ollama，通常地址是：

```text
http://localhost:11434/v1
```

在 Odysseus 中进入：

```text
Settings -> Models / Providers
```

添加 OpenAI-compatible endpoint：

```text
Base URL: http://localhost:11434/v1
API Key: ollama
```

Ollama 默认不一定需要真实 API Key，但很多 OpenAI-compatible 客户端要求填写一个值，可以先写 `ollama`。

测试 Ollama 是否运行：

```powershell
ollama list
```

启动一个模型：

```powershell
ollama run qwen2.5:7b
```

### 配置 OpenAI

在 Settings 中添加 OpenAI provider，填写：

```text
API Key: sk-...
Base URL: https://api.openai.com/v1
```

也可以在 `.env` 中预置：

```env
OPENAI_API_KEY=你的 key
```

但更推荐在网页 Settings 里配置，避免把 key 写进文件后误分享。

### 配置 OpenRouter

OpenRouter 也兼容 OpenAI API 格式：

```text
Base URL: https://openrouter.ai/api/v1
API Key: 你的 OpenRouter Key
```

然后选择对应模型。

### 模型选择建议

新手建议：

- 本地电脑配置一般：先用云端 API 或小模型
- 有 8GB 显存：尝试 7B/8B 量化模型
- 有 16GB 显存：尝试 14B 左右量化模型
- 有 24GB 显存以上：可以尝试更大的本地模型

模型不是越大越适合所有任务。日常写作、总结、轻量编程，稳定和速度也很重要。

## 6. 基础使用：Chat、会话、文件、文档

### Chat

Chat 是最基础的入口。

![本地 Odysseus Chat 首页截图](/images/odysseus-user-manual/odysseus-screenshots/02-home-chat.png)

![Odysseus Chat 与 Agent 演示](/images/odysseus-user-manual/official/chat.gif)

你可以用它做：

- 问答
- 写作
- 翻译
- 总结
- 代码解释
- 文件内容分析
- 多轮任务讨论

建议新手先建立几个固定用途的会话：

- 日常问答
- 写作助手
- 代码助手
- 资料总结
- 产品分析

### Sessions

会话用于保存上下文。

建议：

- 一个主题一个会话
- 长任务不要和闲聊混在一起
- 项目分析单独建会话
- 写作任务单独建会话

这样以后搜索和回溯更方便。

### 文件上传

Odysseus 支持文件上传和部分文档处理。

适合上传：

- PDF
- Markdown
- 文本文件
- CSV
- 图片
- 项目片段

上传文件后，可以让模型：

- 总结重点
- 提取结构
- 找问题
- 改写内容
- 生成报告

### Documents

Documents 更适合长文本写作和编辑。

![本地 Odysseus Library 文档库截图](/images/odysseus-user-manual/odysseus-screenshots/04-documents-library.png)

![本地 Odysseus 新建文档截图](/images/odysseus-user-manual/odysseus-screenshots/05-documents-new.png)

![Odysseus Documents 演示](/images/odysseus-user-manual/official/document.gif)

可以用于：

- 写文章
- 写报告
- 整理会议纪要
- 生成 Markdown
- 做内容润色
- 保存长期文档

建议把 Chat 当成讨论区，把 Documents 当成正式产出区。

## 7. 进阶功能：Agent、Memory、Skills、MCP

### Agent

Agent 是 Odysseus 的核心进阶能力。

普通聊天是“回答你”，Agent 更接近“替你做”。

Agent 可能调用：

- Web 工具
- 文件工具
- Shell 工具
- MCP 服务
- Memory
- Skills

适合任务：

- 分析一个项目目录
- 根据日志排查错误
- 批量整理文件
- 查询资料并写报告
- 执行多步骤研究

### 使用 Agent 的安全原则

Agent 能做事，也意味着它可能做错事。

新手建议：

1. 不要让 Agent 操作重要目录
2. 不要给陌生用户 Shell 权限
3. 不要在公网暴露 Agent
4. 执行删除、移动、覆盖前先确认
5. 重要数据提前备份

### Memory

Memory 用于保存长期信息。

适合保存：

- 你的写作偏好
- 项目背景
- 常用工具
- 个人工作方式
- 团队规则
- 反复使用的资料

不适合保存：

- 密码
- API Key
- 身份证号
- 银行卡
- 公司敏感数据

### Skills

Skills 可以理解为让 Agent 学会某种固定工作方法。

例如：

- 知乎文章改写风格
- 技术文档生成规范
- 项目代码审查流程
- SEO 内容生产流程
- 邮件总结规则

当一个任务会重复出现，就可以考虑沉淀成 Skill。

### MCP

MCP 是 Model Context Protocol，用来让 AI 接入外部工具或服务。

Odysseus 支持 MCP 管理。常见用途：

- 浏览器操作
- 数据库访问
- 文件系统
- 第三方 API
- 自动化工具

启用浏览器 MCP 的官方提示命令：

```bash
npx -y @playwright/mcp@latest --version
```

它会安装 Playwright MCP 相关依赖。安装完成后重启 Odysseus，服务启动时会自动注册。

## 8. Cookbook：本地模型下载与服务

Cookbook 是 Odysseus 面向本地模型用户的重要模块。

![本地 Odysseus Cookbook 截图](/images/odysseus-user-manual/odysseus-screenshots/11-cookbook.png)

它的作用：

- 扫描硬件
- 推荐适合你机器的模型
- 下载模型
- 安装运行依赖
- 启动模型服务
- 管理远程服务器

### 新手怎么用 Cookbook

建议顺序：

1. 打开 Cookbook
2. 扫描硬件
3. 查看推荐模型
4. 选择小模型先测试
5. 下载模型
6. 启动服务
7. 回到 Chat 中选择该模型

### Windows 注意事项

Windows 上如果你只是想用本地模型，最简单的方式通常是：

```text
Ollama + Odysseus
```

Cookbook 的某些后台下载、Shell、vLLM/SGLang GPU 服务能力，在 Linux 或 WSL2 上更完整。

如果你是新手，不建议一开始就折腾 vLLM、CUDA、ROCm。先跑通 Ollama。

### Docker GPU

如果你用 Docker 并希望让容器访问 NVIDIA GPU，可以先诊断：

```bash
scripts/check-docker-gpu.sh
```

启用 NVIDIA overlay：

```bash
scripts/check-docker-gpu.sh --enable-nvidia-overlay
```

AMD 用户查看：

```bash
scripts/check-docker-amd-gpu.sh
```

## 9. Deep Research：深度研究工作流

Deep Research 用于多步骤资料收集、阅读、综合和报告生成。

![本地 Odysseus Deep Research 截图](/images/odysseus-user-manual/odysseus-screenshots/06-deep-research.png)

![Odysseus Deep Research 演示](/images/odysseus-user-manual/official/research.gif)

适合任务：

- 行业调研
- 竞品分析
- 技术选型
- 政策梳理
- 论文/资料总结
- 市场机会分析

使用建议：

1. 问题要具体
2. 给出研究范围
3. 明确输出格式
4. 要求列出来源
5. 让它先产出提纲，再写正文

示例提示词：

```text
请研究 Odysseus 这类本地 AI 工作台的发展趋势。
要求：
1. 对比 ChatGPT、Open WebUI、AnythingLLM、Dify
2. 分析它们分别适合哪些用户
3. 输出知乎文章结构
4. 列出主要参考来源
```

## 10. Compare：模型横向对比

Compare 用来对比多个模型的输出。

![本地 Odysseus Compare 截图](/images/odysseus-user-manual/odysseus-screenshots/07-compare.png)

![Odysseus Compare 演示](/images/odysseus-user-manual/official/compare.gif)

适合：

- 比较本地模型和云端模型
- 比较不同尺寸模型
- 比较写作能力
- 比较代码能力
- 比较总结能力

测试建议：

- 使用同一个问题
- 隐藏模型名称减少偏见
- 从准确性、完整性、逻辑、表达、速度几个维度评分
- 不要只看一次结果，多测几类任务

示例测试题：

```text
请用通俗语言解释 RAG 和 Agent 的区别，并给出一个企业知识库场景下的应用方案。
```

## 11. Notes、Tasks、Calendar、Email

Odysseus 不是只做聊天，它也尝试覆盖个人工作流。

![本地 Odysseus Notes 截图](/images/odysseus-user-manual/odysseus-screenshots/08-notes.png)

![本地 Odysseus Tasks 截图](/images/odysseus-user-manual/odysseus-screenshots/09-tasks.png)

![Odysseus Notes 与 Tasks 演示](/images/odysseus-user-manual/official/notes.gif)

### Notes

适合快速记录：

- 想法
- 待办
- 会议要点
- 资料线索
- AI 给出的行动建议

### Tasks

适合管理任务：

- 定时提醒
- 周期任务
- 后续跟进
- 让 Agent 参与任务执行

### Calendar

支持本地日历和 CalDAV 同步。

适合：

- 日程安排
- 事件管理
- 与提醒联动

### Email

支持 IMAP/SMTP 邮箱集成。

可以用于：

- 邮件摘要
- 自动分类
- 紧急程度判断
- 草拟回复
- 垃圾邮件识别

邮件功能涉及账号和授权码，新手配置时要谨慎，建议先用测试邮箱。

## 12. 数据目录与备份

Odysseus 的用户数据主要在：

```text
odysseus\data
```

重要内容包括：

- `app.db`：会话、消息、文档等数据库
- `auth.json`：用户认证信息
- `settings.json`：设置
- `uploads/`：上传文件
- `personal_docs/`：个人文档
- `chroma/`：向量数据
- `memory.json`：记忆数据
- `generated_images/`：生成图片
- `deep_research/`：研究结果

### 备份建议

定期备份：

```text
data/
.env
logs/
```

其中 `.env` 可能包含 API Key，不要上传到 GitHub 或网盘公开目录。

### 迁移建议

迁移到新机器时：

1. 复制项目代码
2. 重新安装依赖
3. 复制 `data/`
4. 复制 `.env`
5. 启动服务
6. 登录检查会话、设置、模型配置

## 13. 安全设置与局域网访问

### 本机使用

默认推荐：

![Odysseus 安全访问结构图](/images/odysseus-user-manual/odysseus-security-layout.svg)

![本地 Odysseus Memory 截图](/images/odysseus-user-manual/odysseus-screenshots/10-memory.png)

```text
127.0.0.1:7000
```

这种方式只有本机能访问。

### 局域网访问

如果你想让手机或另一台电脑访问，需要绑定：

```text
0.0.0.0
```

启动示例：

```powershell
.\venv\Scripts\python.exe -m uvicorn app:app --host 0.0.0.0 --port 7000
```

然后在手机浏览器访问：

```text
http://你的电脑局域网IP:7000
```

### 局域网访问安全要求

至少做到：

- `AUTH_ENABLED=true`
- 使用强密码
- 不要开开放注册
- 不要把端口暴露到公网
- 不要给普通用户 Shell 权限
- 不要在公共 Wi-Fi 下开放

### HTTPS 和反向代理

进阶部署可以用：

- Tailscale
- Cloudflare Access
- Caddy
- nginx
- Traefik

基本原则：

```text
外部访问 -> HTTPS/认证网关 -> 127.0.0.1:7000
```

只暴露 Odysseus Web/API，不要暴露 ChromaDB、SearXNG、Ollama、vLLM、数据库等内部服务。

## 14. 常用命令速查

### 进入项目目录

```powershell
cd D:\code\ai_codex_project\hermes_project\odysseus
```

### 启动 Odysseus

```powershell
.\venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 7000
```

### 指定端口启动

```powershell
.\venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 7001
```

### 局域网启动

```powershell
.\venv\Scripts\python.exe -m uvicorn app:app --host 0.0.0.0 --port 7000
```

### 查看 7000 端口是否被占用

```powershell
netstat -ano | findstr :7000
```

### 停止指定进程

```powershell
Stop-Process -Id 进程ID
```

### 重新安装 Python 依赖

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 安装可选依赖

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements-optional.txt
```

### 重新初始化

```powershell
.\venv\Scripts\python.exe setup.py
```

注意：不要随便删除 `data/`，里面是你的数据。

### Docker 启动

```bash
docker compose up -d --build
```

### Docker 查看状态

```bash
docker compose ps
```

### Docker 查看日志

```bash
docker compose logs --tail=120 odysseus
```

### Docker 停止

```bash
docker compose down
```

### 更新代码

```powershell
git pull --ff-only
```

更新后建议重新安装依赖：

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 15. 常见问题排查

### 打不开页面

检查服务是否启动：

```powershell
netstat -ano | findstr :7000
```

如果没有监听，重新启动：

```powershell
.\venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 7000
```

### 端口被占用

查看占用：

```powershell
netstat -ano | findstr :7000
```

换端口启动：

```powershell
.\venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 7001
```

### 忘记管理员密码

如果你还可以进入 Settings，直接修改密码。

如果完全无法登录，需要通过 `data/auth.json` 或项目的认证管理逻辑重置。新手不建议手动乱改，先备份：

```powershell
Copy-Item .\data\auth.json .\data\auth.json.bak
```

然后再进行重置。

### 模型列表为空

可能原因：

- Ollama 没启动
- Base URL 配错
- API Key 错误
- 模型服务不兼容 OpenAI API
- 防火墙拦截

先测试 Ollama：

```powershell
ollama list
```

再确认 Odysseus 里填的是：

```text
http://localhost:11434/v1
```

### 聊天报错

常见原因：

- 选中的模型不存在
- API Key 失效
- 本地模型服务没启动
- 上下文太长
- 模型不支持工具调用

处理顺序：

1. 换一个简单模型测试
2. 新建空会话测试
3. 检查模型服务日志
4. 检查 Odysseus 日志

### Deep Research 没结果

可能原因：

- 没配置搜索服务
- 没配置可用模型
- 搜索 API Key 缺失
- 网络访问受限

可以先在普通 Chat 中确认模型正常，再配置搜索。

### Memory 不工作

Memory 依赖 embedding 和向量存储。

可能原因：

- ChromaDB 没启动
- embedding 模型下载失败
- `chromadb-client` 与完整 ChromaDB 冲突

官方修复建议：

```bash
./venv/bin/pip uninstall chromadb-client -y
./venv/bin/pip install --force-reinstall chromadb
```

Windows 下可改成：

```powershell
.\venv\Scripts\python.exe -m pip uninstall chromadb-client -y
.\venv\Scripts\python.exe -m pip install --force-reinstall chromadb
```

## 16. 精通路线：如何把 Odysseus 用成个人 AI 工作台

### 第一步：建立稳定入口

固定启动方式、固定访问地址、固定模型配置。

推荐：

```text
http://127.0.0.1:7000
```

先不要频繁换部署方式。

### 第二步：建立常用模型组合

建议至少配置三类模型：

- 快速模型：用于日常问答、改写、总结
- 强模型：用于复杂推理、代码、研究
- 本地模型：用于隐私内容和离线场景

### 第三步：建立 Presets

为常用任务建立预设：

- 知乎文章助手
- 技术文档助手
- 代码审查助手
- 需求分析助手
- 周报总结助手
- 学习教练

### 第四步：整理 Memory

把长期有用的信息沉淀进去：

- 你的写作风格
- 项目背景
- 常用输出格式
- 术语表
- 个人偏好
- 禁止事项

定期清理错误记忆。

### 第五步：用 Documents 做正式产出

Chat 适合讨论，Documents 适合成稿。

推荐工作流：

```text
Chat 讨论方向 -> Deep Research 收集资料 -> Documents 写作 -> Chat 润色 -> Documents 定稿
```

### 第六步：用 Agent 做重复任务

从低风险任务开始：

- 整理 Markdown
- 总结日志
- 检查格式
- 生成目录
- 提取要点

等熟悉后再让 Agent 处理文件、Shell、MCP 等高权限任务。

### 第七步：接入 MCP

当你需要让 Odysseus 操作外部工具时，再接入 MCP。

例如：

- 浏览器 MCP
- 数据库 MCP
- 文件 MCP
- 自动化平台 MCP

原则是：先小范围测试，再逐步扩大权限。

### 第八步：建立备份和更新习惯

每次大更新前备份：

```text
data/
.env
```

更新后检查：

- 是否能登录
- 模型是否正常
- 历史会话是否存在
- Memory 是否正常
- Agent 工具是否正常

### 第九步：形成自己的 AI 工作流

最终你可以把 Odysseus 用成这些角色：

- 个人知识库入口
- 写作工作台
- 本地模型控制台
- Agent 实验室
- 文档中心
- 研究助手
- 自动化任务中心

真正精通 Odysseus，不是记住每个按钮，而是知道：

```text
什么时候用 Chat
什么时候用 Documents
什么时候用 Deep Research
什么时候用 Agent
什么时候用 Memory
什么时候接 MCP
什么时候不要让 AI 自动执行
```

这才是从“会用工具”到“会设计 AI 工作流”的关键。

---

## 最后建议

如果你是新手，最实用的学习顺序是：

1. 启动 Odysseus
2. 配置 Ollama 或 OpenAI
3. 跑通 Chat
4. 学 Documents
5. 学 Deep Research
6. 学 Memory
7. 学 Agent
8. 最后再研究 Cookbook、MCP、局域网部署和自动化

不要急着一次性学完。每天掌握一个模块，一两周后你就能把 Odysseus 用成自己的 AI 工作台。
