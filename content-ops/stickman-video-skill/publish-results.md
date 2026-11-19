# stickman-video-director Skill 三端推广发布结果（2026-11-19）

## 项目
- 仓库：https://github.com/kaomei/stickman-video-director
- 本地技能：directing-stickman-videos（上一轮已亲手安装到 /root/.hermes/skills/）
- 定位：把话题/文章/脚本自动做成火柴人视频的导演 Skill，主打无脸 YouTube 频道；双引擎 A(模型)+B(代码)，14 种画风
- 数据（发布时实测）：6972 Star / 1225 Fork / JavaScript / MIT / 建仓 2026-08-03，push 2026-11-19

## 一手实测证据（本篇差异化，非 README 复述）
- 本机安装 556MB；73 份 references 契约、57 个脚本、47 个测试文件 485 项断言、253MB 音效库
- 运行时：Node v22.22、FFmpeg、@napi-rs/canvas、sharp、5 个 OFL 字体
- autopilot.mjs doctor 七项（node/ffmpeg/ffprobe/canvas/sharp/字体/b4_hook_font）全绿
- 实测 init 生成 project.json；B6 补装 python3.11 的 numpy/PIL/cv2 后专项检查全绿
- 双引擎只共享安装不共享契约；B1-B4 清单渲染器、B5/B6/B7 专用运行时；原生 16:9+9:16
- 工程约束：渲染器只读声明式 JSON 不执行素材代码/URL（防注入）、内容寻址可续渲、静止≤2.5s、语音主导、实际 MP4 评审门禁
- 祛魅：非一键软件靠 Agent 驱动、A 模式烧外部额度、TTS/生图自配、体量大门槛、风格契约严

## 一、网站端（Hugo，已构建 + sync-site + push）
- 源文件：content/articles/2026/11/19/stickman-video-skill.md
- 图片：static/images/stickman-video-skill/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo12 exit 0
- node scripts/sync-site.mjs：318 articles/656 search entries，已核 home.json(4)、search-index.json(1) 收录本 slug
- 预期 URL：https://jackssybin.cn/articles/2026/11/19/stickman-video-skill/

## 二、微信公众号（仅草稿）✅ 一次通过
- Media ID：snS2bupQYF7HgHImnpl8sZzbXv6ru7Sua_4sbIS58zYgIGZY7EkTDlDERNba8-lv
- payload 校验 validate-payload.mjs：0 问题（1477 中文字、4 图）；frontmatter 带 source_url，正文无 H1 重复
- 封面 IP 双翼 1280×544，随机选中 c3（amber 深琥珀棕 + 生气 + 绿#07C160，左翼14），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA；digest 76 字、content_source_url=GitHub，draft/update errcode 0
- set_digest.py 按标题匹配（账号草稿 360+）
- 引流模块 + 2 条真实内链（圆角方块 Skill、Claude Code ADHD）

## 三、知乎专栏（仅草稿）✅ cookie 正常一次走完
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2106769225197023664
  - id 2106769225197023664，4 图传 CDN 裸 img，6 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生）：id 2106769073472389871
- 封面发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 火柴人手绘涂鸦风（米白纸底+手绘黑线条+亮蓝/橙/红三原色，封面含手绘火柴人）
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检；数字 73 references/57 scripts/485 断言均经 find 核实
