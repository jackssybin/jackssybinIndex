---
title: "7 万 Star 的爬虫一哥 MediaCrawler：我读完 3.3 万行代码，也把它的合规坑摊开讲"
cover: /root/jackssybinIndex/content-ops/mediacrawler-architecture-teardown/media/cover-ip.jpg
source_url: https://github.com/NanmiCoder/MediaCrawler
---

今年 6 月我写过一篇 MediaCrawler 入门教程，那时候它 1.3 万 Star。四个多月过去，这个数字变成了 **7 万**——中文爬虫项目里当之无愧的头部。

那篇讲"怎么装、怎么跑"。今天换个角度：我把仓库完整拉下来通读了一遍，约 **3.3 万行 Python**，认真回答两个问题——**它的代码架构到底值不值得学？以及，用它的法律边界到底在哪？**

第二个问题，可能比第一个重要得多。

## 它解决的核心难题：不逆向，也能拿到签名

七个平台（小红书、抖音、快手、B 站、微博、贴吧、知乎）的爬虫，传统做法的噩梦是 JS 逆向：每个平台都有自己的签名算法，参数一改全站脚本作废，门槛高、维护累。

MediaCrawler 的取舍很干脆：**放弃逆向，让浏览器自己算。** 用 Playwright 起一个真实浏览器，你自己扫码登录，程序在这个带登录态的浏览器上下文里执行 JS，直接把页面环境算好的签名参数取过来发请求。不是黑科技，但把逆向工程师的活降到了会 Python 就能上手——这就是 7 万 Star 的底层原因。

## 架构：一套抽象，七个同构实现

![MediaCrawler 分层架构与数据流](/root/jackssybinIndex/content-ops/mediacrawler-architecture-teardown/media/architecture.png)

**第一层是模板方法。** 所有平台爬虫都继承 `AbstractCrawler`，抽象方法钉死了 `start`、`search`、`launch_browser` 这些骨架，登录还有单独的 `AbstractLogin`（扫码/手机号两条路）。父类定流程、子类填差异，七个平台的代码读起来结构完全一致，看懂一个其余六个平移。

**第二层是平台内的五件套。** 每个平台目录都是同构的：`core.py` 编排主流程状态机，`client.py` 封装 HTTP 接口，`login.py` 管登录态缓存，`sign` 模块在浏览器里执行 JS 取签名，`extractor` 负责把平台 JSON 映射成统一数据模型。还专门用 `exception.py` 把错误码翻译成语义化异常——IP 封了、笔记不存在、权限不够，各有各的异常类，比满屏判断状态码干净。

**第三层是存储工厂。** 一个配置项 `SAVE_DATA_OPTION` 在 csv、json、jsonl、sqlite、postgres、mongodb、excel 共 **8 种后端**之间切换，爬取逻辑和存储完全解耦。新手最值得抄走的就是这个设计：永远别在业务代码里直接 open 文件写。

横切能力也齐：代理池开关、httpx+tenacity 异步重试、异步文件写入。还有个容易被忽略的细节——`tools/user_hash.py` 内置了用户 ID 匿名化和昵称打码，落库前主动做隐私处理。写爬虫时自带这层意识，比同类光着身子存数据的项目强。

## 今年最大的升级：CDP 接管真实浏览器

![Playwright 模式与 CDP 模式对比](/root/jackssybinIndex/content-ops/mediacrawler-architecture-teardown/media/cdp-mode.png)

普通 Playwright 自己启动的浏览器带自动化指纹（`navigator.webdriver=true`），风控容易认出来。现在仓库默认开启的 **CDP 模式**换了思路：直接接管你日常用的那个 Chrome——你的扩展、Cookie、历史记录、真实指纹全都在。

操作上是 Chrome 144 以上打开 `chrome://inspect` 勾选远程调试，9222 端口就绪后程序连入，**首次连接会弹确认框、60 秒手动接受**，不存在静默接管。工程上更成熟的一点是：基类给了默认回退实现，CDP 连不上自动降级回标准 Playwright，调用方代码一行不用改。新能力以可选增强接入，而不是推翻重写——这是成熟项目的演进方式。

## 泼冷水时间：三个入门教程不会重点讲的坑

### 一、它严格说不是"开源软件"

![合规三层判断框架](/root/jackssybinIndex/content-ops/mediacrawler-architecture-teardown/media/compliance.png)

GitHub 上它的 license 字段是 `NOASSERTION`，实际是作者自撰的 **NON-COMMERCIAL LEARNING LICENSE（非商业学习许可）**，三条硬限制：仅限非商业学习研究、禁止大规模爬取和干扰平台、商用必须拿到书面授权。

意思很直白：公司里拿它做竞品分析、做数据产品、接进商业系统，哪怕内部用，都在禁止区。MIT/Apache 那种"随便用"的自由不存在。技术选型时，这条的权重应该排在架构优点前面。

### 二、开源版和 Pro 版是两个产品

README 折叠区在推的 MediaCrawlerPro 是**闭源付费**的。开源版明确没有：断点续爬、多账号调度、去 Playwright 的轻量方案、完整 Linux 支持。跑一半断网重来的成本不低，而这些恰好是生产环境最需要的。看 docs 目录里还有代理服务商和知识付费的导流，理解这个商业化结构，你就明白哪些能力是刻意留给付费版的。

### 三、法律红线是真的，不是免责声明走过场

国内爬虫入刑的判例集中在四类：破解绕过反爬措施、采集登录后的非公开数据、涉及公民个人信息并扩散、高频请求搞挂平台服务。

技术事实也要讲清楚：它采集的是**你本人登录后有权看到的内容**，没有破解加密、没有伪造凭证，签名是浏览器在正常环境里生成的，这和盗号撞库有本质区别。但"技术上没破解"不等于"怎么爬都合法"——频率、用途（尤其商用和二次分发）、个人信息，任何一条越界性质就变。相对安全的姿势就八个字：**低频、公开、本机、学习。** 真有商业数据需求，走平台官方 API 或有授权的数据服务商。

## 所以，值不值得学？

分两层看。

**作为学习素材，非常值得。** 抛开采集本身，这是一份高质量的 Python 异步工程教材：模板方法加策略工厂、七平台同构目录、异常语义化、八后端存储抽象、CDP 接管与优雅降级。3.3 万行能学到的工程模式，比绝大多数脚本合集扎实。

**作为生产工具，极度谨慎。** 非商业协议封死商用，开源版缺生产特性，法律风险不会因为"大家都在用"而消失。

它的 7 万 Star，我觉得一半给"免逆向采七平台"这个点子，另一半给这套架构。前者带着争议，后者经得起读。

---

我是 jk，一个只信「自己跑过」的开源/AI 工具实测派。
每次帮你筛一个能真正省钱、省时间的开源项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目地址我放在了「**阅读原文**」。

相关阅读：
- [找了半年终于找到：全平台媒体下载神器开源了](https://mp.weixin.qq.com/s/QNmVOYyRHlwX94PDQZmlnw)
- [30MB 内存替代 Chromium！这个开源 Rust 无头浏览器太香了](https://mp.weixin.qq.com/s/8CtFLrv-MO_ljIuRA4yJlw)
