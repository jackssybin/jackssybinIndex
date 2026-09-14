# 发布结果 · niwo-render-everything

- 项目：https://github.com/MontageAI/niwo-render-everything （MontageAI 开源 Agent Skill，把任意内容做成短视频素材包）
- slug：`niwo-render-everything-agent-skill-short-video-bundle`
- 日期：2026-09-14

## 网站 / Hugo
- 文件：`content/articles/2026/09/14/niwo-render-everything-agent-skill-short-video-bundle.md`
- 正文 2850 中文字，5 张正文图（3 张自制信息图 + 2 张仓库一手截图）。
- 本地构建：`hugo --destination /tmp/hugo-test --minify --cleanDestinationDir` 退出码 0，产物 `articles/2026/09/14/<slug>/index.html` 存在。
  - 坑：初稿 date 设为当天 11:30（晚于系统时间 09:44），Hugo 默认跳过未来日期导致文章不渲染；改为 09:30 后正常。
- 已 commit + push 到 jackssybinIndex main（含 static/images 与 content-ops），线上预期 URL：https://jackssybin.cn/articles/2026/09/14/niwo-render-everything-agent-skill-short-video-bundle/

## 微信公众号（草稿，未群发）
- 上传文件：`wechat-upload.md`（frontmatter title + 绝对路径 cover + source_url）。
- 主题：newsroom（github）。正文 2124 中文字，5 张正文图。
- Media ID：`snS2bupQYF7HgHImnpl8sWmG6dxVe8jQPXtZIchRPdsFKGoM_WPB9BoEW4jzUBSU`
- source_url（阅读原文）：https://github.com/MontageAI/niwo-render-everything（建稿即透传，set-digest 复核保留）。
- set-digest.js 已回补独立摘要（区别于标题、含搜索关键词），封面保留。
- 相关阅读：用 pick-related-links.mjs 取，采用 1 条真内链（剪映免费工具，视频主题相关）+ 1 条 Skill 主题真内链（3.1 万 star Skill）；均为 mp.weixin.qq.com 已群发短链。
- validate-payload.mjs：0 建议项，通过。
- 注意：正文未放任何外部链接（repo 仅出现在 frontmatter source_url），避免 45166。

## 知乎专栏（草稿，未发布）
- 上传文件：`zhihu-upload.md`，Markdown + `--upload-images` 模式（全局参数 --cookie-file/--cache-dir 在 column 子命令之前）。
- 标题：如何评价开源项目 niwo-render-everything：读完 Skill 定义，我更关心它的协议设计
- 草稿 ID：`2082768241605329943`
- URL：https://zhuanlan.zhihu.com/p/2082768241605329943 （编辑：/edit）
- 图片：uploaded_image_count = 5，全部替换为 zhimg.com CDN，正文无本地路径残留。
- payload 间隔检查：`<p><br` / `<br><img` / `<p><img` / `<table>` / `<ol>` / `<ul>` / 三连换行均为 0，5 张裸 img，无需 compact HTML 重建。
- 表格已在写作阶段全部信息图化（无 Markdown/HTML 表格）。
- 仅运行过一次成功的上传（第二次被安全拦截未执行），无重复草稿。

## 素材与证据
- 一手证据：克隆仓库通读 SKILL.md（425 行）、content-schema.md、manifest-schema.md、validate_bundle.py（689 行）、skill_update.py（237 行）、version.json（v1.0.0, 2026-09-04）。
- 一手截图：仓库 docs/ 的 flow、niwo-studio、chatgpt-branch-work。
- 自制图：diagram-pipeline / diagram-schema / diagram-formats，双封面 cover-wechat(1080x864) / cover-zhihu(1600x900)；vision 逐张确认中文无乱码、无溢出。
- GitHub API：约 129-130 star、2 fork、Python、2026-08-10 建仓、2026-09-04 最近推送。
- 诚实标注的未验证/风险点：README 有 MIT 徽章但仓库根无 LICENSE 文件、API license=null（建议商用前提 Issue 核实）；「70+ agents」仅生态徽章，官方实测只有 ChatGPT 工作模式与 Codex；渲染工作台内测需邀请码；仓库为只读镜像不接受 PR。

## 临时克隆清理
- /tmp/niwo-research（外部仓库克隆）可在收尾后删除。


## 2026-09-14 微信稿修复（用户反馈）
- 问题①「相关阅读」点不动：根因 wenyan 默认 --footnote，正文链接被转为 [n] 脚注角标、真链移到文末「引用链接」。已在 wechat-toolkit theme_catalog.js buildPublishArgs 加 `--no-footnote` 根治。
- 问题②标题重复：wechat-upload.md frontmatter title 已是微信标题，正文首行 `# H1` 又被当正文渲染。已删除正文 H1。
- 按用户要求文末新增 GitHub 裸链（微信建稿通过，未触发 45166；服务端正文为裸文本，可复制/长按识别，「阅读原文」仍为正式跳转）。
- 修复版 Media ID：`snS2bupQYF7HgHImnpl8sZXNcjWXMksO3rPgWoJ-uDj_lCKeH6wZZHYtHu-dGtxQ`，digest/封面/原文已回补；服务端核验 H1=0、footnote=0、相关阅读为真 a 链接、文末有 GitHub。
- 旧草稿 …WmG6dxVe8jQ…UBSU 已删除（用户确认）。
