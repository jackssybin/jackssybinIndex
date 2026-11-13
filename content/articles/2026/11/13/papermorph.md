---
title: "Papermorph 实测：4 个官方案例与 4 个本地原创试样"
date: 2026-11-13
slug: papermorph
draft: false
categories: ["开源项目", "AI工具"]
tags: ["Papermorph", "开源", "AI工具", "互动课程", "内容生产"]
cover: "/images/papermorph/cover-zhihu.png"
description: "Papermorph 安装与三端实测：核对线性代数、纸偶绘本、纪录片和历史地图四个官方案例，并在本地制作四个中文原创试样，实际导出截图、带配音 MP4 与字幕。"
---

一份线性代数 PDF，想变成学生愿意打开的课，通常要拆章节、写讲解、画图、配音，再考虑练习和网页发布。故事、纪录片和历史内容也类似：素材可能已经在手里，麻烦的是把它们组织成别人能看、能听、能操作的作品。

[Papermorph](https://github.com/DozenTwelve/Papermorph) 想接手的是这一整段流程。它是一个给编程智能体使用的开源技能，可以把教材、故事、书籍或观点做成带动画、旁白和互动的静态网页，也能导出 MP4 与字幕。

我打开了它的四个官方案例，并核对了本机安装的技能文档和初始化脚本。最吸引我的不是“AI 又学会做一种视频”，而是这些案例都能作为完整作品存在：有章节，有统一的播放器，有声音与画面的同步，也有些地方必须让读者亲自参与。

下面不看虚构的客户故事和效率数字，只看四个已经上线、可以亲自打开的案例。

## 不只截图官方页面：本地真的做了四个

为了验证安装后能否实际制作，我又在本机写了四个原创中文最小试样。画面由代码绘制，旁白使用 Edge TTS，没有调用付费 API。下面的截图与 MP4 都是本地真实导出，不是官方素材。

### 本地试样一：三个平面，一个公共解

三个三元一次方程变成三个半透明平面，公共交点 `(1, 2, 3)` 随后出现；网页版还有两道检查题。

![本地制作的线性代数互动课](/images/papermorph/local-linear-algebra.png)

<video controls preload="metadata" playsinline style="width:100%;max-width:960px" src="/videos/papermorph/linear-algebra.mp4"></video>

[播放器未显示时，直接打开 MP4（约 33.47 秒）](/videos/papermorph/linear-algebra.mp4)

### 本地试样二：小马过河纸偶绘本

小马、老牛与河边纸景都由代码绘制，带中文角色配音、走路、眨眼、摆尾、抬蹄与水纹。

![本地制作的小马过河纸偶绘本](/images/papermorph/local-little-horse.png)

<video controls preload="metadata" playsinline style="width:100%;max-width:960px" src="/videos/papermorph/little-horse.mp4"></video>

[播放器未显示时，直接打开 MP4（约 23.69 秒）](/videos/papermorph/little-horse.mp4)

### 本地试样三：从放逐到拘禁

这段《疯癫与文明》主题纪录片用原创 SVG 城镇、船、高墙和概念卡，提出“谁有权划分正常与异常”的问题。

![本地制作的《疯癫与文明》短纪录片](/images/papermorph/local-madness.png)

<video controls preload="metadata" playsinline style="width:100%;max-width:960px" src="/videos/papermorph/madness.mp4"></video>

[播放器未显示时，直接打开 MP4（约 45.58 秒）](/videos/papermorph/madness.mp4)

### 本地试样四：欧洲思想史互动地图

1919—1929 年，海德格尔、维特根斯坦、本雅明和卡西尔沿城市路线移动，每个年份都有事件卡片。这个案例以点击阅读为主，不配语音，也不强行导出线性视频。

![本地制作的欧洲思想史互动地图](/images/papermorph/local-magicians.png)

地图底图来自 Natural Earth，现代国界仅作定位。四个试样的源码、整套截图、视频与复现命令保存在 `local-demos/`。

下面再看四个官方完整案例，它们展示了这些试样继续扩展后的作品形态。

## 案例一：把抽象数学做成能演示、能练习的课

**真实场景：教师或课程作者需要解释三维空间，但不希望学生只看一段无法操作的录像。**

Papermorph 官方的 [Linear Algebra 第 12 章](https://papermorph.diamonddoge.org/linear-algebra/ch12/) 叫 *Three Planes, One Point*，讲的是三个三元方程如何对应三个平面，以及它们为什么共享一个解。

页面标注约 14 分钟，共 21 步。我打开第 6 步时，方程、候选解的代入判断和三维平面出现在同一套讲解里。后面的进度条还列出了 Quick check、Chapter practice 和 Playground。

![Linear Algebra 第 12 章：方程、解与三维平面](/images/papermorph/case-linear-algebra.jpg)

这个案例说明，Papermorph 的课程不是把 PDF 文本塞进视频模板。它会把解释拆成一串可前进、可回退的步骤，并在其中安排检查与练习。官方 README 还列出了整套 Linear Algebra 的 40 章；这个数量来自项目方，本文只逐页核对了第 12 章。

对数学老师来说，价值不在“少剪一条视频”，而在于讲完以后，学生仍能拖动、答题和复查。视频导出来后，这些操作反而会消失，这一点后面还会提到。

## 案例二：把儿童故事做成纸偶绘本，而不只是配图朗读

**真实场景：儿童内容作者已有故事，想让人物表演起来，并在阅读中加入简单互动。**

官方的 [《小马过河》第 1 集](https://papermorph.diamonddoge.org/little-horse/ch01/) 标注约 4 分钟，共 9 个场景，从 Home、By the river 到 Uncle Ox、Squirrel 和 At the mill。

![《小马过河》纸偶绘本场景](/images/papermorph/case-little-horse.jpg)

人物和场景采用纸偶式的分层表达。根据官方文档，这个案例还包含角色配音、音效、音乐，以及让孩子根据提示在画面里找人物的 listen-and-find 环节。技能说明注明，角色声音使用了 ElevenLabs，因此“绘本完全免费生成”并不是准确说法。

我在自动化浏览器里打开了河边场景，但这次环境没有成功播放声音，所以我不把“听过配音”或“玩过全部互动”写成实测结论。页面本身和官方文档能确认的是：Papermorph 给绘本作者准备的不只是图片生成，还包括纸偶、场景、口型、声音与找物互动的制作工具。

## 案例三：一本书做成纪录片，再拆成手机端短片

**真实场景：知识类创作者围绕一本书制作长内容，同时希望把同一主题分发到竖屏平台。**

[Madness and Civilization](https://papermorph.diamonddoge.org/madness/) 的官方系列页提供了一部约 10 分钟的纪录片，也列出了 4 集竖屏短片：*The Ship*、*Locked Up*、*Liberation*、*The Last Voices*，每集标注 2 分钟。

![《疯癫与文明》网页纪录片](/images/papermorph/case-madness-documentary.jpg)

这个案例更接近内容团队的真实工作：长片负责完整论证，短片分别抓住一个场景或判断。系列页还公开了素材与许可信息，图片和音乐包括来自 Wikimedia Commons 的 public domain、CC0 作品；声音使用 ElevenLabs，部分线稿和动画也标明了图像模型与视频模型的参与。

我喜欢这种把来源摆在明面上的做法。公共领域图片不是“随便搜一张古画”，作曲进入公共领域也不等于某份录音可以任意使用。Papermorph 提供了查找和记录素材的工具，但最终发布前的版权判断仍然属于作者。

## 案例四：把一段思想史放进能逐年探索的地图

**真实场景：历史或人文作者需要同时交代时间、地点和人物，不愿把这些信息挤成长篇脚注。**

[Time of the Magicians](https://papermorph.diamonddoge.org/time-of-the-magicians/) 把欧洲 1919—1929 年做成互动地图。页面上有 Wittgenstein、Heidegger、Benjamin、Cassirer 四位哲学家的入口，读者可以切换年份，也可以点击人物查看或收听当年的经历。

![Time of the Magicians 互动历史地图](/images/papermorph/case-time-of-the-magicians.jpg)

我在页面上从 1919 切换到 1920，年份与地图内容随之更新。页面底部保留了 Sources and credits，能继续追查地图、音乐和历史图片的来源。

它和前三例很不一样：这里没有要求读者按固定顺序看完一部片，而是把资料组织成一张可以自己探索的页面。对历史、地理、博物馆和年鉴类内容，这种形式往往比把全部信息念一遍更自然。

## 它背后的关键，不是“生成”，而是同步与维护

四个案例的形态差异很大，底层却有相同的制作思路。

### 1. 用 beats 对齐旁白和画面

Papermorph 把横屏作品放在 1600×900 的 SVG 舞台，竖屏短片放在 900×1600 舞台。每个 beat 将一段旁白与一组定时动作配对：说到哪个词，哪个图形出现、移动或改变。

这解释了它为什么适合公式、地图和图解。画面不是视频生成模型凭空猜测的一段连续镜头，而是可以按时间轴检查和修改的网页对象。错了，可以回到对应步骤修。

### 2. 用 style.json 保持整本书一致

开始制作前，技能会询问受众、画风、声音和模型选择，并把决定写入 `style.json`。后续章节沿用这些设置，不必每次从零描述风格。

这也是它与“每次单独生成一条视频”的差别：章节之间需要共享角色、配色、声音和播放器行为。对一本有几十章的书，维护一致性比一次生成足够惊艳的开场更重要。

### 3. 每本书保留自己的引擎副本

官方文档说明，每本作品都会保留一份播放器引擎。这个设计不显眼，却很实用：上游引擎继续更新时，旧作品不会因为共用全局脚本而突然改变行为。需要升级时，再由作者主动同步。

项目还把 `books/`、`content/`、`tools/` 与最终交付的 `site/` 分开。原 PDF、分镜、语音缓存和检查证据留在制作目录，公开网站只拿需要的 HTML、JS、CSS、图片与音频。

## 网页和视频，应该各管一段

Papermorph 的成品是静态网页，不需要应用后端、数据库或账号系统，阅读进度保存在浏览器本地。它可以部署到常见静态托管服务；本地预览时仍应通过 HTTP 服务打开，不能把“静态网站”理解成双击 HTML 就能正常播放所有音频。

章节也能导出 1080p MP4 和 SRT，竖屏作品可输出 1080×1920。可是课程的答题、地图的点击和绘本的游戏依赖网页。官方导出说明明确写着：课程视频会省略需要读者操作的题目。

所以更合理的使用方式是：网页承担学习与互动，MP4 承担平台分发。只导出视频，会丢掉这个项目很有辨识度的一部分。

## 想自己试，建议只做一个章节

Papermorph 代码采用 MIT 许可证。官方为 Claude Code 和 OpenCode 提供的安装命令是：

```bash
npx skills add DozenTwelve/Papermorph --skill papermorph --agent claude-code
# OpenCode 改用 --agent opencode
```

Codex 用户可以把仓库中的 `.claude/skills/papermorph` 安装到自己的 Codex skills 目录。安装后，直接用自然语言描述任务即可，不必照搬其他客户端的 `/papermorph` 命令。

运行时会用到 `uv`、FFmpeg 和 Playwright 浏览器：

```bash
uv run --with playwright playwright install chromium firefox
```

第一段提示词可以这样写：

```text
请使用 papermorph，把这份教材做成中文互动课程。
受众是初学者，先只做第 1 章，加入动画、旁白和两道检查题。
开始制作前先让我确认画风、声音和章节方案，不调用付费 API。
```

先确认试样，再决定是否继续。官方技能文档也把生成章节称为 first cut，需要检查空白画面、文字遮挡、字幕同步、浏览器错误和内容准确性。不要一开始就把整本 PDF 丢进去批量生成。

## 费用和边界，最好提前知道

- Edge TTS 可联网生成旁白，Kokoro 可在本地运行；ElevenLabs、部分 AI 绘画和图生视频属于可选付费步骤，可能需要 API Key。
- 使用编程智能体制作章节也会消耗模型额度。复杂插画、长篇旁白和多轮审看都不是“零成本”。
- 技能负责生成可运行文件，网站托管、书架注册和正式发布是后续工作。
- 原教材、图片、录音与音乐的授权要分别核查。代码是 MIT，不代表你喂进去的材料自动获得发布权。

## 谁适合试，谁可以先等等

如果你在做系列课程、儿童绘本、知识纪录片或人文地图，而且需要多章节统一风格、旁白同步和网页互动，Papermorph 值得用一个章节做试验。

如果你只想输入一句话，尽快得到一条能发出去的视频，它未必是最省事的工具。分镜、风格确认、素材授权和审看都要花时间；省掉这些步骤，也就失去了它的部分优势。

我更愿意把 Papermorph 看成一套互动书的制作框架，而不是又一个“AI 出片按钮”。官方案例展示了完整作品形态，本地四个试样则验证了从中文内容、动画与配音到截图和 MP4 的实际流程。你的材料是否适合、成本能否接受，仍要用自己的第一章来回答。

## 来源与案例入口

- [Papermorph GitHub 仓库](https://github.com/DozenTwelve/Papermorph)
- [Linear Algebra：Three Planes, One Point](https://papermorph.diamonddoge.org/linear-algebra/ch12/)
- [The Little Horse Crosses the River](https://papermorph.diamonddoge.org/little-horse/ch01/)
- [Madness and Civilization](https://papermorph.diamonddoge.org/madness/)
- [Time of the Magicians](https://papermorph.diamonddoge.org/time-of-the-magicians/)

案例数据与页面状态核验于 2026-11-13。本地试样于同日实际生成并检查；未使用付费 API，未声称完成整本课程、整集绘本或完整长纪录片。
