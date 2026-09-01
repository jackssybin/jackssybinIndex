---
title: "Navop：856 Star 国人开源，把数据库+SSH+RDP+AI 全部整合到一个原生工作台"
slug: "navop-all-in-one-dev-workspace"
url: "/articles/2026/09/01/navop-all-in-one-dev-workspace.html"
date: "2026-09-01T00:00:00+08:00"
lastmod: "2026-09-01T00:00:00+08:00"
description: 如果你每天需要在多个工具之间来回切换：打开 DataGrip 查数据库，开 iTerm2 连服务器，用 Microsoft Remote Desktop 连 Windows 远程桌面，还要开 ChatGPT 帮你写 SQL —— 这一切在 Navop 里只需要打开一个窗口就能完成。
categories: ["开发工具", "开源"]
tags: ["Navop", "开发工具", "开源", "数据库", "Rust"]
topic: "开发工具"
topicSlug: "dev-tools"
cover: "/images/navop-all-in-one-dev-workspace/cover-wechat.jpg"
layout: article
contentType: article
draft: false
---

# Navop：856 Star 国人开源，把数据库+SSH+RDP+AI 全部整合到一个原生工作台

> 如果你每天需要在多个工具之间来回切换：打开 DataGrip 查数据库，开 iTerm2 连服务器，用 Microsoft Remote Desktop 连 Windows 远程桌面，还要开 ChatGPT 帮你写 SQL —— 这一切在 Navop 里只需要打开一个窗口就能完成。

## TL;DR

**Navop** 适合：
- ✅ 每天需要同时操作数据库+服务器+远程桌面的开发者/运维/DBA
- ✅ 想要用一个 APP 搞定所有开发操作，减少窗口切换
- ✅ 需要管理国产数据库（达梦/金仓/OB），想要开箱即用
- ✅ 想用 AI 辅助写 SQL、分析数据，不想切换到浏览器

**Navop** 不适合：
- ❌ 需要团队协作多人共享连接（目前偏向个人使用）
- ❌ 完全不碰数据库只写前端代码

核心优势：原生 Rust + GPUI GPU 加速，响应飞快；国产数据库支持完善；自带 MCP 服务可以给 Claude Code/Codex 提供工具；开源免费，完全本地数据，数据安全可控。

## 为什么需要这样一个工具？

作为开发者，你的日常工作流是不是这样：

1. 想查一条数据 → 打开 DataGrip/Navicat
2. 需要线上排查问题 → 打开终端/iTerm2 连 SSH
3. 要改服务器上的文件 → 打开 FileZilla/Cyberduck SFTP
4. 需要操作 Windows 服务器 → 打开 Remote Desktop
5. 想让 AI 帮你把自然语言转成 SQL → 切换到浏览器 Claude.ai

来回切五六个窗口，光是排列窗口就要花一分钟。有没有可能把这一切都整合到同一个原生桌面应用里？

Navop 就是来解决这个问题的 —— **数据库、SSH/SFTP、终端、远程桌面 RDP/VNC、监控、AI 辅助，全部一体化，在同一个工作台搞定**。

## 核心功能拆解

### 一、数据库支持：覆盖主流+国产，功能齐全

Navop 对数据库的支持相当完整，几乎覆盖了你能碰到的所有场景：

| 类型 | 支持情况 |
|------|----------|
| 主流开源 | MySQL、PostgreSQL、SQLite、DuckDB、ClickHouse、Redis、MongoDB |
| 商业数据库 | SQL Server、Oracle |
| 国产数据库 | 达梦 DM、金仓 KingbaseES、OceanBase、openGauss、GBase 8s、Apache IoTDB、神通 Oscar |

