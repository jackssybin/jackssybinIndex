# 影策 open-ai-canvas 三端推广发布结果（2026-11-10）

## 项目
- 仓库：https://github.com/ddcat-ai/open-ai-canvas
- 定位：开源 AI 影视与短剧创作工作台（小说→成片流水线 + 无限画布 + 3D 世界引擎 + Agent）
- 数据（发布时实测）：1747 Star / 584 Fork / TypeScript+Go / MIT / 建仓 2026-07-22，最近 push 2026-11-10（活跃）
- 版本：v1.8.3；在线演示 yingce.tv（test/test123456）

## 源码核实的关键事实
- 规模：后端 Go 1.25+Gin+GORM，1436 个 .go、约 30.2 万行；前端 Bun+React19+Vite，1389 个 TS/TSX、约 27.9 万行；合计约 58 万行
- 插件：plugin-packages 112 个协议插件（文本23/图片17/视频22/音频及工作流支付50，勾稽=112），另有 .yingce-plugin 构建产物
- Manifest 合同（实测 seedance manifest.json）：apiVersion yingce.plugin/v2、permissions、contributes.provider、$ref/$map/$coalesce 字段映射、validations（最多9图3视频）、响应归一、ephemeral 媒体持久化
- 插件安全：不触 React/Cookie/DB，不能自注册 Gin 路由/GORM model，远程走沙箱+宿主RPC，错误不静默降级
- 技术栈：React Three Fiber+three.js 0.185 做 3D 世界引擎（内测）；Zustand+localForage；SQLite 本地 / PostgreSQL+Redis 部署；OSS/COS 存储；SSE+websocket
- 后端 internal 40+ 模块（agent/canvas/generation/payment/provider/skills/workbench 等）

## 祛魅与边界（重点）
- MIT 友好但：软件免费、模型 API 费用自理；需 Bun+Go1.25+Docker 运维；接口仍在演化；3D 引擎内测
- 安全：默认个人/本地/可信环境，勿裸奔公网；关开放注册、CORS 不用 *、后端默认拦私网模型地址防 SSRF、Key 不进日志、8080 不暴露
- 区别于 cowart-codex-tldraw（那是 tldraw Codex widget 插件稿），本篇是全栈影视平台，无撞车

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/10/yingce-ai-film-canvas.md
- 图片：static/images/yingce-ai-film-canvas/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo4 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/10/yingce-ai-film-canvas/

## 二、微信公众号（仅草稿）
- Media ID：snS2bupQYF7HgHImnpl8seWCQVU3cLNTSzHOE-nf5boHup5HcuPh1VTc5HyfDVH0
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c3（cream 米黄 + 惊讶 + 橙#F97316，左翼112），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA（数字勾稽 23+17+22+50=112 被验证）
- 独立 digest 62 字、content_source_url=GitHub，draft/update errcode 0
- 引流模块 + 2 条真实内链（Claude Code ADHD、AI 副业地图）

## 三、知乎专栏（仅草稿）
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2103545873967928139
  - id 2103545873967928139，4 图传 CDN 裸 img，6 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生，脚本无删除功能）：id 2103545716014577276
- 封面发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 影视胶片暖调（深酒红+胶片金+放映机青+玫瑰红），区别于前几篇
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检无乱码/叠印/裁切，封面无卡片遮挡
