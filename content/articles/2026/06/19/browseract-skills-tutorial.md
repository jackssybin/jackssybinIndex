---
title: "BrowserAct Skills 教程：给 AI Agent 配一只真正能干活的浏览器"
url: "/articles/2026/06/19/browseract-skills-tutorial/"
date: "2026-06-19T18:00:00+08:00"
lastmod: "2026-06-19T18:00:00+08:00"
description: "BrowserAct 是一套开源的 AI Agent 浏览器技能库，提供反反爬、多模式浏览器切换（Puppeteer/Playwright/Chrome-CDP）和 Skill Forge 工作流，让 AI Agent 具备真正稳定的网页操作能力。"
tags: ["AI Agent", "浏览器", "自动化", "开源项目"]
topic: "AI Agent"
topicSlug: "ai-agent"
layout: article
contentType: article
---

![封面](/images/browseract-skills-tutorial/cover-zhihu.png)

# BrowserAct Skills 教程：给 AI Agent 配一只真正能干活的浏览器

很多 Agent 的网页能力其实卡在同一个地方：它能“看网页”，但不一定能稳定地“使用网页”。

`curl` 拿不到 JS 渲染后的内容，普通浏览器自动化一碰到反爬和验证码就停住；登录态、多账号、并发任务又很容易互相污染。BrowserAct Skills 这个项目解决的不是某一个网页抓取脚本，而是把浏览器抽象成 AI Agent 可以理解、可以接管、可以隔离的执行环境。

项目地址：<https://github.com/browser-act/skills>

本文基于仓库 README、docs 和本地代码结构整理。我的判断是：如果你正在做 AI Agent、信息采集、竞品监控、网页工作流自动化，BrowserAct 值得认真看一遍。但它也不是“万能爬虫”。它更像一套给 Agent 用的浏览器操作底座，适合把复杂网页任务拆成可复用、可并发、可接管的工作流。

![BrowserAct 的三层反阻断思路](/images/browseract-skills-tutorial/01-anti-blocking.png)

## 这个项目到底是什么

BrowserAct Skills 仓库包含两部分：

1. `browser-act`：入口 Skill，告诉 Agent 什么时候应该调用 BrowserAct，以及第一次应该运行什么命令。
2. `browser-act-skill-forge` 和 `solutions/`：把浏览器探索过程沉淀成可复用 Skill 的工具与示例目录。

它背后的 CLI 是 `browser-act-cli`。官方安装命令是：

```bash
uv tool install browser-act-cli --python 3.12
```

安装后先验证：

```bash
browser-act --version
```

如果你要让 Agent 自动安装入口 Skill，README 给出的提示是：

```text
Install browser-act. Skill source: https://github.com/browser-act/skills/tree/main/browser-act . Verify it works after installation.
```

这句话的意思不是“把 README 复制给 Agent”。真正关键的是安装 `browser-act/SKILL.md`，让 Agent 在遇到网页提取、登录态网页、验证码、表单点击、多浏览器并发时知道：这里应该先调用 BrowserAct，而不是继续用普通 WebFetch 硬试。

## 为什么普通网页工具不够用

普通网页工具常见问题有四类：

- 页面靠 JS 渲染，静态抓取只拿到空壳。
- 站点有反爬、验证码、地区限制，普通 headless 很容易暴露。
- 登录态难复用，尤其是企业 SSO、浏览器插件、证书依赖这类环境。
- 多个 Agent 并发操作时共用浏览器状态，Cookie、指纹和任务上下文可能串线。

BrowserAct 的文档把解决思路拆成三层：

- 环境层：指纹伪装、TLS 轮换、代理、隐私模式，尽量让验证不要触发。
- 执行层：`stealth-extract` 和 `solve-captcha`，触发后自动处理一部分验证。
- 人类层：`remote-assist` 生成接管链接，让人从任何设备接手，处理完再交回 Agent。

这套设计比较现实。它没有假装所有验证都能自动化解决，而是承认自动化会遇到边界，并把“人类接管”做成流程的一部分。

## 快速上手：两条路径

### 路径 A：只想读取页面内容

如果你只是想读取一个网页，尤其是 JS 渲染或有反爬的页面，文档推荐从 `stealth-extract` 开始：

```bash
browser-act stealth-extract https://example.com
```

保存成文件：

```bash
browser-act stealth-extract https://example.com --output ./page.md
```

需要 HTML：

```bash
browser-act stealth-extract https://example.com --content-type html
```

需要指定地区代理：

```bash
browser-act stealth-extract https://example.com --dynamic-proxy JP
```

这个命令的好处是没有浏览器会话管理。URL 进去，Markdown 或 HTML 出来，浏览器上下文自动创建和清理。适合信息检索、批量读页面、替代普通 WebFetch。

注意：`stealth` 相关能力需要 API Key；Chrome 和 chrome-direct 类型不需要认证。

### 路径 B：需要点击、输入、登录和表单

如果任务需要互动，就用 session：

