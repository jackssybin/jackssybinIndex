---
title: "一篇稿子一键发十几个平台：开源扩展 PostBot 源码实测，不上传账号密码怎么做到的"
date: 2026-09-10T21:30:00+08:00
lastmod: 2026-09-10T21:30:00+08:00
slug: postbot-multi-platform-content-sync
draft: false
description: "PostBot 是一款开源的多平台内容同步浏览器扩展，覆盖公众号/微博/小红书/知乎/抖音/B站等十几家平台。我读了它近 1.9 万行源码，拆解它如何在不开放平台 API、不要账号密码的前提下，用本地登录态+内容脚本 DOM 自动化+多标签页扇出实现一键分发，以及它的边界与风险。"
tags: ["开源", "自媒体", "浏览器扩展", "内容运营", "自动化"]
topic: "开源项目"
topicSlug: "open-source"
layout: article
contentType: article
type: article
cover: "/images/postbot-multi-platform-content-sync/cover-wechat.jpg"
---

# 一篇稿子一键发十几个平台：开源扩展 PostBot 源码实测，不上传账号密码怎么做到的

做自媒体的人都有同一个体力活：一篇文章写完，要分别打开公众号、微博、小红书、知乎、头条、百家号……复制标题、粘贴正文、重新传图、改格式、点发布，十几个平台轮一遍，半小时没了。市面上的"一键分发"工具大多是一个思路——**你把账号密码（或登录 Cookie）交给它的云端，它在服务器上替你操作**。方便是方便，但账号凭据离开自己浏览器这件事，很多人始终不踏实。