![Navop 数据库界面](https://jackssybin.cn/images/navop-all-in-one-dev-workspace/database.png)

功能点：
- 浏览数据库对象（表、视图、存储过程）
- 编辑数据、执行 SQL、查看执行计划
- 导入/导出数据
- Schema/Data 对比
- ER 图关系可视化
- 支持 SSH 隧道/代理连接

对于国内做政企项目的开发者来说，这点特别友好 —— 很多工具对国产数据库支持不好，Navop 官方就提供扩展驱动，开箱即用。

### 二、远程运维：SSH/SFTP/RDP 一站式搞定

除了数据库，远程运维常用的工具也都整合了：

- **SSH 终端**：支持拖拽分屏、快速命令、广播输入、会话锁定、录制回放
- **SFTP 文件管理**：上传下载、搜索、收藏、远程编辑、拖拽传输、ZMODEM、跨服务器复制
- **端口转发**：本地/远程/SOCKS 动态转发都支持
- **RDP/VNC 远程桌面**：Windows 上原生集成 MSTSC，跨平台用纯 Rust IronRDP 渲染
- **支持导入 SecureCRT 会话**，不用重新配置

![SSH 终端界面](https://jackssybin.cn/images/navop-all-in-one-dev-workspace/ssh.png)

### 三、AI 与扩展：原生支持 MCP，能给 Claude Code 当工具端

这是 Navop 比较有意思的一点 —— 它本身就支持**公开 MCP 服务**，可以把自己的能力开放给外部 AI Agent：

1. 在 Navop 里开启设置 → 通用 → MCP → MCP Server
2. 选择权限配置（安全/确认/自动）
3. Claude Code 里添加 Navop MCP 服务，就能让 Claude 直接帮你查询数据库、分析数据

对于终端 Agent 还提供了 `@navop/cli`，一键安装 Skill：

```bash
npm install -g @navop/cli@latest
navop skill install --target codex --scope user
```

这样你的 Agent 就能直接操作你本地配置好的数据库连接，不用你把连接信息复制给 AI，更安全。

### 四、原生体验：GPU 加速，多语言，加密同步

- 基于 GPUI 框架，GPU 加速渲染，界面响应非常流畅
- 支持亮色/深色/跟随系统三种主题，可自定义强调色、窗口透明度
- 完整中文化界面，国人开发者做的，对中文用户友好
- 连接信息、凭据加密同步，多设备可以同步配置

![Navop 工作台总览](https://jackssybin.cn/images/navop-all-in-one-dev-workspace/app1.png)

## 和传统工具对比，Navop 的优劣势

| 维度 | Navop | DataGrip | Navicat |
|------|-------|----------|---------|
| 授权 | 开源免费（Apache 2.0 + 补充协议） | 商业订阅 | 商业授权 |
| 一体化 | 数据库+SSH+RDP+SFTP+AI 全有 | 专注数据库，其他较弱 | 专注数据库，其他较弱 |
| 国产数据库 | 官方支持完善 | 需要驱动，配置复杂 | 部分支持 |
| 响应速度 | Rust + GPU 加速，非常快 | 功能重，启动较慢 | 较快 |
| MCP AI 集成 | 原生支持 | 无 | 无 |
| 价格 | 免费 | 约 $15/月 起 | 几千元一次性 |

**适合用 Navop 的场景：**
- 个人开发者/自由职业，不想付商业工具订阅费
- 需要管理国产数据库，一站式解决
- 日常工作流就是数据库+服务器运维，希望减少窗口切换
- 想用 AI 辅助数据分析，又不想把数据库连接信息给第三方

**不适合用 Navop 的场景：**
- 大型团队需要共享连接和协作（目前 Navop 偏向个人使用）
- 你已经付费买了 DataGrip，而且只需要数据库功能

## 5 分钟快速上手

### 环境要求
- macOS / Windows / Linux 都支持，直接下载安装包

### 安装步骤
1. 到 [GitHub Releases](https://github.com/feigeCode/navop/releases/latest) 下载对应平台的安装包
   - macOS: `.dmg` 或 `.tar.gz`，支持 Apple Silicon / Intel
   - Windows: `.msi` 安装包或 `.zip` 便携版
   - Linux: `.deb` / `.rpm` / `.AppImage` / `.tar.gz`
   
2. 安装后打开即可使用，无需编译（想编译从源码构建看项目 README）

3. macOS 提示无法检查恶意软件：
```bash
sudo xattr -rd com.apple.quarantine /Applications/Navop.app
```

### FlatPak 安装（Linux）
```bash
flatpak --user remote-add --if-not-exists flatpark https://dl.flatpark.org/flatpark.flatpakrepo
flatpak --user install flatpark dev.navop.Navop
```

### 给 Claude Code 启用 MCP 集成

如果你用 Claude Code 想让它直接查你本地数据库，只需要两步：

1. 在 Navop 中启用 MCP Server：
   - 设置 → 通用 → MCP → 开启 MCP Server
   - 权限选 "Safe" 或 "Confirm"
   - 记下你的访问 token

2. 在 Claude Code 配置文件 `~/.config/claude-code/claude_desktop_config.json` 中添加：
```json
{
  "mcpServers": {
    "navop": {
      "command": "npx",
      "args": ["-y", "@navop/mcp@latest", "--token", "YOUR_TOKEN_HERE"]
    }
  }
}
```

重启 Claude Code 就可以用了。

## 实际使用体验

我试用了几天，最大的感受就是**清爽**——原来要开五六个APP，现在只需要开一个 Navop，切换连接用标签页就行，不用在窗口之间来回点。

响应速度确实快，即便是打开比较大的表，渲染也不卡，GPUI 的 GPU 加速效果能感觉到。国产数据库支持这点对做国内项目的开发者太友好了，不用自己折腾驱动。

MCP 集成是个惊喜 —— 你直接让 Claude "帮我查一下最近一周用户订单总量"，它自己就去连你数据库查了，不用你复制粘贴 SQL，确实能提高效率。

## 总结

Navop 是一款非常有想法的国产开源工具，它看准了开发者每天来回切多个工具的痛点，把数据库开发和远程运维都整合到了一个原生应用里，加上对国产数据库的完整支持和现代化的 AI MCP 集成，对于个人开发者来说性价比非常高。

如果你已经厌倦了开一堆工具来回切，不妨试试 Navop，反正开源免费，下载就能用。

**项目地址**：https://github.com/feigeCode/navop  
**官方文档**：https://docs.navop.dev/  
**下载最新版**：https://github.com/feigeCode/navop/releases/latest
