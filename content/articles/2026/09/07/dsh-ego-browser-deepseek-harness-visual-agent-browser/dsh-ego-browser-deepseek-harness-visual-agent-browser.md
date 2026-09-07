---
title: "dsh-ego-browser：让 DeepSeek Harness Agent 浏览器操作看得见也控得住"
date: 2026-09-07T15:30:00+08:00
slug: dsh-ego-browser-deepseek-harness-visual-agent-browser
draft: false
description: "dsh-ego-browser 是 DeepSeek Harness 的一个开源插件，给 AI Agent 提供了可见可控的浏览器操作能力，让你能实时看到 Agent 操作网页，还能随时接手干预。"
tags: ["AI", "DeepSeek Harness", "Agent", "浏览器自动化"]
type: article
cover: "/images/dsh-ego-browser-deepseek-harness-visual-agent-browser/01-logo.png"
---

# dsh-ego-browser：让 DeepSeek Harness Agent 浏览器操作看得见也控得住

使用 DeepSeek Harness（DSH）开发和使用 AI Agent 时，你是否遇到过这个问题：Agent 在后台调用浏览器，你完全不知道它在做什么，卡住了也无法发现，更没法中途干预？今天给大家介绍一款国产开源插件 **dsh-ego-browser**，它给 DSH 带来了看得见、控得住的 Agent 浏览器操作能力。

![dsh-ego-browser 界面](/images/dsh-ego-browser-deepseek-harness-visual-agent-browser/01-logo.png)

## 什么是 dsh-ego-browser？

