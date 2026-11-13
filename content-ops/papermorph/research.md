# Papermorph 三端推广文章：事实与案例核验

核验日期：2026-11-13

## 任务边界

- 三端按 `github-repo-three-channel-tutorial` 的定义制作：网站完整版、公众号版、知乎专栏版。
- 只生成地方稿件与配图，不上传、不公开发布。
- 案例均来自 Papermorph 官方已上线页面，不虚构客户、使用者、收入、教学提升或制作效率。
- 文章中的“我打开”“我核对”仅指本次对公开页面、安装脚本和技能文档的检查，不表示这些官方案例由本文作者制作。

## 一手来源

- GitHub 仓库：https://github.com/DozenTwelve/Papermorph
- 官方 README：https://raw.githubusercontent.com/DozenTwelve/Papermorph/main/README.md
- 本机技能说明：`D:\CodexData\codex\skills\papermorph\SKILL.md`
- 发布与导出说明：`D:\CodexData\codex\skills\papermorph\references\core\publish.md`

## 案例 1：线性代数互动课程

- 页面：https://papermorph.diamonddoge.org/linear-algebra/ch12/
- 页面标题：Three Planes, One Point。
- 页面显示约 14 分钟、21 个步骤；步骤 7、11、14 标为 Quick check / Your turn，步骤 16—19 为 Chapter practice，步骤 20 为 Playground。
- 本次打开第 6 步 From all sides，页面同时呈现三个方程、候选解代入判断和三维平面内容。
- 官方 README 列出 Linear Algebra 共 40 章，并说明平面可拖动；拖动操作本次未验证，不作为实测结论。
- 截图：`media/case-linear-algebra.png`。

## 案例 2：《小马过河》纸偶绘本

- 页面：https://papermorph.diamonddoge.org/little-horse/ch01/
- 页面显示约 4 分钟、9 个场景，包含 Home、By the river、Uncle Ox、Squirrel、At the mill 等段落。
- 官方 README 与技能说明列出角色配音、字幕、音效、音乐和 listen-and-find 互动；技能说明注明该案例角色配音使用 ElevenLabs。
- 本次打开第 3 步 By the river。自动化浏览器提示声音无法播放，因此文章不把本次检查写成配音试听或听找游戏实测。
- 截图：`media/case-little-horse.png`。

## 案例 3：《疯癫与文明》纪录片与竖屏短片

- 系列页：https://papermorph.diamonddoge.org/madness/
- 纪录片：https://papermorph.diamonddoge.org/madness/ch01/
- 系列页显示纪录片 10 分钟，另有 4 集竖屏短片：The Ship、Locked Up、Liberation、The Last Voices，每集标注 2 分钟。
- 纪录片页面显示 48 个步骤。本次打开第 2 步 Bosch 并截图。
- 系列页列出素材来源与许可：图片和音乐包括 Wikimedia Commons 的 public domain / CC0 作品；声音为 ElevenLabs v4；部分线稿使用图像模型，部分动画使用 Kling 3.0。文章保留这一成本与素材边界。
- 截图：`media/case-madness-documentary.png`。

## 案例 4：欧洲 1919—1929 互动历史地图

- 页面：https://papermorph.diamonddoge.org/time-of-the-magicians/
- 页面提供 1919—1929 年份切换，以及 Wittgenstein、Heidegger、Benjamin、Cassirer 四位哲学家的可点击入口。
- 本次实际从 1919 切换到 1920，页面年份与内容随之更新。
- 页面含 Sources and credits，列出地图、音乐和历史图片的来源链接；文章不将其中某一素材的许可证泛化为整页统一许可。
- 截图：`media/case-time-of-the-magicians.png`。

## 机制与工程观察

- 技能将横屏内容放在 1600×900 SVG 舞台，竖屏短片放在 900×1600 舞台；旁白切片与定时动作组成 beats。
- `style.json` 保存风格、声音、模型选择和已确认章节，后续章节复用这些决定。
- 每本书保留自己的播放器引擎副本，降低上游引擎更新导致旧作品突然失效的风险。
- 项目把 `books/`、`content/`、`tools/` 与最终 `site/` 分开，原 PDF、制作稿和检查证据不进入公开交付目录。
- 成品是静态网页，无应用后端、数据库或账号系统；进度存于浏览器 `localStorage`。本地音频预览仍需 HTTP 服务，不等于双击 HTML 即可。
- 章节可导出 1080p MP4 与 SRT。课程导出会省略需要读者操作的答题环节，因此 MP4 不是互动网页的完全替代品。

## 本机安全检查

- `python D:\CodexData\codex\skills\papermorph\scripts\new_book.py --help` 正常返回，列出 lesson、picture、documentary、shorts、scroll、explore 六种初始化类型。
- Python 3.12.10、uv 0.7.13、FFmpeg 均在当前机器可用。
- 本次未调用付费 API，未生成完整新书，未导出 MP4，未验证完整配音流程。

## 写作限制

- 不使用“零成本”“一键生成整本书”“完全替代老师/剪辑师”等无证据表述。
- 不承诺阅读量、教学效果或制作耗时。
- 公众号所需历史文章内链未由用户提供，不编造链接；终稿使用真实官方延伸阅读和合集提示，并在结果记录中说明。
- 自动化截图中的浏览器扩展按钮已移除；自动播放受限提示不作为产品缺陷证据。
