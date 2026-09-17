---
title: "把中文故事丢给 Agent，自动出 1080×1440 手绘日记动画：我克隆实测了这个 2 千 star 开源 Skill（含一个 README 没说的坑）"
date: 2026-09-17T12:30:00+08:00
lastmod: 2026-09-17T12:30:00+08:00
slug: story-to-handdrawn-video-agent-skill
draft: false
description: "story-to-handdrawn-video 是 gnipbao 开源的 Agent Skill：把中文故事文案或一组有序手绘图片，转成 3:4 竖屏手绘日记动画，1080×1440、30fps、H.264 静音画面轨，内置 20 种画风。它不是一个脚本，而是 Remotion 渲染器（React 19 + Remotion 4.0.487）加可分发 Skill 的两段式工程，用 text→黑白稿→彩色稿从左到右擦除的统一动画语法，默认 Codex Image2 出图、本地 FFmpeg 派生黑白层，中文走马善政毛笔字体渲染以保证零错字。我在全新 clone 上实测 npm ci、plan、build 全部跑通，同时发现一个 README 没提的真实缺陷：npm run check 在干净克隆上退出码 1——自带 storyboard 引用了被 gitignore 的生成资产。本文给出完整流水线、20 风格家族梳理、输出契约和规避方法，以及谁该用谁该等的判断。"
tags: ["开源", "AI视频", "Agent", "Remotion", "手绘动画", "Codex", "内容创作"]
topic: "开源项目"
topicSlug: "open-source"
layout: article
contentType: article
type: article
cover: "/images/story-to-handdrawn-video-agent-skill/cover-zhihu.png"
---

# 把中文故事丢给 Agent，自动出 1080×1440 手绘日记动画：我克隆实测了这个 2 千 star 开源 Skill（含一个 README 没说的坑）

短视频里最受欢迎的一类内容，是那种像翻手绘日记一样的动画：上方手写字幕，下方彩铅或蜡笔画一笔一笔揭开，画面拙、留白多，情绪比精美动画还抓人。但做一条这样的片子，正常流程要画分镜、逐张插画、对齐字幕、调转场、渲染——一个熟手也要大半天。

