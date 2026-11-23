# ai-pose-gallery-zh 三端推广发布记录

- 项目：anhao/ai-pose-gallery-zh（中文 AI 姿势/服装/人像参考三合一工作台 v2.0）
- 仓库 URL：https://github.com/anhao/ai-pose-gallery-zh
- 在线演示：https://ai-pose-gallery.anhao.app/
- 发布日期：2026-11-23
- 本地工作目录：content-ops/ai-pose-gallery/
- 叙事骨架：narrative-spine.json（六段 spine 校验通过，3 标题候选）

## 一手实测（本地克隆，非照抄 README）

- GitHub：7869 star / 2040 fork（fork 占比约 26%，异常高，说明真要克隆使用）/ 17 open issue
- 2026-10-27 创建，TypeScript 为主，license GitHub 识别 NOASSERTION（代码 MIT，图片不覆盖）
- 克隆体积：不含 .git 约 1.2GB / 含 .git 2.3GB
- 主库 JSON 实测：pose-zh=1439、costume-zh=1407、portrait-zh=1499
- 补充源：gia-anime 动漫=1320、shisei 历代=57套/227视角、charadb 二次元=440
- 图片实测：img/ 与 thumbs/ 各 6011 张（白模png1439+depth1439+costume1407+costumes227+portrait1499）
- **关键纠正**：README 顶部 12022 张是把原图+缩略图重复相加，去重后原图约 6011 张
- 代码规模：src 67 个 ts/tsx=11841 行、comfyui_plugin 5 文件=1610 行、scripts 8 文件=1342 行
- ComfyUI 4 节点源码确认：Pose/Costume/Portrait/CharacterRecipeNode
- 9 个 SKILL.md 技能（pose×5、costume×3、portrait×1）
- translations.csv 实测 475 行（474 条对照）；download.py 支持 DATASET/WORKERS、断点续传；verify.py 校验文件头
- 技术栈：React19+TS7+Vite8(Rolldown)+Tailwind4+shadcn/ui+TanStack+IndexedDB；Cloudflare Workers /api/proxy

## 配图（全部过 vision QA，画廊紫+画布米白风）

正文 4 张：
- 01-architecture.png 一套静态资产五端复用
- 02-data-scale.png 实测数据规模（含纠正 README 口径提示）
- 03-three-usage.png Web/ComfyUI/Agent 三种姿势
- 04-compliance-verdict.png 合规边界与适用判断
封面：
- cover-ip.jpg（微信 1280×544 双翼，随机抽中 c1 纯黑+惊讶，verify_wings rc=0，已记 combo-history）
- cover-zhihu.png（知乎 1600×900 深紫论点型，与微信不同）

## 网站端（Hugo，已 push）

- content/articles/2026/11/23/ai-pose-gallery-zh.md（正文 2583 中文字，4 图，无 shortcode）
- static/images/ai-pose-gallery-zh/
- hugo 临时目录构建 exit 0；sync-site：321 articles / 661 searchable，slug 进 home.json(12)/search-index(3)
- rebase 无冲突自动完成；commit e62bde8 已 push origin main
- 预期 URL：https://jackssybin.cn/articles/2026/11/23/ai-pose-gallery-zh/

## 微信端（仅草稿）

- 标题：AI 绘画找参考图有多痛？这个 7869 Star 的中文三合一工作台一次解决了
- 正文 2125 中文字（不含引流），4 图，无 H1，GitHub 仅文末裸链
- frontmatter：cover 绝对路径 cover-ip.jpg + source_url=GitHub
- 引流齐全：jk 自述 + 在看星标 + 阅读原文 + 2 条真实 mp 内链
- validate-payload rc=0；publish.js 成功（无 45166/40113）
- set-digest：独立 digest 107 字 + content_source_url 回读确认

## 知乎端（专栏，仅草稿）

- 标题：如何评价 ai-pose-gallery-zh 这个把姿势、服装、人像三库合一的中文 AI 绘画参考项目？
- 正文 1286 中文字，4 图，论点先行无 CTA
- 临时 markdown 草稿（传图用）：p/2108175242778760227，需后台手动删除
- compact HTML：4 CDN content_image，无 ol/ul/table/空段/H1
- 正式 HTML 草稿：p/2108175695717328440（ok=true HTTP200，以此为准）

## 待用户处理

- 知乎后台删临时草稿 p/2108175242778760227
- 三端均草稿/网站已推送，微信群发与知乎发布需手动确认
- 合规提醒已写入文章：代码 MIT 但图片版权归原作者 ギア/たき AI，默认 SFW，商用/真人换脸需自行授权
