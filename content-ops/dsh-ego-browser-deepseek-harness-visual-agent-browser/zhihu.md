# dsh-ego-browser：让 DeepSeek Harness Agent 浏览器操作看得见也控得住

使用 DeepSeek Harness（DSH）开发和使用 AI Agent 时，你是否遇到过这个问题：Agent 在后台调用浏览器，你完全不知道它在做什么，卡住了也无法发现，更没法中途干预？今天给大家介绍一款国产开源插件 **dsh-ego-browser**，它给 DSH 带来了看得见、控得住的 Agent 浏览器操作能力。

![dsh-ego-browser 界面](/root/jackssybinIndex/static/images/dsh-ego-browser-deepseek-harness-visual-agent-browser/01-logo.png)

## 项目简介

项目地址：[https://github.com/Fisfzy/dsh-ego-browser](https://github.com/Fisfzy/dsh-ego-browser)

dsh-ego-browser 是 DeepSeek Harness 的插件，它把 CitroLabs/ego-lite（给 AI Agent 用的 Chromium）接入 DSH，提供了 **32 个结构化工具**来驱动浏览器，并且配套了一套**实时观察前端界面**——当 Agent 在后台操作网页时，你可以像看直播一样看到它正在浏览的每个页面，还能直接在观察窗里操作浏览器，遇到验证码或者错误可以随时接手。

最值得称赞的特点是：不仅能看，还能控。就算 Agent 在操作 DSH 自身的界面（管理会话、任务看板、调整设置），你也能全程看到，随时可以接手干预。而且它开箱即用，插件包内置了 ego 运行时，不需要克隆官方仓库，也不需要手动构建，root、Docker、无显示器环境都能一键运行。

## 解决的痛点

通用浏览器不是为 AI Agent 设计的，而 Web 上很多场景（登录、验证码、动态渲染表单、真人会话站点）都需要真实浏览器才能处理。虽然 ego-lite 已经给 Agent 提供了浏览器能力，但最大的问题是：**你看不见 Agent 在做什么，出了问题也插不上手。**

dsh-ego-browser 解决了这个核心痛点：

> 🌐 小球一点看直播；🟦 标签条切换/关闭；🕘 历史抽屉回看；🔍 缩放拖拽；🖱️ 监控窗直接接管真实浏览器。**一句话：让 agent 在浏览器里干活，你在旁边既看得见、又随时能接手。**

常见应用场景：
- **文献 / 数据抓取**：Agent 登录知网 / 谷歌学术翻页收集，你在观察窗看着它滚动、点下一页、下载 PDF，中途卡住立刻就能发现。
- **表单与登录**：Agent 填表到一半，观察窗弹出验证码——你直接接管把验证码点了，再交还给 Agent 继续。
- **QA / 冒烟测试**：让 Agent 在产品上点一圈，观察窗等于一台"会说话的录屏"，还能回看历史轨迹。
- **self-observation：** Agent 操作 DSH 自身界面（管理会话、调设置）时，同样全程可见，随时可以接手。

## 和同类插件对比

目前市面上已经有同类插件把 ego-lite 接入 DSH，但对比下来，dsh-ego-browser 做的要深入很多：

| 能力 | dsh-ego-browser | 同类插件 |
| --- | --- | --- |
| 结构化工具数 | **32 个**，职责单一可精确调用 | 仅 3 个（run/help/status） |
| 实时观察窗 | ✅ 有（CDP JPEG / FFmpeg H.264 双后端 + 标签条 + 历史抽屉） | ❌ 无 |
| 监控窗直接操作浏览器 | ✅ 支持点击/拖拽/滚动回传 CDP | ❌ 不支持 |
| 崩溃自愈 + 单实例守卫 | ✅ 有 | ❌ 不支持 |
| 下载捕获 / 人机验证检测 | ✅ 支持 | ❌ 不支持 |
| 跨平台自适应（Linux/macOS/Windows） | ✅ 全平台自动探测 | 仅 Windows，需要手动配置 |
| 登录态落盘持久化 | ✅ 支持 | ⚠️ 仅文档说明 |

核心差异总结：
- **看得到**：同类插件是黑盒后台执行，只有执行完告诉你结果；dsh-ego-browser 实时推流，你看着 Agent 操作，卡住立刻发现。
- **控得住**：同类插件只读；dsh-ego-browser 允许你在监控窗直接操作同一个浏览器，需要时亲手接管，不需要打断 Agent 重来。

## 核心功能

### 1. 32 个结构化工具

dsh-ego-browser 提供了 32 个以 `ego_` 为前缀的工具，覆盖浏览器操作各个场景：

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

### 2. 实时观察窗体验

观察窗有两种显示模式：
- 如果安装了 `dsh-better-sidebar`，观察窗会注册为侧边栏原生 Tab，首次调用自动打开。
- 如果没有安装，会自动回退为右下角浮动小球，点击打开。

功能特点：
- **主画面**：实时显示 Agent 当前页面，支持点击、拖动、缩放、输入操作。
- **标签页条**：顶部切换标签，关闭不需要的页面。
- **历史抽屉**：按时间回看访问轨迹。

### 3. 两种画面后端

- **CDP 后端**：默认选项，JPEG 帧，20 FPS，资源占用低，满足大多数场景。
- **FFmpeg 后端**：H.264 编码，视频更流畅，适合复杂页面和长会话，插件自动检测兼容版本，提供一键下载。

### 4. 开箱即用跨平台

自动探测浏览器，root 自带 `--no-sandbox`，无需额外配置，支持全平台，内置运行时，安装就能用。

## 安装方法

### 前置条件
- Node.js ≥ 22
- Chrome / Chromium / Brave / Edge
- DeepSeek Harness + dshx

### 安装命令

注意：现在包名是 `dsh-ego-browser`，不是旧的 `@dsh-external/ego-browser`：

```sh
dshx install Fisfzy/dsh-ego-browser
dshx list  # 应该显示：[on] ego-browser
```

旧版本升级需要修改两处：

```diff
- "@dsh-external/ego-browser": "git+https://github.com/Fisfzy/dsh-ego-browser.git",
+ "dsh-ego-browser": "git+https://github.com/Fisfzy/dsh-ego-browser.git",
```

```diff
- "@dsh-external/ego-browser",
+ "dsh-ego-browser",
```

## 总结

dsh-ego-browser 是 DeepSeek Harness 生态中非常实用的开源插件，解决了 Agent 浏览器操作黑盒问题，让你看得见、控得住，大大提升了开发和使用 AI Agent 的效率。如果你是 DeepSeek Harness 用户，一定要试试。

---

*关注我的专栏，持续分享 AI 工具实测和开发效率提升技巧。*
