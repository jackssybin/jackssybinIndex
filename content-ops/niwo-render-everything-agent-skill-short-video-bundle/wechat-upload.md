---
title: 把 PDF 丢给 Agent 就出短视频素材包？我读完这个 130 star 开源 Skill 的全部定义文件
cover: /root/jackssybinIndex/content-ops/niwo-render-everything-agent-skill-short-video-bundle/media/cover-wechat.jpg
source_url: https://github.com/MontageAI/niwo-render-everything
---

# 把 PDF 丢给 Agent 就出短视频素材包？我读完这个 130 star 开源 Skill 的全部定义文件

你大概率也对 AI 说过这句话：「帮我把这篇论文做成一条 90 秒科普短视频」。

普通对话框的套路你很熟：甩给你一段口播稿，再附一串素材链接，然后——就没有然后了。图不会下载，镜头不会裁，没有任何东西能直接拖进剪辑软件。

这周翻到一个开源项目 niwo-render-everything，GitHub 一百多 star，8 月 10 日才建仓。它不是视频模型，也不是网页工具，而是一个装进 ChatGPT 工作模式、Codex、Cursor、Claude Code 的 Skill。我把仓库克隆下来，通读了 425 行 Skill 定义、两份字段协议、689 行校验脚本，这篇讲讲它到底替你干了什么，以及哪些设计值得抄作业。

## 一、最反直觉的一点：它故意不帮你出成片

大多数 AI 视频工具都想端到端：喂内容，吐成片。这个项目反着来，README 第一屏就把边界画死——**Agent 产出的 zip 不是成片，是渲染管线的输入**。

![两段式流水线：Agent 六步产 zip，工作台负责渲染](/root/jackssybinIndex/content-ops/niwo-render-everything-agent-skill-short-video-bundle/media/diagram-pipeline.png)

左半边在你的 Agent 里跑：先提问定稿口播，再把真实图片和 B-roll 视频**下载到本地**（不是给链接），用 ffmpeg 裁成 8 到 12 秒的短镜头，写两份协议文件，跑自校验，打包 zip。右半边在 Niwo 视频工作台里做：选形态、配音、BGM、音效、IP 形象、字幕，点渲染出片。

为什么这么切？因为内容判断（讲什么、用什么画面）适合放在能读材料、能跑脚本的 Agent 里；而音色、模板、渲染模型这些参数变化快、Agent 也没有判断依据，应该留给带界面的产品端。一个内容包，能在工作台渲染成竖屏信息版、竖屏、横屏三种片子。

## 二、7 个字段的封闭协议，多写一个直接报错

让我确认它不是「提示词套壳」的，是这份严格到苛刻的协议。content.json 只接受 7 个字段，多一个键直接校验失败。

![content.json 七字段协议，渲染参数一律拒收](/root/jackssybinIndex/content-ops/niwo-render-everything-agent-skill-short-video-bundle/media/diagram-schema.png)

必填只有三个：版本号、标题、口播正文。其余按条件出现。文档里一句话值得划重点：**成片形态、音色、BGM、IP 形象、渲染模型，全部由用户在工作台选，Agent 写了只会被「未知字段」拒收。**

口播文案的约束也很产品化：这段文字会被逐字朗读成配音、逐字显示成字幕，平台不会替你改一个字，所以标题、镜头说明、emoji 一律不许有。时长也没有别的旋钮——中文原速约每秒 6 字，90 秒就是 540 字左右，写多少字，片子就多长。

还有个细节：多音字要手动注音，「调用量」的「调」得标成 `diao4`，不然 TTS 会读成 tiáo。

## 三、最容易写反的地方，标题和形态是双向绑定

三种成片形态里，竖屏信息版是默认推荐：9:16 画布中间嵌一块横屏内容，顶部有大标题。钩子标题 hook_headline 只服务这条标题带，而且和形态双向锁死，两个方向都会出事。

![三形态与 hook_headline 的绑定规则](/root/jackssybinIndex/content-ops/niwo-render-everything-agent-skill-short-video-bundle/media/diagram-formats.png)

做信息版却漏了标题：开场顶部整块空白；做竖屏、横屏却多写了标题：画面上不显示，还会把渲染界面的形态初值拧成信息版，跟你刚选的对着干。

标题长度按**字宽**而非字数算，中文占满宽、英文数字只算 0.56，超过 12 字宽告警、超过 14 直接失败。这些规则在 689 行的校验脚本里是用正则和常量真实现的，不是文档吓唬人。

## 四、本地校验器和退出码，两个工程细节

那个 689 行的 `validate_bundle.py` 纯用标准库写成，规则和服务端严格对齐：报错的项服务端一定拒收。它查字段、查文件对应关系、查视频选段是否落在真实时长内，甚至能识破「下载失败结果拿到一个 HTML 错误页」。

