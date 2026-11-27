# 搜索与 AI 可见度月度记录

本目录把三类证据分开保存：

1. Nginx 日志中的搜索爬虫、AI 爬虫和 AI 用户触发抓取。
2. 百度搜索资源平台、Google Search Console、Bing Webmaster Tools 的人工检查或合法导出。
3. 固定问题下观察到的真实 AI 引用。

爬虫请求不等于收录、展示、点击、训练采用或 AI 回答引用。User-Agent 也可能被伪造，日志报表只反映可识别请求，不作为官方爬虫身份或业务成效的证明。

## 每月操作

先复制 `observations.example.json` 为 `YYYY-MM.observations.json`，将 `exampleOnly` 改为 `false`，再用真实记录替换全部示例条目。没有观察数据的月份使用空数组，不要保留示例数字或示例 URL。脚本会拒绝直接读取 `exampleOnly: true` 的文件。

在主站仓库根目录运行：

```bash
python scripts/seo-check/monthly-visibility-report.py \
  --month 2026-11 \
  --log /var/log/nginx/jackssybin.access.log \
  --log /var/log/nginx/jackssybin.access.log.1 \
  --observations seo-state/visibility/2026-11.observations.json \
  --output seo-state/visibility/2026-11.report.json
```

在 Windows 本地运行时可把命令写成一行，并传入已合法取得、脱敏保存的日志副本。只读打开日志，不需要数据库或部署权限。日志采用 Nginx `combined` 格式；`.gz` 轮换日志可直接读取，其他压缩格式需先解压。无法解析的行只计数，不输出原文。

`--top` 默认每个 Bot 输出 50 条路径，可在 1～1000 之间调整。省略 `--observations` 时只生成抓取报表；省略 `--output` 时 JSON 写标准输出。

`logCoverage` 逐文件记录文件名、大小、是否压缩、读取行数、解析失败数、月份内请求数及首末时间戳，用于说明真实日志覆盖范围。空日志和跨月行会如实保留，不得把部分月份报表描述成完整自然月。

## 观察字段

- `search[].source`：平台或人工检查来源，例如 `google-search-console`、`bing-webmaster-tools`、`baidu-search-resource-platform`、`manual-url-inspection`。
- `search[].url`：本站或资料馆的无参数 HTTPS 规范 URL；主站也可写 `/...` 路径。
- `search[].indexStatus`：只能是 `observed-indexed`、`observed-not-indexed` 或 `unknown`，不得根据访问日志猜测。
- `search[].impressions/clicks`：对应月份、对应 URL 的平台导出值；未获得导出时填 `null`，不要编造。
- `search[].queries`：可选的聚合查询词、展示和点击，不记录搜索用户身份或私密信息。
- `aiCitations[]`：固定问题、检查日期、AI 产品、是否引用本站，以及实际出现的本站 URL。`cited=false` 时 `citedUrls` 必须为空。

每月尽量固定 URL 集、问题集和检查日期，并保留平台原始导出或截图作为人工证据。报表只接收白名单字段，不合并任意备注、账号信息、IP、Cookie、Referer 或查询参数。

## 结果解读

- 抓取量增加而展示不变：先检查状态码、规范 URL、Sitemap 和内容质量，不称为排名提升。
- 展示增加而点击不变：再检查标题、摘要和查询意图，不把展示当访问量。
- AI Bot 请求增加：只说明抓取变化，不说明训练采用或答案引用。
- 固定问题出现真实引用：记录产品、日期、问题和引用 URL；单次结果不能外推为稳定推荐。

## 回归测试

```bash
python -m unittest scripts/seo-check/test-monthly-visibility-report.py
```
