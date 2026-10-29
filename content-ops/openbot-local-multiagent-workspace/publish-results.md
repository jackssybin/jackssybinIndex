# OpenBot 三端推广 — 发布结果

项目：https://github.com/nightly-labs/openbot
版本/数据基准：v0.51.1（2026-10-26），约 1837 Star / 213 Fork，2026-08-12 建仓
执行日期：2026-10-27

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/10/27/openbot-local-multiagent-workspace.md`
- slug：`openbot-local-multiagent-workspace`
- 预期 URL：https://jackssybin.cn/articles/2026/10/27/openbot-local-multiagent-workspace.html
- 封面：`/images/openbot-local-multiagent-workspace/cover.png`
- 正文图：providers.png、architecture.png、safety-v2.png（均为本站相对路径）
- 本地构建：`hugo --destination /tmp/hugo-openbot-test --minify --cleanDestinationDir` → exit 0，文章 index.html 正常
- 已提交并推送 main（commit 90dbc88）；GitHub Actions 2–5 分钟后上线

## 2. 微信公众号草稿

- 标题：《我在一台电脑上开了 7 个 AI 程序员，还让它们学会了互相派活》
- 主题：newsroom / 报刊室
- **当前有效 draft media_id：`snS2bupQYF7HgHImnpl8sUp1rJilLeiLC_uvqLn7h2jKw7R2QYl6a_z2yU-bZU6B`（2026-10-29 修订版，符合三必查）**
- 早期草稿（3图、1080信息图封面、无文末引流，后台可删）：`snS2bupQYF7HgHImnpl8scD54es2ep4szO9lV2VaVvI7UEAuO9ud3QMpD99tIjce`
- 封面：**cover-ip.jpg（1280×544 IP 双翼，暖橙底 + 困惑表情 + 绿强调，verify_wings rc=0 + vision）**；combo-history 已记录
- 正文图 **5 张**：pain / providers / architecture / deploy / safety-v2
- 文末含 jk 自述 + 在看/星标 + 阅读原文(content_source_url→GitHub) + 相关阅读 2 条
- 独立 digest：draft/batchget + draft/update 设置（errcode 0）
- 状态：草稿箱待人工审核，未群发
- 上传文件：wechat-upload.md

## 3. 知乎专栏草稿

- 标题：《OpenBot：一个不给你模型、却给七个Coding Agent排好工位的本地工作台》
- 正式草稿 URL：https://zhuanlan.zhihu.com/p/2098499611560240992
- edit：https://zhuanlan.zhihu.com/p/2098499611560240992/edit
- 模式：column，compact HTML（--html-file），3 张图全部以 pic.zhimg.com CDN 内嵌，验证 content_image=3、pre=2、无空段/裸图包裹
- 图片 CDN：
  - providers https://pic1.zhimg.com/v2-16ccd72919985298100d0256db0cb86a.png
  - architecture https://picx.zhimg.com/v2-f3408d4cfc392d4e7b1129f060077680.png
  - safety https://pica.zhimg.com/v2-17ab9cf0578d8a4580b4a8e9f23befbc.png
- 标题封面（title_image）：API 创建接口静默忽略该字段；直接 PATCH 被反爬 zse-ck 拦截。封面图 `cover-zhihu.png`（1600×900）已备好，可在草稿编辑器顶部一键设置；或稍后限流恢复再用 set_zhihu_cover.py 重试
- 状态：草稿，未发布

### 草稿箱清理提醒（脚本无删除能力，需后台手动删）
- 2098499371755226717：仅 3 张图的临时上传草稿（可删）
- 2098500278840574546：试 title_image 产生的第二份正式内容草稿（内容与正式稿相同，可删，保留 2098499611560240992 即可）

## 4. 合规与事实核对

- 许可证明确写为 PolyForm Noncommercial 1.0.0（source-available，禁商用，非 OSI 开源）
- 明确披露 danger-full-access + approvalPolicy never、development preview、214 issues、Windows 早版无签名
- 数据来自 GitHub API 与仓库 v0.51.1 源码/README/CHANGELOG，未夸大
- 图片为自制信息图，中文经 vision 验收（safety 图首版底部裁切已重做为 safety-v2）
