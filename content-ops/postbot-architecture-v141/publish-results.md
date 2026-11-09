# PostBot v1.4.1 三端推广发布结果（2026-11-09）

## 项目
- 仓库：https://github.com/gitcoffee-os/postbot
- 定位：开源多平台内容一键分发浏览器扩展（PostBot 内容同步助手）
- 数据（发布时实测）：1644 Star / 231 Fork / TypeScript / 修改版 Apache-2.0 / 最近 push 2026-11-06
- 版本：main 分支 v1.4.1（开发版）；官方稳定分支 v1.1.20

## 角度差异化（重要）
- 本仓库 2026-09-10 已有旧稿 postbot-multi-platform-content-sync（v1.1.20，源码隐私机制实测：不上传账号密码、DOM 自动化、多标签扇出）
- 本篇全新角度：**v1.4.1 架构演进实测**——单体扩展 → 35 个 @gitcoffee-os 模块包、插件引擎、AI 适配层、发布器矩阵；文中明确链接旧稿，不重复隐私机制内容

## 源码核实的关键事实
- package.json：35 个 @gitcoffee-os/* 内部依赖；101 个 TS 文件、约 1.95 万行
- src/media/publisher/platform：37 个 *.publisher.ts（文章11+动态11+视频9+音频6，勾稽=37）
- src/plugins：registry/injector/types/debug.plugin；src/ai-adapter/adapter.shared.ts 用 SchemaRegistry 懒单例 + chrome.storage 同步
- 诚实边界：主仓库 src 未检索到 Playwright/Hermes 等高级引擎实现，属可选生态集成；国际平台在独立 Postar 仓库
- LICENSE（修改版 Apache-2.0）：禁未授权多租户 SaaS（一个租户=一个 workspace）；前端不得去 LOGO/水印/版权；贡献代码可被商用；交互有外观专利

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/09/postbot-architecture-v141.md
- 图片：static/images/postbot-architecture-v141/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo-test2 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/09/postbot-architecture-v141/

## 二、微信公众号（仅草稿）
- Media ID：snS2bupQYF7HgHImnpl8sV_FbACdnRFYFl9KYnKWRNpMmgKWplCFNgroiPW8GTSZ
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c3（paper 冷白 + 喜爱 + 橙#F97316，左翼35），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA（数字勾稽 11+11+9+6=37 被验证）
- 独立 digest 70 字、content_source_url=GitHub，draft/update errcode 0
- 引流模块 + 2 条真实内链（剪映免费工具、终端编码 Agent）

## 三、知乎专栏（仅草稿）
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2103219727145365565
  - id 2103219727145365565，4 图传 CDN 裸 img，6 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生，脚本无删除功能）：id 2103219583679215226
- 封面发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 暖琥珀+紫罗兰工程风，区别于旧稿产品截图与 Lightpanda 冷青风
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检无乱码/叠印/裁切，封面无卡片遮挡
