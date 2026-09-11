# 发布结果 — Y2A-Auto（YouTube → AcFun/bilibili 自动搬运流水线）

- 仓库：https://github.com/fqscfqj/Y2A-Auto （GPL v3，Python 3.11+，3256 star / 549 fork，2026-09-11 仍活跃）
- slug：`y2a-auto-youtube-to-bilibili-acfun-pipeline`
- 生成时间：2026-09-11 21:40 (+08:00)

## 一手研究证据
- 浅克隆到 /root/.cache/tct/Y2A-Auto 通读源码：109 个 .py，合计 50,849 行；task_manager.py 8,497 行。
- 核心机制：8 阶段 PIPELINE_STAGE_ORDER（fetch_info→translate_content→generate_tags→recommend_partition→moderate_content→download_video→translate_subtitle→upload），checkpoint 持久化 tasks.pipeline_checkpoint，重启回收 in-flight 任务续跑。
- 字幕 QC 分层（规则硬拦截 + AI 抽样，阈值0.60/80条/9000字符），QC 失败跳过烧录但继续传；srt_transform_engine 42字符/2行等后处理。
- 转载声明 UPLOAD_APPEND_REPOST_NOTICE 默认 true（acfun_uploader.py:84）。
- YouTube 监控太平洋时区配额预算、不推进游标防漏；AI Chat Completions/Responses 双协议逐级降级；HEVC 硬编 nvenc/qsv/amf/vaapi 回退 libx264。
- 3 张官方真实后台截图 + 自绘 8 阶段流水线图。

## 网站（Hugo / jackssybinIndex）
- 文章：content/articles/2026/09/11/y2a-auto-youtube-to-bilibili-acfun-pipeline.md（约 3700 中文字）
- 图片：static/images/y2a-auto-youtube-to-bilibili-acfun-pipeline/（cover-wechat.jpg + 01/02/03/04 共 5 个）
- frontmatter 完整性：slug/date/lastmod/description/topic/topicSlug/layout:article/contentType:article/cover 全齐；无 {{< shortcode >}}、无 $(date) 占位；3 张正文图 site-relative 路径均存在。
- 本机无 hugo，未做本地整站构建（沿用 CI 部署）；已做静态等价检查。
- 已 commit + push main（见下）。

## 微信公众号草稿
- Media ID：snS2bupQYF7HgHImnpl8sb1cOS8o8lxGeT5CDdj7bx_y-OLu7Y8CBh45tIsN2-d4
- 主题：lapis；正文 2085 中文字；正文图 3 张（02 流水线 + 01 dashboard + 03 monitor）。
- frontmatter：title + cover(绝对路径 1080×864 JPG) + source_url=https://github.com/fqscfqj/Y2A-Auto。
- 阅读原文：content_source_url 已落库为仓库地址（set-digest --source-url 复核，无正文外链，不触发 45166）。
- 独立 digest（100 字，异标题、铺搜索词）：
  「开源Y2A-Auto实测：丢YouTube链接自动听写翻译中文字幕并传AcFun/B站。读5万行源码拆解8阶段断点状态机、字幕QC质检、转载声明、监控配额与硬编回退，附Docker部署与版权风控提醒。」
- 相关阅读（取脚本从 wechat-internal-links.json 按"视频/剪辑/下载"随机取的 2 条本号已群发真内链）：
  - 找了半年终于找到：全平台媒体下载神器开源了
  - 剪映逼我开会员后，我找到了这个免费工具
- 校验：validate-payload.mjs exit 0，0 ERROR 0 WARN。
- set-digest 回写：封面 thumb_media_id 保留，content_source_url 正确。

## 知乎专栏草稿
- 草稿 ID：2081859381919069722
- 编辑链接：https://zhuanlan.zhihu.com/p/2081859381919069722/edit
- 模式：column，Markdown + --upload-images；uploaded_image_count=3/3，embedded=3/3（均已替换为 picx.zhimg.com CDN）。
- 正文 2082 中文字；无表格（无 | 表格行、无 <table>/<ol>/<ul>）；冷静论证风，无公众号式 CTA。
- 封面：知乎专栏封面后台手动关联（API 不可设）。建议用 media/cover-zhihu.jpg（1600×900）。

## 合规边界（已在三稿显著位置写明）
版权/授权是第一位（转载声明≠授权）；自动上传与 Cookie 登录有平台封号风险，建议小号先试+保留人工审核；ASR/翻译/QC 走外部大模型有 Token 成本，阿里云 Green 另收费；三份平台 Cookie 需妥善保管。
