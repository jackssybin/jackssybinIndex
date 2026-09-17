# story-to-handdrawn-video 三端推广教程 — 发布结果

- 项目：https://github.com/gnipbao/story-to-handdrawn-video
- 仓库定性：Agent Skill + Remotion 渲染器，中文故事/有序图片 → 3:4 竖屏手绘日记动画（1080×1440，30fps，H.264 静音画面轨），20 画风
- GitHub 数据（API 核查 2026-09-17）：1,975 star / 276 fork；2026-07-21 创建，MIT，v1.1.0；实测 commit fbab5b2
- slug：`story-to-handdrawn-video-agent-skill`
- 日期：2026-09-17

## 三个备选标题

1. （选用·实测派）把中文故事丢给 Agent，自动出 1080×1440 手绘日记动画：我克隆实测了这个 2 千 star 开源 Skill（含一个 README 没说的坑）
2. （人群点名）做手绘故事短视频的看过来：这个开源 Skill 让 Agent 自己分句、出图、渲染，20 种画风
3. （反常识）一个月的开源项目，把「Agent Skill 该怎么写」示范明白了：以 story-to-handdrawn-video 为例

## 核心论点（差异化）

不是 README 搬运。克隆实测发现三层价值：①「Skill 决策 + Remotion 确定性渲染」两段式工程，硬契约由代码兜底；②文字→黑白→彩色左→右擦除的统一动画语法，中文默认本地毛笔字体零错字、黑白层 FFmpeg 本地派生；③20 风格是带负向约束+指纹防串味的机器配方库。同时诚实记录全新克隆 `npm run check` 退出码 1 的真实缺陷（自带 storyboard 引用 gitignore 的生成资产，tsc 单独通过，不影响 plan/render 主流程）及规避方法。

## 实测证据

- `npm ci` 干净；`--list-styles` 正常；`--mode plan`（两句故事+ink-wash）→ 2×5.3s 场景、风格指纹 5a7d9210946b9ccb、分镜/角色锁定/作业清单齐全，plan 不耗出图额度；`npm run build` exit 0。
- `npm run check` exit 1：validate-storyboard.mjs 校验 src/storyboard.json、src/storyboard.uploaded.json 引用 public/assets/generated/ 资产，该目录在 .gitignore；tsc 单跑 exit 0。
- 代码量：TSX 510 行 + mjs/py 2224 行；React 19.2 + Remotion 4.0.487。
- 仓库自带证据图：默认风格锚点 references/style-approved.png、20 风格 contact sheet（1440×2100）、ink-wash / whiteboard 单风格示例。

## 三端产物

### 1. 网站（Hugo）
- 文件：content/articles/2026/09/17/story-to-handdrawn-video-agent-skill.md
- 中文正文 3048 字，6 张正文图
- 构建：hugo --destination 临时目录 exit 0，页面与全部 6 图正常生成
- 发布：已 commit 并 push origin main（commit 3e3d8f4，rebase 后；首次 push 遇远端更新，pull --rebase 成功）
- URL：https://jackssybin.cn/articles/2026/09/17/story-to-handdrawn-video-agent-skill/

### 2. 微信公众号（草稿）
- 上传文件：wechat-upload.md（正文 2039 中文字，6 图；0 校验警告）
- publish.js newsroom github，输出 media id：
  `snS2bupQYF7HgHImnpl8sddH_ln0yPLGm-jy1l_PTAYuIHtN3oq1UA6rsY21K_dm`
- set-digest.js：独立摘要已写、封面保留、阅读原文→ https://github.com/gnipbao/story-to-handdrawn-video 已确认
- 转化区：公众号合集 + 星标；相关阅读 1 条（5 个 GitHub 副业地图，mp 永久链）
- 文末裸 GitHub 链未触发 45166
- 状态：草稿箱，待人工预览/群发

### 3. 知乎专栏（草稿）
- 上传文件：zhihu-upload.md，标题「如何评价story-to-handdrawn-video：把中文故事自动转手绘动画的开源Agent Skill？」
- zhihu_draft.py column --markdown-file --upload-images
- 草稿 URL：https://zhuanlan.zhihu.com/p/2083986470113638257
- 5 张正文图全部转 zhimg CDN，正文 0 本地路径残留（缓存 zhihu-cache/ 可核）
- 状态：草稿箱，待人工预览/发布

## 配图清单（10 个文件，均通过 vision QA，修过 3 处排版）

自绘 6 张：cover-wechat.jpg、cover-zhihu.png、diagram-pipeline.png、diagram-reveal.png、diagram-styles.png、diagram-audit.png
repo 证据 4 张：evidence-style-approved.jpg（默认彩铅三格长卷）、evidence-contact-sheet.jpg（20 风格总览）、evidence-style-inkwash.png、evidence-style-whiteboard.png（后两张网站/知乎备图，微信未用）

QA 修复记录：diagram-reveal 说明文字被底边裁切→加高到 900；diagram-audit 末卡「资产」溢出边界→缩短文案；diagram-pipeline 三个向下箭头错位→改为单居中转接箭头；diagram-styles 六卡底部小字统一溢出→缩字号。

## 待办

- 三端均为草稿，需人工预览确认后再发布；微信群发成功后把新文 mp 永久链追加进 wechat-internal-links.json
- 可向上游 issue 反馈 npm run check 在干净 clone 失败的问题（建议入库最小示例资产或校验跳过历史样例）