```bash
# 1. 看当前有哪些浏览器
browser-act browser list

# 2. 打开目标页面并创建会话
browser-act --session my-task browser open <browser-id> https://example.com

# 3. 读取页面状态，得到可点击元素索引
browser-act --session my-task state

# 4. 按索引操作
browser-act --session my-task click 4
browser-act --session my-task input 2 "hello@example.com"

# 5. 结束后关闭会话
browser-act session close my-task
```

BrowserAct 的交互模型很适合 Agent：`state` 返回索引化的元素树，Agent 不需要解析复杂 DOM，只要看到 `[4]` 是按钮，就可以 `click 4`。这比让模型在 HTML 里猜 CSS selector 稳定得多。

## 三种浏览器模式怎么选

![三种浏览器模式怎么选](/images/browseract-skills-tutorial/02-browser-modes.png)

BrowserAct 文档把浏览器分成几个场景：

### 1. chrome：复用本地 Chrome 登录态

适合已经登录的网站，例如 GitHub、Gmail、Jira、后台系统。它支持从本地 Chrome 导入 Profile，复制 Cookie、localStorage、IndexedDB、session storage 等登录相关状态。

示例：

```bash
browser-act browser list-profiles

browser-act browser create --type chrome --name "work"   --desc "Work Chrome: logged into GitHub, Jira, Gmail"   --source-profile <profile-id>
```

这个模式适合长期任务。导入是一次性快照，后续本地 Chrome 的变化不会自动同步。导入 Profile 也可能触发一些网站的重新验证，所以需要提前告知用户。

### 2. chrome-direct：直接接管本地 Chrome

适合企业 SSO、证书、插件依赖很强的系统：

```bash
browser-act browser create --type chrome-direct --name "live" --desc "Direct attach to local Chrome"
```

优点是零配置，继承你本地 Chrome 的扩展、书签、证书和 SSO。缺点也很直接：它会占用你的真实 Chrome，不适合长时间后台跑。

### 3. stealth：给反爬和多账号准备

`stealth` 有两种常见用法。

隐私模式适合一次性采集：

```bash
browser-act browser create --type stealth --name "monitor"   --desc "Competitor price monitoring"   --dynamic-proxy US   --private true
```

每次 session 都是新指纹、空资料、无残留。它适合公开页面采集、价格监控、避免指纹积累，但不能保留登录态。

固定身份适合长期多账号：

```bash
browser-act proxy list

browser-act browser create --type stealth --name "shop-1"   --desc "Taobao store 1"   --static-proxy <proxy_id_1>
```

每个浏览器有稳定指纹、固定 IP 和独立 Cookie。你可以把它理解成“一个账号一台浏览器”。这类模式更适合多店铺、多账号运营，但需要 API Key，托管静态代理也属于付费能力。

## 并发：浏览器是身份，session 是工作区

BrowserAct 的一个非显眼但重要的设计是并发隔离。

它把“浏览器”和“会话”分开：浏览器代表身份，session 代表某一次任务工作区。多 Agent 并行时，每个 Agent 用自己的 session 名称，避免互相抢页面。

跨浏览器并发：

```bash
browser-act --session monitor-shop-a browser open competitor1 https://shop-a.com
browser-act --session monitor-shop-b browser open competitor2 https://shop-b.com
browser-act --session monitor-shop-c browser open competitor3 https://shop-c.com
```

同一个浏览器也可以开多个 session，共享登录态，但执行互不阻塞：

```bash
browser-act --session task-a browser open <browser-id> https://site.com/page1
browser-act --session task-b browser open <browser-id> https://site.com/page2
```

这对多 Agent 系统很关键。不是因为“并发”这个词好听，而是因为真实任务里经常同时跑：一个 Agent 查价格，一个 Agent 填表，一个 Agent 看消息。如果它们共用一个页面上下文，迟早会互相踩。

## Skill Forge：把一次探索变成可重复执行的 Skill

![Skill Forge 工作流](/images/browseract-skills-tutorial/03-skill-forge.png)

BrowserAct Skills 里另一个值得看的部分是 Skill Forge。

传统 Agent 抓网页经常是“每次重新探索”：今天让它抓职位，它打开页面、观察 DOM、试参数；明天再来一遍，又重新花 token 和时间。站点稍微变化，还容易走不同路径。

Skill Forge 的思路是：探索一次，生成一个可部署 Skill。后续 500 条、5000 条数据都走同一条稳定路径。

官方文档把流程拆成四步：

```text
Describe → Explore → Generate → Self-Test
```

你只需要描述目标：

```text
Pull title, company, salary, and URL from LinkedIn job postings. I'll run 300 keywords later.
```

Agent 会探索页面，优先发现 API，DOM 作为兜底，然后生成参数化 Skill：

```bash
forged-skill linkedin-jobs --keyword "AI Engineer" --location "Remote"
forged-skill linkedin-jobs --keyword "Backend" --location "SF"
```

这里的重点是参数化。业务变量不能写死在脚本里，否则就不是可复用能力。

