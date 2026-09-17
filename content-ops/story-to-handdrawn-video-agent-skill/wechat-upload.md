---
title: 把中文故事丢给Agent自动出手绘动画？这个2千star开源Skill我克隆真跑了一遍
cover: /root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/cover-wechat.jpg
source_url: https://github.com/gnipbao/story-to-handdrawn-video
---

手绘日记风格的短视频这两年特别吃香：上方一行手写字幕，下方彩铅画从左到右慢慢揭开，画风拙、留白多，情绪反而比精美动画更戳人。但手工做一条，画分镜、逐张插画、对齐字幕、调转场，熟手也要大半天。

有个开源项目想把这件事变成一句话：你把中文故事丢给装了 Skill 的 Agent，它自动分句、分镜、出图、渲染，吐出一条竖屏 MP4。它叫 **story-to-handdrawn-video**，2026 年 7 月底开源，一个月近 2000 star。

我没看宣传，把仓库克隆下来按 README 逐条真跑。结论先说：**核心设计是认真的，主流程跑通了；但 README 让你验证安装的第一条命令，在全新克隆上就是失败的。** 这个坑文末说。

![封面](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/cover-wechat.jpg)

## 一、它不是一个脚本，是「Skill + 渲染器」两层工程

很多人看到 Agent Skill 以为是提示词合集。这个仓库其实是两个解耦的部分：

![两段式工程：Skill 层、Remotion 渲染器层、输出契约](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/diagram-pipeline.png)

下层是一个正经的 **Remotion 工程**——用 React 19 写视频，510 行 TSX 管分镜和转场，所有动效用帧和缓动函数精确描述，可重复渲染、可进 git。上层是一份可分发的 **Agent Skill 契约**，复制进 Codex、Claude Code 或 Kimi Code 的 skills 目录后，你说一句中文就能驱动，不用手敲命令。

中间的统一入口 run_story_video.py 支持 plan、generate、import、render、full 等模式，可以一条龙，也可以只出分镜让你先审。这个分层的好处很实在：**出图模型可以换，但帧率、分辨率、转场这些硬规矩永远由代码兜底**，不会因为模型发挥不稳定整条片就废了。

## 二、一条片子怎么诞生，以及它最克制的设计

拿仓库自带的两句故事实测：「那年夏天，我总爱坐在窗边画画。画里的风筝，比窗外飞得更高。」

我跑的是 plan 模式（不花出图额度）：两句 → 两个 5.3 秒场景，分镜 JSON、角色设定、出图作业清单全部生成。完整管线是四步：按句子切节拍（默认一句一拍，原文措辞不许改）→ Codex Image2 出图，先做角色参考表锁人物长相 → 彩色稿本地用 FFmpeg 派生出对齐的黑白稿 → Remotion 渲染成 1080×1440、30fps 的 H.264。

它最鲜明的取舍是：**只交付静音画面轨，没有配音、没有 BGM。** 这不是偷懒，是刻意把声音留给后期——固定输出 out/picture_silent.mp4，方便你接自己的配音流水线。

## 三、像翻手绘日记的秘密：三层揭示的顺序很讲究

这是它看起来不像「AI 幻灯片」的核心。

![一个节拍：手写字幕、黑白画稿、彩色插画，全部从左向右擦除](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/diagram-reveal.png)

每个节拍严格按 **手写字幕 → 整幅黑白稿 → 黑白稿上长出彩色** 的顺序，每层都从左向右擦除出现，模拟的就是手绘时先勾线、再上色的过程。缓动用 smoothstep，起步收尾都柔，DESIGN.md 里明令禁止镜头晃动、弹跳和卡点音乐。

两个细节看得出它真做过中文内容：

字幕默认用**本地马善政毛笔字体渲染**而不是让 AI 画字，你的原文怎么写画面上就是什么字，从根上杜绝 AI 写中文错字；插画全部 contain 不裁剪、笔触限制在安全边距内，上传的漫画页还能自动裁出文字区和画面区。除了直切，还支持右下角**卷页翻书**转场，纸背保留淡化的原页纹理，像翻一本真画集。

## 四、20 种画风：可横向比较的风格库，不是 20 句随机提示词

v1.1.0 加的 20 风格是它涨 star 的主力。做法很工程化：每种风格都是一份机器配方，含正向语法、负向约束、色板、题材和别名，而且示例图全部用**同一组人物、动作、构图**生成——你比的就只有画材本身。

