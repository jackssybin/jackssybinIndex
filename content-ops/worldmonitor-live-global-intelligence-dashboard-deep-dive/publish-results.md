# 发布结果：worldmonitor-live-global-intelligence-dashboard-deep-dive

- 项目：https://github.com/koala73/worldmonitor（AGPL-3.0，87.1k Star / 13.2k Fork / 7,596 commits，取证时间 2026-09-20）
- 选题论点：不是新闻聚合墙，而是「关联表面 + 面向 AI Agent 的实时世界数据接口」；硬证据 = 线上仪表盘实测截图、CII v8 实时排名实测、无密钥 MCP tools/list 实测返回 75 工具；工程洞察 = 服务器权威评分、protobuf 契约网关、POST→GET all-or-nothing、六档缓存 TTL、CII 民主/威权差异化抗议计分。

## 网站（Hugo）
- 文章：content/articles/2026/09/20/worldmonitor-live-global-intelligence-dashboard-deep-dive.md（约 3,300+ 中文字，5 张图）
- 图片：static/images/worldmonitor-live-global-intelligence-dashboard-deep-dive/（8 个文件）
- Hugo 校验：`hugo --destination /tmp/hugo-test --minify --cleanDestinationDir` exit 0，文章 HTML 正常生成。
  - 踩坑：初版 date 设为当天 18:00（未来时间，北京当时约 17:35），Hugo 静默跳过未来日期文章；改为 16:30 后正常。
- Git：commit + push origin main 成功（rebase 远端新提交后推送，9e561c5）。

## 微信公众号（草稿）
- 标题：87000 Star 的开源世界地图：新闻、航线、油价全叠在一张图上，还白送 AI 75 个工具
- Media ID：snS2bupQYF7HgHImnpl8sWTgmAzjCkjlpV14JCFqvEBVwrso5B6nrAEjBfvwfeq-
- 主题：newsroom（github 来源），正文 1,997 中文字，4 张正文图，封面 cover-wechat.png 1080x864
- source_url（阅读原文）：https://github.com/koala73/worldmonitor，set-digest.js 回读确认 content_source_url 已落库
- 独立摘要已设置（set-digest.js 更新成功，封面保留）：
  「开源情报仪表盘 World Monitor 实测：461 个信息流叠进同一张地图，CII v8 国家不稳定评分算法拆解，75 个 MCP 工具可免费接入 AI Agent，含 Docker 自托管与适用人群判断。」
- 正文无任何外链；相关阅读 2 条均为本号已群发 mp.weixin.qq.com 短链（pick-related-links.mjs，主题 AI Agent/开源，随机回退）。
- 未在正文末尾放 GitHub 裸链（本期选择仅 frontmatter source_url 方案，规避 45166）。

## 知乎专栏（草稿）
- 标题：87000 Star 的开源项目 World Monitor：给 AI Agent 用的实时世界数据接口长什么样
- 草稿 ID：2085063070473365469
- 编辑链接：https://zhuanlan.zhihu.com/p/2085063070473365469/edit
- 模式：column + Markdown + --upload-images，4 张本地图全部上传成功（uploaded_image_count=4，CDN picx.zhimg.com），风格为冷静分析、无公众号 CTA。
- 封面未通过脚本设置（column markdown 流程不支持封面字段），如需封面可在知乎后台草稿编辑器手动添加 cover-zhihu.png（1600x900）。
- 未重跑脚本（避免重复草稿）；zhihu-cache/ 仅 17:49:31 一批产物。

## 验证
- validate-payload.mjs --package：通过，0 ERROR 0 建议项。
- 中文配图经视觉检查：无乱码/问号/截断；微信与知乎封面不同（1080x864 雷达风 vs 1600x900 技术风）。
- 临时克隆 /root/.cache/tct/worldmonitor 保留在缓存目录（调研产物），无凭据读取。