## 解决方案目录里有什么

我在本地检查了仓库结构，当前快照下共有 71 个 `SKILL.md`，其中 `solutions/` 下有 69 个预构建 Skill。分类大致是：

- 电商：Amazon、淘宝、Goofish、通用商品列表、商品详情、评论等。
- 线索生成：Google Maps、LinkedIn Jobs、Product Hunt、社交账号发现等。
- 搜索研究：Google SERP、Google News、Google Images、网页研究助手等。
- 社交监听：Facebook、Instagram、Reddit、X、小红书、知乎、微信公众号文章搜索等。
- 视频平台：YouTube、TikTok 的搜索、详情、评论、字幕、频道等。

这说明仓库不只是一个概念演示。它已经把很多常见网页任务整理成 Skill 包。你可以直接安装某个 solution，也可以把它当成模板学习：一个可复用网页 Skill 应该怎样描述触发条件、输入参数、脚本和验证方式。

安装某个 solution 的提示格式类似：

```text
Install amazon-asin-lookup-api-skill Skill from https://github.com/browser-act/skills/tree/main/solutions/ecommerce/amazon-asin-lookup-api-skill
```

## 一个完整使用建议

如果你准备在自己的 Agent 工作流里试 BrowserAct，我建议按这个顺序来，不要一开始就上最复杂的 stealth 多账号方案。

第一步，先装 CLI 和入口 Skill：

```bash
uv tool install browser-act-cli --python 3.12
browser-act --version
```

告诉你的 Agent：

```text
Install browser-act. Skill source: https://github.com/browser-act/skills/tree/main/browser-act . Verify it works after installation.
```

第二步，让 Agent 先读取运行时指南：

```bash
browser-act get-skills core --skill-version 2.0.2
```

这是 BrowserAct 的两层 Skill 设计：入口 Skill 负责触发，`get-skills` 返回当前环境、浏览器列表、命令和动态指令。这样做比把所有操作规则静态写进 Skill 文件更稳，因为环境状态会变。

第三步，先跑只读任务：

```bash
browser-act stealth-extract https://example.com --output ./page.md
```

第四步，再跑交互任务：

```bash
browser-act browser list
browser-act --session demo browser open <browser-id> https://example.com
browser-act --session demo state
browser-act --session demo click 3
browser-act session close demo
```

第五步，如果你发现自己反复抓同一个站点，再考虑 Skill Forge。不要把一次性任务过早做成 Skill；当任务开始批量化、重复化、需要稳定产出时，Skill Forge 的价值才会出来。

## 安全和成本边界

BrowserAct 的能力比较强，所以边界也要说清楚。

第一，敏感操作需要确认。入口 Skill 明确写了浏览器创建、删除、Profile 导入、代理变更、安全和隐私开关等操作需要用户确认。登录、表单提交、文件上传这类动作也不应该让 Agent 静默执行。

第二，不要把它当绕过规则的工具。反爬、验证码、人类接管这些能力适合处理合法访问中的技术摩擦，不适合违反网站条款或抓取不该抓的数据。

第三，认证和付费能力要分清。Chrome / chrome-direct 浏览器自动化不需要认证；stealth 浏览器、`stealth-extract`、动态代理、`solve-captcha` 等需要 API Key。README 也说明，托管代理和超过免费额度的 stealth 浏览器属于付费能力。

第四，多账号要谨慎。固定身份模式适合长期多账号，但它同时涉及账号安全、IP 稳定性、平台风控和合规问题。工程上能做，不等于业务上应该随便做。

## 谁适合现在试

我会推荐三类人先试：

- 正在做 Agent 工具链，希望 Agent 能稳定操作真实网页，而不是只读静态文本。
- 有重复网页数据采集任务，希望把探索成本沉淀成可复用 Skill。
- 需要多账号、多浏览器、并发隔离的自动化场景，例如电商监控、社媒监听、线索收集。

如果你只是偶尔读几个公开网页，普通 WebFetch 或 Playwright 可能已经够用。BrowserAct 的优势在更复杂的边界：登录态、反爬、人类接管、并发隔离、Agent 可读的状态输出。

## 结论

BrowserAct Skills 最值得借鉴的地方，不是“又一个浏览器自动化工具”，而是它把 Agent 使用浏览器这件事拆成了工程系统：入口 Skill 负责触发，运行时 `get-skills` 负责环境感知，browser/session 负责隔离，stealth/remote-assist 负责处理真实网页里的阻力，Skill Forge 负责把一次探索沉淀成可复用能力。

如果你的 Agent 还停留在“网页打不开就换个工具试试”的阶段，这个项目可以提供一个更系统的答案。

参考：

- GitHub: <https://github.com/browser-act/skills>
- 安装文档: `docs/installation.md`
- 快速开始: `docs/quick-start.md`
- 反阻断: `docs/anti-blocking.md`
- 浏览器模式: `docs/browser-modes.md`
- 并发隔离: `docs/concurrency.md`
- Skill Forge: `docs/skill-forge.md`
