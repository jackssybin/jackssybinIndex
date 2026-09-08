# OpenMontage 三端推广发布结果

项目：OpenMontage（首个开源 Agent 视频制作系统）
日期：2026-09-08
Slug：openmontage-agentic-video-production

## 网站（Hugo / jackssybinIndex）

- **状态**：✅ 已发布
- **文章路径**：`content/articles/2026/09/08/openmontage-agentic-video-production.md`
- **封面**：`/images/openmontage-agentic-video-production/wechat-cover.jpg`
- **正文图片**：4 张（showcase + pipeline-flow + tool-matrix + agent-first）
- **Commit**：aa511ca
- **Frontmatter 完整性**：
  - ✅ url/slug
  - ✅ date (ISO 8601 +08:00)
  - ✅ lastmod
  - ✅ description
  - ✅ topic / topicSlug
  - ✅ layout: article
  - ✅ contentType: article
- **本地 Hugo 构建**：⏭️ 跳过（用户偏好：不本地运行 hugo 校验）
- **推送**：✅ main 分支 push 成功

## 微信公众号草稿

- **状态**：✅ 上传成功
- **标题**：登顶 GitHub Trending 的 OpenMontage：一句话，AI 帮你做完一整条视频
- **封面**：1080×864 JPG（wechat-cover.jpg）
- **正文字数**：约 2116 中文字符
- **正文图片**：4 张（showcase + pipeline-flow + tool-matrix + agent-first）
- **主题**：newsroom（Newsroom / 报刊室）
- **代码高亮**：github
- **Media ID**：snS2bupQYF7HgHImnpl8sSNOtgBvo8COXo09V7ssv3lZ7awyC0xaRP5qNUYhMgN1
- **发布命令**：`node publish.js wechat-upload.md newsroom github`

### 发布过程中的问题与解决

1. **45166 内容审核不通过**：
   - 原因：相关阅读部分的 Markdown 内部链接 `[text](/articles/...)` 触发微信内容安全审核
   - 解决：将相关阅读从链接格式改为纯文本列表格式
2. **53402 封面裁剪失败**：
   - 原因：JPEG 编码参数问题
   - 解决：重新保存为 quality=85 的标准 JPEG

### Conversion Footer

- ✅ 个人介绍 + 关注/在看/星标提示
- ✅ 阅读原文指向 GitHub 项目
- ⚠️ 相关阅读：纯文本（无链接），因微信审核不通过 Markdown 内部链接

## 知乎专栏草稿

- **状态**：✅ 上传成功
- **标题**：OpenMontage 深度解析：首个开源 Agent 视频制作系统，到底是真创新还是新瓶装旧酒？
- **模式**：Markdown + --upload-images
- **草稿 ID**：2080686592876979238
- **草稿 URL**：https://zhuanlan.zhihu.com/p/2080686592876979238
- **编辑 URL**：https://zhuanlan.zhihu.com/p/2080686592876979238/edit
- **上传图片数**：3 张（pipeline-flow + tool-matrix + agent-first）
- **embedded_image_count**：3
- **状态**：draft
- **表格处理**：文章中的所有表格已转为标题+列表格式（知乎不支持 Markdown/HTML 表格）

## 配图清单

| 文件名 | 尺寸 | 用途 | 平台 |
| --- | --- | --- | --- |
| wechat-cover.jpg | 1080×864 | 微信封面 | 微信 + 网站 |
| zhihu-cover.png | 1600×900 | 知乎封面 | 知乎（需手动设置） |
| 01-showcase.jpg | repo 原图 | 项目展示 | 全站 |
| 02-pipeline-flow.png | 1400×500 | 7 阶段流水线图 | 全站 |
| 03-tool-matrix.png | 1300×560 | 57 个工具矩阵图 | 全站 |
| 04-agent-first.png | 1400×480 | Agent-First vs 传统架构对比 | 全站 |

## 文章核心论点

> OpenMontage 的核心价值不是「能生成视频」，而是把 AI 视频生成从单步操作变成了完整的生产流水线。
> 其 Agent-First 架构（没有中央编排器，全靠 Agent 读 Markdown 技能驱动）代表了一种新的软件范式。

## 跳过/调整项说明

1. **网站 Hugo 本地构建**：按用户偏好跳过（2026-09-07 确认）
2. **微信相关阅读链接**：因微信内容审核不通过 Markdown 内部链接，改为纯文本列表
3. **知乎封面**：知乎草稿 API 不支持设置封面，需手动在编辑后台设置
4. **zhihu-compact.html**：本次使用 Markdown + --upload-images 方式上传，未生成 compact HTML（3 张图量较小，间距问题风险低）