另一个意外是版本自检的**退出码协议**。开工前跑一次检查，不靠文字、靠退出码：

- 0：已是最新，直接干活；
- 3：离线没查成，当最新，不许重试卡住用户；
- 10：有新版，问用户要不要更；
- 20：低于最低兼容版本，必须先更新。

还规定一次任务只查一次——素材下到一半不许中途升级，因为旧协议做的半成品不会自动迁移。

## 五、素材清单也有协议，一个坑专门防「片头杀」

除了 content.json，另一份 manifest.json 管素材。它同样是封闭字段：file 必须是相对路径且不能重复声明；summary 是单行中文，只描述画面里**看得见**的东西，不许写你的解读；tags 两到五个；script_anchor 从口播里原样摘一句，提示这段素材适合配在哪句话旁边。

素材工作量给了经验值：一到一分半的片子，通常 20 到 30 张图加 8 到 10 段视频。它强调要下载**真实素材**，明确不要原创动效、不要前端渲染的概念动画、不要把视频抽帧当图片。因为导入素材包后，Niwo 不会再联网补空镜——你交的就是成片全部画面来源。

这里有个写进文档的实战坑：如果你交的是长原片，又写了说明和标签，却没填选段起止秒数，系统会认为你已经挑好镜头，直接从第 0 秒开始取——大概率取到片头台标。正确做法要么用 ffmpeg 自己裁好（推荐，一条命令的事），要么老老实实填上 clip_start_seconds 和 clip_end_seconds。

还有个反「AI 自作主张」的交互设计我很喜欢：开工前它必须在同一轮问完五个独立维度——形态、时长、受众、口吻、必讲信息点，不许合并，不许靠历史记忆替你默认，只有你明确说「你定」它才能拍板，而且用了兜底值必须明说。

## 六、怎么跑起来：先确认你的 Agent 够格

安装简单得反常：不用开终端，在 Agent 的**工作模式**里发一句「帮我安装这个 Skill：GitHub 上的 MontageAI/niwo-render-everything」就行；命令行党也可以 `npx skills add`。

![ChatGPT 普通聊天要先分支到工作模式](/root/jackssybinIndex/content-ops/niwo-render-everything-agent-skill-short-video-bundle/media/chatgpt-branch-work.png)

但有三个硬门槛，缺一个都跑不完：能把文件下载到本地、能跑 shell 且装了 ffmpeg、能打包 zip。这就是为什么普通聊天框和手机助手装了也白装——它们下不了图、跑不了 ffmpeg。官方实测过的只有 ChatGPT 工作模式和 Codex。

拿到 zip 后下载到本地、上传工作台，走选素材、确认内容、渲染配置三步就出片。

![Niwo 视频工作台：选成片形态、配音、背景音乐后开始渲染](/root/jackssybinIndex/content-ops/niwo-render-everything-agent-skill-short-video-bundle/media/niwo-studio.png)

另外要泼两盆冷水：工作台现在**内测**，没账号得先去领邀请码和试用积分；README 打了 MIT 徽章，但仓库里目前没有 LICENSE 文件，想商用二改最好先提 Issue 问清楚。

## 七、谁该现在用，谁先等

适合立刻试：已经在用 ChatGPT 工作模式或 Codex、本机会装 ffmpeg 的人；需要把论文研报新闻**批量**转口播视频的内容团队；喜欢「内容和渲染解耦」、协议文件能读能 diff 的工程型用户。

建议再等等：只有手机端或普通聊天框的人；期待一句话全自动出片、不想碰任何界面的人（它故意把渲染决策留给你）；需要确定性商用授权的团队。

我读完整仓库最大的收获反而不是做视频：它示范了一种 Agent Skill 的设计范式——**用封闭 schema 划清 Agent 能决定什么，用本地校验前置拦截错误，用退出码管理版本兼容，用强制提问防止 AI 替用户做决定。** 哪怕你不做短视频，只要在做「Agent 产出结构化交付物」，这四条都值得抄。

项目地址我放在「阅读原文」了。

---

我是 jackssybin，一个只信「自己跑过」的开源 / AI 工具实测派。
每次帮你筛一个真正省钱、省时间的开源项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目地址和完整命令我放在了「**阅读原文**」。

相关阅读：
- [剪映逼我开会员后，我找到了这个免费工具](https://mp.weixin.qq.com/s/bkYGzCKGOoT9AEtq1fnqMQ)
- [受够了 AI 画的"圆角方块垃圾图"？这个 3.1 万 star 的 Skill](https://mp.weixin.qq.com/s/zrdPmMWlXDrhVmPbWByLXQ)
