---
title: "别再让AI待在聊天框里：这个开源插件把文件夹变成了创作工作台"
cover: /root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/cover-wechat.jpg
source_url: https://github.com/Jackywxsz/DSH-Creator
---

做内容的人，谁没有被工具链折腾过？

脚本在 A 网页里写，成片躺在硬盘，字幕换个网站转录，封面在第三个 SaaS 里生成；发完还得打开四个创作者后台，把播放点赞一个个抄进表格。工具都在劝你「上云」，等你把一整个系列的素材搬上去才发现：正文锁在别人的数据库里，导出的只是降级快照，哪天停服改收费，说没就没。

这周我挖到一个反着来的开源项目：**Jacky Creator**（仓库名 DSH-Creator），DeepSeek Harness 的社区插件，v0.1.0-beta.8，MIT 协议。它的信条只有一句话——**一条片子就是你电脑里的一个普通文件夹，AI 只做文件夹做不到的事。**

我没只看 README，而是把仓库 clone 下来装了依赖、跑了全部测试、通读了 1.7 万行源码。先说结论：这是我最近见过对「AI 边界」最清醒的内容工具。

![Jacky Creator 封面](/root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/cover-wechat.jpg)

## 一、核心设计：文件夹才是唯一真相源

装好之后，你选一个内容目录（默认 `~/Movies/视频项目`），每条内容就是一个 `日期_标题` 文件夹：

![内容文件夹契约](/root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/diagram-folder-contract.png)

`topic.md` 是选题，`script.md` 是脚本，mp4 是成片，srt 是字幕，三张 png 是不同画幅的封面，`公众号文章/` 放图文。文档里有句很硬的话：**磁盘上的文件是准的，插件不负责再读一遍。** 插件自己的状态只存路径、绑定和同步回来的数据，一个字的正文都不存。

这意味着什么？卸载插件，素材一个不少；用 Obsidian、Finder、任意编辑器，照样读写；AI 每次都是真的去列目录读文件，不会拿过期缓存跟你胡说。云端工具是「数据库为准，导出算恩赐」，它是「文件为准，状态只是索引」。

公众号在它的世界观里也不是「第五个视频平台」：文章页读取 script.md，按阅读结构改写成标准 Markdown 写进 `公众号文章/`，图片用相对路径，可以直接丢进 Obsidian MDFlow 排版。换句话说，同一条片子的视频和图文共享同一份脚本资产，不用再来回复制粘贴。

## 二、从灵感到复盘，它想接管的是整条流水线

文件夹只是静态约定，工作台真正解决的是流程问题。它在 DSH 侧边栏放了三个可以共存的工作区：

**内容**是每条片子的检查器，按真实资产分成概览、脚本、演示、视频、字幕、封面、文章七个页签，中间栏能拖宽到 800 像素，右边的对话不用关。**运营**管档期、阶段目标、今日推进和发布后复盘——复盘页有四个固定格子：本次结果、有效做法、存在问题、下一次实验，没有 AI 会话你也能手写保存。**灵感**库记录想法、打标签、分级，确认后一键推进成正式项目。

这里面最容易被忽略的是回流：复盘沉淀的规则会变成「脚本规则」，也就是 AI 下次写 script.md 必须遵守的语气、结构和禁忌。你在对话里说一句「以后口播稿每 15 秒留一个钩子，别用感叹号收尾」，它就存进同一个地方。绝大多数 AI 内容工具是每次从零写 prompt，它是让你的运营经验真的能复利。

它向 Agent 开放 14 个工具，我按职责整理了一张图：

![14个工具与人机边界](/root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/diagram-tools-boundary.png)

最打动我的是它的克制。长任务全部以文件落盘为准：`wait_export` 是等成片文件大小稳定，不是替你导出；字幕先生成稿、强制打开预览，**你确认了专有名词才允许烧录**，而且烧进带 `_subtitled` 后缀的新文件，绝不覆盖原片。所有写操作——选目录、批量重命名、装依赖——一律先预览，你点头才执行；`setup` 工具甚至只接受已经存在的目录，绝不会偷偷给你建文件夹。

