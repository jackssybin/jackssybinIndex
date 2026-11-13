# NovelToGame 三端推广发布结果（2026-11-11）

## 项目
- 仓库：https://github.com/zenstory-ai/novel-to-game
- 定位：7 个 Agent skill 组成的小说改游戏工作流（主语言 Markdown，非可执行软件），适配 Claude Code/Codex/Kimi Code
- 数据（发布时实测）：1003 Star / 136 Fork / MIT / v0.7.1 / 建仓 2026-07-18，最近 push 2026-11-11（活跃）
- 主页：https://zenstory.ai/zh/novel-to-game

## 源码核实的关键事实
- 7 个 skill：novel-to-game（总入口编排）+ novel-game-analyze/game-concept/game-world-design/game-art-direction/game-build/game-qa
- SOURCE_BIBLE 原著事实四分类：immutable/adaptable/open/conflicted，标注章回出处，原创标"设计发明"
- 概念硬否决：换皮模板、脱离核心冲突、伪互动等直接淘汰；设计文档分负责人，构建阶段不得推翻
- game-build 白盒先行（独立 Agent 模拟玩家）；game-qa 六项门禁 launch/render/input/coreLoop/outcome/restart，状态仅 NOT_RUN/FAIL/PASS
- 两个真实示例（均浏览器可玩、带完整工作区）：
  - 西游记·三借芭蕉扇：回合制 RPG，191 文件/1.09 万行 JS，verification.json 六项全 PASS，limitations 如实记未测环境
  - 金瓶梅·风月总账（18+）：互动影游，274 文件/4386 行 JS，五线 16 结局
- 安装：npx skills add zenstory-ai/novel-to-game -g -y -a claude-code -s '*'
- 边界：是 skill 非应用、产出取决于底层模型、消耗自有 Agent 额度、非 3A/商业引擎场景、配音默认关闭
- 区别于既有 cowart 稿（那是 tldraw Codex widget），本篇是方法论 skill 合集，无撞车

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/11/novel-to-game-skills.md
- 图片：static/images/novel-to-game-skills/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo5 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/11/novel-to-game-skills/

## 二、微信公众号（仅草稿）✅ 成功
- Media ID：snS2bupQYF7HgHImnpl8sRSNgeBt7YCgm15cAm9AmcaPv2nFu54RAFdxG4y-30jN
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c1（amber 深琥珀棕 + 得意 + 绿#07C160，左翼7），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA
- 独立 digest 66 字、content_source_url=GitHub，draft/update errcode 0（getcallbackip 验证 token 有效）
- 引流模块 + 2 条真实内链（Cowart 画桌、Claude Code ADHD）

## 三、知乎专栏（仅草稿）✅ 2026-11-13 cookie 更新后补发成功
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2104664563278930059
  - id 2104664563278930059，4 图传 CDN 裸 img，7 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生）：id 2104664398778450064
- 封面发布时手动选 cover-zhihu.png（1600×900）

### 历史（cookie 过期阶段，已解决）
~~## 三、知乎专栏（仅草稿）❌ 失败：登录令牌过期~~
- 失败现象：图片上传 HTTP 401「无法解析的登录令牌」
- 根因：/root/.hermes/secrets/zhihu_cookie.txt 的 z_c0 过期（文件停在 2026-10-13，近一个月未更新）；/api/v3/me 已返回登录页 HTML 而非 JSON
- 处理：未静默标成功，未产出任何知乎草稿；微信走独立认证不受影响
- 已备好补发物料：
  - zhihu.md（终稿，图片用 media/ 相对路径）
  - build_zhihu_html.py（IMG 映射待 CDN 回填，当前能生成离线 HTML 备份）
  - zhihu-compact.html（本地占位版，勿直接上传）
  - zhihu-retry.sh（cookie 更新后的一键补发流程）
- 用户需做：重新获取知乎 Cookie 写入 zhihu_cookie.txt（需真人登录/扫码，agent 无法自动完成），然后 bash zhihu-retry.sh，并按提示回填 CDN、删除首次 markdown 模式产生的多余草稿
- 封面发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 游戏霓虹风（深紫黑+电青+品红+琥珀），区别于前几篇商务/胶片风
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检无乱码/叠印/裁切，封面无卡片遮挡