dsh-ego-browser 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的插件，它把 [CitroLabs/ego-lite](https://github.com/CitroLabs/ego-lite)（给 AI Agent 用的 Chromium）接入 DSH，提供了 **32 个结构化工具**来驱动浏览器，并且配套了一套**实时观察前端界面**——当 Agent 在后台操作网页时，你可以像看直播一样看到它正在浏览的每个页面，还能直接在观察窗里操作浏览器，遇到验证码或者错误可以随时接手。

项目地址：[https://github.com/Fisfzy/dsh-ego-browser](https://github.com/Fisfzy/dsh-ego-browser)

最值得称赞的特点是：不仅能看，还能控。就算 Agent 在操作 DSH 自身的界面（管理会话、任务看板、调整设置），你也能全程看到，随时可以接手干预。

而且它开箱即用，插件包内置了 ego 运行时，不需要克隆官方仓库，也不需要手动构建，root、Docker、无显示器环境都能一键运行。

## 它解决了什么痛点？

通用浏览器不是为 AI Agent 设计的，而 Web 上很多场景（登录、验证码、动态渲染表单、真人会话站点）都需要真实浏览器才能处理。虽然 ego-lite 已经给 Agent 提供了浏览器能力，但最大的问题是：**你看不见 Agent 在做什么，出了问题也插不上手。**

dsh-ego-browser 解决了这个核心痛点：

> 🌐 小球一点看直播；🟦 标签条切换/关闭；🕘 历史抽屉回看；🔍 缩放拖拽；🖱️ 监控窗直接接管真实浏览器。**一句话：让 agent 在浏览器里干活，你在旁边既看得见、又随时能接手。**

常见应用场景：

- **文献 / 数据抓取**：Agent 登录知网 / 谷歌学术翻页收集，你在观察窗看着它滚动、点下一页、下载 PDF，中途卡住立刻就能发现。
- **表单与登录**：Agent 填表到一半，观察窗弹出验证码——你直接接管把验证码点了，再交还给 Agent 继续。
- **QA / 冒烟测试**：让 Agent 在产品上点一圈，观察窗等于一台"会说话的录屏"，还能回看历史轨迹。
- **self-observation：** Agent 操作 DSH 自身界面（管理会话、调设置）时，同样全程可见，随时可以接手。

## 和同类插件对比有什么优势？

目前市面上已经有同类插件把 ego-lite 接入 DSH，但对比下来，dsh-ego-browser 做的要深入很多：

| 能力 | dsh-ego-browser | 同类插件 |
| --- | --- | --- |
| 结构化工具数 | **32 个**，职责单一可精确调用 | 仅 3 个（run/help/status） |
| 实时观察窗 | ✅ 有（CDP JPEG / FFmpeg H.264 双后端 + 标签条 + 历史抽屉） | ❌ 无 |
| 监控窗直接操作浏览器 | ✅ 支持点击/拖拽/滚动回传 CDP | ❌ 不支持 |
| 崩溃自愈 + 单实例守卫 | ✅ 有 | ❌ 无 |
| 下载捕获 / 人机验证检测 | ✅ 支持 | ❌ 不支持 |
| 跨平台自适应（Linux/macOS/Windows） | ✅ 全平台自动探测 | 仅 Windows，需要手动配置 |
| 登录态落盘持久化 | ✅ 支持 | ⚠️ 仅文档说明 |

核心差异总结：
- **看得到**：同类插件是黑盒后台执行，只有执行完告诉你结果；dsh-ego-browser 实时推流，你看着 Agent 操作，卡住立刻发现。
- **控得住**：同类插件只读；dsh-ego-browser 允许你在监控窗直接操作同一个浏览器，需要时亲手接管，不需要打断 Agent 重来。

## 核心功能解析

### 1. 32 个结构化工具，覆盖浏览器操作全场景

dsh-ego-browser 提供了 32 个以 `ego_` 为前缀的工具，分类清晰，职责单一：

| 类别 | 工具列表 |
| --- | --- |
| 任务空间 | `ego_space_open` `ego_space_close` `ego_status` |
| 页面读取 | `ego_snapshot`（语义树） `ego_page_info` `ego_read_element` |
| 导航/等待 | `ego_navigate`（复用 tab） `ego_wait` `ego_wait_for_selector` `ego_wait_for_url` `ego_wait_for_response` |
| 交互 | `ego_click` `ego_fill` `ego_hover` `ego_drag` `ego_select` `ego_check` `ego_key` `ego_scroll` |
| 执行/调试 | `ego_js`（页面求值） `ego_cdp`（原始 CDP） `ego_cli`（任意 heredoc） `ego_script`（多步脚本） |
| 输出 | `ego_screenshot` `ego_download` `ego_upload` |
| 会话/安全 | `ego_auth_flush`（登录落盘） `ego_captcha` `ego_dialog` |
| 元工具 | `ego_help` `ego_doctor` `ego_http` |

你可以在 Agent 工作流中灵活组合这些工具，完成复杂的浏览器自动化任务。

### 2. 实用的实时观察窗体验

观察窗有两种显示模式：
- 如果安装了 `dsh-better-sidebar`，观察窗会注册为侧边栏原生 Tab，首次调用自动打开，非常方便。
- 如果没有安装，会自动回退为右下角浮动小球，点击打开。

观察窗功能：
- **主画面**：实时显示 Agent 当前页面，你可以直接点击、拖动、缩放、输入操作，支持快捷键。
- **标签页条**：顶部切换标签，关闭不需要的页面。
- **历史抽屉**：按时间回看访问轨迹。

### 3. 两种画面后端适配不同场景

- **CDP 后端**（默认）：通过 `Page.startScreencast` 获取 JPEG 帧，默认 20 FPS，占用资源少，大多数场景够用。
- **FFmpeg 后端**：使用 H.264 编码，视频更流畅，适合复杂页面和长会话录制。插件会自动检测兼容的 FFmpeg，也提供一键下载功能。

### 4. 开箱即用，跨平台适配

- 自动探测 Chrome/Edge/Brave，root 用户自带 `--no-sandbox` wrapper，不需要额外配置。
- 支持 Linux/macOS/Windows 全平台，Docker 和无头模式也能正常工作。
- 内置 ego 运行时，不需要克隆官方仓库手动构建，安装就能用。

## 工程亮点：为什么说它做得很用心？

相对于 ego-lite 本体，dsh-ego-browser 额外做了很多工程优化：

1. **完整的前端观察窗实现**：在 ego-lite 无头 CLI 的基础上，增加了 SSE 实时推流、标签管理、历史记录、鼠标操作回传，把"看"和"控"做成了一等能力。

2. **健壮的运行时设计**：冷启动自动重试、单实例守卫、崩溃自动重启、内存缓存上限，杜绝长时间运行的内存泄漏问题。

3. **完善的工具层封装**：提供了环境检查、人机验证检测、登录持久化、浏览器请求等实用工具，覆盖真实场景需求。

4. **全平台自适应**：自动适配 Linux/macOS/Windows，root/无头/无显示器都能正常工作，不需要用户手动修改配置。

## 安装使用

### 前置条件
- Node.js ≥ 22（DSH 环境自带）
- 已安装 Chrome / Chromium / Brave / Edge（自动探测，也可手动指定）
- DeepSeek Harness + dshx

### 安装命令

注意：从某个版本开始，DSH 要求包名一致，所以现在包名是 `dsh-ego-browser`，不是 `@dsh-external/ego-browser`，安装的时候注意：

```sh
dshx install Fisfzy/dsh-ego-browser
dshx list  # 应该显示：[on] ego-browser
```

如果是从旧版本升级，记得更新你的 profile `package.json` 和 `dsh.profile.bundles`：

```diff
- "@dsh-external/ego-browser": "git+https://github.com/Fisfzy/dsh-ego-browser.git",
+ "dsh-ego-browser": "git+https://github.com/Fisfzy/dsh-ego-browser.git",
```

```diff
- "@dsh-external/ego-browser",
+ "dsh-ego-browser",
```

## 谁该用这个插件？

如果你是 DeepSeek Harness 用户，经常需要让 Agent 操作浏览器，那一定要安装 dsh-ego-browser：
- ✅ 看得见 Agent 操作，出问题能及时发现，节省大量时间。
- ✅ 随时可以接手干预，解决验证码这类 AI 搞不定的问题。
- ✅ 功能完整，开箱即用，全平台适配，开源免费。

如果你只是偶尔让 Agent 做一次简单的网页抓取，不需要干预，那也可以选择更轻量的方案。

## 总结

dsh-ego-browser 是 DeepSeek Harness 生态中非常实用的一个插件，解决了 Agent 浏览器操作黑盒问题，让你看得见、控得住，大大提升了开发和使用 AI Agent 的效率。项目代码质量很高，持续更新维护，值得 DeepSeek Harness 用户一试。
