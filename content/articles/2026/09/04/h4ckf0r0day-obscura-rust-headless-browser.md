---
title: "Obscura：Rust 写的轻量级无头浏览器，仅需 30MB 内存替代 Chromium"
url: "/articles/2026/09/04/h4ckf0r0day-obscura-rust-headless-browser.html"
date: "2026-09-04T00:00:00+08:00"
lastmod: "2026-09-04T00:00:00+08:00"
description: "Obscura 是一个用 Rust 编写的开源无头浏览器，专为网页抓取和 AI Agent 自动化打造。仅占用 30MB 内存，二进制大小仅 70MB，比传统的 Headless Chrome 小很多，还内置了反检测和隐身模式。可以直接替代 Puppeteer/Playwright 使用。"
tags: ["开源", "Rust", "浏览器", "网页抓取", "AI Agent", "自动化"]
topic: "开源工具"
topicSlug: "open-source-tools"
layout: article
contentType: article
draft: false
---

# Obscura：Rust 写的轻量级无头浏览器，仅需 30MB 内存替代 Chromium

做网页抓取或者 AI Agent 自动化，你是不是还在拖着几百 MB 的 Chromium 到处跑？今天介绍一个惊艳的开源项目 —— **Obscura**，一个用 Rust 写的无头浏览器引擎，直接把内存占用干到了 30MB，二进制大小也才 70MB，完美替代 Headless Chrome。

## TL;DR

Obscura 是一个开源无头浏览器，核心优势：

- **极致轻量化**：内存仅 30MB，二进制 70MB，对比 Headless Chrome 的 200MB+ 内存、300MB+ 二进制，小了一个数量级
- **无需 Chromium**：原生渲染，不依赖 Chromium/Chrome，下载就能用
- **兼容现有工具**：支持 Chrome DevTools 协议，可以直接作为 Puppeteer/Playwright 的替代品
- **内置隐身**：自带反指纹、反追踪、反检测能力，做网页抓取更稳
- **全功能**：支持截图、PDF导出、并行抓取、CDP 服务，满足绝大多数自动化需求

## 为什么需要 Obscura？

现在做网页抓取和 AI Agent 自动化，基本都离不开无头浏览器。但传统方案不管是 Puppeteer 还是 Playwright，都默认捆绑一个完整的 Chromium，体积好几百 MB，内存占用轻松干到几百 MB。对于很多服务器部署、轻量爬虫、边缘计算场景来说，这太重了。

Obscura 就是来解决这个问题的：同样能跑 JavaScript，能渲染网页，能截取截图，兼容 CDP 协议，但体积和内存都小了一个数量级。

## 核心参数对比

| 指标 | Obscura | Headless Chrome |
|------|---------|-----------------|
| 内存占用 | **30 MB** | 200+ MB |
| 二进制大小 | **70 MB** | 300+ MB |
| 页面加载速度 | **~85 ms** | ~500 ms |
| 启动时间 | **Instant** | ~2s |
| 反检测隐身 | **内置** | 无 |
| Puppeteer 兼容 | ✅ | ✅ |
| Playwright 兼容 | ✅ | ✅ |

从对比就能看出来，Obscura 在轻量化这块做到了极致。对于很多不需要完整浏览器功能的场景，比如静态网页抓取、API 调用后的渲染、简单自动化，Obscura 完全够用，还能省大量资源。

## 主要功能

### 1. 原生 JavaScript 渲染

通过 V8 直接运行 JavaScript，维护真实 DOM 树，支持完整的页面渲染。你可以等待网络空闲，可以执行自定义 JavaScript 提取内容，和在浏览器里一样。

### 2. 截图和 PDF 导出

支持对渲染完成的页面截取 PNG 截图，也能直接导出 PDF。做网页存档、生成报告都很方便。

### 3. 隐身模式（Stealth）

编译开启 stealth 特性后，自动开启：

- 每个会话指纹随机化（GPU、屏幕、画布、音频、电池）
- 真实的 `navigator.userAgentData`，高熵值
- `event.isTrusted = true` 保证分发事件可信
- 隐藏内部属性，原生函数 masking
- `navigator.webdriver = undefined` 匹配真实 Chrome

完全就是真实浏览器的指纹，反爬更容易绕过。

### 4. CDP 服务兼容

启动 `obscura serve` 就能开启 CDP WebSocket 服务，Puppeteer/Playwright 直接连上来就能用，不需要改代码，无缝迁移。

### 5. 并行抓取

`obscura scrape` 命令可以直接批量并行抓取多个 URL，指定并发数，直接输出 JSON 结果，做爬虫非常方便。

## 安装使用

### 下载二进制

直接从 GitHub Releases 下载对应平台的二进制即可，不需要任何依赖：

```bash
# Linux x86_64
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-x86_64-linux.tar.gz
tar xzf obscura-x86_64-linux.tar.gz
./obscura fetch https://example.com --eval "document.title"
```

也支持 Docker 一键运行：

```bash
docker run -d --name obscura -p 127.0.0.1:9222:9222 h4ckf0r0day/obscura
```

### 从源码编译

需要 Rust 1.75+ 环境：

```bash
git clone https://github.com/h4ckf0r0day/obscura.git
cd obscura

# 带渲染功能
cargo build --release -p obscura-cli --bins --features render

# 带渲染和隐身
cargo build --release -p obscura-cli --bins --features render,stealth
```

## 快速上手

### 抓取单个页面

```bash
# 获取页面标题
obscura fetch https://example.com --eval "document.title"

# 提取所有链接
obscura fetch https://example.com --dump links

# 渲染 JavaScript 后导出 HTML
obscura fetch https://news.ycombinator.com --dump html

# 截图保存到文件
obscura fetch https://example.com --screenshot example.png
```

### 启动 CDP 服务给 Puppeteer/Playwright 使用

```bash
# 启动服务，默认端口 9222
obscura serve --port 9222

# 带隐身模式
obscura serve --port 9222 --stealth
```

然后在代码里连接就行了，比如 Puppeteer：

```javascript
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser',
});

const page = await browser.newPage();
await page.goto('https://news.ycombinator.com');
// ... 你的代码
```

Playwright 用法类似：

```javascript
import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP({
  endpointURL: 'ws://127.0.0.1:9222',
});

// ... 你的代码
```

### 批量并行抓取

```bash
obscura scrape url1 url2 url3 \
  --concurrency 25 \
  --eval "document.querySelector('h1').textContent" \
  --format json
```

## 适用场景

✅ **非常适合**：

- 网页抓取、数据采集
- AI Agent 自动化操作
- 服务器轻量部署，资源有限的 VPS
- 边缘计算场景
- 不需要完整浏览器功能的简单自动化

❌ **不适合**：

- 需要完整浏览器功能，复杂交互
- 大型复杂网页的全功能测试
- 需要最新 HTML/CSS 特性完全兼容的场景

Obscura 并不追求 100% 兼容 Chromium 的所有特性，它的目标就是做一个轻量够用的无头浏览器，满足大多数抓取和自动化场景，同时省大量资源。如果你对资源占用敏感，又不需要完整浏览器功能，一定要试试 Obscura。

## 项目地址

GitHub: [https://github.com/h4ckf0r0day/obscura](https://github.com/h4ckf0r0day/obscura)

官方网站: [https://obscura.sh](https://obscura.sh/)

已经 24.6k Star 了，看来大家对轻量方案的需求还是很强烈的，感兴趣快去 Star 一波！
