# 发布结果：HelpWriting 三端教程（2026-09-22）

## 网站（Hugo，已 commit + push）

- 文章：`content/articles/2026/09/22/helpwriting-local-ai-content-workbench-deep-dive.md`
- 预期 URL：<https://jackssybin.cn/articles/2026/09/22/helpwriting-local-ai-content-workbench-deep-dive/>
- Commit：`22276df`（rebase 后），已 push 到 main
- Hugo 校验：`hugo --destination /tmp/hugo-hw --minify --cleanDestinationDir` exit 0，文章 HTML 存在

## 微信公众号（草稿，newsroom 主题）

- 状态：✅ 建稿成功
- Media ID：`snS2bupQYF7HgHImnpl8scx_bnyK54epqy5EGStddD7dhTSwndWQOYg5bM_cQnuP`
- 标题：做公众号还在五六个工具间来回搬？这个本地软件把选题、写作、去AI味、排版、传草稿全包了
- 封面：cover-wechat.png（1080x864，深蓝渐变 + 钢笔图形）
- 正文：中文 1,367 字（quick-take 与 deep-dive 之间，含三层 humanizer、维度引擎、朱雀误判、NOTICE 协议陷阱等硬信息，3 张正文配图）
- source_url（阅读原文）：https://github.com/lfdc-code/helpWriteing
- digest 已独立设置（约 110 字，含 CrewAI/AIForge/八段管线/34套模板/三层去味/源码可见 等搜索词），封面与原文链接已保留
- 正文无任何外链（仓库链接只走 frontmatter），validate-payload 0 ERROR

## 知乎专栏（草稿，Markdown + 图片上传模式）

- 状态：✅ 建稿成功
- 草稿 ID：`2085674216687457580`
- URL：<https://zhuanlan.zhihu.com/p/2085674216687457580>
- 标题：如何评价 GitHub 项目 HelpWriting：一个把公众号选题、写作、去AI味、排版、传草稿串起来的本地工作台
- 上传模式：Markdown column `--upload-images`；uploaded_image_count=3（pipeline / de-ai-flavor / capability-map），均替换为知乎 CDN
- 缓存：`content-ops/helpwriting-local-ai-content-workbench-deep-dive/zhihu-cache/`（勿重跑）

## 本篇核心非显而易见信息

1. 默认分支 develop 只有 LICENSE，实际代码在 master-pro 分支；
2. LICENSE 标 Apache 2.0，但 NOTICE 追加非商业、禁止未经授权分发与 SaaS 条款 → 法律性质为 source-available；
3. 仓库自带朱雀检测截图中，内置 AI 样本被判 80.44% 人工特征、AI 特征 0%，检测器自身误判，反证「去 AI 味」的真实考官是真人读者；
4. 开源版 license 模块空实现，商业版才启用授权。

## 验证记录

- `validate-payload.mjs --package ...`：0 ERROR / 0 警告
- 微信/知乎封面不同；全部图片为 PIL 生成或仓库自带实证，无中文乱码（已视觉核验 pipeline 图与朱雀截图）
- 三端为草稿/网站已发，未群发、未公开知乎文章
