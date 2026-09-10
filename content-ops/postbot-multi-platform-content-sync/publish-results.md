# PostBot 三端发布结果

- 项目：https://github.com/gitcoffee-os/postbot （PostBot 内容同步助手，浏览器扩展）
- 文档：https://postbot.exmay.com/docs ；CLI：https://github.com/gitcoffee-os/postbot-cli ；国际版 Postar
- 仓库数据（2026-09-10 实测）：1376 star / 189 fork，TypeScript，2025-05-30 创建，main 为开发版（稳定 tag v1.1.20）
- slug：`postbot-multi-platform-content-sync`

## 论点与一手证据

- 论点：不接平台开放 API、不存账号密码，靠「浏览器本地登录态 + 内容脚本 DOM 自动化 + 多标签页扇出」实现一键多平台分发，本质是本地 RPA；信任模型从"信厂商服务器"变为"信扩展本身"。
- 源码证据（克隆通读，src 约 1.9 万行 TS，发布逻辑约 1.6 万行）：
  - 37 个发布器：article 11 / moment 11 / video 9 / audio 6（src/media/publisher/platform/ 逐文件统计）；
  - 知乎发布器 article/zhihu.publisher.ts(306行)：MutationObserver 等元素、ClipboardEvent 粘贴注入正文、DataTransfer 写 `<input type=file>` 传图、isAutoPublish 控制点不点发布；
  - 多标签调度 publisher.script.ts：tabs.create + tabGroups + onUpdated complete 后 executeScript 注入，executed 防重入；cn/it/industry 三组合并注册表；
  - manifest 权限：host https://*/*、localhost，tabs/scripting/storage/downloads/clipboardRead/sidePanel；
  - 技术栈 Plasmo(Chrome MV3)+Vue3+AntDV+Tailwind，正文抽取 @mozilla/readability；默认引擎零 AI Token，Playwright/MCP/CLI/AI 为可选层。
- 截图：官方文档一手图（postbot.exmay.com），裁剪为发布工作台/平台账号区/同步弹窗 3 张；封面为自绘信息图，vision QA 中文无乱码（微信封面视频号节点首版被标题压住，已下移重绘复检）。
- 标题候选（3 选 1，选用人群+对比型）：
  1.（已选）一篇稿子一键发十几个平台：开源扩展 PostBot 源码实测，不上传账号密码怎么做到的
  2.（人群点名）同时运营5个平台的自媒体，都该看看这个1376星开源浏览器扩展
  3.（平替对比）付费分发SaaS每年几百块，这个开源扩展不要你的账号密码

## 网站（Hugo / jackssybinIndex）

- content/articles/2026/09/10/postbot-multi-platform-content-sync.md（约 3300 中文字，3 图）
- static/images/postbot-multi-platform-content-sync/（5 张）
- frontmatter 含 date/lastmod/description/topic/topicSlug/layout:article/contentType:article/cover；无占位符、无 shortcode 图。
- 已 push main：53c83ec（按 jk 偏好不本地 hugo 校验）。

## 微信公众号草稿

- wechat-upload.md：正文 2212 中文字，3 图；**无正文 H1**（frontmatter title 即标题，避免标题在正文重复，2026-09-10 新规则）。
- 封面 cover-wechat.jpg 1080×864 JPG；validate-payload.mjs 通过，0 建议；相关阅读为纯文本（规避 45166）；转化三件套齐全。
- Media ID：snS2bupQYF7HgHImnpl8sd2WQpAV-meMEI5y1diGcQAp06a166O6ZNgVqAAqkzdX
- 首次回写 digest 时把封面清空（draft/get 返回 thumb_media_id 恒为空，原样 update 覆盖），已用 material/add_material 重新上传 cover-wechat.jpg 回填，复核 thumb_media_id=64 位非空，封面恢复正常。
- 独立 digest（104 字，与标题不同、铺搜索词）：
  「开源浏览器扩展 PostBot 源码实测：公众号/微博/小红书/知乎/抖音/B站等十几个平台一键同步分发，复用本地登录态自动填表，不上传账号密码、默认零AI Token。附37个发布器与多标签自动化实现拆解。」
- 后台：https://mp.weixin.qq.com/ 草稿箱

## 知乎专栏草稿

- 标题：如何评价开源多平台内容分发工具 PostBot？读了1.9万行源码后说点实际的
- 模式 column + Markdown --upload-images，4 图全部 zhimg CDN。
- 草稿 ID：2081544228585332964；编辑：https://zhuanlan.zhihu.com/p/2081544228585332964/edit
- 正文 1738 中文字，论点先行、无公众号 CTA、结尾一句克制专栏引导；无 pipe 表、无 `<table>`；4/4 图 uploaded。

## 风险/边界（已写入文章）

- 平台风控：DOM 自动化频率过高可能触发异常检测，建议手动确认、控节奏、勿用主号高频测。
- 易碎：选择器与页面强耦合，平台改版会致发布器失效；sleep+Observer 混合等待。
- 权限：全网页 host 权限，信任模型=信扩展，建议自构建未打包加载、不用时停用。
- 本地化局限：发布需本机开机在线，无 SaaS 式云端定时/多人协作。
- License：GitCoffee Open Source License（Apache-2.0 + 附加限制），商用前读附加条款；main 为开发版用 v1.1.20。
