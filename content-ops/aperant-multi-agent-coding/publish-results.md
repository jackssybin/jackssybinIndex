# Aperant 三端推广发布结果（2026-11-10）

## 项目
- 仓库：https://github.com/AndyMik90/Aperant（前身 Auto Claude）
- 定位：自主多会话 AI 编码框架，Claude Code CLI 的桌面编排外壳（非自研模型）
- 数据（发布时实测）：14601 Star / 1890 Fork / TypeScript / AGPL-3.0
- 技术栈：Electron 40 + React 19 + Vite 7 + Zustand + XState + web-tree-sitter + libSQL
- 规模：1146 个 TS 文件、约 31.4 万行

## 核心祛魅（基于源码，非照抄 README）
- 本质：agent-process.ts 用 child_process.spawn 拉起 Claude Code CLI，靠 CLAUDE_CONFIG_DIR/OAUTH 做 profile 隔离；Aperant 只做编排/隔离/状态机/QA/合并
- 强依赖：Claude Pro/Max 订阅 + Claude Code CLI + git 仓库，三者缺一不可
- 12 终端：TerminalGrid.tsx 写死 3×4 网格常量（非营销数字），preload 注释佐证
- worktree：worktree-manager.ts 用 git worktree add/list --porcelain/批量回收，main 只读
- QA：qa-loop + QA_MAX_ITERATIONS；client/factory.ts 默认 maxSteps=200、简单任务=1
- 记忆：libSQL 图数据库（graph_nodes/edges/closure，闭包深度上限5）+ embedding 五级降级，hash 兜底无语义检索
- 安全四层：OS 沙箱、path-containment、命令白名单/denylist、secret-scanner；release 带 SHA256+VirusTotal

## 关键阶段风险（重点如实披露）
- 2.x 已进入维护模式，稳定版 v2.7.6，最新 beta v2.8.0-beta.6 发布于 2026-03-23，之后无新 release
- 3.0 在独立仓库从零重构（加云端，仍 AGPL-3.0），官方声明非弃坑
- 当前仓库 PR 暂停，针对 2.x 的代码 PR 会被关闭，只能走 issue/discussion
- AGPL-3.0：闭源 SaaS/对外网络服务需商业授权

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/10/aperant-multi-agent-coding.md
- 图片：static/images/aperant-multi-agent-coding/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo3 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/10/aperant-multi-agent-coding/

## 二、微信公众号（仅草稿）
- Media ID：snS2bupQYF7HgHImnpl8sT5C8_ohSbamPsC8FdeKR5qj05iCe0e3Ak-VP--sbDW5
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c3（cream 米黄 + 生气 + 橙#F97316，左翼12），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA
- 独立 digest 65 字、content_source_url=GitHub，draft/update errcode 0
- 引流模块 + 2 条真实内链（Claude Code ADHD、AI 副业地图）

## 三、知乎专栏（仅草稿）
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2103486339450778445
  - id 2103486339450778445，4 图传 CDN 裸 img，6 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生，脚本无删除功能）：id 2103486184328643034
- 封面发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 靛蓝+青绿数据流暗色风，区别于 Lightpanda 冷青、PostBot 暖紫
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检无乱码/叠印/裁切，封面无卡片遮挡
