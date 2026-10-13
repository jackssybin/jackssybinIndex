# 发布结果 · lemo-opuscar-code-rendered-films

项目：https://github.com/lemomo-ai/lemo-opuscar （MIT，Lemomo）
制作日期：2026-10-13

## 网站（已 push）
- 文件：content/articles/2026/10/13/lemo-opuscar-code-rendered-films.md
- URL：https://jackssybin.cn/articles/2026/10/13/lemo-opuscar-code-rendered-films/
- 图片：static/images/lemo-opuscar-code-rendered-films/（12 张）
- 校验：hugo --destination /tmp/hugo-test --minify --cleanDestinationDir → exit 0
- commit ad8fcfa 已推送到 main

## 微信公众号草稿（成功）
- Media ID：snS2bupQYF7HgHImnpl8sWFSSsXSK52V6rSSObVhRX8kq2Wa3QPRSJp1cP35fGXE
- 标题：6 分钟复刻 98 部奥斯卡画风，没用一秒 AI 视频模型：我扒完了这个 2.1k Star 仓库的源码
- 正文中文：2103 字（深度稿区间 2000–2800）
- 正文图：4 张（pipeline / style-grid / ink-wash / compare）
- 封面：media/cover-lemo-opuscar.jpg 1280×544，双翼版式（amber 深琥珀 + 惊讶姿态 + 绿#07C160 + 左翼巨字 43），verify_wings.py rc=0，人工双图验收通过；组合已追加 combo-history.md
- source_url：https://github.com/lemomo-ai/lemo-opuscar（阅读原文，已复核保留）
- digest：已独立设置（set-digest.js，封面保留、原文链接保留）
- 相关阅读：2 条本号已群发 mp.weixin.qq.com 真链接（Skill 设计稿、Claude Code ADHD）
- validate-payload.mjs：0 建议项
- 正文无任何外链（GitHub 仅走 frontmatter，规避 45166）

## 知乎专栏草稿（阻塞：cookie 过期）
- 计划标题：不用视频生成模型做电影：拆解 2.1k Star 的 Lemo-Opuscar，43 种画风全靠代码逐帧渲染
- 正文：zhihu.md，1605+ 中文字，冷静分析风，无公众号 CTA，结尾话题标签
- 封面：media/cover-zhihu.jpg 1600×900（与微信封面不同，人工验收通过）
- 失败点：图片上传接口 HTTP 401「无法解析的登录令牌」
- 原因：/root/.hermes/secrets/zhihu_cookie.txt 为 2026-08-31 的旧 cookie，登录态已失效（草稿是否创建未知，图片上传在建稿后失败）
- 重试：更新 cookie 后运行 `bash /root/.cache/tct/zhihu_step1.sh`（markdown+--upload-images），再按记忆流程取 payload CDN URL → 生成 zhihu-compact.html → --html-file 重提

## 素材来源（证据）
- 官方帧 docs/frames/*.jpg（MIT，代码渲染真实成片帧）
- opuscar98.jpg / opuscar98-styles.jpg（官方 banner）
- 自制证据图（PIL，Noto CJK，人工 vision 验收）：
  - pipeline.png 生产管线图（页面契约/时间线/四道质检）
  - compare.png 两路线五维对比（表格转图片，规避知乎丢表）
  - style-grid.png 12 风格矩阵
- 数据：2.1k star / 223 fork / 26 commits（2026-10-13 GitHub 页面实测）；98 部分布 2D77/2.5D4/3D17、片长 6:31（README）
- 关键源码依据：core/README 页面契约（READY/render/DUR/TEXTS）、TECHNIQUE.md（确定性、JPEG、on-twos、loudnorm −14LUFS）、setup.sh（sparse clone、分层依赖）、AGENTS.md（TREATMENT 先行、无署名）、requirements*.txt（Kokoro/edge-tts/whisper/numba）
- 未验证项：普通用户首片质量（README 未承诺，文中已明确提示先试短题材）

## 标题三候选（选用 1）
1.（结果量化/反差，选用）6 分钟复刻 98 部奥斯卡画风，没用一秒 AI 视频模型：我扒完了这个 2.1k Star 仓库的源码
2.（人群点名）做 AI 短片的都该看看：这个开源库让 Agent 写代码逐帧拍电影
3.（悬念提问）视频都在卷一键生成，为什么这个 2.1k Star 项目偏要让 AI 写代码？
