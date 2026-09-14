# 发布结果 · ViMax

- 项目：https://github.com/HKUDS/ViMax （港大 HKUDS Agentic 视频生成框架，arXiv 2606.07649，MIT）
- slug：`vimax-agentic-video-generation-source-deep-dive`
- 日期：2026-09-14

## 网站 / Hugo
- 文件：`content/articles/2026/09/14/vimax-agentic-video-generation-source-deep-dive.md`
- 正文 3183 中文字，4 张正文图（3 张自制信息图 + 1 张官方 Web UI 截图）。
- 本地构建：`hugo --destination /tmp/hugo-vimax --minify --cleanDestinationDir` 退出码 0，产物 index.html 存在。
- 已 commit + push jackssybinIndex main（含 static/images 与 content-ops）。
- 预期 URL：https://jackssybin.cn/articles/2026/09/14/vimax-agentic-video-generation-source-deep-dive/

## 微信公众号（草稿，未群发）
- 上传文件：`wechat-upload.md`（title + 绝对路径 cover + source_url）。主题 newsroom(github)。
- 正文 2110 中文字，4 张正文图。validate-payload.mjs：0 建议项通过。
- Media ID：`snS2bupQYF7HgHImnpl8sU4kuoE5VC-NdM6fppPxCw0HHnTzIMiXjYejBdM1cEuO`
- source_url（阅读原文）：https://github.com/HKUDS/ViMax（建稿透传）。
- 相关阅读：2 条本号已群发 mp 短链（剪映免费工具 / 3.1 万 star Skill），正文无任何外部链接。
- ⚠️ 未完成项：`set-digest.js` 独立摘要回补命令连续两次被安全审批拦截（非内容问题），未重试。建稿时封面与阅读原文已就位，缺的仅是「摘要/副标题」字段。待用户批准后可单独补跑，命令为：
  `node scripts/set-digest.js <media-id> "<digest>" --cover .../cover-wechat.jpg --source-url https://github.com/HKUDS/ViMax`
  建议摘要文案：「港大 HKUDS 开源 Agentic 视频框架 ViMax（12.4k star，arXiv，MIT）。通读 1.37 万行源码：13 个专职 Agent、FAISS+rerank、静态动态特征分离、VLM 多候选选图、机位树、分级并发，并指出小说管线未完工等真实落差。」

## 知乎专栏（草稿，未发布）
- 上传文件：`zhihu-upload.md`，Markdown + `--upload-images`（仅运行一次成功，无重复草稿）。
- 标题：如何评价港大开源的 ViMax：读完 1.37 万行源码，我更在意它怎么解长视频一致性
- 草稿 ID：`2082794335494464254`
- URL：https://zhuanlan.zhihu.com/p/2082794335494464254 （编辑：/edit）
- 图片：uploaded=4，全部替换为 zhimg.com CDN，无本地路径残留。
- payload 间隔检查：`<p><br`/`<br><img`/`<p><img`/`<table>`/`<ol>`/`<ul>`/三连换行均 0，4 张裸 img，无需 compact HTML。表格在写作阶段已全部信息图化。

## 素材与一手证据
- 通读：13 个 agents/*.py（不是 14——初稿图中误写 14，已按目录实数修正为 13 并重新出图、vision 复核）、三条 pipelines（idea 271 / script2video 822 / novel2movie 1010 行）、agent_runtime、tools 供应商后端、tests、pyproject、configs、README_ZH。
- 关键源码点：
  - 一致性三层：global_information_planner 静态/动态特征分离+跨场景角色归并；reference_image_selector 选 ≤8 张参考；best_image_selector VLM 按人物/空间/文本三维度多候选选图。
  - FAISS.from_texts + similarity_search(k=10) + BGE rerank（novel2movie_pipeline 两处）。
  - camera_image_generator 的 CameraTree/construct_camera_tree/generate_first_frame/_validate_camera_tree。
  - asyncio 分级 Semaphore：检索10/场景8/融合8/提取5/基础肖像5/场景肖像3。
  - 供应商：GPT Image 2、Nano Banana、Seedream；Veo、Seedance2.0 Fast、Omni；OpenRouter；BGE。
  - tests/test_hang_guards.py 防无限轮询；idea2video 对 is_visible=False 画外音角色跳过肖像。
- 诚实落差（已写进三端）：novel2movie_pipeline.py 第 1 行 `# TODO: NOT IMPLEMENTED YET` + 中文吐槽注释，作者自述小说管线未完工（非空壳，文本规划/检索/融合已在）；编排框架本身不产图产视频，全靠外部付费 API，长片成本高；「电影级/小时级」为营销口径。
- GitHub API：12373 star / 1861 fork / 49 open issues / Python / MIT / 2025-03-30 建仓 / 2026-07-29 最近推送 / v1.2.0。

## 临时克隆
- /tmp/vimax-research 已清理。
