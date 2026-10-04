---
title: "20.4k Star 的视频号下载器，我把源码翻了一遍：它其实是个「傻瓜版 Charles」"
slug: "res-downloader-proxy-sniffer"
date: 2026-10-04
draft: false
categories: ["开源项目", "效率工具"]
tags: ["开源", "视频号", "资源下载", "代理抓包", "MITM", "Go", "Wails", "m3u8"]
cover: "/images/res-downloader-proxy-sniffer/architecture.png"
description: "res-downloader（爱享素材下载器）是 GitHub 上 20.4k Star 的开源资源嗅探下载器，支持视频号、小程序、抖音、快手、小红书、m3u8、直播流。本文基于源码拆解其 MITM 代理 + 规则筛选 + 插件化处理的实现机制，给出完整使用步骤、证书风险提示与谁该用/谁该等的判断。"
---

刷视频号时看到一条想存档的采访，小红书里有个教程想离线反复看，小程序里买的课想在电脑上留一份——打开 App 找了一圈，没有任何「保存」按钮。这类需求每天都有，但平台们默契地不给入口。

通用下载器解决不了这个问题：IDM、Motrix 这类工具的前提是你手里有一个真实的媒体 URL，而视频号、小程序、小红书的视频地址藏在加密的 HTTPS 流量里，还带着动态鉴权参数，普通用户根本看不见、也复制不出来。

