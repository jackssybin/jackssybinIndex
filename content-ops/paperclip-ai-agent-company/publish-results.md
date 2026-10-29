# Paperclip 三端推广 — 发布结果

项目：https://github.com/paperclipai/paperclip
数据基准：2026-10-29（GitHub API 二次核验：108,304 Star / 17,946 Fork / 2,700+ merged PR / 6,766 open issues）
建仓 2026-03-02，MIT License（Paperclip Labs, Inc），TypeScript，Node.js + React

## 1. 网站（Hugo，jackssybinIndex）

- 文章：`content/articles/2026/10/29/paperclip-ai-agent-company.md`
- slug：`paperclip-ai-agent-company`
- 预期 URL：https://jackssybin.cn/articles/2026/10/29/paperclip-ai-agent-company.html
- 封面：cover.png；正文图 pillars.png / architecture-v2.png / compare.png
- 含与 10-27 OpenBot 文章的站内交叉链接（SEO 内链）
- 本地构建：`hugo --destination /tmp/hugo-pc-test --minify --cleanDestinationDir` → exit 0
- 已推送 main（commit 226d16d），Actions 2–5 分钟上线

## 2. 微信公众号草稿

- 标题：《8 个月 10.8 万 Star，这个开源项目想让你像开公司一样管 AI 员工》
- 主题 newsroom
- **当前有效 draft media_id：`snS2bupQYF7HgHImnpl8sdBiMWpGYonnET9Dyf_xXpyOLIkJqn16Td7eq20V3wdi`（修订版）**
- 早期草稿 media_id（已被修订版取代，后台可删）：`snS2bupQYF7HgHImnpl8sUEsn82Lro1eRvosqn8Da-JDIarUm2wayfhjKYrfisQa`
- 封面：**cover-ip.jpg（1280×544 个人 IP 双翼版式，黑底 + 喜爱表情 + 暖橙，过 verify_wings.py 像素验收 + vision）**；combo-history 已记录
- 正文图 **5 张**（≥3 达标）：flow / pillars / architecture-v2 / roster / compare
- 独立 digest 已设置（errcode 0）；content_source_url（阅读原文）→ GitHub
- **文末含作者引流 + 相关阅读 2 条**（开源终端编码 Agent、DeepSeek 22 份接入指南）
- 状态：草稿，未群发

## 3. 知乎专栏草稿

- 标题：《Paperclip：当一个人能管几十个AI Agent，缺的其实是一家公司》
- URL：https://zhuanlan.zhihu.com/p/2099074833829060916
- edit：https://zhuanlan.zhihu.com/p/2099074833829060916/edit
- compact HTML，正文图 3 张（content_image=3）+ pre 代码块 2 个，验证无空段/裸图包裹
- CDN：
  - pillars https://picx.zhimg.com/v2-8687d970677b875e25b628839ee5df3d.png
  - architecture https://pic1.zhimg.com/v2-acc30bff78e1f14fa64da6924886080c.png
  - compare https://picx.zhimg.com/v2-b36ccd2b675cdf2dd9ef196c824bd940.png
- 标题封面（title_image）：接口限制同 OpenBot 案例，需在编辑器顶部手动选 cover-zhihu.png（1600×900）
- 状态：草稿，未发布
- 临时上传草稿（仅图）需后台删除：见 zhihu-cache/ 记录

## 4. 合规 / 事实

- MIT 真开源（可商用），与非商用同类形成差异，文中明确点出
- 客观披露：6766 open issues、实验性/未交付功能、遥测默认开启（给关闭方法）、自治 Agent 真实权限与安全建议
- 图片 5 张自制信息图，中文全部 vision 验收：architecture 首版 3 处文字溢出+脚注压线，已改 architecture-v2（缩短文案/加高至920px）复检通过
