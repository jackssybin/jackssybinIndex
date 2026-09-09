# book-to-skill 三端推广发布结果

项目：book-to-skill（把技术书/文档转换成结构化 Agent Skill）
仓库：https://github.com/virgiliojr94/book-to-skill （MIT，v1.4.0）
日期：2026-09-09
Slug：book-to-skill-agent-skill

## 标题候选（不同钩子，已选 #1 上微信）
1. 结果量化（采用）：一本技术书读完就忘？开源 book-to-skill 让 Agent 替你记住，提问 token 直降51倍
2. 人群点名：用 Claude Code 读书总幻觉？把书转成 Skill 按需加载，token 省 51 倍
3. 踩坑故事：读完就忘的技术书，我让 Agent 替我记住了：book-to-skill 实测

## 网站（Hugo / jackssybinIndex）
- 状态：✅ 已提交并 push main
- 文章：content/articles/2026/09/09/book-to-skill-agent-skill/book-to-skill-agent-skill.md
- 正文约 3500 字；封面 /images/book-to-skill-agent-skill/wechat-cover.jpg
- 正文图 3 张（01-showcase / 02-extractor-output / 03-architecture）
- 本地 hugo 构建：⏭️ 跳过（用户偏好不本地校验）

## 微信公众号草稿
- 状态：✅ 上传成功（draft，未群发）
- Media ID：snS2bupQYF7HgHImnpl8sdAWO_qNB3gZnGqxO3uOIam8lLxBvRSWdPxrIikTSQ0l
- 正文中文 2152 字（深度稿区间 2000–2800），正文图 3 张
- 封面 1080×864 JPG
- 转化三件套：人设+星标 / 阅读原文 / 相关阅读 已齐
- validate-payload：✅ 0 建议项

## 知乎专栏草稿
- 状态：✅ 上传成功（draft，未发布）
- URL：https://zhuanlan.zhihu.com/p/2081154735802000397
- uploaded_image_count：3（zhihu-cover / 02-extractor-output / 03-architecture，均已替换为 zhimg CDN）
- 模式：column --markdown-file --upload-images
- 封面用 1600×900 知乎款，与微信封面不同

## 一手证据
- 本机实跑 python3 scripts/extract.py（葡语 Capítulo fixture，准确识别 3 章 numeric）
- 官方 tiktoken 实测：单问题 24×/35×/51×；生成成本约 $1/本；pdftotext 0.1s vs docling 164s（48 表 36 代码块）
- 工程洞察：多语言数字章节正则；pro git/Moby-Dick 无法自动分段；扫描 PDF 立即中止提示 OCR；确定性提取器 + spec 生成器解耦；cheatsheet v1.0 从名词表改为 32 条决策规则
