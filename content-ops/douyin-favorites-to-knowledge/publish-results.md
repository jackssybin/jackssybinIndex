# 抖音收藏转知识库 三端推广 — 发布结果

项目：https://github.com/tars1230/douyin-favorites-to-knowledge
数据基准：2026-10-30（GitHub API：79 Star / 10 Fork / 0 open issues）
建仓 2026-07-25，MIT（Cheng Chen / tars1230），Python ≥3.10，v2.3.6（2026-10-29），约 3517 行 src（19 个模块）；Gitee 同名镜像
定位：个人授权把抖音收藏（可选喜欢）同步成本地 Markdown/Obsidian，SiliconFlow SenseVoice 口播转写（默认免费）+ PaddleOCR 图文认字

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/10/30/douyin-favorites-to-knowledge.md`
- slug `douyin-favorites-to-knowledge`，URL：https://jackssybin.cn/articles/2026/10/30/douyin-favorites-to-knowledge/
- 正文图 3：workflow / sources / asr；封面 cover.png（=cover-zhihu）
- 最简 frontmatter（本仓库不加 url/topic/layout）；本地 hugo exit 0；已推送（commit 0b7a644）

## 2. 微信公众号草稿

- 标题：《抖音收藏了几千条再也没看？这个开源小工具，把你的收藏自动变成 Obsidian 笔记》
- newsroom；draft media_id：`snS2bupQYF7HgHImnpl8sbZWs4udH5VZbjDk7nCemRAqJT2B6e6E2gENLk6DpqPh`
- 封面：**cover-ip.jpg（1280×544 IP 双翼，米黄渐变 cream-grad + 喜爱表情 + 亮蓝，verify_wings rc=0 + vision）**；combo-history 已记录；c1暖橙委屈/c2纯黑惊讶未选
- 三必查：正文图 3、文末 jk 引流+阅读原文(→GitHub)+相关阅读 2 条（剪映免费工具、全平台下载神器）
- 独立 digest 114 字（首次 147 字 45004，精简后 errcode 0）；content_source_url 已设
- 状态：草稿未群发

## 3. 知乎专栏草稿

- 标题：《读完3500行源码：一个把抖音收藏变成Obsidian笔记的开源小工具，细节意外扎实》
- URL：https://zhuanlan.zhihu.com/p/2099844680431170854 （edit 加 /edit）
- compact HTML：正文图 3（content_image=3）+ pre 代码块 4（3 bash + 1 python），无 `<table>`，标签 ul/ol 配平，验证无空段
- CDN：workflow pica…9270 / sources picx…2ce5 / asr pic1…d135
- 标题封面 title_image 平台限制，需编辑器手动选 `cover-zhihu.png`（1600×900）
- 临时图片上传草稿（zhihu-cache，仅3图）需后台删除；正式稿保留
- 状态：草稿未发布

## 4. 配图/构建坑

- gen_images.py asr() 第三列元组漏写列表方括号 → "got 7" 解包错误，修复；unpack 循环同步修
- 知乎/微信 digest 两次超长（>120）→ 45004，均精简到 ≤120 后 errcode 0
- build_zhihu_html.py 一度用 sed 误把 `</ul>` 改成 `</ol>` 造成标签不配平，已 patch 修正并校验配平
- 4 张图（cover-zhihu/workflow/sources/asr）全部 vision 复检通过（workflow 首次 vision 超时，转 JPG 后通过，非图问题）

## 5. 合规/事实

- MIT 真开源可商用；明确"个人授权同步、不绕登录、不做下载器"边界
- 如实写 SiliconFlow SenseVoice 价格"截至 2026-08-05 标注免费、不承诺永久免费"；百炼对抖音 douyinvod 结构性 403 故不默认；付费 vision 默认关闭
- 不夸大：仅 79 Star 的小工具，定位"小而克制"，未渲染成爆款大项目
