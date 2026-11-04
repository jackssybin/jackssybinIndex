# charles-video-maker 三端推广 — 发布结果

项目：https://github.com/anneheartrecord/charles-video-maker
数据基准：2026-11-03（GitHub API：49 Star / 8 Fork / 0 open issues）
建仓 2026-10-19（仅约 2 周），MIT，JavaScript 标签，实质 Agent Skill（77 .mjs + 27 .py + 9 .ts，约 2.9 万行含原样收录的 Anatomy）
形态：文字稿→render(t) 网页→Playwright 逐帧截图→FFmpeg 合成竖屏成片，含配音/逐字字幕/封面/publish.txt；四模式（代码动画/素材打底/Anatomy 机器/抖音号）；53 种 Lemo-Opuscar 画风可选
作者自述战绩（截至 2026-11-02）：零粉新号 2026-10-20 起 13 天 37 万+ 播放、0 投流，代表作 78 秒 23.1 万播放/7053 分享。文中明确标注「工具稳质量、爆款靠选题与开头3秒，也做出过几十播放」，未把效果当承诺

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/11/03/charles-video-maker.md`
- URL：https://jackssybin.cn/articles/2026/11/03/charles-video-maker/
- 正文图 4：pipeline / modes / douyin-flow（+封面）；本地 hugo exit 0；已推送（commit 282aecf）

## 2. 微信公众号草稿

- 标题：《零粉丝新号 13 天 37 万播放：这个开源工具让代码一帧帧画出整条短视频》
- newsroom；draft media_id：`snS2bupQYF7HgHImnpl8seO9jSucDF8VFmzLMSeJzPHQN_hofyZNL1FL_s3wOVT1`
- 封面：**cover-ip.jpg（1280×544 IP 双翼，纯黑 ink + 惊讶表情 + 亮绿，verify_wings rc=0 + vision）**
  - **首次执行新规则：不再询问用户，3 候选(c1冷白生气/c2米黄喜爱/c3纯黑惊讶) 过验收后用 random 自动选中 c3**，已记 combo-history
- 三必查：正文图 3、文末 jk 引流+阅读原文(→GitHub)+相关阅读 2（全平台下载神器、Rust 无头浏览器）
- 独立 digest 116 字 errcode 0；content_source_url 已设
- 状态：草稿未群发

## 3. 知乎专栏草稿

- 标题：《读完一个49 Star的Agent Skill：不靠视频模型，代码逐帧渲染怎么做出37万播放短视频》
- URL：https://zhuanlan.zhihu.com/p/2101263635926475318 （+/edit）
- compact HTML：图 3（content_image=3）+ pre 1（配音流水线），ul3/ol2 配平，无 `<table>`
- CDN：pipeline pica…b981 / modes pic1…603f / douyin picx…9e0e
- 标题封面需编辑器手动选 cover-zhihu.png（平台限制）
- 临时图片草稿（zhihu-cache，仅3图）需后台删除
- 状态：草稿未发布

## 4. 配图

- 电影暗房风（暖炭黑+录制红+琥珀+铜青，竖屏视频语义）；4 图全部 vision 验收
- douyin-flow 回流框首版单行末「结论」二字溢出（vision 抓出），改两行+加宽卡片复检通过

## 5. 事实/合规

- MIT；来源归属（xilo-opus-video / Anatomy 原样收录 / 蔚蓝教程 / Lemo-Opuscar）照 NOTICE 写清
- 关键边界：仅 2 周 49 Star 早期项目、0 issue 不代表可靠；不做视频模型素材/不剪辑已有视频；37 万为作者单账号自述非效果承诺；复刻爆款有版权/平台规则风险，文中提示只用有权素材
- Key 只走环境变量；依赖 Python3.9+/FFmpeg/Node20.10+/Whisper/TTS
