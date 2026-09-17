# 如何评价 gnipbao 的 story-to-handdrawn-video（把中文故事自动转手绘动画的开源 Agent Skill）？

最近想把手绘日记风的短视频量产，试了 GitHub 上这个近 2000 star 的项目：[gnipbao/story-to-handdrawn-video](https://github.com/gnipbao/story-to-handdrawn-video)。我把它在全新机器上 clone 下来按 README 真跑了一遍（Node v22，commit fbab5b2），说点实测结论，不做 README 搬运。

**先给结论**：这是一个完成度超出「一个月新项目」预期的 Agent Skill 工程，核心管线（分句 → 分镜 → 出图 → 合成）设计得很克制；但它确实有一个全新克隆必现的安装校验缺陷，README 没提。

![整体流水线：Skill 层 + Remotion 渲染器 + 输出契约](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/diagram-pipeline.png)

## 一、它的本质：Remotion 渲染器 + 可分发 Skill，不是一个脚本

仓库是两个解耦部分：

- 渲染器：React 19 + Remotion 4.0.487 的正经视频工程，510 行 TSX 管分镜、擦除和翻页转场，2200 多行 Node/Python 脚本管分镜生成、图片导入和校验。帧率、分辨率、转场缓动全部由代码决定，可重复渲染、可进 git。
- Skill：`skill-package/` 里一份 149 行的行为契约，cp 进 Codex / Claude Code / Kimi Code 的 skills 目录就能用自然语言驱动。

统一入口 `run_story_video.py` 有 plan / generate / import / render / preview / full 六种模式。这个分层的关键价值：**出图模型可以随便换，但硬契约（1080×1440、30fps、H.264、CRF18、yuv420p）永远由代码兜底**。

输出也很克制：**只交付静音画面轨** `out/picture_silent.mp4`，配音/BGM 刻意后置，方便接你自己的配音流水线。

## 二、动画语法：文字 → 黑白稿 → 彩色稿，都从左向右擦除

这是它看起来像「翻手绘日记」而不是「AI 幻灯片」的核心：

![三层揭示动效](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/diagram-reveal.png)

每个节拍（默认一个完整句子一拍）严格三层揭示：上方安全区马善政毛笔体手写字幕 → 整幅黑白稿 → 黑白稿上长出彩色，每层都左→右 smoothstep 擦除，模拟先勾线再上色。DESIGN.md 明确禁掉镜头晃动、弹跳、卡点。

两个中文向的细节比较加分：

1. 字幕默认走**本地字体渲染**（马善政毛笔体随仓库附带，OFL），而不是让图像模型画中文字——从根上杜绝 AI 写中文错字；只有明确要「画出来的手写感」才切 image2 模式并提前告知风险。
2. 彩色稿只画一遍，**黑白稿在本地用 FFmpeg 派生**（灰度 + 对比度 1.18 + unsharp 锐化），两层天然像素对齐。

上传合成漫画页时自动裁文字区/插画区，还支持右下角卷页翻书转场（弯曲按 sin(π) 变化，纸背保留淡化纹理）。

## 三、20 种画风：带配方和负向约束的风格库，不是随机 prompt

![20 风格六大家族](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/diagram-styles.png)

v1.1.0 加的风格库，每种风格在 JSON 里是机器配方：正向语法、负向约束、画材、色板、题材、中英文别名。示例图全部用**同一组人物/动作/构图**生成，横向比较时变量只有画材——这点对选型很友好，还有一张 20 格 contact sheet：

![20 风格总览](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/evidence-contact-sheet.jpg)

默认「彩铅日记漫画」有四张人工锁定的参考板；水墨写意要求焦浓重淡清、飞白枯笔、不可读朱红印；白板讲解是米白纸火柴人，面向科普。选择支持编号/id/中文名/别名。另外有个防串味设计：**风格配方算成指纹写进资产缓存目录，换风格必出新批次，绝不复用旧图。**

## 四、实测：哪些跑通，哪个坑 README 没说

![实测结果](/root/jackssybinIndex/content-ops/story-to-handdrawn-video-agent-skill/media/diagram-audit.png)

我逐条执行的结果：

- `npm ci`：干净通过，依赖很少。
- `run_story_video.py --list-styles`：20 风格正常列出。
- `--mode plan`（examples/story.txt 两句故事 + 水墨）：正常，2 句 → 2 个 5.3 秒场景，产出分镜 JSON、风格指纹 `5a7d9210946b9ccb`、角色锁定提示词、Image2 作业清单，plan-only 不耗出图额度。
- `npm run build`（Remotion bundle）：exit 0。
- **`npm run check`：全新克隆上退出码 1。**

这就是 README 让你「验证安装」的第一条命令。拆开看：`tsc --noEmit` 单独跑是过的，挂的是 `validate-storyboard.mjs`——它校验仓库自带的 `storyboard.json` / `storyboard.uploaded.json`，而这两个文件引用的 `public/assets/generated/*/01_text.png、01_bw.png、01_color.png` 整个目录都在 `.gitignore` 里（运行时产物）。于是报一连串 missing asset。

**影响**：不影响自己的使用路径，plan 生成的是独立的 `storyboard.generated.json` 和自有资产批次，渲染走 run_story_video.py。规避就是克隆后直接用 plan 冒烟，不必管 check 红灯；期待官方入库示例占位资产或让校验跳过历史样例。

其他要知道的约束：默认 Codex Image2 出图不要 OpenAI Key，选 OpenAI API 才要；遇到时间跳跃、指代不明、年龄敏感角色，它要求先出「场景编号 → 视觉规划」JSON 给你确认再烧图；项目 2026-07-21 才建仓，生产用建议锁版本。

## 五、谁适合用 / 谁先等等

**适合**：做亲子、睡前故事、文化寓言类手绘短视频，后期自己配音的创作者（彩铅/蜡笔/水墨/绘本几族直接对口）；做知识科普想要白板、极简线条讲解动画的人；以及想学习「Skill 工程化驱动确定性渲染器」的开发者——这份 SKILL.md 的默认值锁定、负向约束、输出契约写法本身就是好教材。

**先等等**：要写实、3D、精致二次元的（它的审美刻意拙，负向约束排除平滑矢量和写实光影）；要一键成片含配音配乐的（只给静音画面轨）；不愿装 Node 20 + FFmpeg + Chrome、也不用任何 Agent 运行时的纯小白。

零成本试跑：

```bash
git clone https://github.com/gnipbao/story-to-handdrawn-video.git
cd story-to-handdrawn-video && npm ci
python3 scripts/run_story_video.py --list-styles
python3 scripts/run_story_video.py --input examples/story.txt \
  --title "纸上的夏天" --style ink-wash --mode plan
```

## 总结

我认为它最大的价值是示范了 Agent Skill 的正确边界：**确定性交给代码，判断交给 Agent，人审的 plan 模式隔开两者**。一个月的项目已经有中文字体锁定、风格指纹、黑白层本地派生这些「踩过坑才会写」的细节，check 红灯更像仓库卫生问题而不是能力问题。做手绘故事内容的话，值得花五分钟跑个 plan 看看它给你的故事画了什么分镜。

项目地址：[https://github.com/gnipbao/story-to-handdrawn-video](https://github.com/gnipbao/story-to-handdrawn-video)
