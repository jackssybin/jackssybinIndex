# public-apis 三端推广发布结果（2026-11-21）

## 项目
- 仓库：https://github.com/public-apis/public-apis
- 定位：人工策展的免费公共 API 索引（一份 README 即数据库），GitHub 全站 Star 最高项目之一
- 一手数据（本地克隆 + 脚本解析，非 README 转述）：
  - 500,524 Star / 56,187 Fork / open issue 2811 / 约 2406 贡献者 / 约 7019 提交
  - 2465 个标准 API 条目、51 分类、60 个 MCP 服务器（新增专栏）
  - 认证：免认证 1200(49%)、apiKey 1104(45%)、OAuth 150(6%)、其它 11
  - CORS：Yes 1080(44%)、Unknown 1055(43%)、No 330(13%)
  - 关键交集：656 个「免认证 + CORS Yes」可纯前端 fetch 直连
  - HTTPS：2377 支持 / 88 仅 HTTP；24 个条目含 stdio 标记
  - MIT、Python、master 分支、2016-03 建仓、push 2026-11-20 仍每日维护、未归档
- 实测：scripts/tests 31 个单元测试用 CI 同款 PYTHONPATH 跑通（Ran 31 tests OK）；format.py/links.py 校验 + 3 个 GitHub Actions 质量门禁；CONTRIBUTING 拒收营销 PR

## 用户特别要求
- 重点回答「这些 API 能聚合做什么应用/网站、好点子、好方向」→ 落地为 8 个方向矩阵（ideas.png + 网站/微信/知乎均设独立章节），每个标注依赖分类、Key、难度、变现

## 一、网站端（Hugo，已构建 + sync-site）
- 源文件：content/articles/2026/11/21/public-apis-aggregator.md（正文 2683 中文字，5 节含最小起手式）
- 图片：static/images/public-apis-aggregator/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo_pa --minify --cleanDestinationDir exit 0，文章 HTML 已生成
- node scripts/sync-site.mjs：319 articles / 657 search entries；home.json(4)、search-index.json(1) 已收录本 slug
- 预期 URL：https://jackssybin.cn/articles/2026/11/21/public-apis-aggregator/

## 二、微信公众号（仅草稿）✅
- Media ID：snS2bupQYF7HgHImnpl8sVjYq7dnN82aMzX_XRg7p5RSKFbJw2Lst1neQ4HPMa95
- 正文 2037 中文字、4 图、无 H1、2 条真实内链；frontmatter source_url 承担阅读原文
- validate-payload.mjs 首次报正文 GitHub 裸链会触发 45166 → 已改为纯文字引导（链接只走 frontmatter），复检 0 问题
- 封面 IP 双翼 1280×544：random_cover_job 出 3 候选 → make_cover_ip + verify_wings 全过 → vision 3 张全过 → 随机选定 c1（amber 深琥珀棕 + 喜爱 + #07C160，左翼巨字 2465），combo-history 已追加
- set_digest.py 按标题匹配（草稿 300+，分页扫描）：digest 71 字、content_source_url=GitHub、thumb 未丢，draft/update errcode 0
- 引流模块齐全（jk 自述 + 在看星标 + 阅读原文 + 2 内链）

## 三、知乎专栏（仅草稿）✅ cookie 正常
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2107466972057420255
  - id 2107466972057420255，4 图传 CDN 裸 img，5 个 h2，无 ul/ol/table/紧凑性违规
- ⚠️ 多余首稿待手动删（markdown 传图产生）：id 2107466838716191603 → https://zhuanlan.zhihu.com/p/2107466838716191603
- 封面发布时手动选 cover-zhihu.png（1600×900）
- 冷静分析风、无公众号 CTA

## 配图 QA（深墨青 API 网络拓扑风，区别于既往所有项目）
- 调色板：深墨青底 + 电光青节点 + 琥珀金高亮；5 张 PNG
- grep 确认游标无 yy 漏等号（命中均为坐标偏移 yy+n）
- vision 三轮抓出并修复 3 个真实排版 bug：
  1. cover 底部放射连线压引导语 → 加深色遮罩条 + 环形上移缩半径，像素验算最低标签 y=732 < 遮罩 780
  2. auth-cors 结论框两行叠印（y 坐标写错 902-40）+ 标签括号截断 → 加大框高修正坐标、改短标签
  3. ideas 底部提示语压住最后一排卡片 → 画布 1180→1280 加高、提示语独立区
  另修 verdict 结论框轻微叠印（间距 832/878）
- 所有数字（2465/51/60/1200/656/分类条目数）均经脚本解析核实；stdio 24 行已据实改正（初稿误写 16）
