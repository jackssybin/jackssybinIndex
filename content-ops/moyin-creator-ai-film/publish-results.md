# 魔因漫创 moyin-creator 三端推广 — 发布结果

项目：https://github.com/MemeCalculate/moyin-creator
数据基准：2026-11-05（GitHub API：4,826 Star / 966 Fork / 33 open issues）
建仓 2026-02-09；TypeScript，Electron 30 + React 18，src+electron 约 10.66 万行；定位 AI 影视生产级工具，深度集成 Seedance 2.0
**协议：AGPL-3.0 + 商业许可双轨（非 MIT/Apache，网络传染性，SaaS 也要开源；闭源商用需买授权）**；npm 包名 moyin-creator v0.2.3，安装包 0.1.7；last push 2026-08-27

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/11/05/moyin-creator-ai-film.md`
- URL：https://jackssybin.cn/articles/2026/11/05/moyin-creator-ai-film/
- 正文图 3：pipeline / group-ref / batch；hugo exit 0；已推送（commit d47cfe5）

## 2. 微信公众号草稿

- 标题：《4800 Star 的开源 AI 影视工厂：给个剧本，它自己拆分镜、定角色、批量出成片》
- newsroom；draft media_id：`snS2bupQYF7HgHImnpl8sY16TZQ16vP9DCHIB4zEtFggNYEZ9x9pw6z3ImFeIig0`
- 封面：**cover-ip.jpg（深墨蓝 navy + 开心表情 + 亮绿，verify_wings rc=0 + vision）**；random 三候选自动选 c1（上一篇 MediaCrawler 是冷白，自动错开），已记 combo-history
- 三必查：正文图 3、jk 引流+阅读原文(→GitHub)+相关阅读 2（剪映免费工具、AI设计Skill），内链均用内链库真实 URL（首版误留 /s/ 空链，已修，空链计数=0）
- digest 118 字 errcode 0（首版 122 字偏长精简）
- 状态：草稿未群发

## 3. 知乎专栏草稿

- 标题：《拆完10万行TypeScript：开源AI影视工厂魔因漫创，工程亮点与AGPL边界一次讲清》
- URL：https://zhuanlan.zhihu.com/p/2102296749964539789 （+/edit）
- compact HTML：图 3（content_image=3），无 pre/table，ul/ol 配平；md 内表格转段落
- CDN：pipeline picx…3fae / group pic1…e26f / batch picx…ac61
- 标题封面需编辑器手动选 cover-zhihu.png
- zhihu-cache 临时图片草稿需后台清理
- 状态：草稿未发布

## 4. 配图严重 bug 与排查（重要经验）

- 现象：batch.png / group-ref.png 多行要点全部叠在同一 y，vision 报"叠印乱码+大片空白、每卡只显1行"
- 根因：gen_images.py 把 `yy+=72/78/90` 误写成表达式 `yy+72`（无赋值，游标不前进，Python 不报错）；首版 vision 在 cover/pipeline 上正常，问题图上 vision 两次准确报错
- 排查走了弯路：先怀疑 vision 误判，用纯 PIL 像素行扫描（亮像素带计数）客观证实"真的只有1行"，再用独立复现（4行正常）缩小到模块函数，最终 grep 定位 3 处漏等号（batch 1 处 + group-ref 2 处），改 yy+= 后像素验证 12 行齐全、vision 复检通过
- **教训已写入长期记忆：PIL 循环后 grep `yy\+[0-9]` 查漏等号 + 像素行扫描客观验行数，vision 与像素结合**
- 另：emoji（📝🎭）在 Noto Sans CJK 可能豆腐块，pipeline 标题已去 emoji 改纯文字

## 5. 事实/合规

- AGPL 双许可、编排层非模型层（不训练、依赖外部 API/供应商，README 挂 Memefast 赞助与默认供应商）、项目早期（0.2.x、8 月停推、闭源版更靠前、README 截图占位）均如实写
- 技术点有据：GroupRefManager 9图3视频3音频/5000字符、N×N 网格、三层 prompt 融合、6层身份锚点+角色圣经、多Key轮询、v6→v7迁移、供应商收敛 memefast+RunningHub，均来自 README/CHANGELOG/源码目录
- 无旧稿重复（grep 仅 nav.md 一个无关 moyin.com 外链）
