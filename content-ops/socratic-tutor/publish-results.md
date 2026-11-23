# socratic-tutor 三端推广发布记录

- 项目：janestreet/agent_skills（socratic-tutor 技能）
- 仓库 URL：https://github.com/janestreet/agent_skills
- 发布日期：2026-11-23
- 本地工作目录：content-ops/socratic-tutor/
- 叙事骨架：narrative-spine.json（六段 spine 校验通过，3 个标题候选）

## 一手事实（本地克隆核验，非 README 复述）

- 仓库 2026-11-03 创建，写稿时约 20 天，Star 10681、Fork 739、open issues 0
- 非 .git 仅 4 个文件；核心 socratic-tutor/SKILL.md = 5243 字符
- 零 .py/.js/.ts 可执行代码，纯 Markdown 教学协议，零依赖零构建，MIT
- 机制：意图守卫 → 3-5 题诊断 → 4-10 子技能 × 0-5 级 ASCII 技能地图（U+2588/U+2591）→ 一次一问追问循环（答错不给答案、2-3 次失败才讲并立即重测）→ 间隔复习降级 → 混合终考
- 5 命令：show progress / harder / easier / just tell me / save state / resume from
- 贡献指南：内部仓库导出，不接受新增技能或改文案 PR

## 配图（全部过 vision QA）

正文 4 张（学院墨绿+羊皮纸风，区别于职场系列）：
- media/01-teaching-loop.png 六步教学闭环
- media/02-skill-map.png 0-5 级技能地图（含还原 SKILL.md 的 ASCII 进度条终端框）
- media/03-ai-vs-tutor.png 普通AI vs 苏格拉底私教 5 行对照
- media/04-who-and-commands.png 适合/缓行人群 + 5 命令
封面：
- media/cover-ip.jpg（微信 1280×544 双翼 IP 封面，随机抽中 c2 深墨蓝+开心，verify_wings rc=0，已追加 combo-history）
- media/cover-zhihu.png（知乎 1600×900 深墨绿论点型，与微信封面不同）

## 网站端（Hugo，已 git push）

- 文章：content/articles/2026/11/23/socratic-tutor.md（正文 3054 中文字，4 图，无 shortcode）
- 图片：static/images/socratic-tutor/
- 本地 hugo --destination 临时目录 --minify --cleanDestinationDir：exit 0，文章 HTML 生成
- node scripts/sync-site.mjs：320 articles / 660 searchable，socratic-tutor 已进 home.json(12 处) 与 search-index.json(3 处)
- rebase 冲突处理：远端 home.json 冲突 → 取 theirs 后重跑 sync-site 重建，search-index 自动合并
- commit 0bdf3b6，已 push origin main
- 预期 URL：https://jackssybin.cn/articles/2026/11/23/socratic-tutor/

## 微信端（仅草稿，未群发）

- 标题：当所有 AI 都抢着给你答案，Jane Street 却开源了一个只会追问的严格私教
- 正文 2112 中文字（深度文 2000-2800 区间），4 图，无 H1，GitHub 仅文末裸链
- frontmatter：cover 绝对路径 cover-ip.jpg + source_url=GitHub 仓库
- 引流模块齐全：jk 自述 + 在看星标 + 阅读原文(frontmatter) + 2 条真实 mp 内链（pick-related-links 抽取）
- validate-payload.mjs：rc=0；人工复核无危险非 mp 正文超链接、无替换符
- publish.js newsroom github：发布成功，Media ID snS2bupQ...（脱敏）
- set-digest：独立 digest 100 字 + content_source_url 回读确认成功
- 无 45166/40113 报错

## 知乎端（专栏，仅草稿，未发布）

- 标题：如何评价 Jane Street 开源的 socratic-tutor：一个零代码、20 天破万星的 AI 教学技能？
- 正文 1508 中文字，4 图，论点先行、无 CTA、无 emoji
- 第一次 markdown --upload-images：4 图全传 CDN（临时草稿 p/2108160110010832798，需后台手动删除，脚本无删除功能）
- build_zhihu_compact_html.py：zhihu-compact.html，4 CDN content_image，无 ol/ul/table/空段/H1
- 第二次 --html-file 正式草稿：p/2108160295055127027（ok=true HTTP 200，以此为准）

## 待用户处理

- 知乎后台删除同标题临时 markdown 草稿 p/2108160110010832798
- 三端均为草稿/网站已推送，微信群发与知乎发布需用户手动确认