最近我把 GitHub 上 **20.4k Star** 的开源项目 [res-downloader](https://github.com/putyy/res-downloader)（中文名「爱享素材下载器」）拉下来通读了一遍源码。它支持视频号、小程序、抖音、快手、小红书、酷狗、QQ 音乐、m3u8 和直播流，Apache-2.0 协议，用 Go + Wails 写成，跨 Windows / macOS / Linux，截至今天（10 月 4 日）还在发布 4.0.0-beta.6。读完最大的感受是：**它根本不是什么「破解工具」，而是一个把专业抓包软件做成「点一下就行」的 MITM 代理。** 这篇文章讲清楚它的机制、用法、风险和适用边界。

## 核心机制：本地代理 + 自签证书 + 实时筛选

理解 res-downloader，只要理解一句话：**它在你自己的电脑上开了一个代理服务器，让你的流量先经过它，再由它筛选出视频、音频、图片。**

项目的底层依赖是 Go 生态里成熟的中间人代理库 `goproxy`（`go.mod` 里写得很清楚：`github.com/elazarl/goproxy v1.7.2`）。整体数据流是这样的：

![res-downloader 工作机制：MITM 代理嗅探流程](/images/res-downloader-proxy-sniffer/architecture.png)

1. 点击「启动代理」后，程序在本机 `127.0.0.1:8899` 端口启动代理（端口写在 `core/config.go` 的默认配置里），并自动把系统代理指向它；
2. 安装时要求信任的那个「证书文件」，是程序动态生成的自签 CA 根证书。有了它，代理才能对 HTTPS 流量做中间人解密——`core/proxy.go` 的 `setCa()` 里把生成的证书赋给 `goproxy.GoproxyCa`，这一步和 Fiddler、Charles 首次启动时让你装证书是完全相同的原理；
3. 你在手机或电脑上播放视频时，媒体请求经过代理，程序的响应钩子按 `Content-Type` 和域名实时判断这是不是一个视频/音频/图片资源（`core/plugins/plugin.default.go` 的 `OnResponse` 只处理 200、206、304 三种响应，再用 `TypeSuffix` 映射 MINE 类型）；
4. 命中的资源通过 WebSocket 推给前端列表，你看到的就是一个干净的「可下载资源清单」，而不是 Charles 里几千条混杂请求。

换句话说，它做的事情和 Fiddler / Charles / 浏览器 DevTools 的 Network 面板**在原理上一模一样**，作者在 README 里也没有掩饰这一点。区别只在于：专业工具把所有原始请求丢给你，让你自己在瀑布流里找 `.mp4`；res-downloader 替你完成了筛选、分类、命名和下载。

## 非显然的工程细节：规则引擎和平台插件

如果只是「按 Content-Type 抓视频」，这个项目不值 2 万 Star。源码里有两个值得说的设计。

**一是域名规则引擎。** `core/rule.go` 实现了一套文本规则集，支持三种写法：`*` 匹配所有域名、`*.example.com` 通配子域、以 `!` 开头表示否定规则。规则逐行解析、内存匹配，加了读写锁。这意味着抓哪些站、屏蔽哪些站的噪音，不需要改代码，改规则文本即可——这是典型的「机制与策略分离」。

**二是插件化的平台特判。** 通用插件（`DefaultPlugin`）注册在 `"default"` 域名上，按 MINE 类型通吃；而 `core/plugins/plugin.qq.com.go` 是一个专门的 QQ 系插件，注册在 `qq.com` 域名，里面有大量针对性处理，我在源码里核对到的包括：

- 对 `finder.video.qq.com`（视频号 CDN）的视频流单独识别，并校验请求来自 `mp.weixin.qq.com`；
- 对 `channels.weixin.qq.com`、`res.wx.qq.com` 的特殊响应改写 JS 内容（`replaceWxJsContent`），用正则替换视频号异步取评论等函数——小程序场景下甚至通过注入 `fetch` 请求配合完成资源上报；
- 视频号部分视频是加密传输的，项目单独实现了 `core/aes.go` 的 AES 加解密，下载后在界面上点「视频解密（视频号）」才能得到可播放文件。

![视频号/小程序特殊处理：QQ 系插件工作位置](/images/res-downloader-proxy-sniffer/qq-plugin.png)

这套「通用插件兜底 + 特殊平台插件」的注册表结构（`proxy.go` 里的 `pluginRegistry map[string]shared.Plugin`）解释了为什么它能持续加平台：每支持一个需要特殊处理的站点，写一个实现 `Domains()/OnRequest()/OnResponse()` 的插件注册进去就行，主代理流程一行不用动。

## 使用步骤：关键在「证书」和「同一网络」

官方流程很短，但有几个新手最容易翻车的点，我按实际操作顺序整理：

1. **下载安装**：从 [GitHub Releases](https://github.com/putyy/res-downloader/releases) 下载对应平台安装包，也有蓝奏云镜像。安装时务必允许安装证书、允许网络访问——拒绝证书等于废掉它的 HTTPS 解密能力。Win7 用户只能用 `2.3.0` 版本（新版基于 Wails v2 + WebView2，不支持 Win7）；
2. **启动代理**：打开软件，首页左上角点「启动代理」，确认系统代理已指向 `127.0.0.1:8899`；
3. **手机抓包的网络前提**：想抓手机 App 的流量，手机 Wi-Fi 代理要填运行软件的这台电脑的局域网 IP 和 `8899` 端口，手机还需访问 `res-downloader` 提供的地址下载并信任同一个 CA 证书；
4. **播放、返回、下载**：保持软件在后台，去视频号/小红书/网页里正常播放一遍目标内容，返回软件首页资源列表就会出现；视频号加密资源下载后再点一次「视频解密」。

两个高频坑 README 里也写明了：**软件关闭后上不了网**，多半是系统代理没被自动还原，手动关掉系统代理即可；**拦截不到资源**，先查代理端口和证书是否生效，再查是不是 App 走了证书绑定（Certificate Pinning），这类 App 任何 MITM 工具都抓不动，不是这个项目的问题。

## 谁该用，谁先等等

**适合用的人：**

- 偶尔需要存档视频号内容、小程序课程、网页 m3u8 视频的普通用户，不想学 Charles；
- 需要批量整理素材的内容创作者、新媒体运营；
- 开发者也可以把它当成「带媒体筛选 UI 的本地调试代理」用，或者读它的源码学习 goproxy / Wails 的实战写法。

**先等等或别用的场景：**

- 直播流录制：作者自己都推荐 OBS，代理抓直播流并不稳定；
- 大文件、下载慢的场景：官方建议转投 Neat Download Manager、Motrix 这类专职多线程下载器，嗅探器不等于下载加速器；
- 对证书安全极度敏感的环境：任何 MITM 代理都意味着本机软件能解密你的全部 HTTPS 流量，用完退出、确认系统代理还原，比装什么都重要；
- 合规红线先想清楚：项目 Apache-2.0 开源，但下载的内容版权属于原平台和创作者，个人学习存档与搬运传播是两回事，README 开头的免责声明不是客套话。

总体看，res-downloader 是一个定位诚实的工具：它不假装「破解」了谁，只是把一项专业技术的门槛抹平了。20.4k Star 里，真正值钱的不是下载本身，而是规则引擎、插件结构和把抓包流程产品化的思路——这部分，比下载到的任何一条视频都耐久。

项目地址：[https://github.com/putyy/res-downloader](https://github.com/putyy/res-downloader)，在线文档：[https://res.putyy.com/](https://res.putyy.com/)。
