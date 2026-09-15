# 发布结果 · Hypit

- 项目：https://github.com/hypit-ai/hypit （hypit.ai 开源，AI Agent 视频生产框架 + SVML 语言，Apache-2.0 修改版，v0.1.8）
- slug：`hypit-clone-viral-video-svml-agent-deep-dive`
- 日期：2026-09-15

## 立意与标题
- 核心论点：视频不是渲染出来的，是编译出来的——Script 无时间码，时间经 WhisperX 对齐后投影，组件锚定「词」而非帧；一条爆款结构可近乎零边际成本重放百遍。
- 三个候选：① 一条爆款视频 1.15 美元（数字结果，选用）② Arcads $220/月 vs 开源（免费替代）③ 视频是编译出来的（观点，用于知乎封面/气质）。
- 近一个月标题公式无重复（上一篇 ViMax 为「一句话怎么变成分钟级长视频」）。

## 网站 / Hugo
- 文件：`content/articles/2026/09/15/hypit-clone-viral-video-svml-agent-deep-dive.md`
- 正文 2611 中文字，5 张正文图（官方 GIF 截帧 1 + 自制信息图 4）。
- 本地构建：`hugo --destination /tmp/hugo-final --minify --cleanDestinationDir` 退出码 0，产物 index.html 存在。
- 踩坑：初稿 date 14:30 晚于系统时间 13:59 被 Hugo 当未来文章静默跳过（09/15 目录不生成）；改为 13:55 后正常。已在 preflight 记忆里。
- 已 commit + push jackssybinIndex main（commit a6f4ac3，含 static/images 与 content-ops）。
- 预期 URL：https://jackssybin.cn/articles/2026/09/15/hypit-clone-viral-video-svml-agent-deep-dive/

## 微信公众号（草稿，未群发）
- 上传文件：`wechat-upload.md`（frontmatter title + 绝对路径 cover + source_url，正文无 H1）。主题 newsroom(github)。
- 正文 2031 中文字（深度稿区间 2000–2800），正文图 4 张（不含封面共 5 个图片引用，封面在首行）。
- validate-payload.mjs：0 建议项通过。
- Media ID：`snS2bupQYF7HgHImnpl8sWlGhOl7BdhB1pP64NKvnGMRFV_XJ7JXmSd0csjaImll`
- source_url（阅读原文）：https://github.com/hypit-ai/hypit （建稿透传，set-digest 复核保留）。
- 独立摘要已回补（set-digest.js 成功，含 --cover 与 --source-url），摘要与标题不同、带 SVML/成本/门槛等检索词。
- 相关阅读：2 条本号已群发 mp 短链——剪映免费工具（bkYGzCKG…）、Claude Code 开源终端 Agent（_2gkNg1fE…），均为手工从内链库选取（pick 脚本随机兜底不相关，已弃用随机结果）。
- 文末放了 GitHub 裸链（非超链接 markdown 写法为裸 URL，未触发 45166，建稿成功）。

## 知乎专栏（草稿，未发布）
- 上传文件：`zhihu-upload.md`，Markdown + `--upload-images`（仅运行一次成功，无重复草稿）。
- 标题：如何评价开源的 Hypit：我读完源码，看它怎么把短视频变成可编译的程序
- 草稿 ID：`2083195610279236654`
- URL：https://zhuanlan.zhihu.com/p/2083195610279236654 （编辑：/edit）
- 图片：uploaded=3，全部替换为 zhimg/zhpic CDN，payload 无 /root 本地路径残留。
- 间隔检查：`<ol>`/`<ul>`/`<table>`/`<p><br`/`<br><img`/`<p><img>` 均 0，3 张裸 img，无需 compact HTML。
- 封面：未单独设知乎封面（正文首图即官方演示截帧；cover-zhihu.png 已备于 media/，如需可在后台或后续脚本补）。

## 素材与一手证据
- 浅克隆通读：README/README.zh-CN、package.json（v0.1.8，100+ workspace 包，Node≥22.15/pnpm10.33）、LICENSE（Apache-2.0 修改版：多租户 SaaS/转售需商业授权、LOGO 限制）、docs/zh 与 docs/quickstart|guide 全部、examples/ranking-football/reference.svml 与 README、skills/hypit/SKILL.md、packages/temporal-markup/EDITING.md、docs/guide/conventions.md|providers.md|packages.md。
- GitHub API 取证：1035 star / 65 fork，建仓 2026-07-29，最近推送 2026-09-14。
- 关键证据点：Script prose-first 无时间码（quickstart/script.md）；Selection/Moment 不携带秒级时长（temporal-markup/EDITING.md）；样片成本 $1.15/$1.07/$1.09 与 64 Chromium（README+examples 笔记）；只有 build 花钱、失败终止+Output 复用（conventions.md）；Model/Provider 分离与定价页出处（providers.md）；Dual Text 双文本投影。
- 官方演示 GIF（user-attachments，9.9MB）取帧 shot-source/shot-preview.png 作为一手截图，vision 复核确认左侧 SVML@锚点标签与右侧 B-roll/榜单画面。
- 自制信息图 4 张（word-anchor / architecture / cost-table / quickstart）+ 封面 2 张，均 HTML→Playwright 截图，Noto Sans CJK，vision 逐张中文 QA 无乱码无溢出。

## 未完成 / 注意
- 微信、知乎均为草稿，未群发/未发布。
- 三端稿正文图片数：网站 5、微信正文 4+封面、知乎 3（满足「全教程 ≥3 正文图」）。
- 微信稿群发后需把真实短链追加到 references/wechat-internal-links.json。
- 克隆缓存在 /root/.cache/tct/hypit（临时取证用，可删）。