[story-to-handdrawn-video](https://github.com/gnipbao/story-to-handdrawn-video) 想做的事情很直接：**你把一段中文故事（或一组按顺序排好的手绘图片）交给装了 Skill 的 Agent，它分句、分镜、出图、合成，最后吐出一条 1080×1440 的竖屏 MP4**。2026 年 7 月底开源，一个月左右攒到近 2000 star。它到底是「一句话出片」的魔法，还是又一个 demo 好看、上手翻车的玩具？我把仓库完整克隆下来，按 README 的安装步骤逐条真跑了一遍。先给结论：**核心设计是认真的，主流程能跑通；但它也确实有一个 README 没提、全新克隆必现的坑**，文末细说。

## 一、它到底是什么：不是脚本，是「渲染器 + Skill」两段式工程

先纠正一个常见误解。很多人看到「Skill」以为它是个提示词合集，其实仓库里是两个解耦的部分：

![两段式工程：Agent Skill 层、Remotion 渲染器层、输出契约](/images/story-to-handdrawn-video-agent-skill/diagram-pipeline.png)

- **渲染器项目（仓库根目录）**：一个正经的 [Remotion](https://www.remotion.dev/) 工程——React 19.2 + Remotion 4.0.487 + TypeScript，510 行 TSX 组件负责分镜、擦除动效和翻页转场，2200 多行 Node/Python 脚本负责分镜生成、图片导入和校验。Remotion 是用 React 组件声明式做视频的框架，所有动效用帧和缓动函数精确描述，可重复渲染、可版本管理。
- **可分发的 Agent Skill（`skill-package/`）**：一份 149 行的行为契约，定义 Agent 拿到故事后该怎么分句、怎么选风格、怎么调渲染器。它可以直接 `cp` 进 Codex、Claude Code、Kimi Code 的 skills 目录，然后你用一句自然语言驱动，不用手动跑任何脚本。

中间的统一入口是 `scripts/run_story_video.py`，支持 `plan / generate / import / render / preview / full` 六种模式——既可以一条龙，也可以只出分镜规划人工确认后再继续。这种「Skill 负责决策、渲染器负责确定性执行」的分层，比把逻辑全塞进 prompt 的做法稳得多：出图可以换模型，但帧率、分辨率、转场这些硬契约永远由代码保证。

## 二、一条片子是怎么诞生的：四步，和一个很克制的输出契约

拿仓库自带示例举例，故事只有两句话：

> 那年夏天，我总爱坐在窗边画画。画里的风筝，比窗外飞得更高。

我实跑 `--mode plan`（不花出图额度，只做分镜规划），它产出了两个关键文件：`storyboard.generated.json`（每句一个 5.3 秒的场景）和给图像模型准备的作业清单 `codex-image-jobs.json`。从产物里能看清它的完整管线：

1. **分句分镜**：默认「一个完整句子 = 一个节拍」，长复合句才在自然叙事转折处拆；原文措辞被原样保留，Agent 不许改写你的文字。
2. **出图作业**：默认走 Codex Image2（不需要 OpenAI Key），只有显式要求时才走 OpenAI API。每个故事先产一张「角色参考表」锁定主角的脸、发型、服装和身材比例，再逐场景出图，解决多场景人物一致性问题。
3. **本地派生黑白层**：彩色稿不画两遍——黑白稿是用 FFmpeg 在本地从彩图派生的（灰度 + 对比度 1.18 + 亮度微调 + unsharp 锐化），天然与彩稿像素级对齐。
4. **合成渲染**：Remotion 输出 H.264、CRF 18、yuv420p，正式 1080×1440（3:4，30fps），预览 720×960。

而它最鲜明的设计选择，是**只交付静音画面轨**：没有配音、没有 BGM、没有音效。DESIGN.md 写得很清楚——voiceover 和 BGM 是后期工作，固定输出文件名（`out/picture_silent.mp4`）就是为了方便你接配音流水线。

## 三、动画语法：为什么「文字 → 黑白稿 → 彩色稿」这个顺序很讲究

这是整个项目最打动我的地方，也是它看起来像「手绘日记」而不是「AI 幻灯片」的核心。

![一个节拍的三层揭示：手写字幕、黑白画稿、彩色插画，全部从左向右擦除](/images/story-to-handdrawn-video-agent-skill/diagram-reveal.png)

每个节拍（beat）严格按三层顺序揭示，且**每一层都从左向右擦除出现**：先是上方安全区的手写字幕（站酷马善政毛笔体，SIL OFL 协议随仓库附带），然后是整幅黑白线稿，最后黑白稿上「长出」彩色插画——模拟的正是手绘时先勾线、再上色的过程。缓动用的是 `smoothstep`（`x²(3-2x)`），起步和收尾都平滑，没有弹跳、没有镜头晃动，DESIGN.md 明确禁止 camera shake / bounce / 卡点音乐这类短视频套路。

两个工程细节值得一提：

- **中文零错字优先**：字幕默认 `--text-mode font`，直接用本地毛笔字体渲染，你的原文怎么写，画面上就是什么字。只有当你明确更想要「图像模型画出来的手写感」时才切 `image2` 模式，并提前告知 AI 生成中文可能有错字需要修。对中文内容来说，这个默认值非常清醒。
- **构图安全**：插画一律 `object-fit: contain` 永不裁剪，所有笔触限制在白色安全边距内；上传的合成漫画页会自动裁出上方文字区和下方插画区，还可以用 `--split-y 场景:像素` 逐页手动修正分割线。

除了直切模式，上传图片还支持**卷页翻书**转场：从右下角向左翻起，弯曲强度按 `sin(π)` 变化，翻起的纸背保留淡化的原页纹理——给的是「翻一本真实画集」的感觉，而不是廉价的 slide 切换。

## 四、20 种画风：真正可比较的风格库，而不是 20 句随机 prompt

v1.1.0（2026-08-08）加的 20 风格库，是它 star 增长的主要推力。可贵的是做法很工程化：

![20 种风格分六大家族：线稿讲解、蜡笔坏画、绘本淡彩、纸本质感、东方笔墨、品牌手绘](/images/story-to-handdrawn-video-agent-skill/diagram-styles.png)

每种风格在 `references/handdrawn-style-library.json` 里都是一份**机器可读配方**：正向视觉语法、负向约束、画材、色板、推荐题材、中英文别名，外加一张用**完全相同的人物、动作、构图**生成的示例图——这意味着你横向比较 20 种风格时，变量只有画材和线条，没有「这张构图好所以显得好看」的干扰。另有一张 20 格总览 contact sheet 一眼看全。

![20 风格总览：同一组人物动作在不同画材下的表现](/images/story-to-handdrawn-video-agent-skill/evidence-contact-sheet.jpg)

我实际挑几张看：默认的「彩铅日记漫画」是笨拙黑色毡尖笔轮廓 + 低饱和彩铅短排线 + 大留白；「水墨写意」要求焦浓重淡清五色俱全、飞白枯笔、角落一枚不可读的朱红印记，并显式声明「不是数字灰度滤镜、不勾死板轮廓」；「白板讲解」则是米白纸 + 细黑单线 + 火柴人，信息读取最快，明显面向知识科普而非情感故事。

![默认彩铅日记风格的质量锚点：三格家庭叙事长卷](/images/story-to-handdrawn-video-agent-skill/evidence-style-approved.jpg)

选择方式也照顾了自然语言交互：`--style` 接受编号、英文 id、中文名或别名，Agent 里直接说「选水墨写意」就行。更关键的是一个防串味设计：**选中风格的配方和参考图会算成指纹，写进生成资产的缓存目录名；换风格必然产生一批新资产，绝不会偷偷复用上一种画风的旧图**。默认风格另有四张人工锁定的参考板（线稿、彩铅技法、构图、最终验收标准），是唯一有固定视觉锚点的风格；其余 19 种走 prompt-lock，且明确禁止继承彩铅看板。配方源自 [threerocks/hand-drawn-styles](https://github.com/threerocks/hand-drawn-styles)，保留了 MIT 署名。

## 五、本机实测：哪些跑通了，哪个坑 README 没说

我在全新 clone（commit `fbab5b2`）上按 README 逐条执行，Node v22、Python 3、FFmpeg、Chrome 齐备：

![本机实测结果：star/风格/代码量/音轨为 0，plan 与 build 通过，check 失败](/images/story-to-handdrawn-video-agent-skill/diagram-audit.png)

- `npm ci`：正常，依赖只有 remotion / react 四个运行时包，比较干净。
- `python3 scripts/run_story_video.py --list-styles`：正常，20 种风格带中文描述全部列出。
- `--mode plan`（示例故事 + 水墨风格）：正常，2 句 → 2 个 5.3 秒场景，分镜 JSON、风格指纹（`5a7d9210946b9ccb`）、角色锁定提示词、Image2 作业清单全部生成，且明确提示 plan-only 不消耗出图额度。
- `npm run build`（Remotion bundle）：正常，exit 0。
- **`npm run check`：失败，退出码 1。** 这就是 README 说「不访问网络、用来验证安装」的那条命令，在干净克隆上必现。

具体原因：`check` 由 `tsc --noEmit` 和 `validate-storyboard.mjs` 组成。TypeScript 检查单独跑是过的（exit 0），但校验器会检查仓库自带的两个示例分镜 `storyboard.json` 和 `storyboard.uploaded.json`，而它们引用的 `public/assets/generated/...` 下每个场景的 `01_text.png / 01_bw.png / 01_color.png` 资产，整个 `public/assets/generated/` 目录都在 `.gitignore` 里（它本来就是运行时产物）。于是校验器报一连串 `missing text_image / bw / color asset`。README 让你用 `npm run check` 验证安装，第一次跑的人大概率会以为自己环境没配好。

**影响和规避**：不影响真正的使用路径——你跑自己的故事时，`plan` 生成的是独立的 `storyboard.generated.json` 和自己的资产批次，渲染走 `run_story_video.py`。期待官方后续要么把示例资产（或最小占位资产）入库，要么让校验默认跳过这两个「历史样例」。在那之前，克隆后直接用 `--mode plan` 冒烟即可，不必被 `check` 的红灯劝退。

另外说清它的能力边界，避免预期错位：它是**画面轨工厂**，不做配音、不做 TTS、不做自动剪辑节奏；出图质量上限取决于 Codex Image2，复杂动作、多人物互动仍建议先用它的「两位场景编号为键的视觉规划 JSON」人工过一遍；仓库很年轻（2026-07-21 才建仓，v1.1.0），正式生产前要锁版本。

## 六、五分钟上手路径与适用判断

最小体验路径（不花任何出图额度）：

```bash
git clone https://github.com/gnipbao/story-to-handdrawn-video.git
cd story-to-handdrawn-video
npm ci
# 先看风格菜单
python3 scripts/run_story_video.py --list-styles
# 只规划不出图，检查 storyboard.generated.json
python3 scripts/run_story_video.py \
  --input examples/story.txt --title "纸上的夏天" \
  --style ink-wash --mode plan
```

确认分镜没问题后，在装了 Skill 的 Codex/Claude Code 里走完整 generate → import → render（图片由 Agent 用 Image2 生成）；已有手绘稿的话直接传一组有序图片，`--mode preview` 先出 720×960 快速版，满意再出 1080×1440 正式版。

**适合现在就用的人：**

- 做情感故事、亲子、睡前故事、文化寓言类短视频/绘本号，需要稳定批量产出「手绘日记」风格画面轨、后期自己配音的创作者——20 风格里彩铅、蜡笔、水墨、绘本这几族就是为这类题材准备的。
- 做知识科普的人：极简线条、小豆人信息图、白板讲解三族直接面向「流程/步骤/观点」，配静音轨后期讲解，比自己画白板动画高效。
- 想研究「Skill 如何工程化驱动一个确定性渲染器」的开发者：这份 SKILL.md 的契约写法（默认值锁定、风格指纹、负向约束、输出契约）是很好的参考。

**建议先等等的人：**

- 追求写实、3D、精美二次元画风的——它的审美刻意「拙」，负向约束里直接排除了平滑矢量、写实光影和厚涂。
- 需要一键成片含配音配乐的——它明确只给画面轨，后面还要接 TTS/剪辑。
- 不愿意装 Node 20 + FFmpeg + Chrome、也不用任何 Agent 运行时的纯小白——它的目标用户就是 Agent 时代的开发者/创作者。

## 结语

story-to-handdrawn-video 最有意思的地方，不是「AI 又能做视频了」，而是它展示了 Agent Skill 的一种正确形态：**把可以确定的东西全部交给代码（帧率、分辨率、转场缓动、字体、安全构图），把需要判断的东西交给 Agent（分句、分镜、选风格、视觉规划），并用人审的 plan 模式把两者隔开**。再加上像素级对齐的黑白层、字体渲染保中文、风格指纹防串味这些被「出过事」才会写的细节，它的成熟度远超一个月项目的平均水平。

那个 `npm run check` 的红灯确实会让新用户迟疑，但它更像是仓库卫生问题而非能力缺陷——作者连「静音画面轨方便后期」这种产品边界都想清楚了，补上示例资产应该只是时间问题。如果你正好在做手绘风格的故事内容，值得克隆下来，先跑一个不花钱的 plan 看看它给你的故事画了什么分镜。

项目 GitHub 地址：[https://github.com/gnipbao/story-to-handdrawn-video](https://github.com/gnipbao/story-to-handdrawn-video)
