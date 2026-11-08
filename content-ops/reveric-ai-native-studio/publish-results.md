# Reveric 幻界 三端推广 — 发布结果

项目：https://github.com/looplj/reveric
数据基准：2026-11-08（GitHub API：724 Star / 178 Fork / 4 open issues）
建仓 2026-10-22（仅约 17 天）；Dart/Flutter，2064 个 .dart 文件、约 75.48 万行（含生成代码/多端脚手架）；v0.8.1，release 含 mac/win/linux/android 包
定位：Agent Native 桌面创作工作台，小说→剧本→无限画布→3D导演台→6轨剪辑；Local-First（SQLite/drift）+ BYOK
**协议：AGPL-3.0 主程序 + 插件 SDK（reveric-plugin-sdk）单独 MIT；闭源商用/SaaS 需商业授权（bababaa261@gmail.com）**

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/11/08/reveric-ai-native-studio.md`
- URL：https://jackssybin.cn/articles/2026/11/08/reveric-ai-native-studio/
- 正文图 3：architecture / pipeline / plugin；hugo exit 0；已推送（commit 4b7c087）

## 2. 微信公众号草稿

- 标题：《半个月 700 Star、75 万行代码：这个开源 App 想让 AI 帮你从小说一路做到成片》
- newsroom；draft media_id：`snS2bupQYF7HgHImnpl8sRShg0u-GwGYK_UzCJ4LEeFljtsVtThEJkQfgGVaHrHC`
- 封面：**cover-ip.jpg（米黄渐变 cream-grad + 生气表情 + 亮蓝，verify_wings rc=0 + vision）**；random 三候选自动选 c1，已记 combo-history
- 三必查：正文图 3、jk 引流+阅读原文(→GitHub)+相关阅读 2（tldraw Cowart、AI 设计 Skill，均内链库真实 URL；首版误用未入库的本号新稿链接已替换，空链=0）
- digest 116 字 errcode 0（首版 122 字精简）
- 状态：草稿未群发

## 3. 知乎专栏草稿

- 标题：《读完75万行Dart：半个月700 Star的Reveric，把Agent Native创作工作台做成了什么样》
- URL：https://zhuanlan.zhihu.com/p/2102877705964353450 （+/edit）
- compact HTML：图 3（content_image=3），无 pre/table，ul1/ol2 配平
- CDN：arch picx…816d / pipe picx…d240 / plugin picx…c306
- 标题封面需编辑器手动选 cover-zhihu.png
- zhihu-cache 临时图片草稿需后台清理
- 状态：草稿未发布

## 4. 配图与排查

- 文学书房暖调（墨色+羊皮纸+铜金+苔绿+陶土），呼应项目 DESIGN.md 反紫蓝渐变/玻璃拟态的纪律，4 图
- 本次开工先 grep `yy \+[0-9]$` 查漏等号（无命中），未复现上次 MediaCrawler 的叠印 bug；并用像素行扫描客观验证行数
- architecture 图 vision 两次报"下层卡片文字越界"，用像素列扫描证伪：卡片边框 y=560、末行文字最低亮像素 y≈504，留 56px，实际无越界（深色低对比图 vision 误判）；此前一次真实的背景高度不足已加高修复
- 教训复核：vision 与像素证据冲突时以像素为准，但首次报障仍先修一轮

## 5. 事实/边界

- 关键机制均有源码依据：Orchestrator/Subagent（CONTEXT.md）、tool_approval、loop_detector、4 类 hook、token_estimator、drift SQLite、entity_graph 关系语义（transition/resumption/correction 区分）、插件 IIFE+独立 context、ui.schema 生成 TS/Dart/Rust/JS 四套、skills-lock hash 校验
- 模型支持照 README：OpenAI/Anthropic/Gemini/DeepSeek/智谱/通义/Kimi/MiniMax + Seedance/Seedream/H3 + Ollama/OneAPI；README 挂 88API、秘塔赞助位（编排层非模型层如实写）
- 边界：AGPL 网络传染、仅 SDK 是 MIT、极早期 0.8.x、75 万行含生成代码不能等同手写体量、平台矩阵 Win/Mac/Android（Linux 仅 zip、无 iOS）
- 无旧稿重复（grep 仅 nav 无关外链）
