# 发布结果 — res-downloader-proxy-sniffer

- 项目源：https://github.com/putyy/res-downloader（调研时 20,374 Star / 2,524 Fork，Apache-2.0，Go + Wails，最新 release 4.0.0-beta.6）
- 日期：2026-10-04

## 网站（Hugo · jackssybin.cn）
- 文章：content/articles/2026/10/04/res-downloader-proxy-sniffer.md
- 配图：static/images/res-downloader-proxy-sniffer/{architecture,qq-plugin,checklist}.png
- 验证：hugo --destination /tmp/hugo-tct --minify --cleanDestinationDir → exit 0，文章 HTML 已生成
- 唯一站点仓库确认：/root/jackssybinIndex（remote: jackssybin/jackssybinIndex）

## 微信公众号（草稿，未群发）
- Media ID：snS2bupQYF7HgHImnpl8sVhqbVSOBad4EpFYbkjf0VXAFYk4Rn14cox97HbZ_4OS
- 主题：newsroom；正文中文 1913 字；正文图 3 张
- source_url（阅读原文）：https://github.com/putyy/res-downloader
- digest 已独立设置（set-digest.js，含搜索关键词，封面与 source_url 均保留）
- 相关阅读：pick-related-links.mjs 随机池 2 条真实 mp 短链（无同主题链接，记录在案）
- 封面：wechat-ip-cover 双翼 1280×544，amber + 大笑 + 绿#07C160；verify_wings.py rc=0；人工目检通过

## 知乎专栏（草稿，未发布）
- URL：https://zhuanlan.zhihu.com/p/2090223086767494735
- 上传模式：column Markdown + --upload-images，3 张本地图全部上传成功（picx/pica zhimg CDN）
- 标题：视频号的视频为什么能被下载器抓到？从一个20.4k Star开源项目谈起

## 校验
- validate-payload.mjs：通过，0 建议项
- 临时克隆 /root/.cache/tct-res-downloader 完成后清理
