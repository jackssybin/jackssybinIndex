# MediaCrawler 架构拆解 三端推广 — 发布结果（同项目第二篇）

项目：https://github.com/NanmiCoder/MediaCrawler
数据基准：2026-11-05（GitHub API：70,232 Star / 13,308 Fork / 220 open issues）
建仓 2023-06-09；Python，约 3.29 万行；七平台（xhs/douyin/kuaishou/bilibili/weibo/tieba/zhihu）
**协议：NON-COMMERCIAL LEARNING LICENSE 1.1（GitHub 标 NOASSERTION，非 OSI 开源）——禁商用、禁大规模爬取**

## 与旧稿的关系（避免重复）

- 旧稿（2026-06-27，1.3 万 Star 时）：`content/articles/2026/06/27/mediacrawler-multi-platform-crawler-tutorial.md`，入门安装教程
- 本篇角度：**架构深度拆解 + 合规祛魅**（模板方法/五件套/存储工厂/CDP 模式/许可证真相/Pro 闭源边界/法律红线），slug 完全独立，文中链接回旧教程
- 新事实点（旧稿没有）：CDP 接管真实浏览器（现默认 ENABLE_CDP_MODE=True，Chrome 144+ 9222 端口+60 秒确认框+基类回退）、webui/、user_hash 匿名化、8 种存储后端、Pro 版能力差、NOASSERTION 协议定性

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/11/05/mediacrawler-architecture-teardown.md`
- URL：https://jackssybin.cn/articles/2026/11/05/mediacrawler-architecture-teardown/
- 正文图 3：architecture / cdp-mode / compliance；hugo exit 0；已推送（commit 5b65ff1）

## 2. 微信公众号草稿

- 标题：《7 万 Star 的爬虫一哥 MediaCrawler：我读完 3.3 万行代码，也把它的合规坑摊开讲》
- newsroom；draft media_id：`snS2bupQYF7HgHImnpl8sX1EeCX75YNAsqezWiIe6rXci2Jl8erurz3XeNLYFz4h`
- 封面：**cover-ip.jpg（冷白 paper + 生气表情 + 暖橙，verify_wings rc=0 + vision）**；random 三候选自动选 c2（上一篇 agent-desktop 是米黄，自动错开），已记 combo-history
- 三必查：正文图 3、jk 引流+阅读原文(→GitHub)+相关阅读 2（全平台下载神器、Rust 无头浏览器）
- digest 106 字 errcode 0（首版 129 字超限精简）
- 状态：草稿未群发

## 3. 知乎专栏草稿

- 标题：《7万Star的MediaCrawler架构拆解：值得学的工程模式，与它刻意低调的合规边界》
- URL：https://zhuanlan.zhihu.com/p/2101752211466470427 （+/edit）
- compact HTML：图 3（content_image=3）+ pre 3（python 基类/存储工厂/文本流），ul2/ol2 配平，无 `<table>`（md 内表格转写为段落叙述）
- CDN：cdp picx…0496 / arch pic1…f3e7 / comp pica…9ea1
- 标题封面需编辑器手动选 cover-zhihu.png
- zhihu-cache 临时图片草稿需后台清理
- 状态：草稿未发布

## 4. 配图

- 冷灰蓝技术档案风（钢蓝+琥珀+铜青+警示红），刻意避免诱导采集的视觉
- compliance 图首版左卡「GitHub 标注 NOASSERTION，非 OSI 开源协议」超宽被裁（vision 抓出），拆两行+全图字号 19→18 复检通过
- 4 图全部 vision 验收

## 5. 合规处理（本篇核心差异点）

- 全文明确定性：非 OSI 开源（NOASSERTION/自撰非商业许可），禁商用、禁大规模爬取、Fork 可以商用不行
- MediaCrawlerPro 闭源付费与开源版能力差（无断点续爬/多账号/去 Playwright）如实披露，提示 docs 导流结构
- 法律部分只讲已公开的入刑类型与相对安全姿势（低频/公开/本机/学习），不提供任何绕过、采集操作指引；文末再次声明仅为架构学习笔记
- 数据均来自 GitHub API、LICENSE、仓库源码与 docs，无虚构
