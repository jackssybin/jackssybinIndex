# publish-results · agnes-image-tool-gradio-studio-source-deep-dive

日期：2026-09-18
项目：https://github.com/you-want/agnes-image-tool（29 Star / 9 Fork / MIT，创建 2026-06-23，最近推送 2026-07-29）
标题（网站/微信）：读完 2379 行源码：这个 29 Star 的开源工作台，把 AI 出图和出视频装进了同一个网页
标题（知乎）：29 Star 的 Gradio 开源工作台值得用吗？我读完 2379 行源码，说说它的边界

## 硬证据（源码实测）

- 浅克隆仓库通读全部 2379 行 Python：app.py 931 行（7 个 gr.TabItem）、api_client.py 540 行、styles.py 439 行、config.py 103 行；3 个测试文件。
- 运行依赖仅 4 个（gradio/openai/requests/pillow）；无模型权重，推理走 https://apihub.agnes-ai.com/v1。
- 工程洞察 1：config.py DURATION_TO_FRAMES = {3:81,5:121,8:201,10:241,15:361,18:441} 全部 8n+1；api_client.py 提交前按 max_frames 截断并重对齐。
- 工程洞察 2：图生图本地文件转 Data URI（开箱可用）；图生视频/多图视频只收公网 URL，本地分支仅 API 同源时成立。
- 视频轮询：5s 间隔、指数退避、最多 10 次重试；Nginx 需 proxy_read_timeout 86400s。
- 额外发现：web/ 目录存在 Next.js 15 + React 19 重写版 agnes-forge（端口 3017，含 https-proxy-agent 服务端代理）。
- 未验证项（已在三稿标注）：无真实 API Key，未验证出图/视频质量、生成速度、免费额度。

## 网站（Hugo）

- 文章：content/articles/2026/09/18/agnes-image-tool-gradio-studio-source-deep-dive.md（中文正文约 2500 字，达标）
- URL：https://jackssybin.cn/articles/2026/09/18/agnes-image-tool-gradio-studio-source-deep-dive/
- 构建：hugo --destination /tmp/hugo-verify-agnes --minify --cleanDestinationDir，exit 0，index.html 存在。
- 坑：date 初写 2026-09-18T17:00（未来时间）被 Hugo 静默跳过，改为 12:30 后正常。
- commit 22a4ccf，已 push origin/main（含文章、static/images 5 图、content-ops 素材包；zhihu-cache 未提交）。
- 与 2026-09-17 agnes-ai-platform.md 做了显式差异化（不同仓库：you-want/agnes-image-tool vs WingkySky/Agnes-AI-Platform），正文第七节加入二者选型对比表。

## 微信公众号草稿

- Media ID：snS2bupQYF7HgHImnpl8sfPVnlMcYvH5eMXMOKpf6b622qZK9ks4HVv4iv8J8j5O
- 主题：newsroom；正文中文 2013 字（深度稿区间 2000–2800）；正文图 3 张 + 封面（共 4 图）。
- frontmatter：title / cover 绝对路径 / source_url=https://github.com/you-want/agnes-image-tool（阅读原文已落库）。
- 正文无 H1 重复标题；无 GitHub 外链（仅在文末以纯文字引导阅读原文）；2 条相关阅读均为脚本取自内链库的已群发真链：
  - 剪映逼我开会员后，我找到了这个免费工具
  - 把 tldraw 画布焊进 Codex：Cowart 让 AI 和你共享同一块画桌
- 建稿未触发 45166。
- digest 已由 set-digest.js 独立设置（独立摘要、含搜索关键词；--cover 与 --source-url 同传防回写清空），返回「✅ 更新成功」，封面与原文链接均保留。

## 知乎专栏草稿

- 草稿 ID：2084270394056373392
- URL：https://zhuanlan.zhihu.com/p/2084270394056373392
- 编辑：https://zhuanlan.zhihu.com/p/2084270394056373392/edit
- 模式：column + --markdown-file + --upload-images；uploaded_image_count=3 / embedded=3，3 图全部上传知乎 CDN（picx.zhimg.com）。
- 缓存：content-ops/<slug>/zhihu-cache/zhihu_column_draft_20260918_131943_*
- 未使用 compact HTML：纯 Markdown 列表+代码块+图片，无表格，间距简单，一次上传成功故无需重建。

## 素材

- 封面：微信 1280×544（cover-wechat.jpg，深色工作台+7860 窗口）、知乎 1600×900（cover-zhihu.png，终端代码卡），两版不同。
- 正文图：diagram-tabs（七标签能力矩阵）、diagram-8n1（帧数约束）、diagram-deploy（四条部署路径）。
- 生成脚本：content-ops/<slug>/gen_images.py（Pillow + Noto CJK）。
- 图片 QA：5 张全部经 vision_analyze 检查；微信封面初版标题重叠/被窗口遮挡，已重排修复；deploy 图「免费首选」小字误读改为「HF Spaces」、底部提示改两行；知乎封面功能列表去尾词避让代码卡。终版复检通过。

## 校验

- validate-payload.mjs --package：通过，0 建议项。
- AI 腔词汇扫描（总而言之/综上所述/值得一提的是等）：三稿均 0 命中。
