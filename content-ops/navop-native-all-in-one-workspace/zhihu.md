# Navop：开源免费的一体化原生开发工作台，替代付费数据库和远程工具

作为开发者，你是不是每天都要在多个工具之间来回切换：打开数据库客户端查数据，切到终端 SSH 连服务器，再开远程桌面连 Windows 服务器，还要和 AI 助手对话帮你写 SQL？多个工具不仅占用大量内存，窗口切换也很浪费时间，而且很多好用的工具都是付费订阅，每个月几十块，一年下来也是一笔不小的开支。

今天给大家介绍一款国产开源项目 **Navop**，它把数据库管理、SSH/SFTP、终端、远程桌面、AI 工具全都整合到了一个原生桌面工作台中，基于 Rust 和 GPUI（Zed 编辑器同款 GPU 加速 UI 框架）构建，体验流畅，完全免费开源，帮你省下订阅费，提升开发运维效率。

## 项目简介

项目地址：[https://github.com/feigeCode/navop](https://github.com/feigeCode/navop)

Navop 是一个原生的一体化开发工作台，把开发者日常用到的几乎所有工具都整合在了一个应用里，你不需要再同时打开七八个不同的软件，一个 Navop 就能搞定绝大多数开发和运维工作。它由国内开发者独立维护，持续更新，目前已经达到可用的生产级别。

<img class="content_image" src="file:///root/jackssybinIndex/static/images/navop-native-all-in-one-workspace/01-navop-overview.png">

## 核心功能解析

### 1. 全面的数据库支持

Navop 内置支持几乎所有主流关系型数据库：MySQL、PostgreSQL、SQLite、DuckDB、SQL Server、Oracle、ClickHouse，还通过扩展支持国产数据库：达梦 DM、金仓 KingbaseES、南大通用 GBase 8s、OceanBase、openGauss 等，满足政企和不同行业需求。

除了基础的 SQL 编辑执行，还支持：浏览数据库对象，查看执行计划；数据导入导出，Schema 和数据对比；ER 关系图可视化；Redis 和 MongoDB 专用界面；支持代理和 SSH 隧道连接；持久化 SQL 执行历史。

<img class="content_image" src="file:///root/jackssybinIndex/static/images/navop-native-all-in-one-workspace/03-navop-database.png">

### 2. 强大的远程连接与运维能力

开发者日常离不开远程服务器管理，Navop 在这方面做得非常全面：

- **SSH 与本地终端**：支持可拖拽分屏、快捷命令、广播输入、会话锁定、录制回放，还支持 Telnet 和串口连接。
- **SFTP 文件管理**：支持上传下载、搜索、收藏、远程编辑、拖拽传输、ZMODEM 传输，还支持服务器之间直接复制文件。
- **端口转发**：支持本地端口转发、远程端口转发（`ssh -R`）、动态 SOCKS 代理，X11 转发也没问题。
- **远程桌面**：支持 RDP 和 VNC，Windows 上直接集成原生 MSTSC，内嵌到应用标签页中，跨平台用纯 Rust 的 IronRDP 渲染。
- 还支持导入 SecureCRT 等外部工具的会话，自带服务器监控功能。

### 3. AI 与扩展能力

Navop 不仅整合了传统开发工具，还与时俱进集成了 AI 能力：

- AI 可以帮你生成 SQL、解释 SQL、分析数据、生成图表、辅助终端操作，还支持工具调用和 Agent 工作流。
- 支持通过 ACP 协议接入外部 Agent：Codex、Claude Code、OpenCode 都可以接入。
- Agent Hub 让你在同一个工作区管理终端 Agent、项目文件、Git 分支和变更对比。
- 扩展市场可以安装第三方扩展，官方也提供了很多数据库驱动和功能扩展，所有扩展都在独立的 [navop-extensions](https://github.com/feigeCode/navop-extensions) 仓库维护。

### 4. MCP 协议开放能力

这是一个非常有意思的亮点：Navop 可以把自身的工具能力通过 MCP（Model Context Protocol）协议开放给外部的 Claude Code、Codex 等 Agent 客户端使用。你只需要在设置中开启 MCP 服务，选择好权限和开放的工具组，外部 Agent 就能安全调用 Navop 宿主上的工具能力，而 Navop 始终保留权限管控和审计能力。

对于终端 Agent，只需要安装官方提供的 `@navop/cli` 就可以直接使用：

```bash
npm install -g @navop/cli@latest
navop skill install --target codex --scope user
```

### 5. 原生流畅的桌面体验

因为基于 GPUI 框架构建，Navop 拥有 GPU 加速渲染，界面响应非常流畅，同时还支持：

- 亮色、深色、跟随系统三种主题，支持导入自定义主题，可配置强调色和窗口透明度。
- 支持英文、简体中文、繁体中文三种界面语言。
- 加密同步多设备之间的连接、凭据和设置，换设备不用重新导入所有连接信息。

## 技术选型分析

Navop 选择用 Rust 开发，基于 Zed 团队开源的 GPUI 框架，这是一个非常明智的技术选型：

1. **内存安全与性能**：Rust 天生保证内存安全，没有 GC 停顿，对于长期运行的桌面应用来说非常稳定，内存占用也比 Electron 这类基于 Chromium 的方案小很多。
2. **GPU 加速 UI**：GPUI 是一个 GPU 加速的 UI 框架，专门为文本编辑和开发者工具设计，渲染性能比传统的 CPU 渲染UI框架好很多，大界面、多标签场景下也非常流畅。
3. **跨平台一致性**：Rust + GPUI 可以做到一份代码多平台运行，同时保持原生体验，不需要像 Electron 那样打包整个浏览器，安装包体积也小很多。

## 使用建议

**适合人群：**
- 需要同时管理数据库和远程服务器的开发者、运维工程师，Navop 帮你把多个工具整合到一个，减少切换，提升效率。
- 不想为数据库客户端、SSH 工具等支付订阅费用的个人开发者，Navop 完全免费开源，功能不比付费工具差。
- 喜欢原生应用体验，追求流畅性能的用户，Rust+GPU 加速的体验确实比 Web 版和 Electron 应用好很多。

**可以观望：**
- 如果你只需要单一功能，比如只用到 SSH，那你可能已经有习惯的工具了，不一定需要更换。
- 对某些小众数据库或非常高级的数据库功能有要求，可能目前扩展还没支持，可以去提 Issue 给作者。

## 安装方式

Navop 提供了多平台的安装包，直接去 GitHub Releases 下载对应你的系统的版本即可：

- macOS：DMG 和 tar.gz，支持 Apple Silicon 和 Intel
- Windows：MSI、EXE 安装程序，还有普通和便携版 ZIP
- Linux：tar.gz、deb、rpm、AppImage 都有

也可以通过 Flatpak 安装：

```bash
flatpak --user remote-add --if-not-exists flatpark https://dl.flatpark.org/flatpark.flatpakrepo
flatpak --user install flatpark dev.navop.Navop
```

总的来说，Navop 是一款非常用心的国产开源项目，功能全面，体验流畅，确实值得开发者尝试。如果你厌倦了在多个工具之间来回切换，不妨试试 Navop。

---

*关注我的专栏，持续分享开源工具实测和开发效率提升技巧。*