有四件事它明说永远不替你做：亲自录制和导出 MP4、确认字幕、核对封面错别字、在各平台点最后那个「发表」。它是工作台，不是自动号。发布数据回收也讲究：每次开一个只读浏览器空间，翻完四个平台的已发布列表把播放赞评写回来就关，90 秒内重复点直接吃缓存；平台上有、本地没有文件夹的，绝不自动建条目。四个平台默认全部不勾选，勾选只代表允许 AI 操作，不代表已经登录。

## 三、实测：351 个测试，全绿

代码撑不撑得起这份克制？我在服务器上跑了一遍完整验证（Node v22.22.0）：

![pnpm test 实测：56个测试文件351个用例全部通过](/root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/diagram-tests.png)

`pnpm install` 39.2 秒装完，`pnpm test` 跑了 31.71 秒：**56 个测试文件、351 个用例全部通过**。点进测试名单更有意思——能力安装、发布晋升、持久化、品牌术语一致性都有覆盖，连 beta.5 踩过的「封面人物贴近边缘被误判为违规」都留了回归测试。运行时依赖只有一个 zod，插件本体非常瘦。

源码里还有个细节：当自家品牌封面 Skill 没有可验证的公开安装源时，设置页就老实显示「缺失」，**不伪造一个一键安装按钮**；非 macOS 环境下 Screen Studio 能力直接标成 unsupported，同时说明其他功能照常可用。这种诚实，在现在的 AI 工具圈里挺罕见的。

## 四、怎么装，谁该等

普通用户不用碰源码：先装 DSH Desktop 2.0.2，在它的内置终端（注意是终端不是聊天框）里执行 `dsh plugin --profile web add jacky-creator`，彻底退出重启，侧边栏左上角出现 Jacky Creator 就成了。npm 通道抽风时，也可以钉死 GitHub Release 里同版本的 tgz 包装。

新会话记得用 standard 或 code 预设——minimal 预设没有文件工具，做不了首次引导。第一句话直接说「帮我配置 Jacky Creator，选好本地内容目录，先预览准备改的设置，确认后再保存」。之后你说内容主题，它就建文件夹、出 topic.md 和脚本初稿；等 Screen Studio 导出成片后说一句「等成片落盘，然后生成字幕和封面」，它就按「等落盘 → 转录 → 预览 → 烧字 → 三画幅封面」的顺序往下推，每一步都在检查器里看得见。字幕转录用百炼的 Key，封面用 ZenMux 的 Key，Key 都由 DSH 凭据服务保管，设置页只显示「已配置/未配置」，不会回读。

![内容生命周期闭环](/root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/diagram-pipeline.png)

我的判断很直接：**Mac 主力、已经在用或想试 DeepSeek Harness 的内容创作者，现在就可以装**，尤其是素材散落五六个 SaaS、在意内容主权的人。往期没剪完的片子也能救回来：打开旧文件夹，让 AI 列一遍缺什么——工程、成片、字幕、封面还是发布标记——缺哪步补哪步，列表状态会跟着实时更新。Windows/Linux 用户先等等——片库脚本能用，但 Screen Studio 录制、Ego 浏览器发版这些 macOS 专属链路等于半残；想要「一句话全自动出片」的也不用来，它明确拒绝替你按发表。另外版本还是 beta.8，beta.7 还做过工具改名的硬切换，升级前记得看 CHANGELOG。代码是 MIT，但名称、Logo、芽仔形象这些品牌资产不随 MIT 授权，二开前单独读 BRAND_ASSETS.md。

AI 内容工具都在比赛谁更「全自动」，这个项目反着走：把内容留在本地，把确认权留给人。比起又一个云端黑盒，我更愿意为这种克制买单。

项目 GitHub 地址：https://github.com/Jackywxsz/DSH-Creator

---

我是 jackssybin，一个只信「自己跑过」的开源/AI 工具实测派。
每次帮你筛一个能真正省钱、省时间的开源项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目地址和完整命令我放在了「**阅读原文**」。

相关阅读：
- [DeepSeek官方出了22份接入指南，覆盖Claude Code到Copilot，配置只要3分钟](https://mp.weixin.qq.com/s/4lZbySSLYj2aj-y-DIV7ZA)
- [用了 Claude Code 半年后，我换成了这个完全开源的终端编码 Agent](https://mp.weixin.qq.com/s/_2gkNg1fECDEM62GNbTy9w)
