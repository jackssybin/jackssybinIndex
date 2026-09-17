---
title: "21 Star 的 Agnes-AI-Platform，凭什么把图片生成、视频生成、无限画布、MCP Server 塞进一个 Vue+FastAPI 全栈里"
date: "2026-09-17T12:39:59+08:00"
lastmod: "2026-09-17T12:39:59+08:00"
slug: "agnes-ai-platform"
draft: false
description: "开源自建的 AI 图片视频生成平台"
tags: ["开源", "AI", "图片视频生成", "自托管", "教程"]
topic: "AI、Agent 与本地模型"
topicSlug: "ai-agent"
layout: article
contentType: article
type: article
cover: "/images/agnes-ai-platform/cover-website.png"
---

# 21 Star 的 Agnes-AI-Platform，凭什么把图片生成、视频生成、无限画布、MCP Server 塞进一个 Vue+FastAPI 全栈里

> **项目地址：** <https://github.com/WingkySky/Agnes-AI-Platform>
> **仓库全名：** `WingkySky/Agnes-AI-Platform`
> **版本：** 0.0.1 ｜ **创建：** 2026-06-08 ｜ **最近推送：** 2026-09-15
> **技术栈：** Vue 3 + FastAPI 0.115 + SQLAlchemy 2.0 + Pinia + Element Plus

---

## 先说结论：它不是一个 Demo，是"能用"的东西

![](/images/agnes-ai-platform/01-comparison.png)


21 Star，6 Fork，475 个文件，6440 KB。体量不大，但东西很实。后端 162 个接口，前端覆盖文生图、图生图、文生视频、图生视频、关键帧动画、无限画布（节点连线蒙版）、MCP Server、SSE 流式对话、预设中心、社区广场，外加一个 mobile 端和 OpenAI 兼容接口。五阶段演进（v1→v5），每一步都有提交的哈希和时间戳能对上。

最近一次提交 `2026-09-15 120b8dca`，修复的是"刷新按钮裸绑定 `@click=\"loadList\"` 把 PointerEvent 当 page 实参污染 filters.page"这种真实场景的 bug——这种提交出现在 21 Star 的项目里，说明有人在用，有人在修。

---

## 一、技术栈全貌（按目录说话）

### 后端：`backend/`

```
backend/app/services/   → 32 个文件（最大目录，业务逻辑集中区）
backend/app/routes/     → 30 个文件（路由层）
backend/app/models/     → 23 个文件（数据模型）
```

三件套：FastAPI 0.115 + httpx + SQLAlchemy 2.0。数据库默认 SQLite（一键启动不需要额外依赖），可选 PostgreSQL。

**关键文件路径：**

| 能力 | 路径 |
|---|---|
| MCP Server 实现 | `backend/app/models/mcp_server.py`、`backend/app/models/mcp_market.py`、`backend/app/routes/mcp.py` |
| 迁移历史 | `backend/alembic/versions/20260913_add_mcp_servers.py` |
| Agent 会话测试 | `backend/tests/test_agent_sessions.py`、`backend/tests/test_episode_isolation.py` |
| 配置/健康检查 | `GET /health`、`GET /api/config` |

### 前端：`frontend/`

Vue 3 + Vite + Element Plus + Pinia + Vue Router，TypeScript 占 31.0%（1517758 bytes）。

```
frontend/src/views/        → 22 个文件
frontend/src/components/canvas/  → 21 个文件
frontend/src/api/          → 20 个文件
```

核心画布组件 `CanvasCameraPanel.vue`、图片上传 `ImageUploader.vue`、摄像头预设选择 `CameraPresetSelector.vue`——文件名和功能边界对得上 README 里写的"无限画布（节点、连线、蒙版编辑）"。

### 移动端：`mobile/`

```
mobile/.env.example       → 环境变量模板
mobile/.gitignore
mobile/README.md
mobile/index.html         → 单页入口
```

mobile 命中 28 处，属于独立子项目，不是 web 的响应式适配。

---

## 二、五阶段演进（从 v1 到 v5 都做了什么）

全部来自 `README_zh.md`「项目演进」表格，一字不差：