![20 种风格分六大家族](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/diagram-styles.png)

默认是彩铅日记漫画（笨拙黑毡尖笔轮廓 + 低饱和彩铅短排线）；水墨写意要求焦浓重淡清、飞白枯笔、角落一枚不可读朱红印；白板讲解是米白纸火柴人，明显给知识科普用。选风格直接说中文名、编号或英文 id 都行。

![20 风格总览：同一人物动作，不同画材](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/evidence-contact-sheet.jpg)

还有个防串味设计我很喜欢：**选中风格会算成指纹写进资产目录，换风格必出一批新图，绝不会偷偷复用上一种画风的旧图。**

## 五、实测体检：一个 README 没说的坑

![本机实测结果](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/diagram-audit.png)

npm ci 干净、风格菜单正常、plan 正常、Remotion bundle exit 0。但 README 让你用来验证安装的 **npm run check，全新克隆上退出码 1**。

原因：校验器会检查仓库自带的两个示例分镜，可它们引用的图片资产在 public/assets/generated/ 目录里，而这个目录整个写进了 .gitignore（本来就是运行时产物）。TypeScript 检查单独跑是过的，挂的是示例资产缺失。第一次装的人大概率以为自己环境配错了。

实际**不影响使用**：你跑自己的故事时，plan 生成的是独立的分镜和资产批次，渲染走 run_story_video.py 而不是那个校验器。克隆后直接用 plan 冒烟就行，不用被这个红灯劝退——也等官方把示例资产入库，或者让校验默认跳过历史样例。

顺手说几个文档里的真实约束：出图默认走 Codex Image2、不需要 OpenAI Key，选 OpenAI API 才要 KEY；遇到时间跳跃、指代不明、医疗场景或年龄敏感角色，它会要求先给一份以场景编号为键的视觉规划 JSON，你确认后再出图——这个「难场景先规划」的默认开关，比一上来烧额度出一堆错图靠谱。仓库还很年轻（7 月 21 日建仓，当前 v1.1.0），真要进生产建议锁死版本。

## 六、谁该用，谁先等等

**适合**：做亲子、睡前故事、文化寓言类手绘短视频、后期自己配音的创作者；做知识科普、想要白板/极简线条讲解动画的人；以及想学习「Skill 怎么工程化驱动确定性渲染器」的开发者，它的契约写法很值得参考。

**先等等**：要写实、3D、二次元精美画风的（它刻意画得拙）；要一键成片含配音配乐的（明确只给画面轨）；不想装 Node 20 + FFmpeg + Chrome、也不用任何 Agent 的纯小白。

五分钟体验不花一分钱：克隆后 npm ci，跑 run_story_video.py --list-styles 看菜单，再用 examples/story.txt 跑 --mode plan，先审它给你故事画的分镜；分镜满意再在 Agent 里走完整出图和渲染。已经有手绘稿的话，直接把图片按播放顺序传给它，加 --transition page-flip 就是翻书效果，建议先出 720×960 预览版，确认节奏再出正式版，省得反复烧渲染时间。

这类项目最值得看的，是它划清了一条线：**确定性的东西全交给代码（帧率、分辨率、转场、字体、安全构图），需要判断的东西交给 Agent（分句、分镜、选风格、视觉规划），中间用人工审的 plan 隔开。** 一个月的项目能想到中文用字体会锁、风格要算指纹防串味、黑白稿本地派生而不是画两遍，成熟度超出预期；那个 check 红灯更像仓库卫生问题，不影响它作为故事号生产工具的价值。如果你在做手绘风格内容，值得先花五分钟跑个不花钱的 plan。

---

我是 jackssybin，一个只信「自己跑过」的开源实测派，每个项目都克隆下来逐条验证再下笔，连 README 没提的坑也一起告诉你。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目 GitHub 地址我放在了「**阅读原文**」。

相关阅读：
- [别再到处找 AI 赚钱项目了，这 5 个 GitHub 仓库才是真正的副业地图](https://mp.weixin.qq.com/s/GrcxJAVwfslAuzkB1Du_sA)

这个号在持续做「开源项目实测」系列，更多 AI 工具和一手踩坑，进公众号主页合集一次看全；下一篇我们继续拆。

项目 GitHub 地址：https://github.com/gnipbao/story-to-handdrawn-video
