# FilmCraft 三端推广 — 发布结果

项目：https://github.com/storytold/filmcraft
数据基准：2026-10-30（GitHub API：16,914 Star / 7,005 Fork / 2,021 open issues）
建仓 2026-09-30（约 1 个月），MIT OR Apache-2.0，纯 Rust，约 42.4 万行 / 1138 个 .rs 文件；alpha；官网 getartcraft.com/apps/filmcraft
功能广度约 86%（菜单92%/特效100%），真正可干活约 56%（51–61%），距 beta ≈19点/400–700h

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/10/30/filmcraft-rust-nle.md`
- slug `filmcraft-rust-nle`，URL：https://jackssybin.cn/articles/2026/10/30/filmcraft-rust-nle/
- 正文图 3 张：edit-map / codecs / status（站点相对路径）；封面 cover.png
- frontmatter 注意：本仓库用最简风格（title/slug/date/draft/categories/tags/cover/description），**不要加 url:/topic:/layout: 等字段**——加了 `url:*.html` 会导致输出变成 xxx.html 而非目录 index.html（本次踩过，已改回）
- 本地构建 exit 0，已推送 main（commit f135ae6，含 rebase）

## 2. 微信公众号草稿

- 标题：《Premiere 能被开源替代了？我读完 42 万行纯 Rust，看到了视频剪辑的另一种活法》
- newsroom；draft media_id：`snS2bupQYF7HgHImnpl8scEr5bubX8ByrlmyD_sj9kYAcA8AxDijK8z7okgv9usL`
- 封面：**cover-ip.jpg（1280×544 IP 双翼，深墨蓝 ink + 惊讶表情 + 暖橙，verify_wings rc=0 + vision）**，combo-history 已记录；c1冷白生气/c3米黄委屈未选
- 正文图 3 张（edit-map/codecs/status）；文末 jk 引流 + 阅读原文(→GitHub) + 相关阅读 2 条（剪映免费工具、Rust 无头浏览器）
- 独立 digest 116 字（首次146字超限，精简后 errcode 0）；content_source_url 已设
- 状态：草稿未群发

## 3. 知乎专栏草稿

- 标题：《42万行纯Rust，从零写一个专业视频剪辑器：我读了FilmCraft的源码》
- URL：https://zhuanlan.zhihu.com/p/2099620796016619648 （edit 同 +/edit）
- compact HTML，正文图 3（content_image=3）+ pre 代码块 2，无 `<table>`，验证无空段
- CDN：edit pica…f72b / codecs picx…9340 / status picx…4b2b
- 标题封面 title_image 受平台限制（接口静默忽略/PATCH 反爬），需在编辑器手动选 `cover-zhihu.png`（1600×900）
- 临时图片上传草稿（zhihu-cache 目录，仅3图）需后台删除；正式稿保留
- 状态：草稿未发布

## 4. 配图生产坑（PIL）

- gen_images.py 中 `yy+62` 写成表达式语句（应为 `yy+=62`），导致知乎封面右卡 7 行数据全叠在同一 y，表现为重影+空白。vision 抓出，像素扫描定位后修复。
- 信息图长文本必须按列宽预算（PIL getlength）：codecs 表首版第10行越界、容器行超 2px，均缩短修复。
- status 短板 5 条，画布 780 高不够（第5条被裁），加高到 860。
- 全部 4 张（cover-zhihu/edit-map/codecs/status）经 vision 复检通过。

## 5. 合规/事实

- 明确 MIT OR Apache-2.0（真开源可商用）；不内置 FFmpeg、编解码自研且逐帧对拍，优点与"野生素材待验证"代价两面都写
- 客观披露 alpha、56% 可干活度、CPU 渲染、无 .prproj 直开、无插件、导出编码有限、macOS 测试最多
- 数据取自 GitHub API 与仓库 README/architecture/parity/roadmap，未夸大