| 阶段 | 功能 |
|---|---|
| **v1** | 文生图、图生图、文生视频、图生视频 |
| **v2** | 数据库驱动的多 Provider 系统 |
| **v3** | AI 对话 + 工具调用 + SSE 流式输出 |
| **v4** | 无限画布（节点、连线、蒙版编辑） |
| **v5** | 画布 Agent、预设中心、社区广场 |

一个项目干完了"生成→接入→对话→创作→生态"五个阶段，而且每个阶段都有对应的提交。最近几个提交按时间倒序列出来：

- `2026-09-15` `120b8dca` — fix：统一审核列表整页 400 空数据
- `2026-09-14` `02f50ec6` — fix：安全收尾——验证码随机源换 CSPRNG + 依赖漏洞升级清零
- `2026-09-14` `6c22c2be` — fix：providers 管理路由补 admin 鉴权（**14 个端点此前零鉴权**）
- `2026-09-13` `5ed1aac0` — feat：管理员日志查看（后端日志 + 前端错误上报）
- `2026-09-13` `736fea16` — feat：统一生图/生视频比例分辨率 UI

注意第二条：`02f50ec6` 把验证码随机源从普通 `random` 换成了 CSPRNG——这是真实的安全修复，不是装饰性的。再看第三条：`6c22c2be` 给 providers 管理的 14 个端点补上鉴权，说明之前这些接口任何人都不登录就能操作。这两个提交放在一起看，能看出维护者的安全意识是在迭代的。

---

## 三、源码级观察：MCP Server 是怎么接进去的

`backend/app/routes/mcp.py` 和 `backend/app/models/mcp_server.py` 是两个核心入口，迁移文件 `20260913_add_mcp_servers.py` 说明 MCP Server 这个能力是 9 月 13 日才加进去的——距离最近推送（9 月 15 日）只有两天。也就是说这个项目还在快速追加功能。

MCP（Model Context Protocol）在 AI 圈是 2025 年下半年才热起来的标准，这个项目直接在后端 models 和 routes 里实现，不是调用别人的 SDK，是原生写进去的。10 处能力信号命中，不算多，但证明这不是个空头标签。

**一个不显然的工程经验：** MCP Server 的实现通常涉及工具注册、上下文序列化、协议握手三块。看 `mcp_market.py`（市场/列表）和 `mcp_server.py`（单个服务器）分离成两个 model，说明设计者把"市场浏览"和"服务器实例管理"做了职责划分——这对后续接入第三方 MCP tool 是有意义的，不要合并成一个 model。

---

## 四、坏做法 vs 好做法（来自最近提交）

![](/images/agnes-ai-platform/02-flow.png)


### ❌ 坏做法：之前 providers 管理路由零鉴权

`6c22c2be` 的提交信息原话：

> fix：providers 管理路由补 admin 鉴权——整路由 14 个端点此前零鉴权

**后果：** 任何人都可以增删改 AI 模型的 API Key（注意：API Key 是加密存储在服务端的，不暴露到浏览器，见 README）。14 个端点全部无鉴权，这是一个真实的安全漏洞。

### ✅ 好做法：同时修复了两个关联问题

同一时期（9 月 14 日），同一个维护者又提交了 `02f50ec6`，把验证码随机源换成了 CSPRNG。这两个 fix 是关联的：一个防未授权访问，一个防验证码被预测绕过。说明维护者在做安全收尾时是有整体观的，不是修完一个就不管了。

### ❌ 坏做法：前端刷新按钮事件参数污染

`120b8dca`（最近一次提交）修复的问题：

> fix：统一审核列表整页 400 空数据——刷新按钮裸绑定 @click="loadList" 把 PointerEvent 当 page 实参污染 filters.page

**根因：** Vue 的 `@click` 如果不传参数，浏览器会把 MouseEvent 作为第一个参数传入方法。如果 `loadList` 的签名是 `loadList(page?)`，那么点击刷新时 `page` 实际收到的是一个 Event 对象，后续被当作页码传给后端，导致 400 错误。

**正确写法：**
```vue
<!-- 坏 -->
<button @click="loadList">刷新</button>

<!-- 好 -->
<button @click="loadList(1)">刷新</button>
<!-- 或 -->
<button @click.prevent="loadList">刷新</button>
```

