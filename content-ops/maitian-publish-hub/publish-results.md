# 麦田 三端推广发布结果（2026-11-19）

## 项目
- 仓库：https://github.com/CzzzzzzJ/mdldm-maitian
- 定位：自媒体多平台发布中控与数据监控（B站/抖音/小红书/视频号/YouTube/X/Instagram 7 平台），飞书卡片+数据大屏，不存平台密码
- 数据（发布时实测）：1355 Star / 425 Fork / JavaScript / MIT / 建仓 2026-11-14（仅 5 天），push 2026-11-18
- 版本：v0.4.0；Node ≥22.5（用内置 node:sqlite）；主打 macOS，Windows 社区版
- 作者：麦当 mdldm（0 基础 AI Agent 教学博主）

## 源码核实的关键事实
- 规模：src 23 个 ES Module、核心约 2400 行，hub.mjs 471 行最大；加 skill 共 2385 行；几乎零运行时依赖
- 三件套：maitian-publish Skill（Claude/Codex 写文案生成 publish.json）+ Chrome 插件「麦田发布助手」（平台适配器，商店自动更新）+ 本地中控 hub.mjs（调度/防重/取链/采数据）
- 安全四道：①不存密码，驱动专用 Chrome（CDP 9333）用用户登录态 ②国内四家只填不发、人点最后一下，海外校验后自动提交 ③每平台只传一次防重、小红书只模拟真人低频 ④数据本地、网页无口令 401、飞书验证码/Cloudflare Access
- faststart 校验：validate.mjs 读文件头查 moov 是否在 mdat 前，否则小红书/抖音报错
- 数据闭环：播种(发布)/长势(每天采集，新片头3天每6h)/收成(utm 归因自有站注册收入)；SQLite 11 张表；第1/3/7天同龄复盘、周一周报、转化漏斗、iPhone 小组件
- 三级上手：L1 只看数据(30min) / L2 分发(+1h) / L3 转化(接站点)
- demo 实测：node v22.22 跑 node src/demo.mjs 正常起 :8788 假数据大屏（仅 SQLite 实验性警告）
- 祛魅：5 天新项目 v0.4.0；src 无单元测试；核心适配逻辑在商店插件不在主仓库；依赖平台页面稳定；mac 为主、Win 自启未适配；不创造内容只提效

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/19/maitian-publish-hub.md
- 图片：static/images/maitian-publish-hub/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo11 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/19/maitian-publish-hub/

## 二、微信公众号（仅草稿）✅ 成功（一次通过）
- Media ID：snS2bupQYF7HgHImnpl8sW_clkoaxbTPK3vsnGNfidSSBP6FZ_NOlMHNMqB-I2ok
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c1（cream-grad 米黄渐变 + 得意 + 橙#F97316，左翼7），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA
- digest 78 字（≤120）、content_source_url=GitHub，draft/update errcode 0
- set_digest.py 按标题匹配（账号草稿 360+，规避分页/硬编码 id）
- 引流模块 + 2 条真实内链（Rust 无头浏览器、Claude Code ADHD；内链库库存不足，分两个话题各取 1 条）

## 三、知乎专栏（仅草稿）✅ 成功（cookie 正常，一次走完）
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2106710090309026542
  - id 2106710090309026542，4 图传 CDN 裸 img，5 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生）：id 2106709829196816982
- 封面发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 麦田田园风（奶油麦黄底+麦穗绿+深棕+陶土橙），呼应"麦田"品牌，区别于前几篇科技深色/宣纸风
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检无乱码/叠印/裁切
