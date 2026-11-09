# Lightpanda 三端推广发布结果（2026-11-09）

## 项目
- 仓库：https://github.com/lightpanda-io/browser
- 定位：用 Zig 从零写（非 Chromium/WebKit fork）的无头浏览器，面向 AI Agent 与规模化自动化
- 数据（发布时实测）：41,654 Star / 2,070 Fork / 11,903 commits / Zig / AGPL-3.0 / 昨天仍在更新
- 关键基准（官方 933 真实页面，AWS m5.xlarge，Chrome 143 对照）：100 页并发 123MB vs 2GB（≈16×）、5s vs 46s（≈9×）

## 一、网站端（Hugo，已本地构建验证）
- 源文件：content/articles/2026/11/09/lightpanda-zig-headless-browser.md
- 图片：static/images/lightpanda-zig-headless-browser/（cover-zhihu.png + 4 张正文图）
- 本地构建：`hugo --destination /tmp/hugo-test --minify --cleanDestinationDir` exit 0
- 产物：/tmp/hugo-test/articles/2026/11/09/lightpanda-zig-headless-browser/index.html
- 预期 URL：https://jackssybin.cn/articles/2026/11/09/lightpanda-zig-headless-browser/（push 后生效）

## 二、微信公众号（仅草稿，未群发）
- 草稿 Media ID：snS2bupQYF7HgHImnpl8sUZGMYlLnTwpKsrYSzWXCzoGDSIfDw7mBBjaPzMCEjPJ
- 主题：newsroom / github
- 封面：个人 IP 双翼版式 1280×544（随机选中 c3：cream 米黄底 + 委屈 pose + 蓝#3B82F6，左翼 16×），verify_wings rc=0 + vision 复检通过；combo-history 已追加
- 正文图：4 张（benchmark/architecture/usecases/limits，≥3 达标），均过 vision QA
- 独立 digest：61 字（≤120），draft/update errcode 0
- content_source_url（阅读原文）：https://github.com/lightpanda-io/browser
- 引流模块：jk 自述 + 在看星标 + 阅读原文 + 2 条真实内链（Rust 无头浏览器旧文 + 终端编码 Agent）

## 三、知乎专栏（仅草稿，未发布）
- 正式稿（compact HTML，采用此版）：
  - 专栏 URL：https://zhuanlan.zhihu.com/p/2103214333299838976
  - 草稿 id：2103214333299838976，state=draft
  - 4 图全部上传知乎 CDN 并以裸 img class=content_image 嵌入；1 个 <pre lang=bash> 代码块；5 个 h2
- ⚠️ 多余草稿待手动删除（首次 markdown 模式产生，脚本无删除功能）：
  - 旧草稿 id：2103214119050654938（同标题，state=draft），请到知乎后台删除
- 封面：发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 5 张图均 PIL + Noto Sans CJK 生成；grep 检查无 yy 漏等号
- 修复 2 处：① 知乎封面右侧数据卡遮挡主/副标题 → 重排版（标题右端 771 < 卡片左缘 1150）；② usecases 长参数 browserWSEndpoint 被截 → 改短表述
- 全部经 vision_analyze 复检：无乱码/叠印/裁切

## 合规与祛魅（已写入三端）
- 无图形渲染引擎、WPT 兼容性追赶中、仅 nightly、glibc 依赖、默认遥测可关
- AGPL-3.0：闭源 SaaS/对外网络服务需评估开源义务或商业授权
- 基准为官方 demo 站口径，文中明确提示用自己页面回归测试