这是一个典型的"看起来没问题，一用就炸"的前端坑，Vue 3 + TypeScript 组合下尤其容易踩，因为 TS 不会拦运行时的事件对象注入。

---

## 五、部署（clone 下来就能跑）

### 快速开始（来自 README_zh.md）

```bash
# 克隆
git clone https://github.com/WingkySky/Agnes-AI-Platform.git
cd Agnes-AI-Platform

# 启动（跨平台）
python start.py

# 或者 macOS/Linux
./start.sh

# 或者 Windows
start.bat
```

默认管理员账号：`admin` / `admin123`。

可通过环境变量自定义：

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@example.com
ADMIN_CREDITS=9999
```

### 后端访问

- 健康检查：`GET /health`
- Swagger UI：`http://localhost:8000/docs`
- 统一响应格式：`{"status": "success", "message": "", "data": ...}`

### 图片/视频模型

![](/images/agnes-ai-platform/03-architecture.png)


| 模型 | 用途 |
|---|---|
| `agnes-image-2.1-flash` | 图片生成 |
| `agnes-video-v2.0` | 视频生成 |

这些是 Agnes AI 自家的模型，API Key 加密存储在后端，不会传到浏览器——这是设计上的正确做法，不要把 Key 放在前端环境变量里。

---

## 六、内置截图（仓库自带，可对照）

`docs/images/` 下 6 张，`mobile/src/assets/images/` 下 3 张，共 9 张：

| 文件 | 对应功能 |
|---|---|
| `canvas.jpg` | 无限画布 |
| `chat.jpg` | AI 对话 |
| `history.jpg` | 生成历史 |
| `image-generation.jpg` | 图片生成 |
| `preset-center.jpg` | 预设中心 |
| `settings.jpg` | 设置页 |

---

## 七、适用人群 / 观望人群 / 需要自行验证的点

### ✅ 适合这些人在这里找东西

- **想快速搭建 AIGC 平台的小团队**：五阶段的功能已经覆盖了图片、视频、对话、画布、社区，不是从零开始造轮子
- **想学习 FastAPI + Vue 3 全栈架构的人**：目录结构清晰，services/routes/models 三层分离是标准做法
- **想做 MCP Server 接入的开发者**：`mcp.py` + `mcp_server.py` + `mcp_market.py` 的拆分方式值得参考
- **需要 OpenAI 兼容接口的后端服务**：`/api/images/generations`、`/api/videos` 等端点格式跟 OpenAI API 对齐

### ⏳ 观望人群

- **生产环境重度依赖者**：21 Star、单维护者、版本 0.0.1，生产使用前建议自己 Review 鉴权和加密逻辑（虽然最近的 fix 说明维护者在认真修补）
- **需要多租户隔离的企业**：项目目前看到的是单租户设计，多租户需要自行评估

### 🔍 需要自行验证的点

1. **许可证**：仓库元信息写的是 "Other"，但 README 顶部 badge 写的是 Apache 2.0 + Commons Clause。Commons Clause 限制了商业销售，商用前请读完整许可证文本
2. **SQLite 并发**：默认用 SQLite，高并发下可能需要切 PostgreSQL——README 写了可选，但没给迁移指南
3. **API Key 加密算法**：README 只说了"加密存储"，没写算法，需要看源码确认是否用了标准的 AES-GCM 或类似方案
4. **mobile 端功能完整性**：mobile 目录存在但文档较少，功能是否跟 web 端对齐需要实际跑一遍验证
5. **MCP Server 的实际运行状态**：9 月 13 日才加入，距今不到一个月，是否存在未覆盖的边界 case 需要自己测

---

## 八、总结

`WingkySky/Agnes-AI-Platform` 是一个用 6440 KB、475 个文件、162 个接口堆出来的全栈 AIGC 平台。它不是那种"README 写得很好但代码空空"的项目——最近的提交在修真实 bug、补安全漏洞、改 UI，而且每次提交都有明确的哈希和时间戳。

21 Star 不多，但如果你需要一套"图片+视频+对话+画布+MCP"都能跑起来的开源方案，这个项目值得一 fork 下来跑一遍。至少它的架构（FastAPI services/routes/models 三层、Vue 3 组件按能力分区）是你可以照着学到的。