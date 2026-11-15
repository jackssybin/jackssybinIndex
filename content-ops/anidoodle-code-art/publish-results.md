# anidoodle 三端推广发布结果（2026-11-15）

## 项目
- 仓库：https://github.com/alexgreensh/anidoodle
- 定位：Agent 技能/插件（非独立 App），用代码生成手绘风插画、动画、发布片、互动网页艺术与配乐，强调确定性可复现
- 数据（发布时实测）：1703 Star / 151 Fork / TypeScript / Apache-2.0 / 建仓 2026-09-22，push 2026-11-05
- 适配：Claude Code / Codex / Grok Build，插件版本 0.10.1

## 源码核实的关键事实
- 规模：engine 1139 个 TS 文件、约 8.1 万行；tools 84 个工具脚本；89 个测试文件（104 测试相关文件）；全仓 1551 个 ts/mjs/js
- 确定性契约（determinism-and-contract.md，全文最硬核）：
  - renderFrame 必须纯函数、帧间无状态；随机只许 rng(seed)，核心禁 Math.random/Date/performance.now
  - 受限画布：禁 ctx.filter（Safari 不支持）、禁 DOM/window/new Image，表面只能 env.canvas()
  - 仓库不放素材（文字=笔画、纹理=种子噪声、音乐=算术），三个例外（three.js/Poppins 字体/旁白）全部哈希锁定
  - 缓存键必须命名像素依赖的全部输入；位图只缩不放；校验 PSNR>45dB + 帧哈希
- 风格：styles.gen.json 实测 32 套配方；21 种曲风代码合成、无采样，music check 审新颖度
- 四后端：playwright/html-player/remotion/hyperframes 共用一个纯函数绘图核心
- 产物：PNG/MP4/GIF/透明 WebM/约100KB 自包含离线 HTML；示例片 1410 帧 47 秒，首遍后重渲染零成本
- 工程诚实：文档主动记录一次首跑 0/12 不一致、7 次复测才通过且无法复现的事故，强调不能"重跑到绿灯就沉默"

## 祛魅与边界
- 是 Agent 插件非开箱软件，需配编码 Agent；审美上限取决于引导与模型
- 8 万行引擎有学习曲线；动态渲染需 Node20+ / ffmpeg / 浏览器
- 照片重绘是代码笔触风格化，非照片级写实
- Apache-2.0（非 MIT），有 NOTICE 与署名义务

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/15/anidoodle-code-art.md
- 图片：static/images/anidoodle-code-art/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo8 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/15/anidoodle-code-art/

## 二、微信公众号（仅草稿）✅ 成功
- Media ID：snS2bupQYF7HgHImnpl8se1DQ9I72IQvq6x2dtNRMgcpdi93RcTyOYIYxBa_9_eq
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c2（cream-grad 米黄渐变 + 困惑 + 橙#F97316，左翼32），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA
- 独立 digest 66 字、content_source_url=GitHub，draft/update errcode 0
- 引流模块 + 2 条真实内链（媒体下载神器、剪映免费工具）

## 三、知乎专栏（仅草稿）✅ 成功（cookie 已恢复，本次一次走完）
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2105435433471587744
  - id 2105435433471587744，4 图传 CDN 裸 img，7 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生，脚本无删除功能）：id 2105435267670751102
- 封面发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 手绘纸张艺术风（米色纸底+墨黑+朱砂红+靛青+苔绿），区别于前几篇科技/商务风
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检无乱码/叠印/裁切，封面无卡片遮挡