这周我翻到一个思路完全不同的开源项目 [PostBot 内容同步助手](https://github.com/gitcoffee-os/postbot)（GitHub 1376 star / 189 fork，TypeScript，2025 年 5 月立项至今持续迭代）。它是一个浏览器扩展，核心卖点就一句话：**直接复用你浏览器里已经登录的状态，在你自己电脑上打开平台页面、自动填表发布，账号信息从头到尾不离开本地**，而且默认不消耗任何 AI Token。

我把仓库克隆下来读了源码（`src` 下约 1.9 万行 TS，其中发布逻辑约 1.6 万行），又核对了官方截图与在线文档。这篇不写软文，回答三个我自己最好奇的问题：它到底覆盖多少平台、"不上传密码"在代码层面是怎么成立的、以及这种做法的代价和风险在哪。

![PostBot 发布工作台：左侧内容类型与富文本/Markdown 编辑器，右侧同步助手勾选发布账号](/images/postbot-multi-platform-content-sync/01-publisher.jpg)

## 平台覆盖：37 个发布器，按内容形态分四类

它不是一个平台一个按钮，而是先按**内容形态**把平台分成四个大类，我在 `src/media/publisher/platform/` 目录里逐个文件点过名：

- **文章（article）11 个**：微信公众号、微博（头条文章）、知乎、小红书（长文/图文）、头条号、百家号、企鹅号、B 站专栏、简书、豆瓣、知识星球；
- **动态（moment）11 个**：微博、小红书、知乎想法、微信朋友圈/视频号、抖音、快手、头条、百家号、豆瓣、知识星球；
- **视频（video）9 个**：B 站、抖音、快手、视频号、小红书、知乎、微博、头条、企鹅号；
- **音频（audio）6 个**：喜马拉雅、小宇宙、网易云音乐、QQ 音乐、蜻蜓 FM、荔枝。

合计 **37 个发布器文件**。同一个平台在不同形态下各有一套适配（比如知乎同时有文章发布器和动态发布器），因为它们背后是完全不同的创作页和 DOM 结构。README 还提到国际版姊妹项目 [Postar](https://github.com/gitcoffee-os/postar)，面向 X、Facebook、Instagram、TikTok、YouTube、LinkedIn。

![右侧同步账号区：公众号/头条/小红书/知乎/微博/百家号/企鹅号/视频号，可多选并设置图片自动上传、手动/自动发布](/images/postbot-multi-platform-content-sync/02-platforms.jpg)

## 核心机制：它其实是一个"本地 RPA"，不是 API 集成

这是整个项目最关键、也最容易被宣传语带过去的一点。我读了知乎文章发布器 `src/media/publisher/platform/article/zhihu.publisher.ts` 的完整实现（306 行），它干的事情非常朴素——**在知乎自己的创作页里，用 JavaScript 操作真实 DOM**：

1. **打开平台真实创作页**。每个发布器配置了目标 URL，扩展用 `chrome.tabs.create` 逐个打开新标签页，并用 `chrome.tabGroups` 把这批标签页归到一个紫色的"PostBot 内容同步助手"标签组里（见 `src/tabs/index.ts`）。
2. **等页面就绪**。不是写死 `sleep(3000)` 硬等，而是用 `MutationObserver` 监听 DOM，直到标题框、`contenteditable` 编辑器这些关键元素出现，带 10 秒超时和中文报错。
3. **模拟"人"的输入**。标题是给 `textarea` 赋值后派发 `input`/`change` 事件（让框架感知到变化）；正文更讲究——它构造一个真实的 `ClipboardEvent('paste')`，把 HTML 塞进 `clipboardData` 再派发给富文本编辑器，**走的是"粘贴"通道而不是 `innerHTML` 强写**，这样能最大程度保留平台自己的格式清洗与图片上传逻辑。
4. **图片走真实文件上传控件**。它把图片（本地 blob 或远程 URL，远程图通过 background 脚本绕过跨域取成 base64）装进一个 `DataTransfer`，直接赋给 `<input type="file">` 再触发 `change`——等于模拟你手动选文件。
5. **最后点"发布"**。同样是找到按钮派发 `click`。是否真的点下去，受一个 `isAutoPublish` 开关控制；关掉时它只把内容填好，由你人工确认。

换句话说，**它没有对接任何一家平台的开放 API，也没有保存任何账号密码**。它能登录，是因为浏览器本来就登录着；扩展只是在页面这个"已登录的浏览器标签"里，自动做了你手动会做的填表动作。这就是"本地化操作机制、规避云端存账号风险"在代码里的真实含义——不是营销话术。

技术上它用 [Plasmo](https://www.plasmo.com/) 框架（基于 Chrome Manifest V3）+ Vue 3 + Ant Design Vue + Tailwind 构建，富文本与 Markdown 双编辑器，网页正文提取用的是 Mozilla 的 `@mozilla/readability`（就是 Firefox 阅读模式同款内核）。

## 多平台扇出：一个标签页一个"工人"

一键多平台是怎么并发跑起来的？链路在 `src/media/publisher/index.ts` 和 `publisher.script.ts`：

- 你在右侧勾选目标平台后，`windowPublish` 调用 `createTabsForPlatformsWithScript`；
- 它为每个平台创建独立标签页、编入标签组，然后监听 `chrome.tabs.onUpdated`，**等某个标签页 `status === 'complete'` 加载完成，就用 `chrome.scripting.executeScript` 把对应平台的发布函数注入进去执行**，并且有 `executed` 标志防止重复注入；
- 发布器入口是按 `cn`（国内）、`it`（国际）、`industry`（行业）三组合并出来的注册表，结构统一为 `{article, moment, video, audio}`，加新平台就是往注册表里添一个 entry。

这个设计的好处是**平台之间天然隔离**：一个标签页崩了或选择器变了，不影响其它平台；每个平台跑在自己的域名和登录态下，权限边界也清楚。

## 安全性：它要了哪些权限，你该警惕什么

"不上传密码"不等于"没有权限"。我特意看了 `package.json` 里的 manifest 权限声明，这里如实列出：

- `host_permissions` 是 `https://*/*`、`http://127.0.0.1/*`、`http://localhost/*`——**对所有网页有访问权**；
- API 权限包括 `tabs`、`scripting`、`activeTab`、`storage`、`downloads`、`clipboardRead`（读剪贴板）、`contextMenus`、`sidePanel` 等。

这是这类"通用网页自动化"工具的必然要求——它要能在任意平台页注入脚本，就必须申请广泛权限。因此信任模型和装一个 RPA/自动填表扩展是一样的：**你需要信任扩展本身**。好在它开源、可自行审计、也能本地 `pnpm build` 后加载未打包版本（README 明确提醒 main 分支是日常开发版，求稳建议切到稳定 tag `v1.1.20`），不必装商店里来路不明的编译产物。我的建议是：账号价值高、或涉及商业矩阵的用户，优先用自行构建的版本，并在不需要批量发布时停用扩展。

## 它还能接什么：多引擎与 AI 是"可选"不是"必需"

README 里一堆"多引擎/AI"词容易让人以为是个套壳 AI 产品，但源码层面默认发布引擎是纯 DOM 自动化，**不调任何大模型、不花 Token**。真正的扩展点在：

- 引擎层可替换/增强：文档列出可接入 Playwright、PageAgent、OpenClaw、Hermes Agent 等自动化引擎做更复杂流程；
- 有插件引擎、SDK、API、MCP、独立的 [postbot-cli](https://github.com/gitcoffee-os/postbot-cli) 命令行（批量与自动化任务）；
- AI 是可选适配层（`src/ai-adapter`），用于内容个性化，不配 Key 也不影响核心同步。

这种"把免费的核心同步做扎实、把 AI/企业能力放在可选项里"的取舍，比一上来就要你充 Token 的产品有诚意。

## 谁该用，谁先等等

**适合：**
- 同时运营 5 个以上平台、每天被"复制粘贴改格式"消耗大量时间的个人自媒体与中小团队；
- 对"账号凭据上云"有顾虑、希望分发动作完全发生在本机的人；
- 想学习浏览器扩展实战（MV3、content script、多标签页编排、富文本粘贴注入、文件上传模拟）的前端——这套代码是很具体的教材。

**要谨慎：**
- **平台风控**：DOM 自动化本质是模拟操作，频率过高、行为过于机械，可能触发各平台的异常检测。建议保留"手动发布"确认、控制批量节奏，别拿主号猛冲。
- **易碎性**：选择器与页面结构强耦合，平台一改版，对应发布器就可能失效，需要等更新或自己改选择器（项目用调试面板把选择器挂到了运行时，明显是为了降低维护成本）。
- **合规**：自动发布要遵守各平台用户协议；许可证是带附加限制的 Apache-2.0（GitCoffee Open Source License），商用/二发前读一眼附加条款。
- main 是快速迭代版，生产使用请切稳定版 tag。

项目地址：[https://github.com/gitcoffee-os/postbot](https://github.com/gitcoffee-os/postbot)，官方文档：[postbot.exmay.com/docs](https://postbot.exmay.com/docs)。

总体评价：它没有发明新东西——DOM 自动化、粘贴事件、文件 input 注入都是老技术——但把这些"笨办法"工程化成了覆盖 37 个发布器、四类内容、可插拔引擎的完整产品，并且在最敏感的账号问题上选择了"本地登录态"这条更让人安心的路线。对于被多平台分发折磨的内容创作者，它值得装来跑一遍；对于开发者，它则是一份难得的、成规模的浏览器自动化实战样本。
